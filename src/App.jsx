import { useEffect, useState } from "react";
import CategoryForm from "./components/CategoryForm.jsx";
import CategoryTable from "./components/CategoryTable.jsx";
import GameHud from "./components/GameHud.jsx";
import { useCategories } from "./hooks/useCategories.js";
import { useGameStats } from "./hooks/useGameStats.js";

export default function App() {
  const { categories, addCategory, deleteCategory, deleteAll } = useCategories();
  const game = useGameStats();
  const [toast, setToast] = useState(null);

  // Auto-dismiss the reward toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleAdd = (category) => {
    addCategory(category);
    setToast({ id: Date.now(), text: game.awardCategory() });
  };

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <GameHud {...game} />
          <CategoryForm onAdd={handleAdd} />
          <CategoryTable
            categories={categories}
            onDelete={deleteCategory}
            onDeleteAll={deleteAll}
          />
        </div>
      </div>
      {toast && (
        <div className="game-toast" role="status">
          {toast.text}
        </div>
      )}
    </main>
  );
}
