export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  subtitle: string;
  role: string;
  overview: string;
  process: string[];
  deliverables: string[];
  coverImage?: string;
  detailImage?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'project-1',
    number: '01',
    title: "Mirage - Stop Motion Film",
    category: "Set Design",
    year: "2026",
    subtitle: "A Semester 6 Communication Design stop-motion film following a samurai and a cowboy whose paths collide over a sacred relic.",
    role: "Lead Set Design",
    coverImage: "/assets/aistudio/mirage_cover_50994d9c.png",
    detailImage: "/assets/aistudio/mirage_cover_50994d9c.png",
    overview: "As part of the Semester 6 Communication Design curriculum, our team simulated a production house to create a stop-motion film about a samurai and a cowboy whose paths collide in a conflict over a sacred relic.",
    process: [
      "Developed the narrative and visual world collaboratively in designated production roles.",
      "Led the set design and construction of the miniature physical environment.",
      "Brought the story to life through stop-motion animation and post-production."
    ],
    deliverables: ["Stop Motion Film", "Set Architecture", "Miniature Environment"]
  },
  {
    id: 'project-2',
    number: '02',
    title: "Real Estate Campaign",
    category: "Art Direction",
    year: "2026",
    subtitle: "A commercial social media campaign created for Rameshwar City, featuring five Instagram reels developed for real estate marketing.",
    role: "Assistant Art Director",
    coverImage: "/assets/aistudio/real_estate_cover_7ae12424.png",
    overview: "As part of the art direction team at Indie Production, I contributed to the pre-production and on-set execution of the campaign. My involvement included moodboard development, prop sourcing, set preparation and assisting with the visual execution during the shoot.",
    process: [
      "Prepared visual moodboards and location references during pre-production.",
      "Sourced and arranged props and set dressing aligned with festive and family narratives.",
      "Supported on-set art direction and styling transitions across five vertical Instagram reels."
    ],
    deliverables: ["5 Instagram Reels", "Moodboards & Visual References", "On-Set Art Direction"]
  },
  {
    id: 'project-3',
    number: '03',
    title: "The Garbo Campaign",
    category: "Art Direction",
    year: "2026",
    subtitle: "A Garba event marketing project built around two distinct physical setups — one blue, one red — created for promotional video production.",
    role: "On-ground Set Execution Support",
    coverImage: "/assets/aistudio/garbo_cover_b25561e5.png",
    overview: "A Garba event marketing project for That Yellow Company built around two distinct physical setups — one blue, one red — created as visual environments for five promotional Instagram reels.",
    process: [
      "Assisted on-ground with the physical creation and preparation of the blue setup.",
      "Built and styled the contrasting red setup for promotional video production.",
      "Supported set execution on location across five promotional Instagram reels."
    ],
    deliverables: ["5 Promotional Reels", "The Blue Setup", "The Red Setup"]
  },
  {
    id: 'project-4',
    number: '04',
    title: "The Kindness that Glowed",
    category: "Publication Design",
    year: "2025",
    subtitle: "An individual academic children’s storybook illustrated in Procreate and designed in Adobe InDesign.",
    role: "Author, Illustrator & Publication Designer",
    coverImage: "/assets/aistudio/Ghostie_s_Spooky_Forest_Storybook_9b9cb6bf.png",
    overview: "The Kindness that Glowed is an illustrated children’s storybook developed as an individual academic publication design project using Procreate and Adobe InDesign.",
    process: [
      "Developed the narrative arc, character concepts, and storyboards.",
      "Illustrated scenes and characters digitally in Procreate.",
      "Composed editorial spreads and typography in Adobe InDesign."
    ],
    deliverables: ["Illustrated Children's Storybook", "Character Design", "Editorial Spread Layout"]
  },
  {
    id: 'project-5',
    number: '05',
    title: "Type Design",
    category: "Type Design",
    year: "2024",
    subtitle: "An individual academic project developing an original A–Z display typeface with a recurring teardrop-inspired detail.",
    role: "Typography / Display Typeface Design",
    coverImage: "/assets/aistudio/image_9e4e2252.png",
    overview: "Beginning with experiments around different forms of the letter H, one visual direction was selected and developed into a complete A–Z display alphabet unified by a recurring teardrop-inspired element.",
    process: [
      "Explored multiple structural directions through early sketches of the letter H.",
      "Selected a single visual direction and developed the recurring teardrop-inspired detail.",
      "Expanded the system into a complete A–Z display alphabet."
    ],
    deliverables: ["Complete A–Z Display Alphabet", "Letter H Explorations", "Typography Applications"]
  }
];
