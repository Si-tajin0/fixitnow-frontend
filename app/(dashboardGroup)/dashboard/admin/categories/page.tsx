"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Layers, PlusCircle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { createCategoryAction } from "@/service/adminActions";
import { getCategoriesAction } from "@/service/serviceActions";
import { Category } from "@/lib/types";

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

const categorySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: isFetching } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => await getCategoriesAction(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryFormValues) => {
    const result = await createCategoryAction(data);

    if (result.success) {
      toast.success(result.message);
      reset();
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <Layers className="mr-3 text-blue-600" /> Manage Categories
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side - Category List */}
        <div className="md:col-span-2 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 border-b rounded-t-xl">
              <CardTitle className="text-xl text-gray-800">
                Existing Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isFetching ? (
                <div className="p-8 text-center text-gray-500 animate-pulse">
                  Loading categories...
                </div>
              ) : categories.length > 0 ? (
                <div className="divide-y">
                  {categories.map((cat: Category) => (
                    <div
                      key={cat.id}
                      className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-bold text-gray-800">{cat.name}</h3>
                        <p className="text-sm text-gray-500">
                          {cat.description}
                        </p>
                      </div>
                      <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No categories found. Create your first category!
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Create Category Form */}
        <div className="md:col-span-1">
          <Card className="shadow-sm sticky top-24">
            <CardHeader className="bg-blue-50 border-b rounded-t-xl">
              <CardTitle className="text-xl text-blue-700 flex items-center">
                <PlusCircle className="w-5 h-5 mr-2" /> Add Category
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Plumbing"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description..."
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
                  className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Category"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
