import FormField from "./FormField.jsx";
import { useValidatedField } from "../hooks/useValidatedField.js";

export default function CategoryForm({ onAdd }) {
  const name = useValidatedField();
  const desc = useValidatedField();

  const handleAdd = () => {
    const nameOk = name.validate();
    const descOk = desc.validate();

    // Guard clause: inline feedback, focus first invalid field
    if (!nameOk || !descOk) {
      (!nameOk ? name : desc).focus();
      return;
    }

    onAdd({ name: name.value.trim(), description: desc.value.trim() });

    // Reset inputs, clear validation styles, refocus
    name.reset();
    desc.reset();
    name.focus();
  };

  return (
    <div className="game-card card mb-4">
      <div className="card-header game-header py-3">
        <h1 className="h5 mb-0 fw-bold">Quest: Register a Category</h1>
      </div>
      <div className="card-body p-4">
        <form noValidate onSubmit={(e) => e.preventDefault()}>
          <FormField
            id="txtCatName"
            label="Category Name"
            placeholder="e.g., Consulting"
            errorMessage="Please enter a category name."
            ref={name.ref}
            value={name.value}
            status={name.status}
            onChange={name.onChange}
            onBlur={name.onBlur}
          />
          <FormField
            id="txtCatDesc"
            label="Description"
            placeholder="e.g., Enterprise technical support contract"
            errorMessage="Please enter a description."
            ref={desc.ref}
            value={desc.value}
            status={desc.status}
            onChange={desc.onChange}
            onBlur={desc.onBlur}
          />
          <button
            type="button"
            className="btn btn-primary px-4 fw-semibold"
            onClick={handleAdd}
          >
            Save Category (+10 XP)
          </button>
        </form>
      </div>
    </div>
  );
}
