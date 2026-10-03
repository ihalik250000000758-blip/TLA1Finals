import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

/** Owns the category list (persisted in the browser). */
export function useCategories() {
  const [categories, setCategories] = useLocalStorage("incomeTracker.categories", []);

  const addCategory = useCallback(({ name, description }) => {
    setCategories((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, description },
    ]);
  }, [setCategories]);

  const deleteCategory = useCallback((id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, [setCategories]);

  const deleteAll = useCallback(() => setCategories([]), [setCategories]);

  return { categories, addCategory, deleteCategory, deleteAll };
}
