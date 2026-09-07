"use client";

import { FilterX, Search } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Category, Service } from "@/lib/types";
import { getAllPublicServicesAction } from "@/service/serviceActions";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 💡 ১. পেজ লোড হলে প্রথমবার সব ডেটা আনবে এবং ক্যাটাগরি বের করবে
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const initialServices = await getAllPublicServicesAction("");
      setServices(initialServices);

      const uniqueCategories: Category[] = [];
      const catMap = new Map();

      initialServices.forEach((s: Service) => {
        if (s.category && !catMap.has(s.category.id)) {
          catMap.set(s.category.id, true);
          uniqueCategories.push(s.category);
        }
      });
      setCategories(uniqueCategories);
      setIsLoading(false);
    };
    fetchInitialData();
  }, []);

  // 💡 ২. Real-time Search & Filter (Debounce Effect)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);

      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append("searchTerm", searchTerm);

      if (selectedCategory && selectedCategory !== "all")
        queryParams.append("categoryId", selectedCategory);
      if (minPrice) queryParams.append("minPrice", minPrice);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);

      const filteredData = await getAllPublicServicesAction(
        queryParams.toString(),
      );
      setServices(filteredData);
      setIsLoading(false);
    }, 500); // 👈 ৫০০ ms Delay

    return () => clearTimeout(delayDebounceFn); // Cleanup function
  }, [searchTerm, selectedCategory, minPrice, maxPrice]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar - Filter Panel */}
        <div className="w-full md:w-1/4 space-y-6 bg-white p-6 rounded-xl shadow-sm border h-fit sticky top-24">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4">
            Filter Services
          </h2>

          {/* 💡 Real-time Search */}
          <div className="space-y-2">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* 💡 Auto Extracted Categories */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                if (value !== null) setSelectedCategory(value);
              }}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="All Categories">
                  {selectedCategory === "all"
                    ? "All Categories"
                    : categories.find((c) => c.id === selectedCategory)?.name ||
                      "All Categories"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Price Range ($)</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="text-gray-500">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Right Side - Services Grid */}
        <div className="w-full md:w-3/4">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            Available Services
          </h1>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Card
                  key={n}
                  className="w-full h-64 animate-pulse bg-gray-100 border-gray-200"
                />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader>
                    {service.category && (
                      <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded mb-2">
                        {service.category.name}
                      </span>
                    )}
                    <CardTitle className="text-xl text-gray-800 line-clamp-1">
                      {service.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-3xl font-bold text-gray-900">
                      ${service.price}
                    </p>
                    <p className="text-gray-500 mt-2 text-sm line-clamp-2">
                      {service.description}
                    </p>
                  </CardContent>

                  <CardFooter>
                    <Link href={`/book/${service.id}`} className="w-full">
                      <Button className="w-full cursor-pointer bg-gray-900 hover:bg-blue-600 transition-colors text-white">
                        Book Now
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
              <FilterX className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700">
                No Services Found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your filters or search term.
              </p>
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="mt-6 cursor-pointer"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
