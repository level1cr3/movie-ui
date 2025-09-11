import type { FieldValues, UseFormSetError } from "react-hook-form";

type ServerError = {
  code: string;
  message: string;
  propertyName: string | null;
};

export function applyServerError<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  errors: ServerError[]
) {
  const types = errors.reduce<Record<string, string>>((acc, err, idx) => {
    acc[`${err.code}_${idx}`] = err.message;
    return acc;
  }, {});

  setError("root", {
    type: "server",
    message: "Server Validation failed",
    types,
  });
}
