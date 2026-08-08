import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as assetService from "@/services/assetService";
import * as liabilityService from "@/services/liabilityService";
import * as transactionService from "@/services/transactionService";
import { useAuth } from "@/context/AuthContext";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { isAuthenticated, initialising } = useAuth();
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const [a, l, t] = await Promise.all([
        assetService.getAssets(), liabilityService.getLiabilities(), transactionService.getTransactions(),
      ]);
      setAssets(a); setLiabilities(l); setTransactions(t);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (initialising) return;
    if (isAuthenticated) refresh();
    else {
      setAssets([]); setLiabilities([]); setTransactions([]); setLoading(false); setError(null);
    }
  }, [initialising, isAuthenticated, refresh]);

  const addAsset = useCallback(async (payload) => { const item = await assetService.createAsset(payload); setAssets((p) => [item, ...p]); return item; }, []);
  const editAsset = useCallback(async (id, payload) => { const item = await assetService.updateAsset(id, payload); setAssets((p) => p.map((x) => x.id === id ? item : x)); return item; }, []);
  const removeAsset = useCallback(async (id) => { await assetService.deleteAsset(id); setAssets((p) => p.filter((x) => x.id !== id)); }, []);
  const addLiability = useCallback(async (payload) => { const item = await liabilityService.createLiability(payload); setLiabilities((p) => [item, ...p]); return item; }, []);
  const editLiability = useCallback(async (id, payload) => { const item = await liabilityService.updateLiability(id, payload); setLiabilities((p) => p.map((x) => x.id === id ? item : x)); return item; }, []);
  const removeLiability = useCallback(async (id) => { await liabilityService.deleteLiability(id); setLiabilities((p) => p.filter((x) => x.id !== id)); }, []);
  const addTransaction = useCallback(async (payload) => { const item = await transactionService.createTransaction(payload); setTransactions((p) => [item, ...p]); return item; }, []);
  const editTransaction = useCallback(async (id, payload) => { const item = await transactionService.updateTransaction(id, payload); setTransactions((p) => p.map((x) => x.id === id ? item : x)); return item; }, []);
  const removeTransaction = useCallback(async (id) => { await transactionService.deleteTransaction(id); setTransactions((p) => p.filter((x) => x.id !== id)); }, []);

  const value = useMemo(() => ({ assets, liabilities, transactions, loading, error, refresh,
    addAsset, editAsset, removeAsset, addLiability, editLiability, removeLiability,
    addTransaction, editTransaction, removeTransaction,
  }), [assets, liabilities, transactions, loading, error, refresh, addAsset, editAsset, removeAsset,
    addLiability, editLiability, removeLiability, addTransaction, editTransaction, removeTransaction]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used inside DataProvider");
  return context;
}
