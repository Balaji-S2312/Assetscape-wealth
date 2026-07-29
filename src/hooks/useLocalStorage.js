import { useEffect, useState } from "react";
import { readStore, writeStore } from "@/utils/storage";

/** Local-storage backed state. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const stored = readStore(key, null);
    if (stored !== null) setValue(stored);
  }, [key]);

  const update = (next) => {
    setValue((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      writeStore(key, resolved);
      return resolved;
    });
  };

  return [value, update];
}
