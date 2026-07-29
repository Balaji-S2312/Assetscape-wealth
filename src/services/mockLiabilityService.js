import { mockLiabilities } from "@/data/liabilities";
import { STORAGE_KEYS, readStore, writeStore, delay, makeId } from "@/utils/storage";

/** Mock liability service — promise-based local persistence only. */
function load() {
  return readStore(STORAGE_KEYS.liabilities, null) ?? mockLiabilities;
}

function save(list) {
  writeStore(STORAGE_KEYS.liabilities, list);
  return list;
}

export async function getLiabilities() {
  await delay(380);
  return load();
}

export async function getLiabilityById(id) {
  await delay(220);
  return load().find((item) => item.id === id) ?? null;
}

export async function createLiability(payload) {
  await delay(420);
  const liability = { ...payload, id: makeId("LIA") };
  save([liability, ...load()]);
  return liability;
}

export async function updateLiability(id, payload) {
  await delay(420);
  const list = load().map((item) => (item.id === id ? { ...item, ...payload, id } : item));
  save(list);
  return list.find((item) => item.id === id);
}

export async function deleteLiability(id) {
  await delay(300);
  save(load().filter((item) => item.id !== id));
  return id;
}

export async function resetLiabilities() {
  await delay(200);
  return save(mockLiabilities);
}
