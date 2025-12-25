/**
 * Simplified NextAuth Configuration for Testing
 * Use this temporarily to diagnose OAuth issues
 */

import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  debug: true, // Enable debug mode to see more errors
};
