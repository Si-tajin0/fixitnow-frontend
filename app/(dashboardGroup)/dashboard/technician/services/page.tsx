"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, PlusCircle } from "lucide-react";

import {
  createServiceAction,
  getCategoriesAction,
} from "@/service/serviceActions";
import { Category, CreateServicePayload } from "@/lib/types"; // 💡 NO ANY!

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// 💡 Zod Schema
const serviceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().min(1, "Price is required"),
  categoryId: z.string().min(1, "Please select a category"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function TechnicianServicesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories = [], isLoading: isFetchingCats } = useQuery<
    Category[]
  >({
    queryKey: ["tech-categories-list"],
    queryFn: async () => {
      const data = await getCategoriesAction();
      return data as Category[];
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
  });

  const watchCategoryId = watch("categoryId");

  const onSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);

    const payload: CreateServicePayload = {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      price: Number(data.price),
    };

    const result = await createServiceAction(payload);

    if (result.success) {
      toast.success(result.message);
      reset();
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <Briefcase className="mr-3 text-blue-600" /> My Services
      </h1>

      <Card className="shadow-sm border-t-4 border-t-blue-600">
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="text-xl text-blue-700 flex items-center">
            <PlusCircle className="w-5 h-5 mr-2" /> Add New Service
          </CardTitle>
          <CardDescription>
            Create a specific service to offer to customers.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Service Name</Label>
                <Input
                  placeholder="e.g. Pro AC Cleaning"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Service Price ($)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 500"
                  {...register("price")}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={watchCategoryId}
                onValueChange={(val) => setValue("categoryId", val as string)}
              >
                <SelectTrigger className="w-full cursor-pointer py-6">
                  <SelectValue
                    placeholder={
                      isFetchingCats ? "Loading..." : "Select a category"
                    }
                  >
                    {watchCategoryId
                      ? categories.find(
                          (c: Category) => c.id === watchCategoryId,
                        )?.name
                      : "Select a category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: Category) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                className="resize-none"
                placeholder="Detailed description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish Service"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
