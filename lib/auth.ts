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
      // Initialize session defaults
      session.isInGuild = false;
      session.canMarkAsKilled = false;
      session.roleBadge = undefined;

      // Add Discord data to session
      if (session.user) {
        session.user.id = token.discordId as string;
        session.user.name = token.displayName as string; // Use display name
        session.accessToken = token.accessToken as string;
      }

      // Check if we have an access token
      if (!token.accessToken) {
        console.error("[Auth Error] No access token available");
        return session;
      }

      // Fetch user's guilds and check membership
      try {
        const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });

        if (!guildsResponse.ok) {
          console.error("[Auth Error] Failed to fetch guilds:", guildsResponse.status, guildsResponse.statusText);
          const errorText = await guildsResponse.text();
          console.error("[Auth Error] Response:", errorText);
          return session; // Return with defaults
        }

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

            if (!memberResponse.ok) {
              console.error("[Auth Error] Failed to fetch member data:", memberResponse.status, memberResponse.statusText);
              const errorText = await memberResponse.text();
              console.error("[Auth Error] Response:", errorText);
              // User is in guild but we can't get member data - keep isInGuild true but no roles
              return session;
            }

            if (memberResponse.ok) {
              const member = await memberResponse.json();
              session.user.roles = member.roles || [];

              // Use server nickname if available, otherwise use display name from token
              if (member.nick) {
                session.user.name = member.nick;
              }

              // Check roles and determine badge
              const elysiumRoleId = process.env.DISCORD_ELYSIUM_ROLE_ID;
              const adminRoleIds = process.env.DISCORD_ADMIN_ROLE_ID;
              const leaderRoleId = process.env.DISCORD_LEADER_ROLE_ID;
              const viceLeaderRoleId = process.env.DISCORD_VICE_LEADER_ROLE_ID;
              const coreRoleId = process.env.DISCORD_CORE_ROLE_ID;

              const hasElysiumRole = elysiumRoleId && member.roles.includes(elysiumRoleId);

              // Support multiple admin roles (comma-separated)
              const hasAdminRole = adminRoleIds
                ? adminRoleIds.split(',').map(id => id.trim()).some(roleId => member.roles.includes(roleId))
                : false;

              session.canMarkAsKilled = hasElysiumRole || hasAdminRole;

              // Determine role badge (priority: Leader > Vice Leader > Core > Member)
              if (leaderRoleId && member.roles.includes(leaderRoleId)) {
                session.roleBadge = "Elysium Leader";
              } else if (viceLeaderRoleId && member.roles.includes(viceLeaderRoleId)) {
                session.roleBadge = "Elysium Vice Leader";
              } else if (coreRoleId && member.roles.includes(coreRoleId)) {
                session.roleBadge = "Elysium Core";
              } else if (hasElysiumRole) {
                session.roleBadge = "Elysium Member";
              }
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
