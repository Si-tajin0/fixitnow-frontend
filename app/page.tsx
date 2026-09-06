"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useServices } from "@/hooks/useServices";
import { Service } from "@/lib/types";
import Link from "next/link";

export default function HomePage() {
  // React Query use the fetch data
  const { data: services, isLoading, isError } = useServices();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Your Trusted Home Service Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Book the best technicians in your area. Fast, reliable, and
          hassle-free! Don&apos;t wait, fix it now.
        </p>
      </div>

      {/* Services Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Featured Services
        </h2>

        {/* Loading Skeleton   */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card
                key={n}
                className="w-full h-48 animate-pulse bg-gray-100 border-gray-200"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <p className="text-red-600 font-medium text-lg">
              Oops! Couldn&apos;t load services. Please check your backend
              connection.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && (!services || services.length === 0) && (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              No services available at the moment.
            </p>
          </div>
        )}

        {/* 💡 Service List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/*
            নোট: এখানে any এর বদলে পরে আমরা Type বসাবো,
            আপাতত তোমার ব্যাকএন্ডের রেসপন্স অনুযায়ী ডেটা দেখাচ্ছি।
            তোমার ব্যাকএন্ডে সার্ভিসের নাম, দাম (price) আছে ধরে নিচ্ছি।
          */}
          {services?.map((service: Service) => (
            <Card
              key={service.id}
              className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  {service.name}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  ${service.price}
                </p>

                <p className="text-gray-500 mt-2 line-clamp-2">
                  {service.description}
                </p>
              </CardContent>

              <CardFooter>
                <Link href={`/book/${service.id}`} className="w-full">
                  <Button className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
                    Book Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
