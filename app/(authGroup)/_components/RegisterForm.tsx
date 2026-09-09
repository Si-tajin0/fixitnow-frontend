// app/(authGroup)/_components/RegisterForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { registerUserAction } from "../_actions/authActions";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z
    .string()
    .min(11, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  role: z.enum(["CUSTOMER", "TECHNICIAN"], { message: "Please select a role" }),
  // Conditional fields (এগুলো অপশনাল রাখছি, কারণ কাস্টমারের লাগবে না)
  skills: z.string().optional(),
  experience: z.string().optional(),
  pricing: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CUSTOMER" }, // ডিফল্ট কাস্টমার
  });

  // 💡 ম্যাজিক ট্রিক: রিয়েল-টাইমে রোল চেক করা
  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormValues) => {
    // ম্যানুয়াল ভ্যালিডেশন (যদি টেকনিশিয়ান হয়, তবে ফিল্ডগুলো ফাঁকা রাখা যাবে না)
    if (selectedRole === "TECHNICIAN") {
      if (!data.skills || !data.experience || !data.pricing) {
        toast.error(
          "Skills, Experience, and Pricing are required for Technicians!",
        );
        return;
      }
    }

    setIsLoading(true);
    const result = await registerUserAction(data);

    if (result.success) {
      toast.success(result.message);
      router.push("/login");
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-lg shadow-lg mt-10 mb-10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          Create an Account
        </CardTitle>
        <CardDescription className="text-center">
          Join FixItNow as a Customer or Technician
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="John Doe" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="01700000000"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Input
              id="address"
              placeholder="Dhaka, Bangladesh"
              {...register("address")}
            />
          </div>

          <div className="space-y-2">
            <Label>Role *</Label>
            <Select
              onValueChange={(value) =>
                setValue("role", value as "CUSTOMER" | "TECHNICIAN")
              }
              defaultValue="CUSTOMER"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CUSTOMER">
                  Customer (Book Services)
                </SelectItem>
                <SelectItem value="TECHNICIAN">
                  Technician (Provide Services)
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* 💡 Conditional Rendering (শুধু TECHNICIAN এর জন্য) */}
          {selectedRole === "TECHNICIAN" && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg space-y-4 mt-4 animate-in fade-in slide-in-from-top-4">
              <h3 className="font-semibold text-blue-800">
                Technician Details
              </h3>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (Comma Separated) *</Label>
                <Input
                  id="skills"
                  placeholder="e.g. Plumbing, Electrical"
                  {...register("skills")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (Years) *</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="e.g. 5"
                    {...register("experience")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricing">Base Pricing ($) *</Label>
                  <Input
                    id="pricing"
                    type="number"
                    placeholder="e.g. 50"
                    {...register("pricing")}
                  />
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Register"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
