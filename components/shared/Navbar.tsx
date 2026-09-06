"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { logoutUserAction } from "@/app/(authGroup)/_actions/authActions";
import { CustomJwtPayload } from "@/service/auth.sevice";

type UserProps = {
  user: CustomJwtPayload | null;
};

export const Navbar = ({ user }: UserProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUserAction();
    toast.success("Logged out successfully!");
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              FixItNow<span className="text-gray-800">.</span>
            </Link>
          </div>

          {/* Links Section */}
          <div className="hidden md:flex space-x-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Services
            </Link>
          </div>

          {/* Auth Buttons Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href={`/dashboard/${user.role.toLowerCase()}`}>
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button onClick={handleLogout} variant="destructive">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
