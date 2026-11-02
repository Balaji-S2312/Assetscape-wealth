import { mockTransactions } from "@/data/transactions";
import { STORAGE_KEYS, readStore, writeStore, delay, makeId } from "@/utils/storage";

function load() {
  return readStore(STORAGE_KEYS.transactions, null) ?? mockTransactions;
}

function save(list) {
  writeStore(STORAGE_KEYS.transactions, list);
  return list;
}

export async function getTransactions() {
  try {
    const res = await fetch("/api/transactions");
    if (res.ok) {
      const live = await res.json();
      if (Array.isArray(live) && live.length > 0) {
        save(live);
        return live;
      }
    }
  } catch {
    /* fallback */
  }
  await delay(100);
  return load();
}

export async function createTransaction(payload) {
  try {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const created = await res.json();
      save([created, ...load()]);
      return created;
    }
  } catch {
    /* fallback */
  }
  await delay(200);
  const transaction = { ...payload, id: makeId("TRX") };
  save([transaction, ...load()]);
  return transaction;
}

export async function updateTransaction(id, payload) {
  await delay(200);
  const list = load().map((item) => (item.id === id ? { ...item, ...payload, id } : item));
  save(list);
  return list.find((item) => item.id === id);
}

export async function deleteTransaction(id) {
  try {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
  } catch {
    /* fallback */
  }
  await delay(150);
  save(load().filter((item) => item.id !== id));
  return id;
}

export async function resetTransactions() {
  await delay(100);
  return save(mockTransactions);
}
