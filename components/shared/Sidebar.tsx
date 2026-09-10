"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  Settings,
  Users,
  Briefcase,
  Wrench,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarProps = {
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
};

export const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();

  const menuItems = {
    CUSTOMER: [
      { name: "My Bookings", href: "/dashboard/customer", icon: History },
      {
        name: "Payment History",
        href: "/dashboard/customer/payments",
        icon: CreditCard,
      },
      {
        name: "Profile Settings",
        href: "/dashboard/customer/profile",
        icon: Settings,
      },
    ],
    TECHNICIAN: [
      { name: "Job Requests", href: "/dashboard/technician", icon: Briefcase },
      {
        name: "Profile Settings",
        href: "/dashboard/technician/profile",
        icon: Settings,
      },
      {
        name: "Manage Services",
        href: "/dashboard/technician/services",
        icon: Wrench,
      },
    ],
    ADMIN: [
      { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
      {
        name: "Categories",
        href: "/dashboard/admin/categories",
        icon: Briefcase,
      },
      {
        name: "All Services",
        href: "/dashboard/admin/services",
        icon: Wrench,
      },
    ],
  };

  const links = menuItems[role] || [];

  return (
    <aside className="w-full md:w-64 bg-white border-r min-h-screen p-4 flex flex-col shadow-sm">
      <div className="mb-8 px-4">
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wider">
          {role} PANEL
        </h2>
      </div>
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link key={link.name} href={link.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer mb-1",
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
