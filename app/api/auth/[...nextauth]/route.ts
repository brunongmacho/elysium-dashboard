/**
 * NextAuth API Route
 * Handles all authentication requests
 */

import NextAuth from "next-auth";
// Temporarily using simplified auth for testing
import { authOptions } from "@/lib/auth-simple";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
