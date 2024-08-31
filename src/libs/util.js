import VueJwtDecode from "vue-jwt-decode";
const getStatusText = (status) => {
  if (typeof status === "object" && status !== null) {
    return status.name || "";
  } else if (typeof status === "string") {
    return status.name || status;
  } else {
    return "Unknown Status";
  }
};
const isTokenExpired = (token) => {
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

export { getStatusText, isTokenExpired };
