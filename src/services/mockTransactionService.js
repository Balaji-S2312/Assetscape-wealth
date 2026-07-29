import { mockTransactions } from "@/data/transactions";
import { STORAGE_KEYS, readStore, writeStore, delay, makeId } from "@/utils/storage";

/** Mock transaction service — promise-based local persistence only. */
function load() {
  return readStore(STORAGE_KEYS.transactions, null) ?? mockTransactions;
}

function save(list) {
  writeStore(STORAGE_KEYS.transactions, list);
  return list;
}

export async function getTransactions() {
  await delay(360);
  return load();
}

export async function createTransaction(payload) {
  await delay(400);
  const transaction = { ...payload, id: makeId("TRX") };
  save([transaction, ...load()]);
  return transaction;
}

export async function updateTransaction(id, payload) {
  await delay(400);
  const list = load().map((item) => (item.id === id ? { ...item, ...payload, id } : item));
  save(list);
  return list.find((item) => item.id === id);
}

export async function deleteTransaction(id) {
  await delay(300);
  save(load().filter((item) => item.id !== id));
  return id;
}

export async function resetTransactions() {
  await delay(200);
  return save(mockTransactions);
}
