/**
 * NextAuth Configuration
 * Handles Discord OAuth2 authentication with guild verification
 */

import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import type { DiscordProfile, DiscordGuild, DiscordMember } from "@/types/api";
import { AUTH } from "@/lib/constants";

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
    async jwt({ token, account, profile, trigger }) {
      // Store Discord access token and user data for API calls
      if (account && profile) {
        const discordProfile = profile as DiscordProfile;
        token.accessToken = account.access_token;
        token.discordId = discordProfile.id;
        // Store display name (global_name) or fallback to username
        token.displayName = discordProfile.global_name || discordProfile.username || profile.name;
        // Reset cache on new login
        token.lastFetched = 0;
      }

      // Check if we need to refresh Discord data
      const now = Date.now();
      const lastFetched = token.lastFetched || 0;
      const shouldRefresh = (now - lastFetched) > AUTH.CACHE_AGE;

      if (shouldRefresh && token.accessToken) {
        try {
          // Fetch and cache Discord guild/member data
          const guildId = process.env.DISCORD_GUILD_ID!;

          const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
            headers: { Authorization: `Bearer ${token.accessToken}` },
          });

          if (guildsResponse.ok) {
            const guilds = await guildsResponse.json() as DiscordGuild[];
            const isInGuild = guilds.some((g: DiscordGuild) => g.id === guildId);
            token.cachedIsInGuild = isInGuild;

            if (isInGuild) {
              const memberResponse = await fetch(
                `https://discord.com/api/users/@me/guilds/${guildId}/member`,
                { headers: { Authorization: `Bearer ${token.accessToken}` } }
              );

              if (memberResponse.ok) {
                const member = await memberResponse.json() as DiscordMember;
                token.cachedRoles = member.roles || [];
                token.cachedNickname = member.nick || token.displayName;

                // Calculate role badge
                const elysiumRoleId = process.env.DISCORD_ELYSIUM_ROLE_ID;
                const adminRoleIds = process.env.DISCORD_ADMIN_ROLE_ID;
                const leaderRoleId = process.env.DISCORD_LEADER_ROLE_ID;
                const viceLeaderRoleId = process.env.DISCORD_VICE_LEADER_ROLE_ID;
                const coreRoleId = process.env.DISCORD_CORE_ROLE_ID;

                const hasElysiumRole = elysiumRoleId && member.roles.includes(elysiumRoleId);
                const hasAdminRole = adminRoleIds
                  ? adminRoleIds.split(',').some((id: string) => member.roles.includes(id.trim()))
                  : false;

                token.cachedCanMarkAsKilled = hasElysiumRole || hasAdminRole;
                token.cachedIsAdmin = hasAdminRole;

                if (leaderRoleId && member.roles.includes(leaderRoleId)) {
                  token.cachedRoleBadge = "Elysium Leader";
                } else if (viceLeaderRoleId && member.roles.includes(viceLeaderRoleId)) {
                  token.cachedRoleBadge = "Elysium Vice Leader";
                } else if (coreRoleId && member.roles.includes(coreRoleId)) {
                  token.cachedRoleBadge = "Elysium Core";
                } else if (hasElysiumRole) {
                  token.cachedRoleBadge = "Elysium Member";
                }

                token.lastFetched = now;
              }
            } else {
              token.cachedCanMarkAsKilled = false;
              token.cachedIsAdmin = false;
              token.lastFetched = now;
            }
          }
        } catch (error) {
          console.error("[JWT Cache] Error refreshing Discord data:", error);
          // Don't update lastFetched on error, will retry next time
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Add Discord data to session from JWT token
      if (session.user) {
        session.user.id = token.discordId as string;
        session.user.name = token.cachedNickname as string || token.displayName as string;
        session.user.roles = token.cachedRoles || [];
        session.accessToken = token.accessToken as string;
      }

      // Use cached data from JWT token (refreshed every 5 minutes in JWT callback)
      session.isInGuild = token.cachedIsInGuild || false;
      session.canMarkAsKilled = token.cachedCanMarkAsKilled || false;
      session.isAdmin = token.cachedIsAdmin || false;
      session.roleBadge = token.cachedRoleBadge;

      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: AUTH.SESSION_MAX_AGE / 1000, // Convert to seconds - cache session to reduce Discord API calls and avoid rate limiting
  },
};
