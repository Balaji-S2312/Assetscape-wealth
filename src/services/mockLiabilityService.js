import { mockLiabilities } from "@/data/liabilities";
import { STORAGE_KEYS, readStore, writeStore, delay, makeId } from "@/utils/storage";

function load() {
  return readStore(STORAGE_KEYS.liabilities, null) ?? mockLiabilities;
}

function save(list) {
  writeStore(STORAGE_KEYS.liabilities, list);
  return list;
}

export async function getLiabilities() {
  try {
    const res = await fetch("/api/liabilities");
    if (res.ok) {
      const live = await res.json();
      if (Array.isArray(live) && live.length > 0) {
        save(live);
        return live;
      }
    }
  } catch {
    /* fallback to local storage */
  }
  await delay(100);
  return load();
}

export async function getLiabilityById(id) {
  const items = await getLiabilities();
  return items.find((item) => item.id === id) ?? null;
}

export async function createLiability(payload) {
  try {
    const res = await fetch("/api/liabilities", {
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
  const liability = { ...payload, id: makeId("LIA") };
  save([liability, ...load()]);
  return liability;
}

export async function updateLiability(id, payload) {
  try {
    const res = await fetch(`/api/liabilities/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const updated = await res.json();
      const list = load().map((item) => (item.id === id ? { ...item, ...updated } : item));
      save(list);
      return updated;
    }
  } catch {
    /* fallback */
  }
  await delay(200);
  const list = load().map((item) => (item.id === id ? { ...item, ...payload, id } : item));
  save(list);
  return list.find((item) => item.id === id);
}

export async function deleteLiability(id) {
  try {
    await fetch(`/api/liabilities/${id}`, { method: "DELETE" });
  } catch {
    /* fallback */
  }
  await delay(150);
  save(load().filter((item) => item.id !== id));
  return id;
}

export async function resetLiabilities() {
  await delay(100);
  return save(mockLiabilities);
}
