import { Loader2 } from "lucide-react";

type Props = {
  message?: string;
};

const Loader = ({ message = "Loading..." }: Props) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600 mb-4" />
      <p className="text-gray-700">{message}</p>
    </div>
  );
};

export default Loader;

// later make it so it works in dark theme as well.
