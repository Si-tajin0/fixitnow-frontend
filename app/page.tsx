// app/page.tsx
"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Wrench, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 💡 Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight">
            Your Trusted <span className="text-blue-600">Home Service</span>{" "}
            Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Book the best technicians in your area. Fast, reliable, and
            hassle-free! Don&apos;t wait, fix it now.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/services">
              <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-full shadow-lg cursor-pointer">
                Explore Services <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                className="text-lg px-8 py-6 rounded-full bg-white text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
              >
                Join as Technician
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 💡 How It Works Section */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            How FixItNow Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
                1
              </div>
              <h3 className="text-xl font-bold">Choose a Service</h3>
              <p className="text-gray-500">
                Browse through our wide range of professional home services and
                select what you need.
              </p>
            </div>
            <div className="space-y-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
                2
              </div>
              <h3 className="text-xl font-bold">Pick a Time</h3>
              <p className="text-gray-500">
                Select a convenient date and time slot. Our technicians adapt to
                your schedule.
              </p>
            </div>
            <div className="space-y-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
                3
              </div>
              <h3 className="text-xl font-bold">Get It Fixed</h3>
              <p className="text-gray-500">
                The technician arrives and completes the job. Pay securely
                online after acceptance!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 💡 Why Choose Us Section */}
      <section className="py-20 bg-gray-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Why Choose Us?</h2>
            <p className="text-gray-400 mt-4">
              We ensure top-notch quality and peace of mind.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-blue-400" />
              <h4 className="font-bold text-lg">Verified Experts</h4>
              <p className="text-sm text-gray-400">
                All our technicians go through a strict background check.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <Star className="w-12 h-12 text-yellow-400" />
              <h4 className="font-bold text-lg">Quality Assured</h4>
              <p className="text-sm text-gray-400">
                We maintain high standards to give you the best results.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <Clock className="w-12 h-12 text-green-400" />
              <h4 className="font-bold text-lg">On-Time Service</h4>
              <p className="text-sm text-gray-400">
                We respect your time and guarantee punctual arrivals.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <Wrench className="w-12 h-12 text-orange-400" />
              <h4 className="font-bold text-lg">Modern Tools</h4>
              <p className="text-sm text-gray-400">
                Equipped with the latest technology to fix issues efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
