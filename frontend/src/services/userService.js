import api from "./api";

const userService = {
  register: (data) => api.post("/users/register/", data),
  getProfile: () => api.get("/users/me/"),
  updateProfile: (data) => api.put("/users/me/", data),
  changePassword : (data) => api.post("/users/change-password/", data)
};

export default userService;