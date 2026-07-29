import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as assetService from "@/services/mockAssetService";
import * as liabilityService from "@/services/mockLiabilityService";
import * as transactionService from "@/services/mockTransactionService";
import { STORAGE_KEYS, clearStore } from "@/utils/storage";

/** Single source of truth for all mock financial records. */
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [a, l, t] = await Promise.all([
      assetService.getAssets(),
      liabilityService.getLiabilities(),
      transactionService.getTransactions(),
    ]);
    setAssets(a);
    setLiabilities(l);
    setTransactions(t);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addAsset = useCallback(async (payload) => {
    const created = await assetService.createAsset(payload);
    setAssets((prev) => [created, ...prev]);
    return created;
  }, []);

  const editAsset = useCallback(async (id, payload) => {
    const updated = await assetService.updateAsset(id, payload);
    setAssets((prev) => prev.map((a) => (a.id === id ? updated : a)));
    return updated;
  }, []);

  const removeAsset = useCallback(async (id) => {
    await assetService.deleteAsset(id);
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const addLiability = useCallback(async (payload) => {
    const created = await liabilityService.createLiability(payload);
    setLiabilities((prev) => [created, ...prev]);
    return created;
  }, []);

  const editLiability = useCallback(async (id, payload) => {
    const updated = await liabilityService.updateLiability(id, payload);
    setLiabilities((prev) => prev.map((l) => (l.id === id ? updated : l)));
    return updated;
  }, []);

  const removeLiability = useCallback(async (id) => {
    await liabilityService.deleteLiability(id);
    setLiabilities((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const addTransaction = useCallback(async (payload) => {
    const created = await transactionService.createTransaction(payload);
    setTransactions((prev) => [created, ...prev]);
    return created;
  }, []);

  const editTransaction = useCallback(async (id, payload) => {
    const updated = await transactionService.updateTransaction(id, payload);
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const removeTransaction = useCallback(async (id) => {
    await transactionService.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const resetData = useCallback(async () => {
    clearStore(STORAGE_KEYS.assets);
    clearStore(STORAGE_KEYS.liabilities);
    clearStore(STORAGE_KEYS.transactions);
    clearStore(STORAGE_KEYS.user);
    await refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      assets,
      liabilities,
      transactions,
      loading,
      refresh,
      addAsset,
      editAsset,
      removeAsset,
      addLiability,
      editLiability,
      removeLiability,
      addTransaction,
      editTransaction,
      removeTransaction,
      resetData,
    }),
    [
      assets,
      liabilities,
      transactions,
      loading,
      refresh,
      addAsset,
      editAsset,
      removeAsset,
      addLiability,
      editLiability,
      removeLiability,
      addTransaction,
      editTransaction,
      removeTransaction,
      resetData,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
