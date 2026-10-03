import { forwardRef } from "react";

const FormField = forwardRef(function FormField(
  { id, label, placeholder, value, status, errorMessage, onChange, onBlur },
  ref
) {
  const stateClass =
    status === "invalid" ? " is-invalid" : status === "valid" ? " is-valid" : "";

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {label}
      </label>
      <input
        ref={ref}
        type="text"
        id={id}
        className={`form-control${stateClass}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required
      />
      <div className="invalid-feedback">{errorMessage}</div>
    </div>
  );
});

export default FormField;
