import { mockAssets } from "@/data/assets";
import { STORAGE_KEYS, readStore, writeStore, delay, makeId } from "@/utils/storage";

/**
 * Mock asset service.
 * Promise-based with simulated delay so it can be swapped for a real
 * HTTP client later without changing any calling component.
 */
function load() {
  return readStore(STORAGE_KEYS.assets, null) ?? mockAssets;
}

function save(list) {
  writeStore(STORAGE_KEYS.assets, list);
  return list;
}

export async function getAssets() {
  await delay(380);
  return load();
}

export async function getAssetById(id) {
  await delay(240);
  return load().find((asset) => asset.id === id) ?? null;
}

export async function createAsset(payload) {
  await delay(420);
  const asset = {
    ...payload,
    id: makeId("AST"),
    history: payload.history ?? buildHistory(payload.purchaseValue, payload.currentValue),
  };
  save([asset, ...load()]);
  return asset;
}

export async function updateAsset(id, payload) {
  await delay(420);
  const list = load().map((asset) => (asset.id === id ? { ...asset, ...payload, id } : asset));
  save(list);
  return list.find((asset) => asset.id === id);
}

export async function deleteAsset(id) {
  await delay(320);
  save(load().filter((asset) => asset.id !== id));
  return id;
}

export async function resetAssets() {
  await delay(200);
  return save(mockAssets);
}

function buildHistory(start = 0, end = 0, points = 12) {
  const from = Number(start) || 0;
  const to = Number(end) || 0;
  return Array.from({ length: points }, (_, i) => ({
    label: `M${i + 1}`,
    value: Math.round(from + ((to - from) * i) / (points - 1)),
  }));
}
