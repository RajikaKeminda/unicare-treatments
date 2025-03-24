import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  const roleBaseAccess = {
    patient: ["/channeling"],
    admin: ["/channeling", "/dashboard"],
    doctor: ["/channeling", "/dashboard"],
    supplier: ["/channeling", "/dashboard"],
  };

  const newRoutes = Object.values(roleBaseAccess).flat();
  const newSet = new Set([...newRoutes]);
  const protectedRoutes = Array.from(newSet);

  const url = request.nextUrl;
  const path = url.pathname;

  // Redirect root to home page
  if (path === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // If logged in users try to access auth pages, redirect based on role
  if (
    token &&
    (path.startsWith("/sign-in") ||
      path.startsWith("/sign-up") ||
      path.startsWith("/verify"))
  ) {
    if (token.role === "user") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    if (["admin", "doctor", "supplier"].includes(token.role as string)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // // Handle protected routes based on role
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    // No token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    const role = token.role as string;

    const allowedRoutes =
      roleBaseAccess[role as keyof typeof roleBaseAccess] || [];

    // // Check if the current path is allowed for the user's role
    const isAllowed = allowedRoutes.some((route) => path.startsWith(route));

    if (!isAllowed) {
      // Redirect to home if not allowed
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
