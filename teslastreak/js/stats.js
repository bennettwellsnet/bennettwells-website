/** Curated FSD streak stats & sample posts (illustrative demo data).
 *  Sources: Tesla FSD Safety Report, community X posts, public reporting (as of 2026-07-30).
 *  Not affiliated with Tesla. Always supervise FSD (Supervised).
 */
export const fsdStats = {
  longestStreak: '20,000+ miles (zero interventions, community-reported)',
  avgAutonomous: '95%+ of miles on FSD (Supervised) among heavy users',
  safetyMultiplier: '~7–8× fewer major collisions vs U.S. average (Tesla FSD Safety Report)',
  realWorldMiles: '~5.3M miles between major collisions on FSD vs ~660k U.S. average',
  fleetMiles: '12.8B+ cumulative FSD (Supervised) miles published on Tesla’s safety page',
  streakNote:
    'FSD v14.3+ tracks intervention-free streak miles across drives and celebrates milestones (250 / 500 / 1k / 5k+).',
};

export const commonTips = [
  'Intervene early in parking lots, garages, and Superchargers — don’t risk safety for the counter',
  'Tap the accelerator to pass when needed; keep eyes up and hands ready',
  'High FSD % and long clean streaks can help Tesla Insurance scoring — track them honestly',
  'Don’t let gamification push bad decisions — safety always beats the streak number',
  'Use Chill (or calmer profiles) on long highway legs for smoother consistency',
  'Take over early in construction, temporary lanes, and messy navigation edges',
  'Use the in-car intervention / feedback UI so Tesla can improve the model',
];

export const examplePosts = [
  {
    user: '@DavidMoss',
    date: '2026-07',
    likes: 'high',
    highlight: '20k-mile milestone',
    text: 'Community spotlight: a verified multi-thousand-mile intervention-free FSD streak crossed 20,000 consecutive miles — highways, cities, and Supercharger stops — still under active supervision.',
  },
  {
    user: '@WholeMarsBlog',
    date: '2026-07',
    likes: 'high',
    highlight: 'Telemetry culture',
    text: 'Streak counters + community trackers made intervention-free miles measurable. The point isn’t the badge — it’s whether you still take over the second something feels wrong.',
  },
  {
    user: '@SawyerMerritt',
    date: '2026-06',
    likes: 'high',
    highlight: 'Fleet scale',
    text: 'Tesla’s public FSD (Supervised) safety page now shows multi-billion cumulative miles. Per-mile claims keep improving on paper — independent rate audits still matter.',
  },
  {
    user: '@tesla_owners',
    date: '2026-07',
    likes: 'med',
    highlight: 'v14.3+ celebrations',
    text: 'FSD v14.3.x started celebrating streak milestones on-screen (250 / 500 / 1,000 / 5,000 mi). Fun UI — still supervised driving, not a challenge mode.',
  },
  {
    user: '@DailyFSD',
    date: '2026-07',
    likes: 'med',
    highlight: 'Commute streaks',
    text: 'Hit 1,300+ miles intervention-free on a multi-day road trip. Parking lots remain the streak killers — I take over early every time.',
  },
  {
    user: '@FSD_RealTalk',
    date: '2026-07',
    likes: 'med',
    highlight: 'Safety first',
    text: 'Reminder: a short streak with smart takeovers beats a long streak you protected by hesitating. The counter is a metric, not a scoreboard.',
  },
  {
    user: '@city_commuter',
    date: '2026-07',
    likes: 'low',
    highlight: 'v14 Lite / HW3',
    text: 'On recent FSD builds (including wider HW3 “Lite” candidates), garage parking and dense city miles feel more confident — still watching every second.',
  },
  {
    user: '@skepti_driver',
    date: '2026-07',
    likes: 'med',
    highlight: 'Reality check',
    text: 'Love FSD for highways. Still intervene for curb-tight parking, cart corrals, and weird nav. Influencer “perfect” trips aren’t most people’s daily reality.',
  },
];

export function getRandomTip() {
  return commonTips[Math.floor(Math.random() * commonTips.length)];
}
