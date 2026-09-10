"use client";

import {
  CheckCircle2,
  Info,
  Search,
  Star,
  Wrench,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { TechnicianDisplayProfile } from "@/lib/types";
import {
  getAllPublicTechniciansAction,
  getMyRoleAction,
} from "@/service/technicianActions";

export default function PublicTechniciansPage() {
  const [technicians, setTechnicians] = useState<TechnicianDisplayProfile[]>(
    [],
  );
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const [data, role] = await Promise.all([
        getAllPublicTechniciansAction(),
        getMyRoleAction(),
      ]);

      setTechnicians(data as TechnicianDisplayProfile[]);
      setUserRole(role);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredTechnicians = technicians.filter(
    (tech: TechnicianDisplayProfile) => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = tech.name?.toLowerCase().includes(searchLower);
      const skillsMatch = tech.technicianProfile?.skills?.some(
        (skill: string) => skill.toLowerCase().includes(searchLower),
      );
      const locationMatch = tech.address?.toLowerCase().includes(searchLower);
      let priceMatch = false;
      const searchNumber = Number(searchLower);

      if (!isNaN(searchNumber) && searchLower !== "") {
        const techPrice = tech.technicianProfile?.pricing || 0;
        priceMatch = techPrice <= searchNumber;
      }

      return nameMatch || skillsMatch || priceMatch || locationMatch;
    },
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Find the Best Technicians
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse through our verified professionals. Check their live skills,
          pricing, and availability!
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-12 relative">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search by technician name or skills (e.g., AC Repair, Plumbing)..."
          className="pl-12 py-6 text-lg rounded-full shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <Card
              key={n}
              className="w-full h-80 animate-pulse bg-gray-100 border-gray-200"
            />
          ))}
        </div>
      ) : filteredTechnicians.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTechnicians.map((tech: TechnicianDisplayProfile) => {
            const profile = tech.technicianProfile || {
              skills: [],
              experience: 0,
              pricing: 0,
              isAvailable: false,
            };
            const isAvailable = profile.isAvailable !== false;

            const bio =
              profile.skills?.length > 0
                ? `Professional technician with ${profile.experience || 0} years of experience specializing in ${profile.skills.slice(0, 2).join(", ")} and more.`
                : "Professional home service technician ready to assist you.";

            return (
              <Card
                key={tech.id}
                className="flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-blue-500"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl text-gray-800">
                        {tech.name}
                      </CardTitle>
                      <div className="flex items-center text-yellow-500 mt-1 font-bold text-sm">
                        <Star className="w-4 h-4 mr-1 fill-current" />{" "}
                        {tech.rating || 0} / 5
                      </div>
                    </div>

                    {isAvailable ? (
                      <span className="flex items-center text-[10px] uppercase font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Available
                      </span>
                    ) : (
                      <span className="flex items-center text-[10px] uppercase font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        <XCircle className="w-3 h-3 mr-1" /> Busy
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  <div className="text-sm text-gray-600 flex items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <Info className="w-4 h-4 mr-2 text-blue-500 mt-0.5 shrink-0" />
                    <p className="line-clamp-2">{bio}</p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-500 text-sm font-medium">
                      Base Price
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${profile.pricing || 0}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold mb-2 flex items-center">
                      <Wrench className="w-3 h-3 mr-1" /> Top Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills
                        ?.slice(0, 3)
                        .map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded text-xs font-semibold"
                          >
                            {skill}
                          </span>
                        )) || (
                        <span className="text-xs text-gray-400">
                          General Services
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                  <div className="flex w-full gap-2">
                    <Link href={`/technicians/${tech.id}`} className="w-1/2">
                      <Button
                        variant="outline"
                        className="w-full cursor-pointer text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        View Profile
                      </Button>
                    </Link>

                    {!userRole ? (
                      <Link
                        href={`/login?redirect=/book/${tech.id}`}
                        className="w-1/2"
                      >
                        <Button className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700">
                          Login
                        </Button>
                      </Link>
                    ) : userRole === "CUSTOMER" ? (
                      <Link href={`/book/${tech.id}`} className="w-1/2">
                        <Button
                          className={`w-full cursor-pointer ${isAvailable ? "bg-gray-900 hover:bg-gray-800 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                          disabled={!isAvailable}
                        >
                          {isAvailable ? "Book" : "Busy"}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className="w-1/2 cursor-not-allowed bg-gray-200 text-gray-500 text-xs"
                        disabled
                      >
                        Not Allowed
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-700">
            No Technicians Found
          </h3>
          <p className="text-gray-500 mt-2">
            We couldn&apos;t find anyone matching your search.
          </p>
          <Button
            onClick={() => setSearchTerm("")}
            variant="outline"
            className="mt-6 cursor-pointer"
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}
