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
import ForgotPasswordDialog from "@/components/auth/ForgotPasswordDialog";
import { loginSchema } from "@/validations/loginSchema";
import { useLogin } from "@/hooks/auth/useLogin";
import FormSubmissionButton from "@/components/common/FormSubmissionButton";
import type { LoginRequest } from "@/types/api/authTypes";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import axios from "axios";
import type { ApiError } from "@/types/api/commonTypes";
import { applyServerError } from "@/lib/applyServerErrors";

type FormFields = z.infer<typeof loginSchema>;

type EmailActionType = "emailVerification" | "forgotPassword" | null;

const Login = () => {
  const [emailAction, setEmailAction] = useState<EmailActionType>(null);
  const getLinkType = (action: Exclude<EmailActionType, null>) => {
    return action === "emailVerification" ? "verification" : "password reset";
  };

  const form = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const { mutateAsync: loginAsync, isPending } = useLogin();
  const { setAuth } = useAuthStore((state) => state.actions);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const request: LoginRequest = {
        email: data.email,
        password: data.password,
      };
      const response = await loginAsync(request);
      console.log(response);
      setAuth(response.token.accessToken, response.user);
    } catch (error) {
      toast.error("Login failed");
      if (axios.isAxiosError<ApiError>(error) && error.response?.data.errors) {
        applyServerError(form.setError, error.response.data.errors);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <>
      <FocusedPageContainer>
        {emailAction && (
          <EmailActionAlert
            title="Check your inbox"
            description={`If this email is registered, we've sent you a ${getLinkType(
              emailAction
            )} link.`}
            onClose={() => setEmailAction(null)}
          />
        )}
        <Card>
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
            <FormSubmissionButton
              formId="loginForm"
              className="w-full"
              isSubmitting={form.formState.isSubmitting || isPending}
              submittingText="Logging in..."
            >
              Login
            </FormSubmissionButton>

            <div className="border-t w-full mt-3 pt-2 flex flex-col gap-0.5">
              <ForgotPasswordDialog
                showSuccessAlert={() => setEmailAction("forgotPassword")}
              />
              <ResendVerificationDialog
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



> In react if you have Expensive component that you don't want to re-render very time something changes in consumer component that doesn't effect it.
> we should pass this expensive component as children. that will solve the issue.

*/
