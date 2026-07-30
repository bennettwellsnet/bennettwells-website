export const fsdStats = {
  longestStreak: "13,521 miles (zero critical interventions)",
  avgAutonomous: "95%+ of miles on FSD (Supervised) in heavy users",
  safetyMultiplier: "7-9x safer than average human driver (Tesla Q3 2025 data)",
  realWorldMiles: "One crash every 6.36 million miles on FSD vs. 702k for humans",
  streakNote: "New in FSD v14.3+: Carries from drive to drive as long as you don't drive manually or intervene."
};
export const commonTips = [
  "Intervene early in parking lots/garages/charging â don't risk the streak for unsafe moves",
  "Tap accelerator to pass slow cars and keep streak (Mad Max mode)",
  "High FSD % and long streaks lower your Tesla Insurance risk dramatically",
  "Don't let gamification push bad decisions â safety > streak",
  "Use in Chill mode for better consistency on long drives",
  "Avoid construction zones and complex navigation until more mature",
  "Report critical interventions via the car screen for Tesla to improve faster"
];
export const examplePosts = [
  { user: "@SawyerMerritt", text: "Tesla FSD milestone: the community has now logged over 2 billion cumulative autonomous miles. The improvement curve on each major version is still accelerating. V13 → V14 was the biggest leap yet." },
  { user: "@WholeMarsBlog", text: "Community member just crossed the 10,000-mile FSD streak with zero critical interventions on public roads. Remember when people said this technology was years away? It’s here. And it’s only getting better." },
  { user: "@DavidMoss", text: "FSD v14.3 streak feature is genuinely changing how people think about autonomous driving. You can now see your actual intervention-free record carry across drives. Data-driven accountability for AI performance." },
  { user: "@BlakeKing", text: "Crossed 5,200 miles on my FSD streak today. Tips: Chill mode on highways, let it negotiate its own path in parking, don’t ‘help’ it when it hesitates — it usually figures it out. Trust the model." },
  { user: "@WholeMarsBlog", text: "The safety numbers are staggering. FSD is now 7-9x safer per mile than the average US human driver. Every mile that gets added to community streaks is another data point proving this out." },
  { user: "@SawyerMerritt", text: "New FSD v14.4 rolling out to early access fleet. Testers reporting significant improvement in unprotected left turns and roundabout handling — two of the last major edge cases. Streak continuity preserved on update." },
  { user: "@JCChristopher", text: "13,521 miles. Zero critical interventions. My last manual takeover was for a fallen tree blocking the lane — genuinely the right call. Everything else FSD handled. The bar has moved permanently." },
  { user: "@DavidMoss", text: "Important reminder from the community: the streak is a measurement tool, not a goal. If you need to take over, take over. The data point matters less than the safety decision. Never let gamification override judgment." },
];
export function getRandomTip() { return commonTips[Math.floor(Math.random() * commonTips.length)]; }
