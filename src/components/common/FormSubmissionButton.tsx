import { LoaderCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  formId: string;
  isSubmitting: boolean;
  submittingText?: string;
  children: ReactNode;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

const FormSubmissionButton = ({
  formId,
  isSubmitting,
  submittingText = "Submitting...",
  children,
  size,
  className,
}: Props) => {
  return (
    <Button
      form={formId}
      type="submit"
      disabled={isSubmitting}
      size={size}
      className={cn(className)}
    >
      {isSubmitting ? (
        <div className="flex content-center items-center gap-2">
          <LoaderCircleIcon className="animate-spin" />
          {submittingText}
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default FormSubmissionButton;
