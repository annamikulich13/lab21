import { useState, useEffect } from "react";

/**
 * Синхронизация состояния с localStorage.
 *
 * Реализация по методичке (Лаб. №4, Часть 3):
 *   1) useEffect с []       — загрузка при монтировании
 *   2) useEffect с [items]  — сохранение при каждом изменении
 *
 * Флаг `loaded` предотвращает гонку: пока данные не загружены из localStorage,
 * эффект сохранения не пишет в него — иначе начальные данные могли бы
 * перезаписать актуальные.
 *
 * @param {string} key - ключ в localStorage
 * @param {*} initialValue - значение по умолчанию, если данных нет
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [loaded, setLoaded] = useState(false);

  // === ЭФФЕКТ 1: загрузка из localStorage при монтировании (пустой массив) ===
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // защита: если ожидаем массив, а пришло нечто другое — игнорируем
        if (Array.isArray(initialValue) && !Array.isArray(parsed)) {
          setLoaded(true);
          return;
        }
        setValue(parsed);
      }
      // если saved нет — остаётся initialValue, заданное в useState
    } catch (err) {
      console.error("Ошибка чтения localStorage:", err);
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // пустой массив — только при монтировании

  // === ЭФФЕКТ 2: сохранение в localStorage при каждом изменении value ===
  useEffect(() => {
    // не пишем, пока не завершена загрузка
    if (!loaded) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("Ошибка записи localStorage:", err);
    }
  }, [key, value, loaded]); // [items] — сохранение при каждом изменении

  return [value, setValue];
}
