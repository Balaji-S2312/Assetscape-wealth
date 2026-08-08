import { apiRequest } from "./apiClient";
export const getAssets = () => apiRequest("/assets");
export const getAssetById = (id) => apiRequest(`/assets/${id}`);
export const createAsset = (payload) => apiRequest("/assets", { method: "POST", body: JSON.stringify(payload) });
export const updateAsset = (id, payload) => apiRequest(`/assets/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteAsset = (id) => apiRequest(`/assets/${id}`, { method: "DELETE" });
