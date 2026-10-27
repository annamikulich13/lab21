import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(initialValue) && !Array.isArray(parsed)) {
          setLoaded(true);
          return;
        }
        setValue(parsed);
      }
    } catch (err) {
      console.error("Ошибка чтения localStorage:", err);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("Ошибка записи localStorage:", err);
    }
  }, [key, value, loaded]);

  return [value, setValue];
}
