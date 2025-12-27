"use client";

import { useState, useEffect, useMemo } from "react";
import Footer from "@/components/Footer";
import memberLore from "@/member-lore.json";

interface MemberLoreData {
  title: string;
  lore: string;
  recent_developments: string;
  specialty: string;
  reputation: string;
  stats: string;
  skills: string[];
}

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

export default function GuildHomePage() {
  const [seed, setSeed] = useState(0);
  const [memberIdMap, setMemberIdMap] = useState<Record<string, string>>({});

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
      setSeed((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="space-y-8 pb-32">
      {/* Hero Section - Guild Welcome */}
      <section className="relative py-8 sm:py-12 overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        {/* Background Glow Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-danger/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative">
          <div className="text-center space-y-4 sm:space-y-6">
            {/* Guild Name */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl text-gold text-rpg-title leading-tight">
              ⚔️ ELYSIUM
            </h1>
            <p className="text-xl sm:text-2xl text-silver font-game-decorative">
              Where Chaos Becomes Strategy
            </p>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto font-game italic">
              "Where stupidity becomes genius and friendly fire is tactical."
            </p>
            <p className="text-xs sm:text-sm text-gray-400 font-game">
              Led by Goblok's Crayon Intelligence | Powered by Organized Apocalypse | Therapy by LXRDGRIM
            </p>
          </div>
        </div>
      </section>

      {/* Quick Access Navigation */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Boss Timers */}
          <a
            href="/timers"
            className="group glass backdrop-blur-sm rounded-lg border border-primary/30 p-4 sm:p-6 hover:border-primary transition-all duration-200 card-3d hover:scale-105 glow-primary"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-primary group-hover:text-primary-light transition-all duration-200 group-hover:scale-110 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-primary-bright font-game-decorative">Boss Timers</h3>
                <p className="text-xs sm:text-sm text-gray-400 font-game">Track spawn times</p>
              </div>
            </div>
          </a>

          {/* Leaderboards */}
          <a
            href="/leaderboard"
            className="group glass backdrop-blur-sm rounded-lg border border-accent/30 p-4 sm:p-6 hover:border-accent transition-all duration-200 card-3d hover:scale-105 glow-accent"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-accent group-hover:text-accent-light transition-all duration-200 group-hover:scale-110 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path d="M12 15l-2 5-3-1 2-5-2-1 1-4 4-1 4 1 1 4-2 1 2 5-3 1-2-5z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="3" />
              </svg>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-accent-bright font-game-decorative">Leaderboards</h3>
                <p className="text-xs sm:text-sm text-gray-400 font-game">View rankings</p>
              </div>
            </div>
          </a>

          {/* Discord Link */}
          <a
            href="https://discord.gg/EUWXd5tPa7"
            target="_blank"
            rel="noopener noreferrer"
            className="group glass backdrop-blur-sm rounded-lg border border-primary/30 p-4 sm:p-6 hover:border-primary transition-all duration-200 card-3d hover:scale-105 glow-primary sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-primary group-hover:text-primary-light transition-all duration-200 group-hover:scale-110 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-primary-bright font-game-decorative">Discord</h3>
                <p className="text-xs sm:text-sm text-gray-400 font-game">Join the community</p>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Guild Stats Overview */}
      <section>
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-gold text-rpg-title mb-6">Guild Stats (Mostly Accurate)</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-3 sm:p-4 md:p-6 text-center card-3d hover:scale-105 transition-transform duration-200 glow-primary">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-bright mb-2 font-game-decorative">100%</div>
            <div className="text-xs sm:text-sm text-gray-400 font-game">Jalo Bot Financial Accuracy</div>
            <div className="text-xs text-gray-500 font-game mt-1">(HesuCrypto: 0%)</div>
          </div>

          <div className="glass backdrop-blur-sm rounded-lg border border-accent/30 p-3 sm:p-4 md:p-6 text-center card-3d hover:scale-105 transition-transform duration-200 glow-accent">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent-bright mb-2 font-game-decorative">∞/0</div>
            <div className="text-xs sm:text-sm text-gray-400 font-game">HesuCrypto's Net Worth</div>
            <div className="text-xs text-success-bright font-game mt-1">(Quantum State)</div>
          </div>

          <div className="glass backdrop-blur-sm rounded-lg border border-success/30 p-3 sm:p-4 md:p-6 text-center card-3d hover:scale-105 transition-transform duration-200 glow-success">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-success-bright mb-2 font-game-decorative">127</div>
            <div className="text-xs sm:text-sm text-gray-400 font-game">LXRDGRIM's Therapy Clients</div>
          </div>

          <div className="glass backdrop-blur-sm rounded-lg border border-danger/30 p-3 sm:p-4 md:p-6 text-center card-3d hover:scale-105 transition-transform duration-200 glow-danger">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-danger-bright mb-2 font-game-decorative">9999</div>
            <div className="text-xs sm:text-sm text-gray-400 font-game">Ztig's Ally Precision Score</div>
          </div>
        </div>
      </section>

      {/* Current Guild Activities - Dynamic */}
      <section>
        <div className="glass backdrop-blur-sm rounded-lg border border-primary/20 p-4 sm:p-6 card-3d hover:scale-[1.01] transition-transform duration-200">
          <h3 className="text-xl sm:text-2xl md:text-3xl text-gold text-rpg-title mb-6">📜 Guild Member Chronicles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm font-game">
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
          </div>
          <div className="mt-4 text-center text-xs text-gray-500 italic">
            Rotating every 30 seconds • Member reputations and current status
          </div>
        </div>
      </section>

      {/* Guild Info */}
      <section className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gray-900/30 backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* About the Guild */}
          <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-4 sm:p-6 md:p-8 card-3d hover:scale-[1.01] transition-transform duration-200">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-gold text-rpg-title mb-6">About Elysium</h2>
            <div className="space-y-4 text-gray-300 font-game text-sm sm:text-base">
              <p className="leading-relaxed">
                We are a guild where impossibilities become strategies. Where a deaf oracle sees everything,
                a vegan grillmaster defends fortresses, and our Chrono-Tactician wins battles by showing up late to yesterday.
              </p>
              <p className="leading-relaxed">
                Led by Goblok's crayon-drawn battle plans (somehow they work), managed by LXRDGRIM's therapy empire
                (Death & Cookies sessions available), and powered by members who turn their failures into legendary victories.
              </p>
              <p className="text-xs sm:text-sm italic text-primary-bright leading-relaxed">
                "The guild where being wrong becomes being right, allergies become weapons, and friendly fire is just tactical positioning."
              </p>
            </div>
          </div>

          {/* Guild Legends - Dynamic */}
          <div className="glass backdrop-blur-sm rounded-lg border border-accent/30 p-4 sm:p-6 md:p-8 card-3d hover:scale-[1.01] transition-transform duration-200">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-gold text-rpg-title mb-6">⚔️ Legendary Specialties</h2>
            <ul className="space-y-3 sm:space-y-4 text-gray-300 font-game text-xs sm:text-sm">
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
            <div className="mt-4 text-center text-xs text-gray-500 italic">
              Rotating every 30 seconds • Showcasing unique member abilities
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
