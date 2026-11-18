import { useEffect, useState } from "react";

function read(key, initialValue) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw);
  } catch {
    /* corrupted or unavailable storage: fall back to the default */
  }
  return typeof initialValue === "function" ? initialValue() : initialValue;
}

/**
 * useState that persists to localStorage and stays in sync across browser tabs.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => read(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked (e.g. private mode) */
    }
  }, [key, value]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        setValue(JSON.parse(e.newValue));
      } catch {
        /* ignore malformed values */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  return [value, setValue];
}
