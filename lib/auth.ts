/**
 * NextAuth Configuration
 * Handles Discord OAuth2 authentication with guild verification
 */

import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// Discord OAuth scopes needed for guild membership and roles
const DISCORD_SCOPES = ["identify", "guilds", "guilds.members.read"].join(" ");

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: DISCORD_SCOPES,
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      // Store Discord access token for API calls
      if (account) {
        token.accessToken = account.access_token;
        token.discordId = profile?.id;
      }
      return token;
    },

    async session({ session, token }) {
      // Add Discord data to session
      if (session.user) {
        session.user.id = token.discordId as string;
        session.accessToken = token.accessToken as string;
      }

      // Fetch user's guilds and check membership
      try {
        const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });

        if (guildsResponse.ok) {
          const guilds = await guildsResponse.json();
          const guildId = process.env.DISCORD_GUILD_ID!;

          // Check if user is in the required guild
          const isInGuild = guilds.some((guild: any) => guild.id === guildId);
          session.isInGuild = isInGuild;

          if (isInGuild) {
            // Fetch guild member details to get roles
            const memberResponse = await fetch(
              `https://discord.com/api/users/@me/guilds/${guildId}/member`,
              {
                headers: {
                  Authorization: `Bearer ${token.accessToken}`,
                },
              }
            );

            if (memberResponse.ok) {
              const member = await memberResponse.json();
              session.user.roles = member.roles || [];

              // Check if user has ELYSIUM role or is admin
              const elysiumRoleId = process.env.DISCORD_ELYSIUM_ROLE_ID;
              const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;

              const hasElysiumRole = elysiumRoleId && member.roles.includes(elysiumRoleId);
              const hasAdminRole = adminRoleId && member.roles.includes(adminRoleId);

              session.canMarkAsKilled = hasElysiumRole || hasAdminRole;
            }
          } else {
            session.canMarkAsKilled = false;
          }
        }
      } catch (error) {
        console.error("Error fetching Discord guild data:", error);
        session.isInGuild = false;
        session.canMarkAsKilled = false;
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
  },
};
