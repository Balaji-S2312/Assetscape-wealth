import { apiRequest } from "./apiClient";
export const getTransactions = () => apiRequest("/transactions");
export const getTransactionById = (id) => apiRequest(`/transactions/${id}`);
export const createTransaction = (payload) => apiRequest("/transactions", { method: "POST", body: JSON.stringify(payload) });
export const updateTransaction = (id, payload) => apiRequest(`/transactions/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteTransaction = (id) => apiRequest(`/transactions/${id}`, { method: "DELETE" });
