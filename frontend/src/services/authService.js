import api from "./api";

const authService = {
  // POST /api/token/
  login: async (username, password) => {
    const { data } = await api.post("/token/", { username, password });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    return data;
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  },

  isAuthenticated: () => !!localStorage.getItem("access_token"),
};

export default authService;