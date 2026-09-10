// components/shared/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { logoutUserAction } from "@/app/(authGroup)/_actions/authActions";
import { Button } from "@/components/ui/button";
import { CustomJwtPayload } from "@/service/auth.service";
import { LayoutDashboard, LogOut, User } from "lucide-react";

type UserProps = {
  user: CustomJwtPayload | null;
};

export const Navbar = ({ user }: UserProps) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logoutUserAction();
    toast.success("Logged out successfully!");
    router.push("/login");
    router.refresh();
  };

  const displayName =
    user?.name || (user?.email ? user.email.split("@")[0] : "User");
  const userInitial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0 flex items-center">
            <Link
              href="/"
              className="text-2xl font-extrabold text-blue-600 tracking-tight"
            >
              FixItNow<span className="text-orange-500">.</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>

            {/* technician profile service hide  */}

            {user?.role !== "TECHNICIAN" && (
              <Link
                href="/services"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Services
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* 💡 Avatar Button */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="outline-none border-none bg-blue-600 text-white font-bold h-10 w-10 flex items-center justify-center rounded-full ring-2 ring-blue-100 hover:ring-blue-300 transition-all cursor-pointer shadow-sm"
                >
                  {userInitial}
                </button>

                {/*  Dropdown Menu  */}
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 transition-all">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 bg-blue-50 text-blue-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/dashboard/${user.role.toLowerCase()}`);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center cursor-pointer transition-colors"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4 text-gray-500" />
                        Dashboard
                      </button>

                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push(
                            `/dashboard/${user.role.toLowerCase()}/profile`,
                          );
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center cursor-pointer transition-colors"
                      >
                        <User className="mr-2 h-4 w-4 text-gray-500" />
                        Profile Settings
                      </button>
                    </div>

                    <div className="border-t border-gray-100 py-1 mt-1">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center cursor-pointer font-medium transition-colors"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="font-semibold cursor-pointer"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 font-semibold cursor-pointer">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
