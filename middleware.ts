import { clerkMiddleware } from "@clerk/nextjs/server";

// Use the basic Clerk middleware implementation
export default clerkMiddleware();

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 