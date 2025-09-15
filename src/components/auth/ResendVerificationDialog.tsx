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
import { useResendVerifyEmail } from "@/hooks/auth/useResendVerifyEmail";
import { z } from "zod";
import { resendVerifyEmailSchema } from "@/validations/resendVerifyEmailSchema";
import { useForm } from "react-hook-form";
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

type Props = {
  triggerName: string;
};

type FormFields = z.infer<typeof resendVerifyEmailSchema>;

const ResendVerificationDialog = ({ triggerName }: Props) => {
  const form = useForm<FormFields>({
    defaultValues: { email: "" },
    resolver: zodResolver(resendVerifyEmailSchema),
  });

  const { mutateAsync: resendVerifyEmailAsync, isPending } =
    useResendVerifyEmail();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerName}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter your registered email</DialogTitle>
        </DialogHeader>

        {/* put by form here with email field */}
        <Form {...form}>
          <form id="resendVerifyEmailForm">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your registerd email"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose></DialogClose>
          <Button
            form="resendVerifyEmailForm"
            type="submit"
            disabled={form.formState.isSubmitting || isPending}
          >
            {form.formState.isSubmitting || isPending ? (
              <div>
                <LoaderCircleIcon className="animate-spin" />
                Submitting...
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResendVerificationDialog;

/*

Why we use aschild prop in shadcn ui ?

Say you want a shadcn Button but it should behave like a react-router-dom <Link>.

Without asChild, you’d nest them → ugly and not semantic:

<Button>
  <Link to="/dashboard">Dashboard</Link>
</Button>


This renders:

<button>
  <a href="/dashboard">Dashboard</a>
</button>


⚠️ Invalid HTML (button inside link).

With asChild:

<Button asChild>
  <Link to="/dashboard">Dashboard</Link>
</Button>


This renders:

<a href="/dashboard" class="btn-classes">Dashboard</a>


✅ No extra wrapper, styling from Button is applied directly to <Link>.

⚡ Rule of thumb

If the component renders something interactive by default (like button, a, div with role), and you want to replace that with your own component → use asChild.

If the component is just a layout wrapper (CardContent, CardHeader, Form, Separator, etc.), then you usually don’t need asChild.

*/
