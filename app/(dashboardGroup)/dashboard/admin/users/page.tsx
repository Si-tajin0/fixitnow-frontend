// app/(dashboardGroup)/dashboard/admin/users/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ShieldAlert, ShieldCheck, Users } from "lucide-react";

import {
  getAllUsersAction,
  updateUserStatusAction,
} from "@/service/adminActions";
import { User } from "@/lib/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 💡 React Query দিয়ে ইউজারদের ফেচ করা
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => await getAllUsersAction(),
  });

  // 💡 Ban / Unban ফাংশন
  const handleStatusChange = async (userId: string, currentStatus: string) => {
    setLoadingId(userId);
    const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";

    const result = await updateUserStatusAction(userId, newStatus);

    if (result.success) {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }); // লিস্ট রিলোড হবে
    } else {
      toast.error(result.message);
    }
    setLoadingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <Users className="mr-3 text-blue-600" /> User Management
      </h1>

      <Card className="shadow-sm">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-xl text-gray-800">
            All Registered Users
          </CardTitle>
          <CardDescription>
            View all users and manage their access (Ban/Unban).
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500 animate-pulse font-medium">
              Loading users data...
            </div>
          ) : users.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-gray-900">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.status === "ACTIVE" ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">
                            ACTIVE
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none">
                            BLOCKED
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {/* 💡 অ্যাডমিন নিজে নিজেকে ব্লক করতে পারবে না! */}
                        {user.role === "ADMIN" ? (
                          <span className="text-xs text-gray-400 font-medium">
                            System Admin
                          </span>
                        ) : (
                          <Button
                            variant={
                              user.status === "ACTIVE"
                                ? "destructive"
                                : "default"
                            }
                            size="sm"
                            className={`cursor-pointer ${user.status === "BLOCKED" ? "bg-green-600 hover:bg-green-700" : ""}`}
                            onClick={() =>
                              handleStatusChange(user.id, user.status)
                            }
                            disabled={loadingId === user.id}
                          >
                            {loadingId === user.id ? (
                              "Processing..."
                            ) : user.status === "ACTIVE" ? (
                              <>
                                <ShieldAlert className="w-4 h-4 mr-1" /> Block
                                User
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-4 h-4 mr-1" /> Unblock
                              </>
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No users found in the system.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
