/** Curated FSD streak stats & sample posts (illustrative demo data).
 *  Phase A: company vs community sources, dated labels, honest snapshot framing.
 *  As of 2026-08-02. Not affiliated with Tesla. Always supervise FSD (Supervised).
 */

/** Meta for the whole data pack */
export const snapshotMeta = {
  asOf: '2026-08-02',
  asOfLabel: 'August 2, 2026',
  kind: 'Static snapshot',
  honesty:
    'This is a curated demo snapshot — not a live X API feed and not an official Tesla product. Company figures come from Tesla’s public FSD Safety Report; streak miles are owner-reported and hard to independently audit.',
  caveatsTitle: 'How to read these numbers',
  caveats: [
    'Tesla safety rates are company-published; methodology and independent auditability are debated in public reporting.',
    'Community streak miles are self- or peer-reported. Definitions of “intervention” vary (brake, cancel, steering, parking takeovers).',
    'Long influencer streaks are not typical daily-driver outcomes. Parking lots and construction remain common takeover moments.',
    'FSD (Supervised) always requires an attentive driver ready to intervene.',
  ],
};

/** Tesla / company-published framing */
export const companyStats = [
  {
    id: 'fleet',
    label: 'Cumulative FSD miles',
    value: '13.0B+',
    detail: 'Miles driven with FSD (Supervised) engaged (Tesla public safety page scale ≈12.98B).',
    source: 'Tesla FSD Safety Report',
    sourceUrl: 'https://www.tesla.com/fsd/safety',
    asOf: '2026-08',
    caveat: 'Fleet total grows continuously; treat as order-of-magnitude, not a live counter.',
  },
  {
    id: 'major',
    label: 'Miles / major collision',
    value: '~5.3M',
    detail: 'Company framing for FSD vs ~660k miles U.S. average between major collisions.',
    source: 'Tesla FSD Safety Report',
    sourceUrl: 'https://www.tesla.com/fsd/safety',
    asOf: '2026-08',
    caveat: 'Tesla-defined collision windows and baselines; external researchers have criticized comparability.',
  },
  {
    id: 'multiplier',
    label: 'Fewer major collisions',
    value: '~7–8×',
    detail: 'Approximate ratio of Tesla’s published FSD major-collision rate vs U.S. average (Tesla also cites ~7× major / ~5× minor).',
    source: 'Tesla FSD Safety Report',
    sourceUrl: 'https://www.tesla.com/fsd/safety',
    asOf: '2026-08',
    caveat: 'Headline multiplier depends on methodology. Not a guarantee for any single driver or trip.',
  },
  {
    id: 'software',
    label: 'Streak feature (software)',
    value: 'v14.3+',
    detail: 'Intervention-free streak counter across drives; milestone celebrations (250 / 500 / 1k / 5k+).',
    source: 'Public software notes / owner reports',
    sourceUrl: 'https://www.tesla.com/fsd/safety',
    asOf: '2026-06–08',
    caveat: 'UI and milestone behavior vary by build and region. Always supervised.',
  },
];

/** Owner / community-reported framing */
export const communityStats = [
  {
    id: 'longest',
    label: 'Longest reported streak',
    value: '20,000+ mi',
    detail: 'Community-reported zero-intervention streak miles under FSD (Supervised).',
    source: 'Owner / community reporting (e.g. long-run streak posts)',
    sourceUrl: null,
    asOf: '2026-08',
    caveat: 'Not Tesla-certified. “Intervention” definitions differ; not typical for most drivers.',
  },
  {
    id: 'heavy',
    label: 'Heavy FSD users',
    value: '95%+ auto',
    detail: 'Pattern described by long-streak owners: most daily miles on FSD when conditions allow.',
    source: 'Community anecdotes',
    sourceUrl: null,
    asOf: '2026-08',
    caveat: 'Selection bias — people who post long streaks are not a random sample.',
  },
  {
    id: 'killers',
    label: 'Common streak breakers',
    value: 'Parking + work zones',
    detail: 'Owners often take over in lots, garages, Superchargers, construction, and tight nav edges.',
    source: 'Community themes on X',
    sourceUrl: null,
    asOf: '2026-08',
    caveat: 'Qualitative, not a fleet telemetry export.',
  },
  {
    id: 'mindset',
    label: 'Community consensus',
    value: 'Safety > streak',
    detail: 'Streak is a metric, not a scoreboard — hesitate to intervene and you are using it wrong.',
    source: 'Repeated owner guidance',
    sourceUrl: null,
    asOf: '2026-08',
    caveat: 'Healthy norm — still not a substitute for your own judgment behind the wheel.',
  },
];

/** @deprecated keep for any old imports */
export const fsdStats = {
  longestStreak: communityStats[0].value,
  avgAutonomous: communityStats[1].value,
  safetyMultiplier: companyStats[2].value,
  realWorldMiles: companyStats[1].value,
  fleetMiles: companyStats[0].value,
  streakNote: companyStats[3].detail,
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
    text: 'Community spotlight: a multi-thousand-mile intervention-free FSD streak crossed 20,000 consecutive miles in public reporting — still under active supervision.',
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
    text: 'Tesla’s public FSD (Supervised) safety page shows multi-billion cumulative miles. Per-mile claims keep improving on paper — independent rate audits still matter.',
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
