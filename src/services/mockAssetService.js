import { mockAssets } from "@/data/assets";
import { STORAGE_KEYS, readStore, writeStore, delay, makeId } from "@/utils/storage";

function load() {
  return readStore(STORAGE_KEYS.assets, null) ?? mockAssets;
}

function save(list) {
  writeStore(STORAGE_KEYS.assets, list);
  return list;
}

export async function getAssets() {
  try {
    const res = await fetch("/api/assets");
    if (res.ok) {
      const live = await res.json();
      if (Array.isArray(live) && live.length > 0) {
        save(live);
        return live;
      }
    }
  } catch {
    /* backend unavailable, fall back to storage */
  }
  await delay(100);
  return load();
}

export async function getAssetById(id) {
  const assets = await getAssets();
  return assets.find((a) => a.id === id) ?? null;
}

export async function createAsset(payload) {
  try {
    const res = await fetch("/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const created = await res.json();
      const current = load();
      save([created, ...current]);
      return created;
    }
  } catch {
    /* fallback */
  }
  await delay(200);
  const asset = {
    ...payload,
    id: makeId("AST"),
    history: payload.history ?? buildHistory(payload.purchaseValue, payload.currentValue),
  };
  save([asset, ...load()]);
  return asset;
}

export async function updateAsset(id, payload) {
  try {
    const res = await fetch(`/api/assets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const updated = await res.json();
      const list = load().map((a) => (a.id === id ? { ...a, ...updated } : a));
      save(list);
      return updated;
    }
  } catch {
    /* fallback */
  }
  await delay(200);
  const list = load().map((asset) => (asset.id === id ? { ...asset, ...payload, id } : asset));
  save(list);
  return list.find((asset) => asset.id === id);
}

export async function deleteAsset(id) {
  try {
    await fetch(`/api/assets/${id}`, { method: "DELETE" });
  } catch {
    /* fallback */
  }
  await delay(150);
  save(load().filter((asset) => asset.id !== id));
  return id;
}

export async function resetAssets() {
  await delay(100);
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
