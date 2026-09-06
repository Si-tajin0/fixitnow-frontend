import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  email: string;
  exp: number;
}

export const middleware = (request: NextRequest) => {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Without login not go to dashboard
  if (!token && pathname.startsWith("/dashboardGroup")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // use the token and decode the role
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (pathname === "/login" || pathname === "/register") {
        if (decoded.role === "ADMIN")
          return NextResponse.redirect(
            new URL("/dashboard/admin", request.url),
          );

        if (decoded.role === "TECHNICIAN")
          return NextResponse.redirect(
            new URL("/dashboard/technician", request.url),
          );

        return NextResponse.redirect(
          new URL("/dashboard/customer", request.url),
        );
      }

      // based router protection
      if (pathname.startsWith("/dashboard/admin") && decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (
        pathname.startsWith("/dashboard/technician") &&
        decoded.role !== "TECHNICIAN"
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (
        pathname.startsWith("/dashboard/customer") &&
        decoded.role !== "CUSTOMER"
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      return response;
    }
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
