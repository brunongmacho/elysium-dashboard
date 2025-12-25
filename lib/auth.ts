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
      // Store Discord access token and user data for API calls
      if (account && profile) {
        token.accessToken = account.access_token;
        token.discordId = profile.id;
        // Store display name (global_name) or fallback to username
        token.displayName = (profile as any).global_name || profile.username || profile.name;
      }
      return token;
    },

    async session({ session, token }) {
      // Add Discord data to session
      if (session.user) {
        session.user.id = token.discordId as string;
        session.user.name = token.displayName as string; // Use display name
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

          console.log("[Auth Debug] User guilds:", guilds.map((g: any) => ({ id: g.id, name: g.name })));
          console.log("[Auth Debug] Looking for guild ID:", guildId);

          // Check if user is in the required guild
          const isInGuild = guilds.some((guild: any) => guild.id === guildId);
          console.log("[Auth Debug] Is in guild:", isInGuild);
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
              const adminRoleIds = process.env.DISCORD_ADMIN_ROLE_ID;

              const hasElysiumRole = elysiumRoleId && member.roles.includes(elysiumRoleId);

              // Support multiple admin roles (comma-separated)
              const hasAdminRole = adminRoleIds
                ? adminRoleIds.split(',').map(id => id.trim()).some(roleId => member.roles.includes(roleId))
                : false;

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

  session: {
    strategy: "jwt",
  },
};
