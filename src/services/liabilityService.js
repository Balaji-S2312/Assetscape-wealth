import { apiRequest } from "./apiClient";
export const getLiabilities = () => apiRequest("/liabilities");
export const getLiabilityById = (id) => apiRequest(`/liabilities/${id}`);
export const createLiability = (payload) => apiRequest("/liabilities", { method: "POST", body: JSON.stringify(payload) });
export const updateLiability = (id, payload) => apiRequest(`/liabilities/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteLiability = (id) => apiRequest(`/liabilities/${id}`, { method: "DELETE" });
