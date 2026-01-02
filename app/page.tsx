"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import memberLore from "@/member-lore.json";
import guildStats from "@/guild-stats.json";
import { Section, Stack, Grid } from "@/components/layout";
import { Typography } from "@/components/ui";
import { Icon } from "@/components/icons";
import AnimatedCounter from "@/components/AnimatedCounter";
import Tooltip from "@/components/Tooltip";
import type { BossTimersResponse } from "@/types/api";
import { swrFetcher } from "@/lib/fetch-utils";

interface MemberLoreData {
  title: string;
  lore: string;
  recent_developments: string;
  specialty: string;
  reputation: string;
  stats: string;
  skills: string[];
}

interface GuildStat {
  value: string;
  label: string;
  sublabel: string;
  color: string;
}

type GuildStatsData = GuildStat[][];

// Helper to get an icon/emoji based on member specialty
function getIconForMember(name: string, data: MemberLoreData): string {
  // Member-specific icon mapping (prevents duplicates)
  const memberIcons: Record<string, string> = {
    'AmielJohn': '🍖',       // Caloric Warlord - meat/food consumption
    'Azryth': '💡',          // Nightlight Assassin
    'Byakko': '🐯',          // Marketing Divine Tiger
    'Carrera': '⏰',         // Temporal Weapons Specialist
    'CheeseCakee': '🧀',     // Lactose Weapons Engineer
    'Chunchunmaru': '📱',    // Self-Aware Meme Legend (social media)
    'Daleee': '🎓',          // Professor of Wrongness
    'Enaira': '💸',          // Economic Singularity
    'erwarrr': '🔇',         // Militant Silence
    'Evand3r': '🥄',         // Legendary Spoon Seeker
    'Fever': '📋',           // Apocalypse Administrator
    'Goblok': '🖍️',          // Transcendent Fool Emperor (crayon)
    'Helvenica': '🔤',       // Font War Criminal
    'Hercules': '💪',        // Divine Retirement Plan
    'Hesucrypto': '💰',      // Quantum Financier
    'Iguro': '🌀',           // Accidental Recruitment Director (portals)
    'Inihaw': '🥗',          // Ethical Grillmaster General (vegan)
    'Jalo': '🤡',            // Oracle of Incorrectness
    'Jayzzzzzzz': '😴',      // Wakeful Nightmare
    'JeffEpstein': '🍪',     // Nominative Paradox Saint (cookies)
    'ladyhoho': '😂',        // Laughing Abyss
    'LXRDGRIM': '☠️',        // Reaper Therapist Chancellor
    'M1ssy': '💉',           // Anaphylactic Tactician (epipen)
    'Maria': '📢',           // Decibel Tyrant (loud)
    'Marsha11': '📁',        // Archival Martyr (files)
    'Miang': '🗣️',           // Infinite Narrator (talking)
    'Munchyy': '🗡️',         // Assassination Artist
    'Onirgerep': '⏪',       // Temporal Reversal Anomaly (backwards)
    'PotatoCheese': '🥔',    // Carbohydrate Martyr Saint
    'Riku': '🔑',            // Keychain Calamity
    'Shawty': '📏',          // Tall Delusion King
    'Skadushy': '🌓',        // Thermodynamic Heretic (shadow/light)
    'Varys': '🕵️',          // Rumor Industrialist (spy)
    'xSelah': '💃',          // Perpetual Motion Disaster
    'Ztig': '🎯',            // Friendly Fire Legend
    'PanCoco': '🥥',         // Tropical Hazmat Warrior
    'Ace': '🎲',             // Cosmic Spite Champion (gambling)
    'lanZ6': '🦋',           // Vibes Prophet Chancellor (butterfly)
    'Ayane69': '🍂',         // Catastrophic Ninja Legend (falling)
    'Tinitira': '👁️',        // Sightless Oracle
    'Hayacinth': '🌸',       // Biological Artillery Commander
    'LaxusLawliet': '🍬',    // Disappointed Namesake (sweets)
    'Cogwind': '⚙️',         // Mad Engineer Laureate
    'DadaXxD': '🐸',         // Meme Hierophant (Pepe)
    'AE28': '🪨',            // Stone Age Supremacist
    '惡1ce': '🧊',           // Benevolent Evil Overlord (ice)
    'Caera': '🤝',           // Diplomatic Calamity
    'Cutie': '🌺',           // Weaponized Adorableness
  };

  // Check for member-specific icon first
  if (memberIcons[name]) {
    return memberIcons[name];
  }

  // Fallback to keyword-based matching
  const specialty = data.specialty.toLowerCase();
  const title = data.title.toLowerCase();
  const reputation = data.reputation.toLowerCase();

  // Time & Prophecy
  if (specialty.includes('time') || title.includes('temporal') || specialty.includes('chrono')) return '🔮';

  // Food & Culinary
  if (specialty.includes('food') || specialty.includes('snack') || title.includes('caloric')) return '🍪';
  if (specialty.includes('consumption') || specialty.includes('eating') || specialty.includes('culinary')) return '🍖';
  if (specialty.includes('cookie') || specialty.includes('sweet')) return '🍰';
  if (specialty.includes('chef') || specialty.includes('cooking')) return '👨‍🍳';

  // Finance & Economics
  if (specialty.includes('finance') || specialty.includes('economic') || specialty.includes('wealth')) return '💎';
  if (specialty.includes('crypto') || specialty.includes('currency')) return '💰';
  if (specialty.includes('bidding') || specialty.includes('auction')) return '💸';

  // Death, Therapy & Darkness
  if (specialty.includes('therapy') || specialty.includes('death')) return '☠️';
  if (specialty.includes('assassination') || specialty.includes('assassin')) return '🗡️';
  if (specialty.includes('shadow') || specialty.includes('darkness')) return '🌑';
  if (specialty.includes('reaper') || specialty.includes('grim')) return '💀';

  // Communication & Sound
  if (specialty.includes('silence') || specialty.includes('quiet') || title.includes('deaf')) return '🔇';
  if (specialty.includes('music') || specialty.includes('sound')) return '🎵';
  if (specialty.includes('voice') || specialty.includes('speech')) return '🎙️';

  // Art & Design
  if (specialty.includes('font') || specialty.includes('design')) return '🎨';
  if (specialty.includes('aesthetic') || specialty.includes('visual')) return '🖼️';

  // Combat & Warfare
  if (specialty.includes('combat') || specialty.includes('warrior') || specialty.includes('battle')) return '⚔️';
  if (specialty.includes('tactics') || specialty.includes('tactical')) return '🎖️';
  if (specialty.includes('sniper') || specialty.includes('precision')) return '🎯';
  if (specialty.includes('hunter') || specialty.includes('hunting')) return '🏹';
  if (specialty.includes('defense') || specialty.includes('fortress')) return '🛡️';

  // Knowledge & Academia
  if (specialty.includes('academic') || specialty.includes('scholar')) return '📚';
  if (specialty.includes('philosophy') || specialty.includes('philosophical')) return '🤔';
  if (specialty.includes('research') || specialty.includes('study')) return '🔬';
  if (specialty.includes('enlighten') || specialty.includes('wisdom')) return '💡';
  if (specialty.includes('teaching') || specialty.includes('professor')) return '🎓';

  // Divine & Mythical
  if (specialty.includes('divine') || title.includes('tiger') || title.includes('byakko')) return '🐯';
  if (specialty.includes('angel') || specialty.includes('celestial')) return '👼';
  if (specialty.includes('dragon') || specialty.includes('serpent')) return '🐉';

  // Magic & Mystical
  if (specialty.includes('portal') || specialty.includes('magic')) return '🌀';
  if (specialty.includes('spell') || specialty.includes('enchant')) return '✨';
  if (specialty.includes('crystal') || specialty.includes('gem')) return '💠';
  if (specialty.includes('arcane') || specialty.includes('mystical')) return '🔯';

  // Chaos & Disorder
  if (specialty.includes('chaos') || specialty.includes('random')) return '💥';
  if (specialty.includes('apocalypse') || specialty.includes('filing')) return '📊';
  if (specialty.includes('disaster') || specialty.includes('catastrophe')) return '🌪️';

  // Leadership & Strategy
  if (specialty.includes('leader') || specialty.includes('command')) return '👑';
  if (specialty.includes('strategy') || specialty.includes('strategic')) return '🧠';
  if (specialty.includes('planning') || specialty.includes('coordination')) return '📋';

  // Technology & Engineering
  if (specialty.includes('engineer') || specialty.includes('tech')) return '⚙️';
  if (specialty.includes('bot') || specialty.includes('automation')) return '🤖';
  if (specialty.includes('mechanical') || specialty.includes('machine')) return '🔧';

  // Stealth & Intelligence
  if (specialty.includes('spy') || specialty.includes('espionage')) return '🕵️';
  if (specialty.includes('stealth') || specialty.includes('infiltration')) return '👁️';
  if (specialty.includes('intelligence') || specialty.includes('reconnaissance')) return '🔍';

  // Nature & Elements
  if (specialty.includes('fire') || specialty.includes('flame') || specialty.includes('burn')) return '🔥';
  if (specialty.includes('ice') || specialty.includes('frost') || specialty.includes('cold')) return '❄️';
  if (specialty.includes('lightning') || specialty.includes('thunder') || specialty.includes('electric')) return '⚡';
  if (specialty.includes('nature') || specialty.includes('forest') || specialty.includes('plant')) return '🌿';
  if (specialty.includes('water') || specialty.includes('ocean')) return '🌊';
  if (specialty.includes('earth') || specialty.includes('stone')) return '🪨';
  if (specialty.includes('wind') || specialty.includes('air')) return '💨';

  // Healing & Support
  if (specialty.includes('heal') || specialty.includes('medic')) return '💚';
  if (specialty.includes('support') || specialty.includes('buff')) return '✨';
  if (specialty.includes('resurrect') || specialty.includes('revival')) return '🌟';

  // Luck & Fortune
  if (specialty.includes('luck') || specialty.includes('fortune')) return '🍀';
  if (specialty.includes('gambling') || specialty.includes('chance')) return '🎲';

  // Social & Communication
  if (specialty.includes('diplomacy') || specialty.includes('negotiation')) return '🤝';
  if (specialty.includes('charisma') || specialty.includes('charm')) return '💫';

  // Miscellaneous
  if (specialty.includes('nightlight') || specialty.includes('light')) return '💡';
  if (specialty.includes('vegan') || specialty.includes('vegetarian')) return '🥗';
  if (specialty.includes('alcohol') || specialty.includes('drink')) return '🍺';
  if (specialty.includes('speed') || specialty.includes('fast')) return '💨';
  if (specialty.includes('strength') || specialty.includes('power')) return '💪';

  // Default icons based on position in alphabet
  const firstChar = name.charAt(0).toUpperCase();
  const icons = ['⚡', '🔥', '✨', '💫', '🌟', '⭐', '🎯', '⚔️', '🛡️', '🎨', '🔮', '💎'];
  return icons[firstChar.charCodeAt(0) % icons.length];
}

// Quick Stats Component with Real-time Data
function QuickStats() {
  // Fetch boss timers
  const { data: bossData } = useSWR<BossTimersResponse>(
    '/api/bosses',
    swrFetcher,
    { refreshInterval: 30000 }
  );

  const stats = useMemo(() => {
    if (!bossData?.bosses) {
      return {
        total: 0,
        spawned: 0,
        soon: 0,
        tracking: 0,
      };
    }

    return {
      total: bossData.count || 0,
      spawned: bossData.bosses.filter((b) => b.status === 'spawned').length,
      soon: bossData.bosses.filter((b) => b.status === 'soon').length,
      tracking: bossData.bosses.filter((b) => b.status === 'ready').length,
    };
  }, [bossData]);

  return (
    <Grid columns={{ xs: 2, md: 4 }} gap="md">
      <Tooltip content="Total number of bosses being tracked" fullWidth>
        <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-3 sm:p-4 text-center hover:scale-105 transition-transform duration-200 cursor-help glow-primary">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary font-game-decorative">
            <AnimatedCounter value={stats.total} />
          </div>
          <div className="text-xs sm:text-sm text-gray-400 font-game">Total Bosses</div>
        </div>
      </Tooltip>
      <Tooltip content="Bosses currently alive and ready to fight!" fullWidth>
        <div className="glass backdrop-blur-sm rounded-lg border border-danger p-3 sm:p-4 text-center glow-danger hover:scale-105 transition-transform duration-200 cursor-help">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-danger font-game-decorative">
            <AnimatedCounter value={stats.spawned} />
          </div>
          <div className="text-xs sm:text-sm text-gray-400 font-game">Spawned Now</div>
        </div>
      </Tooltip>
      <Tooltip content="Bosses spawning within 30 minutes" fullWidth>
        <div className="glass backdrop-blur-sm rounded-lg border border-accent p-3 sm:p-4 text-center glow-accent hover:scale-105 transition-transform duration-200 cursor-help">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent font-game-decorative">
            <AnimatedCounter value={stats.soon} />
          </div>
          <div className="text-xs sm:text-sm text-gray-400 font-game">Spawning Soon</div>
        </div>
      </Tooltip>
      <Tooltip content="Bosses with active countdown timers" fullWidth>
        <div className="glass backdrop-blur-sm rounded-lg border border-success p-3 sm:p-4 text-center glow-success hover:scale-105 transition-transform duration-200 cursor-help">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-success font-game-decorative">
            <AnimatedCounter value={stats.tracking} />
          </div>
          <div className="text-xs sm:text-sm text-gray-400 font-game">Tracking</div>
        </div>
      </Tooltip>
    </Grid>
  );
}

export default function GuildHomePage() {
  const [seed, setSeed] = useState(0);
  const [memberIdMap, setMemberIdMap] = useState<Record<string, string>>({});
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [currentShuffleIndex, setCurrentShuffleIndex] = useState(0);

  // Initialize shuffled indices on mount
  useEffect(() => {
    const indices = Array.from({ length: 50 }, (_, i) => i);
    const shuffled = indices.sort(() => Math.random() - 0.5);
    setShuffledIndices(shuffled);
  }, []);

  // Fetch member data to map usernames to Discord IDs
  useEffect(() => {
    async function fetchMemberIds() {
      try {
        const response = await fetch('/api/members?type=attendance&limit=0');
        const data = await response.json();

        if (data.success && data.data) {
          // Create username -> memberId mapping
          const mapping: Record<string, string> = {};
          data.data.forEach((member: any) => {
            mapping[member.username] = member.memberId;
          });
          setMemberIdMap(mapping);
        }
      } catch (error) {
        console.error('Failed to fetch member IDs:', error);
      }
    }

    fetchMemberIds();
  }, []);

  // Rotate content every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShuffleIndex(prev => {
        const next = prev + 1;
        // If we've shown all items, reshuffle and start over
        if (next >= 50) {
          const indices = Array.from({ length: 50 }, (_, i) => i);
          const shuffled = indices.sort(() => Math.random() - 0.5);
          setShuffledIndices(shuffled);
          setSeed(s => s + 1);
          return 0;
        }
        setSeed(s => s + 1);
        return next;
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Guild stats rotation data
  const guildStatsRotation = useMemo((): GuildStat[] => {
    // Fallback stat set in case of import issues
    const fallbackStats: GuildStat[] = [
      { value: "100%", label: "Jalo Bot Financial Accuracy", sublabel: "(HesuCrypto: 0%)", color: "primary" },
      { value: "∞/0", label: "HesuCrypto's Net Worth", sublabel: "(Quantum State)", color: "accent" },
      { value: "127", label: "LXRDGRIM's Therapy Clients", sublabel: "", color: "success" },
      { value: "9999", label: "Ztig's Ally Precision Score", sublabel: "", color: "danger" }
    ];

    // Cast imported data with type safety
    const statsData = guildStats as GuildStatsData;

    // Safety check for guildStats
    if (!statsData || !Array.isArray(statsData) || statsData.length === 0) {
      console.warn('Guild stats data not loaded, using fallback');
      return fallbackStats;
    }

    // Use shuffled index to select stat set (shuffle with repeat all)
    if (shuffledIndices.length === 0) {
      return statsData[0] || fallbackStats;
    }

    const currentIndex = shuffledIndices[currentShuffleIndex];
    return statsData[currentIndex] || fallbackStats;
  }, [shuffledIndices, currentShuffleIndex]);

  // Get random members for activities and achievements
  const { currentActivities, legendaryAchievements } = useMemo(() => {
    const members = Object.entries(memberLore as Record<string, MemberLoreData>);

    // Truly random shuffle using current seed
    const shuffled = [...members].sort(() => Math.random() - 0.5);

    // Extract current activities (6 items)
    const activities = shuffled.slice(0, 6).map(([name, data]) => {
      // Use reputation field as it's already a good summary
      const text = data.reputation || data.specialty || 'Causing legendary chaos';

      return {
        name,
        text,
        icon: getIconForMember(name, data)
      };
    });

    // Extract legendary achievements (5 items)
    const achievements = shuffled.slice(6, 11).map(([name, data]) => {
      const specialty = data.specialty?.trim() || 'Master of legendary feats';

      return {
        name,
        title: data.title || 'The Legendary One',
        specialty,
        icon: getIconForMember(name, data)
      };
    });

    return { currentActivities: activities, legendaryAchievements: achievements };
  }, [seed]);

  return (
    <Stack gap="xl" className="pb-32">
      {/* Hero Section - Guild Welcome */}
      <section className="relative py-8 sm:py-12 overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        {/* Background Glow Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-danger/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative">
          <Stack gap="md" align="center" className="text-center">
            {/* Guild Name */}
            <Typography variant="display" className="text-5xl sm:text-6xl md:text-7xl text-gold">
              ⚔️ ELYSIUM
            </Typography>
            <Typography variant="h2" className="text-xl sm:text-2xl text-silver">
              Where Chaos Becomes Strategy
            </Typography>
            <Typography variant="body" className="text-base sm:text-lg text-gray-300 max-w-3xl italic">
              "Where stupidity becomes genius and friendly fire is tactical."
            </Typography>
            <Typography variant="small" className="text-xs sm:text-sm text-gray-400">
              Led by Goblok's Crayon Intelligence | Powered by Organized Apocalypse | Therapy by LXRDGRIM
            </Typography>
          </Stack>
        </div>
      </section>

      {/* Quick Access Navigation */}
      <Section>
        <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
          {/* Boss Timers */}
          <a
            href="/timers"
            className="group glass backdrop-blur-sm rounded-lg border border-primary/30 p-4 sm:p-6 hover:border-primary transition-all duration-200 card-3d hover:scale-105 glow-primary"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <Icon
                name="clock"
                size="2xl"
                className="text-primary group-hover:text-primary-light transition-all duration-200 group-hover:scale-110 flex-shrink-0"
              />
              <div>
                <Typography variant="h3" className="text-lg sm:text-xl font-bold text-primary-bright">
                  Boss Timers
                </Typography>
                <Typography variant="caption" className="text-xs sm:text-sm text-gray-400">
                  Track spawn times
                </Typography>
              </div>
            </div>
          </a>

          {/* Event Schedule */}
          <a
            href="/events"
            className="group glass backdrop-blur-sm rounded-lg border border-accent/30 p-4 sm:p-6 hover:border-accent transition-all duration-200 card-3d hover:scale-105 glow-accent"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <Icon
                name="calendar"
                size="2xl"
                className="text-accent group-hover:text-accent-light transition-all duration-200 group-hover:scale-110 flex-shrink-0"
              />
              <div>
                <Typography variant="h3" className="text-lg sm:text-xl font-bold text-accent-bright">
                  Events
                </Typography>
                <Typography variant="caption" className="text-xs sm:text-sm text-gray-400">
                  Daily & weekly events
                </Typography>
              </div>
            </div>
          </a>

          {/* Leaderboards */}
          <a
            href="/leaderboard"
            className="group glass backdrop-blur-sm rounded-lg border border-accent/30 p-4 sm:p-6 hover:border-accent transition-all duration-200 card-3d hover:scale-105 glow-accent"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <Icon
                name="trophy"
                size="2xl"
                className="text-accent group-hover:text-accent-light transition-all duration-200 group-hover:scale-110 flex-shrink-0"
              />
              <div>
                <Typography variant="h3" className="text-lg sm:text-xl font-bold text-accent-bright">
                  Leaderboards
                </Typography>
                <Typography variant="caption" className="text-xs sm:text-sm text-gray-400">
                  View rankings
                </Typography>
              </div>
            </div>
          </a>

          {/* Discord Link */}
          <a
            href="https://discord.gg/EUWXd5tPa7"
            target="_blank"
            rel="noopener noreferrer"
            className="group glass backdrop-blur-sm rounded-lg border border-primary/30 p-4 sm:p-6 hover:border-primary transition-all duration-200 card-3d hover:scale-105 glow-primary"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <Icon
                name="discord"
                size="2xl"
                className="text-primary group-hover:text-primary-light transition-all duration-200 group-hover:scale-110 flex-shrink-0"
              />
              <div>
                <Typography variant="h3" className="text-lg sm:text-xl font-bold text-primary-bright">
                  Discord
                </Typography>
                <Typography variant="caption" className="text-xs sm:text-sm text-gray-400">
                  Join the community
                </Typography>
              </div>
            </div>
          </a>
        </Grid>
      </Section>

      {/* Quick Stats - Real-time Data */}
      <Section>
        <Typography variant="h1" className="text-2xl sm:text-3xl md:text-4xl text-gold mb-6">
          📊 Live Guild Stats
        </Typography>
        <QuickStats />
      </Section>

      {/* Guild Stats Overview - Dynamic */}
      <Section>
        <Typography variant="h1" className="text-2xl sm:text-3xl md:text-4xl text-gold mb-6">
          Guild Stats (Mostly Accurate)
        </Typography>

        <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
          {guildStatsRotation.map((stat, index) => (
            <div
              key={`${stat.label}-${seed}-${index}`}
              className={`glass backdrop-blur-sm rounded-lg border border-${stat.color}/30 p-3 sm:p-4 md:p-6 text-center card-3d hover:scale-105 transition-all duration-500 glow-${stat.color}`}
              style={{
                animation: `fadeInOutScale 30s ease-in-out ${index * 0.1}s both`,
              }}
            >
              <div className={`text-2xl sm:text-3xl md:text-4xl font-bold text-${stat.color}-bright mb-2 font-game-decorative transition-all duration-500`}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-game transition-all duration-500">
                {stat.label}
              </div>
              {stat.sublabel && (
                <div className={`text-xs ${stat.sublabel.includes('∞') || stat.sublabel.includes('All') ? 'text-success-bright' : 'text-gray-500'} font-game mt-1 transition-all duration-500`}>
                  {stat.sublabel}
                </div>
              )}
            </div>
          ))}
        </Grid>

        <Typography variant="caption" className="mt-4 text-center italic">
          Rotating every 30 seconds • Live guild statistics
        </Typography>

        <style jsx>{`
          @keyframes fadeInOutScale {
            0% {
              opacity: 0;
              transform: scale(0.85) translateY(20px);
            }
            3% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
            93% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
            100% {
              opacity: 0;
              transform: scale(0.85) translateY(-20px);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            @keyframes fadeInOutScale {
              0% {
                opacity: 0;
              }
              3% {
                opacity: 1;
              }
              93% {
                opacity: 1;
              }
              100% {
                opacity: 0;
              }
            }
          }
        `}</style>
      </Section>

      {/* Current Guild Activities - Dynamic */}
      <Section>
        <div className="glass backdrop-blur-sm rounded-lg border border-primary/20 p-4 sm:p-6 card-3d hover:scale-[1.01] transition-transform duration-200">
          <Typography variant="h2" className="text-xl sm:text-2xl md:text-3xl text-gold mb-6">
            📜 Guild Member Chronicles
          </Typography>
          <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="md" className="text-xs sm:text-sm font-game">
            {currentActivities.map((activity, index) => (
              <div key={activity.name + index} className="flex items-start gap-2">
                <span className={`text-${['success', 'primary', 'accent', 'danger', 'success', 'primary'][index % 6]}`}>
                  {activity.icon}
                </span>
                <span className="text-gray-300">
                  <a
                    href={`/profile/${memberIdMap[activity.name] || activity.name}`}
                    className="text-accent-bright font-medium hover:text-accent hover:underline transition-all duration-200"
                  >
                    {activity.name}
                  </a>: {activity.text}
                </span>
              </div>
            ))}
          </Grid>
          <Typography variant="caption" className="mt-4 text-center italic">
            Rotating every 30 seconds • Member reputations and current status
          </Typography>
        </div>
      </Section>

      {/* Guild Info */}
      <section className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gray-900/30 backdrop-blur-sm">
        <Grid columns={{ xs: 1, lg: 2 }} gap="lg">
          {/* About the Guild */}
          <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-4 sm:p-6 md:p-8 card-3d hover:scale-[1.01] transition-transform duration-200">
            <Typography variant="h2" className="text-xl sm:text-2xl md:text-3xl text-gold mb-6">
              About Elysium
            </Typography>
            <Stack gap="md" className="text-gray-300 text-sm sm:text-base">
              <Typography variant="body" className="leading-relaxed">
                We are a guild where impossibilities become strategies. Where a deaf oracle sees everything,
                a vegan grillmaster defends fortresses, and our Chrono-Tactician wins battles by showing up late to yesterday.
              </Typography>
              <Typography variant="body" className="leading-relaxed">
                Led by Goblok's crayon-drawn battle plans (somehow they work), managed by LXRDGRIM's therapy empire
                (Death & Cookies sessions available), and powered by members who turn their failures into legendary victories.
              </Typography>
              <Typography variant="small" className="italic text-primary-bright leading-relaxed">
                "The guild where being wrong becomes being right, allergies become weapons, and friendly fire is just tactical positioning."
              </Typography>
            </Stack>
          </div>

          {/* Guild Legends - Dynamic */}
          <div className="glass backdrop-blur-sm rounded-lg border border-accent/30 p-4 sm:p-6 md:p-8 card-3d hover:scale-[1.01] transition-transform duration-200">
            <Typography variant="h2" className="text-xl sm:text-2xl md:text-3xl text-gold mb-6">
              ⚔️ Legendary Specialties
            </Typography>
            <ul className="space-y-4 text-gray-300 text-xs sm:text-sm">
              {legendaryAchievements.map((achievement, index) => (
                <li key={achievement.name + index} className="flex items-start gap-2 leading-relaxed">
                  <span className={`text-${['primary', 'accent', 'danger', 'success', 'primary'][index % 5]}-bright font-bold text-base sm:text-lg flex-shrink-0`}>
                    {achievement.icon}
                  </span>
                  <span className="text-gray-300">
                    <a
                      href={`/profile/${memberIdMap[achievement.name] || achievement.name}`}
                      className="text-accent-bright font-medium hover:text-accent hover:underline transition-all duration-200"
                    >
                      {achievement.name}
                    </a> - {achievement.specialty}
                  </span>
                </li>
              ))}
            </ul>
            <Typography variant="caption" className="mt-4 text-center italic">
              Rotating every 30 seconds • Showcasing unique member abilities
            </Typography>
          </div>
        </Grid>
      </section>
    </Stack>
  );
}
