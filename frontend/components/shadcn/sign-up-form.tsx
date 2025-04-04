"use client";

import { cn } from "@/helpers/libs/utils";
import { Button } from "@/components/shadcn/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card";
import { Input } from "@/components/shadcn/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { signUpSchema } from "@/helpers/validation/sign-up-schema";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { UserApiResponse } from "@/types/users";
import { apiService } from "@/libs/api";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useDebounceValue("", 500);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await apiService.post<UserApiResponse>(
        `/user/sign-up`,
        data
      );

      if (response.success) {
        toast.success(response.message);
        router.push(`/verify/${username}`);
      } else {
        toast.error(response.message);
      }
      setIsSubmitting(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage(""); // Reset message
        try {
          const response = await apiService.get<UserApiResponse>(
            `/user/check-username-unique/${username}`
          );
          setUsernameMessage(response.message);
        } catch {
          setUsernameMessage("Something went wrong. Please try again.");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Join us here</CardTitle>
          <CardDescription>
            Sign up to start your anonymous adventure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setUsername(e.target.value);
                          }}
                        />
                        {isCheckingUsername && (
                          <Loader2 className="animate-spin" />
                        )}
                        {!isCheckingUsername && usernameMessage && (
                          <p
                            className={`text-sm ${
                              usernameMessage === "Username is unique"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {usernameMessage}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <Input {...field} name="email" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" {...field} name="password" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-2 mb-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
                <div className="flex flex-col gap-2">
                  <p className="text-center">
                    We will send you a verification code
                  </p>
                  <div className="text-center text-sm">
                    Do you already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
