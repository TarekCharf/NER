import api from "./api"

const nerService = {
  analyze: (data) => api.post("/sentences/analyze/", data),
  list: () => api.get("/sentences/"),
  retrieve: (id) => api.get(`/sentences/${id}/`),
  getStats: () => api.get("/sentences/stats/")
};

export default nerService;