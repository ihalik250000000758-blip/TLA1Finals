import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

export const XP_PER_CATEGORY = 10;
export const XP_PER_LEVEL = 50;

export const BADGES = [
  { id: "first", icon: "🌱", name: "First Step", need: 1 },
  { id: "five", icon: "📦", name: "Collector", need: 5 },
  { id: "ten", icon: "🏆", name: "Ledger Master", need: 10 },
];

const levelOf = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1;

/** XP, level and badges. Progress is earned and is NOT lost when rows are deleted. */
export function useGameStats() {
  const [stats, setStats] = useLocalStorage("incomeTracker.stats", {
    xp: 0,
    totalAdded: 0,
  });

  // Returns the message to show in the toast
  const awardCategory = useCallback(() => {
    const next = { xp: stats.xp + XP_PER_CATEGORY, totalAdded: stats.totalAdded + 1 };
    setStats(next);

    const parts = [`+${XP_PER_CATEGORY} XP`];
    if (levelOf(next.xp) > levelOf(stats.xp)) parts.push(`Level up! You're level ${levelOf(next.xp)}`);
    BADGES.filter((b) => b.need === next.totalAdded).forEach((b) =>
      parts.push(`Badge unlocked: ${b.icon} ${b.name}`)
    );
    return parts.join(" | ");
  }, [stats, setStats]);

  return {
    level: levelOf(stats.xp),
    xpInLevel: stats.xp % XP_PER_LEVEL,
    xpPerLevel: XP_PER_LEVEL,
    totalXp: stats.xp,
    badges: BADGES.map((b) => ({ ...b, earned: stats.totalAdded >= b.need })),
    awardCategory,
  };
}
