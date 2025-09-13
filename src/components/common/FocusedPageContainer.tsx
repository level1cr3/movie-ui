import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const FocusedPageContainer = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg space-y-3">{children}</div>
    </div>
  );
};

export default FocusedPageContainer;

// maybe later allow other background color based on theme
