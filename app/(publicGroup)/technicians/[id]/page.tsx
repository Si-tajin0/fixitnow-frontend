"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  User,
  Briefcase,
  Wrench,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getPublicTechnicianByIdAction } from "@/service/technicianActions";
import { Review, TechnicianDisplayProfile } from "@/lib/types";

export default function TechnicianProfileDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [technician, setTechnician] = useState<TechnicianDisplayProfile | null>(
    null,
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTechData = async () => {
      setIsLoading(true);
      const [techData, reviewData] = await Promise.all([
        getPublicTechnicianByIdAction(params.id as string),
        getTechnicianReviewsAction(params.id as string),
      ]);

      setTechnician(techData as TechnicianDisplayProfile);
      setReviews(reviewData);
      setIsLoading(false);
    };
    loadTechData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="text-center mt-32 text-xl font-bold animate-pulse text-blue-600">
        Loading Professional Details...
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="text-center mt-32 text-red-500 text-xl font-bold">
        Technician Profile Not Found!
      </div>
    );
  }

  const profile = technician.technicianProfile || {
    skills: [],
    experience: 0,
    pricing: 0,
    isAvailable: false,
  };
  const isAvailable = profile.isAvailable !== false;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 text-gray-500 hover:text-blue-600 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-t-4 border-t-blue-600 shadow-md text-center pt-8">
            <CardContent className="space-y-4">
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {technician.name}
                </h1>
                <div className="flex items-center justify-center text-yellow-500 mt-2 font-bold text-lg">
                  <Star className="w-5 h-5 mr-1 fill-current" />{" "}
                  {technician.rating || 0} / 5
                </div>
              </div>

              <div className="flex justify-center mt-4">
                {isAvailable ? (
                  <span className="flex items-center text-xs uppercase font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Available for
                    Booking
                  </span>
                ) : (
                  <span className="flex items-center text-xs uppercase font-bold bg-red-100 text-red-700 px-3 py-1.5 rounded-full">
                    <XCircle className="w-4 h-4 mr-1" /> Currently Busy
                  </span>
                )}
              </div>

              <div className="pt-6">
                <Link href={`/book/${technician.id}`}>
                  <Button
                    className={`w-full py-6 text-lg cursor-pointer ${isAvailable ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 text-gray-500"}`}
                    disabled={!isAvailable}
                  >
                    {isAvailable ? "Book This Technician" : "Unavailable"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 border-b pb-4">
              <CardTitle className="text-lg">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-blue-500" />{" "}
                {technician.address || "Location not provided"}
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-blue-500" />{" "}
                {technician.phone || "Phone not provided"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 border-b pb-4">
              <CardTitle className="text-xl">Professional Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-500 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" /> Experience
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {profile.experience || 0} Years
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm text-gray-500 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" /> Base Pricing
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${profile.pricing || 0}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Wrench className="w-4 h-4 mr-2 text-gray-500" /> Technical
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-100 border text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium"
                    >
                      {skill}
                    </span>
                  )) || (
                    <span className="text-gray-400 text-sm">
                      No specific skills listed.
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 💡 Customer Reviews Section */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 border-b pb-4">
              <CardTitle className="text-xl flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" /> Customer Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review: Review, i: number) => (
                    <div
                      key={i}
                      className="p-4 border rounded-lg bg-white shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-800">
                          {review.customer?.name || "Anonymous Customer"}
                        </span>
                        <span className="flex items-center text-yellow-500 text-sm font-bold">
                          <Star className="w-3 h-3 mr-1 fill-current" />{" "}
                          {review.rating}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm italic">
                        &quot;{review.comment}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                  <Star className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">
                    No reviews yet for this professional.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { DollarSign } from "lucide-react";
import { getTechnicianReviewsAction } from "@/service/reviewActions";
