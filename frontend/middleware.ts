import { auth } from "@/utils/auth";

import { NextResponse } from "next/server";

const roleBaseAccess = {
  user: ["/channeling"],
  admin: ["/channeling", "/dashboard"],
  doctor: [
    "/channeling",
    "/dashboard/appointment-list",
    "/dashboard/appointment-schedule",
    "/dashboard/treatment-history-management",
  ],
  supplier: [
    "/channeling",
    "/dashboard/Inventory-management",
    "/dashboard/product-management",
    "/dashboard/product-management/product-add",
    "/dashboard/product-management/product-see",
    "/dashboard/order-management",
  ],
};

export default auth(async function middleware(request) {
  const url = request.nextUrl;
  const path = url.pathname;
  const newRoutes = Object.values(roleBaseAccess).flat();
  const newSet = new Set([...newRoutes]);
  const protectedRoutes = Array.from(newSet);

  const session = request?.auth;
  const user = request?.auth?.user;

  if (
    user?.error &&
    user?.error === "RefreshAccessTokenError" &&
    !path.startsWith("/sign-in")
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Redirect root to home page
  if (path === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // If user is already logged-in and trying to access auth pages, redirect based on role
  if (
    session &&
    (path.startsWith("/sign-in") ||
      path.startsWith("/sign-up") ||
      path.startsWith("/verify")) &&
    !session?.user.error
  ) {
    if (user?.role === "user") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    if (user?.role === "doctor") {
      return NextResponse.redirect(
        new URL("/dashboard/appointment-list", request.url)
      );
    }
    if (user?.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // If a user tries to access a protected route
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    // If user is not logged-in then go to sign-in
    if (!session) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const role = user?.role as string;

    const allowedRoutes =
      roleBaseAccess[role as keyof typeof roleBaseAccess] || [];

    // Check if the current path is allowed for the user's role
    const isAllowed = allowedRoutes.some((route) => path.startsWith(route));

    if (!isAllowed) {
      // Redirect to sign-in if the user is not allowed to access the route
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
