import VueJwtDecode from "vue-jwt-decode";
import router from "@/router/router";

// Store the token in localStorage
export const storeToken = (token, refreshToken) => {
  localStorage.setItem("jwtToken", token);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

// Retrieve the JWT token from localStorage
export const getToken = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token || isTokenExpired(token)) {
    return null; // Return null if token is expired or missing
  }
  return token;
};

// A separate function to handle token refresh logic
export const handleTokenRefresh = async () => {
  let token = getToken();

  // If token is expired, attempt to refresh
  if (!token) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken && !isTokenExpired(refreshToken)) {
      token = await useRefreshToken(); // Refresh the token
    }
  }

  return token;
};

// Remove tokens from localStorage (for logout)
export const removeTokens = () => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("refreshToken");
};

// Check if the token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = VueJwtDecode.decode(token);
    if (decoded.exp) {
      const expirationDate = decoded.exp * 1000;
      return Date.now() > expirationDate;
    }
    return true;
  } catch (err) {
    console.log("Invalid token: ", err);
    return true;
  }
};
export const decodedToken = () => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    removeTokens();
    router.push({ name: "login" });
    return;
  } else {
    const decodedToken = VueJwtDecode.decode(token);
    return decodedToken;
  }
};

// Refresh the token using a refresh token
export const useRefreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken && !isTokenExpired(refreshToken)) {
    console.error("No refresh token available");
    router.push({ name: "login" });
    return null;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.access_token;
      storeToken(token, refreshToken); // Update tokens
    } else {
      console.error("Failed to refresh token");
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};
