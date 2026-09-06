"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUserAction } from "../_actions/authActions";

// Zod Validation Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Form submit after the call function
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    const result = await loginUserAction(data);

    if (result.success) {
      toast.success(result.message);
      const redirectUrl = searchParams.get("redirect");
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push("/");
      }

      router.refresh();
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-[400px] shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to login to FixItNow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@fixitnow.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {/* UI Error Handling  */}
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
