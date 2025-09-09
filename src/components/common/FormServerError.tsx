import type { GlobalError } from "react-hook-form";

type Props = {
  error?: Record<string, GlobalError> & GlobalError;
};

const FormServerError = ({ error }: Props) => {
  if (!error) return null;
  return (
    <div className="text-sm font-medium text-red-600">{error.message}</div>
  );
};

export default FormServerError;
