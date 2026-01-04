import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { LayoutContent } from "@/components/LayoutContent";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Fantasy RPG-style fonts for Lordnine Infinite Class theme
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  variable: "--font-cinzel-decorative",
  weight: ["400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elysium Dashboard - Guild Management & Boss Timers",
  description: "Real-time boss timer tracking, leaderboards, and guild management for Elysium guild members",
  keywords: "Elysium, guild, boss timers, leaderboard, dashboard",
  authors: [{ name: "Elysium Guild" }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '256x256' },
    ],
    apple: [
      { url: '/icon.png', sizes: '256x256', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cinzelDecorative.variable}`}>
      <head>
        {/* Prevent theme flash by injecting theme CSS before any other styles */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const themes = {
                    crimson: { primary: '#dc2626', primaryDark: '#991b1b', primaryLight: '#fca5a5', accent: '#ea580c', accentDark: '#c2410c', accentLight: '#fdba74', success: '#047857', warning: '#d97706', danger: '#dc2626', info: '#3b82f6' },
                    wine: { primary: '#9f1239', primaryDark: '#881337', primaryLight: '#fda4af', accent: '#be123c', accentDark: '#9f1239', accentLight: '#fecdd3', success: '#047857', warning: '#d97706', danger: '#dc2626', info: '#9f1239' },
                    magenta: { primary: '#d946ef', primaryDark: '#a21caf', primaryLight: '#f0abfc', accent: '#e879f9', accentDark: '#c026d3', accentLight: '#f5d0fe', success: '#047857', warning: '#d97706', danger: '#dc2626', info: '#d946ef' },
                    peach: { primary: '#fb923c', primaryDark: '#f97316', primaryLight: '#fed7aa', accent: '#fbbf24', accentDark: '#f59e0b', accentLight: '#fef3c7', success: '#047857', warning: '#d97706', danger: '#dc2626', info: '#fb923c' },
                    sunset: { primary: '#f97316', primaryDark: '#c2410c', primaryLight: '#fdba74', accent: '#fb923c', accentDark: '#ea580c', accentLight: '#fed7aa', success: '#047857', warning: '#d97706', danger: '#dc2626', info: '#f97316' },
                    golden: { primary: '#d97706', primaryDark: '#b45309', primaryLight: '#fcd34d', accent: '#d97706', accentDark: '#b45309', accentLight: '#fde68a', success: '#047857', warning: '#d97706', danger: '#dc2626', info: '#06b6d4' },
                    lime: { primary: '#84cc16', primaryDark: '#65a30d', primaryLight: '#bef264', accent: '#a3e635', accentDark: '#84cc16', accentLight: '#d9f99d', success: '#047857', warning: '#d97706', danger: '#dc2626', info: '#84cc16' },
                    olive: { primary: '#a3a300', primaryDark: '#808000', primaryLight: '#d4d466', accent: '#ca8a04', accentDark: '#a16207', accentLight: '#fde047', success: '#047857', warning: '#d97706', danger: '#dc2626', info: '#a3a300' },
                    emerald: { primary: '#059669', primaryDark: '#047857', primaryLight: '#6ee7b7', accent: '#0d9488', accentDark: '#0f766e', accentLight: '#5eead4', success: '#047857', warning: '#d97706', danger: '#dc2626', info: '#06b6d4' },
                    forest: { primary: '#16a34a', primaryDark: '#15803d', primaryLight: '#86efac', accent: '#22c55e', accentDark: '#16a34a', accentLight: '#bbf7d0', success: '#047857', warning: '#d97706', danger: '#dc2626', info: '#16a34a' },
                    mint: { primary: '#2dd4bf', primaryDark: '#14b8a6', primaryLight: '#99f6e4', accent: '#6ee7b7', accentDark: '#34d399', accentLight: '#d1fae5', success: '#047857', warning: '#d97706', danger: '#dc2626', info: '#2dd4bf' },
                    default: { primary: '#3b82f6', primaryDark: '#1d4ed8', primaryLight: '#93c5fd', accent: '#c026d3', accentDark: '#a21caf', accentLight: '#f0abfc', success: '#047857', warning: '#d97706', danger: '#ef4444', info: '#3b82f6' },
                    navy: { primary: '#1e40af', primaryDark: '#1e3a8a', primaryLight: '#60a5fa', accent: '#fbbf24', accentDark: '#f59e0b', accentLight: '#fde68a', success: '#047857', warning: '#d97706', danger: '#dc2626', info: '#1e40af' },
                    arctic: { primary: '#0ea5e9', primaryDark: '#0284c7', primaryLight: '#7dd3fc', accent: '#38bdf8', accentDark: '#0ea5e9', accentLight: '#bae6fd', success: '#047857', warning: '#d97706', danger: '#dc2626', info: '#0ea5e9' },
                    cyber: { primary: '#0891b2', primaryDark: '#0e7490', primaryLight: '#67e8f9', accent: '#9333ea', accentDark: '#7e22ce', accentLight: '#d8b4fe', success: '#047857', warning: '#d97706', danger: '#dc2626', info: '#0891b2' },
                    purple: { primary: '#7c3aed', primaryDark: '#6d28d9', primaryLight: '#c4b5fd', accent: '#db2777', accentDark: '#be185d', accentLight: '#f9a8d4', success: '#047857', warning: '#d97706', danger: '#dc2626', info: '#7c3aed' }
                  };

                  const savedTheme = localStorage.getItem('guild-theme') || 'crimson';
                  const theme = themes[savedTheme] || themes.crimson;

                  // Inject inline style tag with CSS variables - executes before external CSS
                  const style = document.createElement('style');
                  style.innerHTML = \`:root {
                    --color-primary: \${theme.primary};
                    --color-primary-dark: \${theme.primaryDark};
                    --color-primary-light: \${theme.primaryLight};
                    --color-accent: \${theme.accent};
                    --color-accent-dark: \${theme.accentDark};
                    --color-accent-light: \${theme.accentLight};
                    --color-success: \${theme.success};
                    --color-warning: \${theme.warning};
                    --color-danger: \${theme.danger};
                    --color-info: \${theme.info};
                  }\`;
                  document.head.appendChild(style);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased font-game min-h-screen flex flex-col">
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
