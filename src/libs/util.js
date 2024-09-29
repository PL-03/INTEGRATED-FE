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

export { getStatusText };
