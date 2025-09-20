import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import FocusedPageContainer from "@/components/common/FocusedPageContainer";
import { useState } from "react";
import EmailActionAlert from "@/components/auth/EmailActionAlert";
import ResendVerificationDialog from "@/components/auth/ResendVerificationDialog";

const formSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormFields = z.infer<typeof formSchema>;

type EmailActionType = "emailVerification" | "resetPassword" | null;

const Login = () => {
  const [emailAction, setEmailAction] = useState<EmailActionType>(null);

  const form = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await fetch("https://localhost:7145/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
      }
    } catch (error) {
      if (error instanceof Error) {
        form.setError("root", { message: error.message });
      }
    }
  };

  return (
    <>
      {emailAction && (
        <EmailActionAlert
          title="Check your inbox"
          description={`If this email is registered, we've sent you a ${
            emailAction === "emailVerification"
              ? "verification"
              : "password reset"
          } link.`}
          onClose={() => setEmailAction(null)}
        />
      )}

      <FocusedPageContainer>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your credentials to login to your account
            </CardDescription>
            <CardAction>
              <Button variant="link" size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id="loginForm"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Server error */}
                {form.formState.errors.root && (
                  <div className="text-sm font-medium text-red-600">
                    {form.formState.errors.root.message}
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col">
            <Button
              form="loginForm"
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <div className="border-t w-full mt-3 pt-2 flex flex-col gap-0.5">
              <Button variant="link" size="sm" asChild>
                <Link to="/forgot-password">Forgot password?</Link>
              </Button>
              <ResendVerificationDialog
                buttonText="Didn’t receive verification email?"
                showSuccessAlert={() => setEmailAction("emailVerification")}
              />
            </div>
          </CardFooter>
        </Card>
      </FocusedPageContainer>
    </>
  );
};

export default Login;

/* 
# Do you have to give defaultValues?
> Not always required — if your form is strictly for new data entry (like login, registration), React Hook Form can work without defaults.
> But recommended — because React Hook Form keeps all inputs controlled. Without defaultValues, inputs may start as undefined, which can cause warnings or unexpected behavior.
*/
