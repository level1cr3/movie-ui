import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { emailSchema } from "@/validations/resendVerifyEmailSchema";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircleIcon } from "lucide-react";
import type { ResendVerifyEmailRequest } from "@/types/api/authTypes";
import { toast } from "sonner";
import { useState } from "react";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";

type Props = {
  showSuccessAlert: () => void;
};

type FormFields = z.infer<typeof emailSchema>;

const ForgotPasswordDialog = ({ showSuccessAlert }: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<FormFields>({
    defaultValues: { email: "" },
    resolver: zodResolver(emailSchema),
  });

  const { mutateAsync: forgotPasswordAsync, isPending } = useForgotPassword();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const request: ResendVerifyEmailRequest = { email: data.email };
      await forgotPasswordAsync(request);
      toast.success(
        "If this email is registered, a password reset link has been sent"
      );
      form.reset();
      setOpen(false);
      showSuccessAlert();
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link">Forgot password?</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Password Reset Link</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form id="forgotPasswordForm" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your registered email"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            form="forgotPasswordForm"
            type="submit"
            disabled={form.formState.isSubmitting || isPending}
          >
            {form.formState.isSubmitting || isPending ? (
              <div className="flex content-center items-center gap-2">
                <LoaderCircleIcon className="animate-spin" />
                Submitting...
              </div>
            ) : (
              "Submit"
            )}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
