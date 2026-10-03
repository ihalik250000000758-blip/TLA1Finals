export default function CategoryRow({ category, onDelete }) {
  return (
    <tr>
      <td className="fw-semibold">{category.name}</td>
      <td className="text-secondary">{category.description}</td>
      <td className="text-end">
        <button
          type="button"
          className="btn btn-danger btn-sm btn-delete"
          onClick={() => onDelete(category.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
