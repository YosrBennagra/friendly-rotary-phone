import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => Boolean(token),
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/editor/:path*",
    "/preview/:path*",
    "/versions/:path*",
    "/settings",
    "/settings/:path*",
  ],
};
