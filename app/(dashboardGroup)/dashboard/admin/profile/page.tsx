// app/(dashboardGroup)/dashboard/admin/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // 💡 React Query ইম্পোর্ট
import { ShieldCheck, Loader2, Mail, Phone, MapPin, Edit } from "lucide-react";

import {
  getAdminProfileAction,
  updateAdminProfileAction,
} from "@/service/adminActions";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UpdateAdminPayload } from "@/lib/types";

// Zod Schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(11, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(5, "Enter your full address")
    .optional()
    .or(z.literal("")),
});

type AdminProfileFormValues = z.infer<typeof profileSchema>;

export default function AdminProfilePage() {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 💡 React Query ম্যাজিক: কোনো useState বা useEffect দিয়ে ডেটা আনার দরকার নেই!
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => await getAdminProfileAction(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // 💡 ডেটা আসলে শুধু ফর্মে অটো-ফিল করে দিবো (কোনো এরর আসবে না)
  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData.name || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
      });
    }
  }, [profileData, reset]);

  const onSubmit = async (data: AdminProfileFormValues) => {
    if (!profileData?.id) return;

    setIsUpdating(true);
    const payload: UpdateAdminPayload = {
      name: data.name,
      phone: data.phone || "",
      address: data.address || "",
    };

    const result = await updateAdminProfileAction(payload);

    if (result.success) {
      toast.success(result.message);
      setIsModalOpen(false);
      // 💡 ডেটাবেজ আপডেট হলে React Query অটোমেটিক নতুন ডেটা এনে স্ক্রিনে দেখিয়ে দিবে!
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
    } else {
      toast.error(result.message || "Failed to update profile!");
    }
    setIsUpdating(false);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );

  if (!profileData)
    return (
      <div className="text-center text-red-500 mt-10 font-bold text-xl">
        Failed to load admin profile!
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <ShieldCheck className="mr-3 text-blue-600" /> System Admin Profile
        </h1>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 cursor-pointer shadow-md">
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Admin Information</DialogTitle>
              <DialogDescription>
                Update your contact details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...register("phone")} />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input id="address" {...register("address")} />
                {errors.address && (
                  <p className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-lg py-6"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving Changes..." : "Save Profile"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-t-4 border-t-blue-600">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-xl text-gray-800">Admin Details</CardTitle>
          <CardDescription>
            Your registered root administrative information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center text-gray-700 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <ShieldCheck className="w-6 h-6 mr-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Full Name
                </p>
                <p className="font-semibold text-lg">{profileData.name}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-700 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <Mail className="w-6 h-6 mr-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Email Address
                </p>
                <p className="font-semibold text-lg">{profileData.email}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-700 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <Phone className="w-6 h-6 mr-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Phone Number
                </p>
                <p className="font-semibold text-lg">
                  {profileData.phone || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center text-gray-700 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <MapPin className="w-6 h-6 mr-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Address
                </p>
                <p className="font-semibold text-lg">
                  {profileData.address || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
