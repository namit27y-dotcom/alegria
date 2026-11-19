export type EventCategory = 'Music' | 'Dance' | 'Drama' | 'Art' | 'Literary' | 'Gaming';
export type PassTierName = 'Mortal' | 'Hero' | 'Immortal';

export interface FestivalEvent {
  id: number;
  name: string;
  category: EventCategory;
  icon: string;
  description: string;
  prize: string;
  venue: string;
  team: string;
  art: string;
}

export interface ScheduleDay {
  title: string;
  items: Array<[time: string, title: string, venue: string]>;
}

export interface PassTier {
  name: PassTierName;
  price: string;
  unit: string;
  features: string[];
  featured?: boolean;
}

export interface OracleQuestion {
  prompt: string;
  options: string[];
}

export interface OracleResult {
  god: string;
  icon: string;
  tagline: string;
  eventIds: number[];
}

export interface RegistrationRecord {
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  pass: PassTierName;
  events: number[];
  photo?: string;
  code: string;
  status: string;
  createdAt: string;
}

export const LOGO_MAIN = '/assets/alegria-rise-of-olympus.webp';
export const LOGO_WORDMARK = '/assets/alegria-wordmark.webp';
export const HERO_BG = '/assets/olympus-hero-background.png';

export const CATEGORIES: Array<'All' | EventCategory> = [
  'All',
  'Music',
  'Dance',
  'Drama',
  'Art',
  'Literary',
  'Gaming'
];

export const CATEGORY_ACCENTS: Record<EventCategory, string> = {
  Music: '#e0a82e',
  Dance: '#ff5c7c',
  Drama: '#a77bff',
  Art: '#3fa9f5',
  Literary: '#35c991',
  Gaming: '#ff8a3d'
};

export const FESTIVAL_EVENTS: FestivalEvent[] = [
  {
    id: 1,
    name: 'Apollo’s Lyre',
    category: 'Music',
    icon: '🎼',
    description: 'A solo and duet singing showdown. Charm the gods with your voice.',
    prize: '₹30,000',
    venue: 'Parthenon Amphitheatre',
    team: 'Solo or duet',
    art: '/assets/01_Apollos_Lyre.png'
  },
  {
    id: 2,
    name: 'Orpheus Battle of Bands',
    category: 'Music',
    icon: '🎸',
    description: 'Bands descend into the underworld of sound. Only the loudest return.',
    prize: '₹60,000',
    venue: 'Main Arena',
    team: 'Team of 3 to 7',
    art: '/assets/02_Orpheus_Battle_of_Bands.png'
  },
  {
    id: 3,
    name: 'Terpsichore',
    category: 'Dance',
    icon: '💃',
    description: 'Group dance spectacle across classical, folk and contemporary forms.',
    prize: '₹50,000',
    venue: 'Main Arena',
    team: 'Team of 6 to 16',
    art: '/assets/03_Terpsichore.png'
  },
  {
    id: 4,
    name: 'Dionysus Dance-Off',
    category: 'Dance',
    icon: '🔥',
    description: 'Freestyle street battle: one beat, one floor, one winner.',
    prize: '₹20,000',
    venue: 'Grove Stage',
    team: 'Solo or crew',
    art: '/assets/04_Dionysus_Dance_Off.png'
  },
  {
    id: 5,
    name: 'Thespis Stage Play',
    category: 'Drama',
    icon: '🎭',
    description: 'Full-length stage play: tragedy, comedy or myth reborn.',
    prize: '₹40,000',
    venue: 'Parthenon Amphitheatre',
    team: 'Team of 8 to 15',
    art: '/assets/05_Thespis_Stage_Play.png'
  },
  {
    id: 6,
    name: 'Muse of Mime',
    category: 'Drama',
    icon: '🤫',
    description: 'Speak without a word. Mime and mono-act in four minutes.',
    prize: '₹10,000',
    venue: 'Hall of Echoes',
    team: 'Solo or duo',
    art: '/assets/06_Muse_of_Mime.png'
  },
  {
    id: 7,
    name: 'Athena’s Canvas',
    category: 'Art',
    icon: '🎨',
    description: 'Live painting on the theme “Rise of Olympus”. Wisdom meets colour.',
    prize: '₹15,000',
    venue: 'Gallery of Gods',
    team: 'Solo',
    art: '/assets/07_Athenas_Canvas.png'
  },
  {
    id: 8,
    name: 'Hephaestus Forge',
    category: 'Art',
    icon: '⚒️',
    description: 'Sculpture and installation design from recycled materials.',
    prize: '₹15,000',
    venue: 'Gallery of Gods',
    team: 'Team of 2 to 3',
    art: '/assets/08_Hephaestus_Forge.png'
  },
  {
    id: 9,
    name: 'Homer’s Odyssey',
    category: 'Literary',
    icon: '📜',
    description: 'Poetry slam, storytelling and extempore: an epic of words.',
    prize: '₹12,000',
    venue: 'Hall of Echoes',
    team: 'Solo',
    art: '/assets/09_Homers_Odyssey.png'
  },
  {
    id: 10,
    name: 'Oracle of Delphi Quiz',
    category: 'Literary',
    icon: '🔮',
    description: 'A mythology and general knowledge quiz of prophetic difficulty.',
    prize: '₹10,000',
    venue: 'Lecture Hall 2',
    team: 'Team of 3',
    art: '/assets/10_Oracle_of_Delphi_Quiz.png'
  },
  {
    id: 11,
    name: 'Ares Arena',
    category: 'Gaming',
    icon: '⚔️',
    description: 'Esports tournament: tactical shooter and strategy brackets.',
    prize: '₹35,000',
    venue: 'Esports Zone',
    team: 'Team of 5',
    art: '/assets/11_Ares_Arena.png'
  },
  {
    id: 12,
    name: 'Zeus’s Thunderbolt',
    category: 'Gaming',
    icon: '⚡',
    description: 'Mobile gaming clash. Strike fast, strike first.',
    prize: '₹20,000',
    venue: 'Esports Zone',
    team: 'Squad of 4',
    art: '/assets/12_Zeus_Thunderbolt.png'
  }
];

export const SCHEDULE_DAYS: ScheduleDay[] = [
  {
    title: 'Day I: Arrival of the Gods',
    items: [
      ['09:00', 'Opening Ceremony: The Gates of Olympus', 'Main Arena'],
      ['11:00', 'Athena’s Canvas begins', 'Gallery of Gods'],
      ['13:30', 'Oracle of Delphi Quiz', 'Lecture Hall 2'],
      ['16:00', 'Apollo’s Lyre: Prelims', 'Parthenon Amphitheatre'],
      ['19:00', 'Inaugural Night: Celestial Lights Show', 'Main Arena']
    ]
  },
  {
    title: 'Day II: War and Revelry',
    items: [
      ['10:00', 'Thespis Stage Play', 'Parthenon Amphitheatre'],
      ['11:30', 'Ares Arena: Quarterfinals', 'Esports Zone'],
      ['14:00', 'Terpsichore: Group Dance', 'Main Arena'],
      ['17:00', 'Homer’s Odyssey: Poetry Slam', 'Hall of Echoes'],
      ['20:00', 'Guest Performance: Pro Show', 'Main Arena']
    ]
  },
  {
    title: 'Day III: Ascension',
    items: [
      ['10:00', 'Dionysus Dance-Off', 'Grove Stage'],
      ['13:00', 'Orpheus Battle of Bands: Finals', 'Main Arena'],
      ['16:30', 'Prize Ceremony: The Gods Decide', 'Main Arena'],
      ['19:00', 'Closing Night: Headliner Concert', 'Main Arena']
    ]
  }
];

export const PASS_TIERS: PassTier[] = [
  {
    name: 'Mortal',
    price: '₹300',
    unit: 'per event',
    features: [
      'Enter any single event',
      'All three days of access',
      'Digital participation certificate'
    ]
  },
  {
    name: 'Hero',
    price: '₹999',
    unit: 'up to 5 events',
    features: [
      'Enter up to five events',
      'All three days of access',
      'Priority check-in lane',
      'Digital participation certificate'
    ],
    featured: true
  },
  {
    name: 'Immortal',
    price: '₹1,999',
    unit: 'all 12 events',
    features: [
      'Enter every event',
      'Front-section headliner concert',
      'Priority check-in lane',
      'Digital participation certificate'
    ]
  }
];

export const ORACLE_QUESTIONS: OracleQuestion[] = [
  {
    prompt: 'Your ideal weekend?',
    options: [
      'Leading a squad to victory',
      'Jamming with friends',
      'Painting or reading alone',
      'Dancing till dawn'
    ]
  },
  {
    prompt: 'Your superpower?',
    options: ['Command', 'Harmony', 'Wisdom', 'Charisma']
  },
  {
    prompt: 'Pick your weapon.',
    options: ['A thunderbolt', 'A golden lyre', 'The owl’s insight', 'Wine and laughter']
  }
];

export const ORACLE_RESULTS: OracleResult[] = [
  {
    god: 'Zeus',
    icon: '⚡',
    tagline: 'Born to rule. You thrive in high-stakes battles.',
    eventIds: [11, 12, 2]
  },
  {
    god: 'Apollo',
    icon: '☀️',
    tagline: 'Music flows through you. The stage is your temple.',
    eventIds: [1, 2, 9]
  },
  {
    god: 'Athena',
    icon: '🦉',
    tagline: 'Strategic and creative. You win with wit and craft.',
    eventIds: [7, 10, 9]
  },
  {
    god: 'Dionysus',
    icon: '🍇',
    tagline: 'Life of the party. You turn every moment into a performance.',
    eventIds: [4, 3, 5]
  }
];

export interface ArtistItem {
  id: string;
  name: string;
  night: 'Comedy Night' | 'DJ Night' | 'Concert Night';
  date: string;
  image: string;
  bookingOpen: boolean;
  instagramUrl: string;
}

export const FESTIVAL_ARTISTS: ArtistItem[] = [
  {
    id: 'ravi-gupta',
    name: 'Ravi Gupta',
    night: 'Comedy Night',
    date: '05 Feb',
    image: '/assets/artists/ravi-gupta.png',
    bookingOpen: false,
    instagramUrl: 'https://www.instagram.com/shudhdesicomic/'
  },
  {
    id: 'karan-kanchan',
    name: 'Karan Kanchan',
    night: 'DJ Night',
    date: '06 Feb',
    image: '/assets/artists/karan-kanchan.png',
    bookingOpen: true,
    instagramUrl: 'https://www.instagram.com/karankanchanmusic/'
  },
  {
    id: 'seedhe-maut',
    name: 'Seedhe Maut',
    night: 'Concert Night',
    date: '07 Feb',
    image: '/assets/artists/seedhe-maut.png',
    bookingOpen: false,
    instagramUrl: 'https://www.instagram.com/seedhemaut/'
  },
  {
    id: 'aashish-solanki',
    name: 'Aashish Solanki',
    night: 'Comedy Night',
    date: '05 Feb',
    image: '/assets/artists/aashish-solanki.png',
    bookingOpen: false,
    instagramUrl: 'https://www.instagram.com/aashishsolanki_1/'
  },
  {
    id: 'probros',
    name: 'ProBros',
    night: 'DJ Night',
    date: '06 Feb',
    image: '/assets/artists/probros.png',
    bookingOpen: true,
    instagramUrl: 'https://www.instagram.com/probrosmusic/'
  },
  {
    id: 'kratex',
    name: 'Kratex',
    night: 'DJ Night',
    date: '06 Feb',
    image: '/assets/artists/kratex.png',
    bookingOpen: true,
    instagramUrl: 'https://www.instagram.com/kratexmusic/'
  }
];
