# ⚔️ Elysium Dashboard

Web dashboard for the Elysium Discord bot - real-time boss timers, member leaderboards, and auction tracking.

## 🎯 Features

- **Boss Timer Dashboard** - Real-time boss spawn tracking with live countdowns
- **Member Leaderboards** - Attendance and bidding points rankings
- **Auction History** - View past auctions and current queue
- **Member Profiles** - Detailed stats, attendance breakdown, and auction wins
- **Discord Authentication** - Guild-only access with role-based permissions

## 🚀 Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, MongoDB Node.js Driver
- **Database:** MongoDB Atlas (Singapore region)
- **Authentication:** NextAuth.js with Discord OAuth2
- **Deployment:** Vercel (free tier)
- **Charts:** Recharts
- **Animations:** Framer Motion

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account with connection to Elysium bot database
- Discord OAuth2 application (for authentication)
- Vercel account (for deployment)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/brunongmacho/elysium-dashboard.git
cd elysium-dashboard
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and fill in your values
```

**Required variables:**
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `DISCORD_CLIENT_ID` - Discord OAuth2 client ID
- `DISCORD_CLIENT_SECRET` - Discord OAuth2 client secret
- `DISCORD_GUILD_ID` - Your ELYSIUM guild ID
- `DISCORD_ELYSIUM_ROLE_ID` - Role ID for "Mark as Killed" permission
- `NEXTAUTH_SECRET` - Random secret (generate with: `openssl rand -base64 32`)

### 3. Test MongoDB Connection

```bash
npm run dev
```

Visit http://localhost:3000/api/health to verify connection.

## 🏗️ Project Structure

```
elysium-dashboard/
├── app/                          # Next.js 14 App Router
│   ├── api/                      # API routes
│   │   └── health/              # Health check endpoint
│   ├── page.tsx                 # Boss timers homepage
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # React components
├── lib/                         # Utilities
│   ├── mongodb.ts              # MongoDB connection
│   └── boss-config.ts          # Boss configuration utilities
├── types/                       # TypeScript types
│   └── database.ts             # Database type definitions
├── boss_spawn_config.json       # Boss spawn configuration
├── boss_points.json             # Boss points configuration
└── .env.example                 # Environment variables template
```

## 📝 Implementation Progress

### ✅ Phase 1: Project Setup (COMPLETE)
- [x] Next.js 14 with TypeScript & Tailwind
- [x] MongoDB connection utility
- [x] TypeScript type definitions
- [x] Boss configuration utilities
- [x] Environment variables template
- [x] Health check API

### 🔄 Next Phases
See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed roadmap.

## 📚 Documentation

- [Bot Architecture Analysis](./BOT_EXPLORATION_SUMMARY.md)
- [Implementation Plan](./IMPLEMENTATION_PLAN.md)
- [MongoDB Schema](https://github.com/brunongmacho/elysium-attendance-bot/blob/main/docs/MONGODB_SCHEMA.md)

---

**Status:** Phase 1 Complete ✅ | Ready for MongoDB connection testing
