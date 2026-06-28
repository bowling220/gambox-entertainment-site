import { FileText, Megaphone, ScrollText, ShieldCheck, Users, Wrench } from "lucide-react";

export const games = [
  {
    slug: "sniper",
    title: "SNIPER!",
    status: "Soundtrack preview",
    description:
      "SNIPER! is a Gambox Entertainment Roblox project with an official game soundtrack banner now in preview.",
    modes: ["Roblox game official", "Official game soundtrack", "Gambox Entertainment"],
    focus: ["Soundtrack identity", "Sniper character art", "Roblox release context", "Production credits"],
    knownDetails: [
      "The current banner presents SNIPER! as an official Roblox game soundtrack.",
      "The art features a hooded Roblox-style sniper character with a scoped rifle on a red background.",
      "The banner credits Hasnain Presents and Prod. by FRITZEATSFRIES.",
      "Hox Entertainment and Gambox Entertainment appear on the soundtrack art.",
    ],
    soundtrackCredits: [
      ["Presented by", "Hasnain"],
      ["Produced by", "FRITZEATSFRIES"],
      ["Entertainment", "Hox Entertainment / Gambox Entertainment"],
      ["Release context", "Official game soundtrack for Roblox game official"],
    ],
    roadmap: [
      ["Soundtrack banner", "Preview added"],
      ["Game details", "Details pending"],
      ["Gameplay direction", "Details pending"],
      ["Release window", "Details pending"],
    ],
  },
  {
    slug: "grimwood-blackout",
    title: "Grimwood Blackout",
    status: "In development",
    description:
      "Scavenge forest ruins by day, keep the base generator running, and hold the fence through escalating zombie nights.",
    modes: ["Solo", "Team survival", "Wave defense"],
    focus: ["Generator pressure", "Fuel scavenging", "Weapon upgrades", "Class mastery"],
    gameplayLoop: [
      "Day: search ruined forest buildings for red fuel canisters while enemy pressure is lighter.",
      "Night: defend the base, spend earned money on weapon upgrades, and keep the generator alive.",
      "Blackout: if the generator runs dry, zombies enter the base and a boss threat appears until morning or recovery.",
    ],
    plannedMechanics: [
      "Fuel canisters that respawn each day.",
      "Generator states that control lights, base danger, and blackout events.",
      "Zombie waves that scale across later nights and player count.",
      "Weapon upgrades paid for by zombie kills.",
      "Daily rewards, survival records, trophy road progress, and class mastery.",
    ],
    rolesNeeded: ["Builders", "Modelers", "Scripters"],
    roadmap: [
      ["Core gameplay loop", "In development"],
      ["Forest base and ruined buildings", "In development"],
      ["Generator and blackout logic", "Planned"],
      ["Zombie wave scaling", "Planned"],
      ["Rewards and mastery systems", "Planned"],
      ["Public release details", "Details pending"],
    ],
  },
  {
    slug: "expendable",
    title: "Expendable",
    status: "In planning",
    description:
      "A second Gambox game assigned to its own team. Its full design brief and release details will be published later.",
    modes: ["Future release", "Dedicated team", "Details pending"],
    focus: ["Project brief pending", "Music work started", "Targeted after Grimwood", "Team planning"],
    knownDetails: [
      "Expendable is assigned to its own development team.",
      "The full design brief has not been published yet.",
      "Licensed lyrical music work has started for the project.",
      "The project is targeted after Grimwood Blackout.",
    ],
    roadmap: [
      ["Dedicated team setup", "Started"],
      ["Music direction", "Started"],
      ["Design documentation", "Planned"],
      ["Gameplay prototype", "Details pending"],
      ["Release window", "Details pending"],
    ],
  },
];

export const news = [
  {
    type: "Production",
    title: "Grimwood Blackout foundation is set",
    date: "May 2026",
    text: "The first playable direction centers on a log-house base, daylight fuel runs, and night waves that punish an empty generator.",
  },
  {
    type: "Gameplay",
    title: "Progression starts with days survived",
    date: "May 2026",
    text: "Trophy road rewards, daily rewards, class mastery, and survival records are planned around the number of days players endure.",
  },
  {
    type: "Team Log",
    title: "Builders, modelers, and scripters have clear targets",
    date: "May 2026",
    text: "Map work, lobby spaces, weapons, fuel props, enemy models, waves, generator logic, and reward data are listed in the member log.",
  },
];

export const hubItems = [
  { icon: Megaphone, title: "Important Announcements", text: "Private studio updates, deadlines, and priority notices." },
  { icon: FileText, title: "Studio Documents", text: "Internal planning docs, policies, guides, and decisions." },
  { icon: ScrollText, title: "Game Design Documents", text: "Design notes, gameplay briefs, and build targets for Grimwood Blackout." },
  { icon: Wrench, title: "Update Logs", text: "Patch history, fixes, test notes, and production changelogs." },
  { icon: Users, title: "Team Resources", text: "Onboarding, role expectations, workflow notes, and checklists." },
  { icon: ShieldCheck, title: "Private Links", text: "Roblox group links, Discord resources, and internal references." },
];

export const grimwoodMemberLog = {
  project: "Grimwood Blackout",
  heading: "Detailed gameplay and development roadmap",
  gameplay: [
    "Players spawn solo or with a team in a forest base built around a log house.",
    "During the morning, players search ruined buildings for red fuel canisters while dealing with lighter enemies.",
    "The base generator must stay fueled. At night, zombie waves attack from outside the base and damage the structure, making the generator drain faster.",
    "When the generator runs dry, zombies can enter the base and a chaotic boss threat appears until morning or until players recover fuel.",
    "Zombie kills pay out money for weapon upgrades. Later nights increase the pressure with harder waves.",
    "Fuel respawns each day. Filling the generator upgrades the base and opens more of the map, but larger progression asks players to find more fuel.",
  ],
  retention: [
    "Count days survived as points for a trophy road that stacks progress across runs.",
    "Track both the highest days survived in one round and total days survived across rounds.",
    "Add daily rewards.",
    "Give each class mastery rewards and a title earned at the end of its mastery track.",
  ],
  builders: [
    "Build a low-poly or mid-poly forest map with a fenced log-house base at the center and ruined buildings spread through the woods.",
    "Build a low-poly or mid-poly lobby with a class shop, leaderboard house, and a daily quest board with paper details.",
  ],
  modelers: [
    "Multiple tree variants",
    "Bandage",
    "Fuel canister",
    "Generator",
    "Sack",
    "Pistol",
    "Sniper",
    "AK-47",
    "Shotgun",
    "Grenade",
    "Placeable bomb",
    "R6 zombie with glowing white eyes",
  ],
  scripters: [
    "Lobby system from team creation through teleporting into the main game.",
    "Wave system that begins with five zombies and scales toward a player-count-based cap.",
    "Daily reward system.",
    "Saved survival data for highest days in one round and total days across rounds.",
    "Trophy road rewards driven by total days survived.",
    "Generator states for fueled lights, blackout behavior, base access for zombies, and boss arrival or despawn rules.",
  ],
  classes: [
    "Medic: starts with five bandages and a medkit that heals another player for 50% health while costing the Medic 50% health. One use per day.",
    "Shooter: starts with a pistol plus one extra random gun.",
  ],
  next: "UI, animations, and additional production details will be added as the design develops.",
};

export const seedAnnouncements = [
  {
    id: "role-system-rework",
    date: "May 18, 2026",
    title: "Role system rework",
    body: "The Discord role system has been reworked. Roblox roles will be handled separately because Roblox developers may be grouped under broader development roles.",
  },
  {
    id: "project-assignments",
    date: "May 18, 2026",
    title: "Project assignments",
    body: "Grimwood Blackout and Expendable have separate development teams. Grimwood Blackout is the first release target for this year, while Expendable is planned after it.",
  },
  {
    id: "ugc-platform",
    date: "May 18, 2026",
    title: "UGC platform released",
    body: "The Gambox UGC platform is available as a passive-income project for the studio.",
    href: "https://www.roblox.com/communities/70019092/Gambox-Entertainment-UGC-Division#!/about",
    linkLabel: "Open UGC group",
  },
  {
    id: "roblox-group-rework",
    date: "May 19, 2026",
    title: "Roblox group rework",
    body: "Development roles and game-file access depend on joining the current Roblox group and sharing the correct Roblox username with staff.",
    href: "https://www.roblox.com/share/g/989010074",
    linkLabel: "Open Roblox group",
  },
  {
    id: "grimwood-document",
    date: "May 19, 2026",
    title: "Grimwood document shared",
    body: "The Grimwood Blackout gameplay proposal is available. The current task coverage focuses on builders, modelers, and scripters, with more work areas to be added later.",
    href: "https://docs.google.com/document/d/1exDk0U-FVrkJpNsWIKoMf-F3tqmxm1la3K_DH0VEeCw/edit?usp=sharing",
    linkLabel: "Open Grimwood document",
  },
  {
    id: "expendable-update",
    date: "May 19, 2026",
    title: "Expendable update",
    body: "Expendable documentation is planned, and licensed lyrical music work has started for the project.",
  },
  {
    id: "roblox-publishing",
    date: "May 20, 2026",
    title: "Roblox publishing changes under review",
    body: "The team is reviewing Roblox publishing and age-category requirements because they may affect the release path for Gambox games.",
  },
  {
    id: "studio-access",
    date: "May 20, 2026",
    title: "Roblox Studio access checklist",
    body: "Developers need to complete the required Roblox age and collaboration steps so Team Create access, development progress, and payment tracking are not blocked.",
  },
  {
    id: "script-workflow",
    date: "May 21, 2026",
    title: "Script work waiting on lobby and UI",
    body: "Script work is paused until the lobby layout and user interface direction are ready for the next implementation pass.",
  },
  {
    id: "town-lobby-npcs",
    date: "May 22, 2026",
    title: "Town lobby NPC interest",
    body: "Team members interested in appearing as an NPC in the town lobby can prepare a rig for review.",
  },
  {
    id: "grimwood-breakdown",
    date: "May 22, 2026",
    title: "Full Grimwood breakdown ready",
    body: "The team has a full Grimwood Blackout breakdown covering architecture, design, and technical direction. Developers should review it before continuing current tasks.",
    href: "https://tinyurl.com/Grimwood-Blackout",
    linkLabel: "Open breakdown",
  },
];

export const roles = [
  "Project Manager",
  "Representative (Investor Finder)",
  "Lead Animators",
  "Community Management",
  "Teasers & Trailers Team",
];
