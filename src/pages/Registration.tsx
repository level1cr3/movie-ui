import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "@/validations/registrationSchema";
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
import { useRegister } from "@/hooks/auth/useRegister";
import type { RegisterRequest } from "@/services/auth";
import axios from "axios";
import type { ApiError } from "@/types/api";
import { toast } from "sonner";
import { applyServerError } from "@/lib/applyServerErrors";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon, XIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type FormFields = z.infer<typeof registrationSchema>;

const Registration = () => {
  const [isShowPassword, setShowPassword] = useState(false);
  const [isSubmittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const form = useForm<FormFields>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registrationSchema),
  });

  const { mutateAsync: registerAsync, isPending } = useRegister();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const request: RegisterRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    }; // never pass UI-specific fields (like confirmPassword, acceptTerms, captchaToken, etc.) in your request payload.

    try {
      await registerAsync(request); // only returning 200 status on success no data.
      toast.success("user created");
      setSubmittedSuccessfully(true);
      form.reset();
    } catch (error) {
      toast.error("Registration failed!");
      if (axios.isAxiosError<ApiError>(error)) {
        if (error.response?.data.errors) {
          applyServerError(form.setError, error.response.data.errors);
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      {isSubmittedSuccessfully && (
        <Alert variant="info" className="w-full max-w-md mb-3">
          <CircleAlertIcon />
          <AlertTitle>Verify your email to activate your account</AlertTitle>
          <AlertDescription>
            We&apos;ve sent a confirmation link to your inbox. Check your email
            to complete the registration.
          </AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSubmittedSuccessfully(false)}
            className="absolute right-0"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </Button>
        </Alert>
      )}

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
          <CardAction>
            <Button variant="link" size="sm">
              <Link to="/login">Login</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="registrationForm"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <div className="flex mt-5">
            <Checkbox
              id="showPassword"
              className="mr-2"
              onCheckedChange={() => setShowPassword(!isShowPassword)}
            />
            <Label htmlFor="showPassword" className="cursor-pointer">
              Show Password
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col justify-center">
          {form.formState.errors.root?.types && (
            <ul className="list-disc text-red-600 mb-3 space-y-1">
              {Object.values(form.formState.errors.root.types).map(
                (msg, idx) => (
                  <li key={idx}>{msg}</li>
                )
              )}
            </ul>
          )}
          <Button
            form="registrationForm"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting || isPending ? (
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"></div>
                Submitting...
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Registration;
