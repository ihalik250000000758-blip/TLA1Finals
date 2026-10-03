import { useState, useRef, useCallback } from "react";

const isFilled = (text) => text.trim() !== "";

/**
 * Text field with Bootstrap-style validation status.
 * status: null (untouched) | "valid" | "invalid"
 */
export function useValidatedField() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState(null);
  const ref = useRef(null);

  // Validate on blur / on save; returns validity
  const validate = useCallback(() => {
    const ok = isFilled(value);
    setStatus(ok ? "valid" : "invalid");
    return ok;
  }, [value]);

  const onChange = useCallback(
    (e) => {
      const next = e.target.value;
      setValue(next);
      // Re-check while typing only once the field has been flagged
      if (status === "invalid") setStatus(isFilled(next) ? "valid" : "invalid");
    },
    [status]
  );

  const reset = useCallback(() => {
    setValue("");
    setStatus(null);
  }, []);

  const focus = useCallback(() => ref.current?.focus(), []);

  return { value, status, ref, onChange, onBlur: validate, validate, reset, focus };
}
