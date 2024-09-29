import VueJwtDecode from "vue-jwt-decode";

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
  const refreshToken = localStorage.getItem("refreshToken");
  if (!token || isTokenExpired(token)) {
    if (!refreshToken || isTokenExpired(refreshToken)) {
      alert("Your session has expired. Please login again.");
      router.push({ name: "login" });
      return null;
    }
  }
  return token || refreshToken;
};

// Retrieve the Refresh token from localStorage
export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
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

// // Refresh the token using a refresh token
// export const refreshToken = async () => {
//   const refreshToken = getRefreshToken();
//   if (!refreshToken) {
//     console.error("No refresh token available");
//     return;
//   }

//   try {
//     const response = await fetch(
//       `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ refreshToken }),
//       }
//     );

//     if (response.ok) {
//       const data = await response.json();
//       // Update the JWT token and refresh token
//       storeToken(data.accessToken, data.refreshToken);
//       return data.accessToken;
//     } else {
//       console.error("Failed to refresh token");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//     return null;
//   }
// };
