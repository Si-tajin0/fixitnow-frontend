"use client";

import { useQuery } from "@tanstack/react-query";
import { Wrench, Loader2 } from "lucide-react";

import { getAllPublicServicesAction } from "@/service/serviceActions";
import { Service } from "@/lib/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminServicesPage() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin-all-services"],
    queryFn: async () => await getAllPublicServicesAction(""),
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <Wrench className="mr-3 text-blue-600" /> Platform Services
      </h1>

      <Card className="shadow-sm border-t-4 border-t-blue-600">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-xl text-gray-800">
            All Registered Services
          </CardTitle>
          <CardDescription>
            View all services created by technicians across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : services.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service: Service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium text-gray-900">
                        {service.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          {service.category?.name || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {service.technician?.name || "Unknown"}
                      </TableCell>
                      <TableCell className="text-right font-bold text-gray-900">
                        ${service.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No services found on the platform.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
