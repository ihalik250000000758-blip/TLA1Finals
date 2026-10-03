import CategoryRow from "./CategoryRow.jsx";
import EmptyRow from "./EmptyRow.jsx";

export default function CategoryTable({ categories, onDelete, onDeleteAll }) {
  const isEmpty = categories.length === 0;

  return (
    <div className="game-card card">
      <div className="card-header game-header-alt py-3 d-flex justify-content-between align-items-center">
        <h2 className="h6 mb-0 text-secondary fw-bold text-uppercase">
          Quest Log
        </h2>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm fw-semibold"
          disabled={isEmpty}
          onClick={onDeleteAll}
        >
          Delete All
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th scope="col" className="w-35">Category Name</th>
              <th scope="col">Description</th>
              <th scope="col" className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <EmptyRow />
            ) : (
              categories.map((c) => (
                <CategoryRow key={c.id} category={c} onDelete={onDelete} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
