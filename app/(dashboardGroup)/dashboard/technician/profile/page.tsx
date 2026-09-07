// app/(dashboardGroup)/dashboard/technician/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import {
  UserCog,
  Loader2,
  Edit,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Wrench,
  DollarSign,
  Briefcase,
  Star,
} from "lucide-react";

import {
  getTechnicianProfileAction,
  updateTechnicianProfileAction,
} from "@/service/technicianActions";
import { TechnicianDisplayProfile } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const profileSchema = z.object({
  skills: z.string().min(3, "Please enter your skills (comma separated)"),
  experience: z.string().min(1, "Experience is required"),
  pricing: z.string().min(1, "Pricing is required"),
  isAvailable: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function TechnicianProfilePage() {
  const [profileData, setProfileData] =
    useState<TechnicianDisplayProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      skills: "",
      experience: "0",
      pricing: "0",
      isAvailable: true,
    },
  });

  const isAvailable = watch("isAvailable");

  const loadProfile = async () => {
    console.log("🚀 Frontend calling backend...");
    setIsLoading(true);
    const data = await getTechnicianProfileAction();
    console.log("🚀 Data received in frontend:", data);

    if (data) {
      setProfileData(data);

      const techProfile = data.technicianProfile || {};
      const skillsArray = Array.isArray(techProfile.skills)
        ? techProfile.skills
        : [];

      reset({
        skills: skillsArray.join(", "),
        experience: String(techProfile.experience || 0),
        pricing: String(techProfile.pricing || 0),
        isAvailable:
          techProfile.isAvailable !== undefined
            ? techProfile.isAvailable
            : true,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsUpdating(true);

    const payload = {
      skills: data.skills
        .split(",")
        .map((skill: string) => skill.trim())
        .filter(Boolean),
      experience: Number(data.experience),
      pricing: Number(data.pricing),
      isAvailable: data.isAvailable,
    };

    const result = await updateTechnicianProfileAction(payload);

    if (result.success) {
      toast.success(result.message);
      setIsModalOpen(false);
      loadProfile();
    } else {
      toast.error(result.message);
    }
    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center text-red-500 mt-10 font-bold text-xl">
        Failed to load profile data!
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <UserCog className="mr-3 text-blue-600" /> My Profile
        </h1>

        {/* 💡 Edit Button & Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 cursor-pointer shadow-md">
            <Edit className="w-4 h-4 mr-2" /> Edit Professional Details
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Professional Details</DialogTitle>
              <DialogDescription>
                Update your skills, experience, and pricing. (Personal info can
                only be updated by Admin).
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (Comma Separated)</Label>
                <Input id="skills" {...register("skills")} />
                {errors.skills && (
                  <p className="text-sm text-red-500">
                    {errors.skills.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    {...register("experience")}
                  />
                  {errors.experience && (
                    <p className="text-sm text-red-500">
                      {errors.experience.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricing">Base Pricing ($)</Label>
                  <Input id="pricing" type="number" {...register("pricing")} />
                  {errors.pricing && (
                    <p className="text-sm text-red-500">
                      {errors.pricing.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4 bg-gray-50">
                <Label className="text-base font-bold">
                  Available for Bookings?
                </Label>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={(checked) =>
                    setValue("isAvailable", checked)
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Info Card (Read Only) */}
        <Card className="shadow-sm md:col-span-1">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg">Personal Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mb-2">
              <div className="flex items-center text-yellow-500 font-bold">
                <Star className="w-5 h-5 mr-2 fill-current" />
                <span>Rating</span>
              </div>
              <span className="text-lg font-black text-gray-800">
                {profileData.rating || 0} / 5
              </span>
            </div>

            <div className="flex items-center text-gray-700">
              <UserCog className="w-5 h-5 mr-3 text-blue-500" />
              <span className="font-semibold">{profileData.name}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Mail className="w-5 h-5 mr-3 text-blue-500" />
              <span>{profileData.email}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="w-5 h-5 mr-3 text-blue-500" />
              <span>{profileData.phone || "Not provided"}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="w-5 h-5 mr-3 text-blue-500" />
              <span>{profileData.address || "Not provided"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Professional Info Card */}
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-gray-50 border-b flex flex-row justify-between items-center">
            <CardTitle className="text-lg">Professional Details</CardTitle>
            {profileData.technicianProfile?.isAvailable ? (
              <span className="flex items-center text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3 mr-1" /> AVAILABLE
              </span>
            ) : (
              <span className="flex items-center text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">
                <XCircle className="w-3 h-3 mr-1" /> UNAVAILABLE
              </span>
            )}
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <Briefcase className="w-8 h-8 text-blue-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="text-xl font-bold text-gray-800">
                    {profileData.technicianProfile?.experience || 0} Years
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-100">
                <DollarSign className="w-8 h-8 text-green-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Base Pricing</p>
                  <p className="text-xl font-bold text-gray-800">
                    ${profileData.technicianProfile?.pricing || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center">
                <Wrench className="w-4 h-4 mr-2" /> SKILLS
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData.technicianProfile?.skills?.map(
                  (skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-100 border text-gray-700 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ),
                ) || (
                  <p className="text-sm text-gray-400">No skills added yet.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
