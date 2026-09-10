"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { User, Loader2, Mail, Phone, MapPin, Edit } from "lucide-react";

import {
  getCustomerProfileAction,
  updateCustomerProfileAction,
  UpdateCustomerPayload,
} from "@/service/customerActions";

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

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

type CustomerProfileFormValues = z.infer<typeof profileSchema>;

interface CustomerDisplayProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function CustomerProfilePage() {
  const [profileData, setProfileData] = useState<CustomerDisplayProfile | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      const data = await getCustomerProfileAction();

      if (data) {
        setProfileData({
          id: data.id,
          name: data.name || "N/A",
          email: data.email || "N/A",
          phone: data.phone || "",
          address: data.address || "",
        });

        reset({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      }
      setIsLoading(false);
    };

    loadProfile();
  }, [reset]);

  const onSubmit = async (data: CustomerProfileFormValues) => {
    setIsUpdating(true);
    const payload: UpdateCustomerPayload = {
      name: data.name,
      phone: data.phone || "",
      address: data.address || "",
    };

    // 💡 ম্যাজিক ফিক্স: এখন আর এরর দিবে না!
    const result = await updateCustomerProfileAction(payload);

    if (result.success) {
      toast.success(result.message);
      setIsModalOpen(false);
    } else {
      toast.error(result.message || "Backend route not available yet!");
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
        Failed to load profile data!
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <User className="mr-3 text-blue-600" /> My Profile
        </h1>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 cursor-pointer shadow-md">
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Personal Information</DialogTitle>
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
          <CardTitle className="text-xl text-gray-800">
            Account Details
          </CardTitle>
          <CardDescription>
            Your registered personal and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center text-gray-700 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <User className="w-6 h-6 mr-4 text-blue-500" />
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
