import {
  UserProfile,
  AssetData,
  CategoryItem,
  SubcategoryItem,
  RightsRecord,
  RelationshipItem,
  ApprovalRequest,
  ActivityLog,
  AssetContributor,
  Agency,
  AssetStatus,
  ContentProvenance,
} from '@/types'
import { generateAssetArchive } from './assetArchiveData'
import { attorneyGeneralAssetsData } from './scheduleAssets'
import { sortDiscontinuedToBottom } from '@/lib/risk'

export const initialUsers: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Pastor Chelsea Kalu',
    email: 'chelsea.kalu@kiddiesmedia.org',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    initials: 'PCK',
    role: 'super_admin',
    roleLabel: 'Super Admin (KMM Network)',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    skills: ['admin', 'legal_counsel', 'video_editor'],
    bio: 'Oversees intellectual asset governance, ministry rights registry and final sign-offs across all Kiddies Media Ministries agencies.',
  },
  {
    id: 'usr-2',
    name: 'Faith Daniel',
    email: 'faith.d@kiddiesmedia.org',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    initials: 'FD',
    role: 'reviewer',
    roleLabel: 'Content Reviewer & Approver',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    skills: ['animation', 'video_editor', 'writer'],
    bio: 'Lead reviewer for media compliance, doctrine consistency and broadcast clearances across agencies.',
  },
  {
    id: 'usr-3',
    name: 'David Kolawole',
    email: 'david.k@kiddiesmedia.org',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    initials: 'DK',
    role: 'agency_admin',
    roleLabel: 'Lovetoons Agency Admin',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    skills: ['animation', 'video_editor'],
    bio: 'Agency administrator managing animated series production assets, character turnarounds and rights submissions.',
  },
  {
    id: 'usr-4',
    name: 'Samuel Adeleke',
    email: 'samuel.a@kiddiesmedia.org',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    initials: 'SA',
    role: 'agency_admin',
    roleLabel: 'Publishing Agency Admin',
    agency: 'Publishing Agency',
    unit: 'Publishing Agency',
    skills: ['writer', 'designer'],
    bio: 'Directs illustrated devotional storybooks, comic magazines, faith literature and international translation prints.',
  },
  {
    id: 'usr-5',
    name: 'Emmanuel Vance',
    email: 'emmanuel.v@kiddiesmedia.org',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    initials: 'EV',
    role: 'agency_admin',
    roleLabel: 'Digital Agency Admin',
    agency: 'Digital Agency',
    unit: 'Digital Agency',
    skills: ['developer', 'designer'],
    bio: 'Leads kiddies digital streaming platform, interactive web games, cloud archives and mobile apps.',
  },
  {
    id: 'usr-6',
    name: 'Dr. Miriam Peters',
    email: 'miriam.p@kiddiesmedia.org',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    initials: 'MP',
    role: 'agency_admin',
    roleLabel: 'Academy Agency Admin',
    agency: 'Academy Agency',
    unit: 'Academy Agency',
    skills: ['writer', 'admin'],
    bio: 'Oversees Kiddies Media Academy creative training programs, animation masterclasses and certification curriculum.',
  },
  {
    id: 'usr-7',
    name: 'Pastor Joshua Davies',
    email: 'joshua.d@kiddiesmedia.org',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    initials: 'JD',
    role: 'agency_admin',
    roleLabel: 'Educational Agency Admin',
    agency: 'Educational Agency',
    unit: 'Educational Agency',
    skills: ['writer', 'designer'],
    bio: 'Heads faith-based school outreach curricula, Bible reading fiesta campaigns and early literacy initiatives.',
  },
  {
    id: 'usr-8',
    name: 'Grace Emmanuel',
    email: 'grace.e@kiddiesmedia.org',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    initials: 'GE',
    role: 'agency_admin',
    roleLabel: 'Lovetoons Audio & Music Admin',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    skills: ['audio_producer'],
    bio: 'Coordinates children music recordings, animated soundtrack stems, publishing royalties and audio licensing.',
  },
]

export const initialCategories: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Animated Programme',
    description: 'Animated series, cartoons, 3D animated episodes and short films',
    subcategoriesCount: 3,
    assetsCount: 3,
    status: 'Active',
    iconType: 'tv',
    color: 'bg-[#8b5cf6]',
  },
  {
    id: 'cat-2',
    name: 'TV Programme',
    description: 'Live action children shows, puppets, broadcast series and episodes',
    subcategoriesCount: 3,
    assetsCount: 4,
    status: 'Active',
    iconType: 'tv',
    color: 'bg-[#3b82f6]',
  },
  {
    id: 'cat-3',
    name: 'Documentary / Video',
    description: 'Children educational documentaries, health awareness and special features',
    subcategoriesCount: 2,
    assetsCount: 2,
    status: 'Active',
    iconType: 'bible',
    color: 'bg-[#0284c7]',
  },
  {
    id: 'cat-4',
    name: 'Film / Short Movie',
    description: 'Theatrical kiddies faith films, dramatic narratives and festival shorts',
    subcategoriesCount: 2,
    assetsCount: 2,
    status: 'Active',
    iconType: 'tv',
    color: 'bg-[#6366f1]',
  },
  {
    id: 'cat-5',
    name: 'Consumer Product / Merchandise',
    description: 'School bags, apparel, toys, branded beverage and promotional items',
    subcategoriesCount: 3,
    assetsCount: 3,
    status: 'Active',
    iconType: 'game',
    color: 'bg-[#10b981]',
  },
  {
    id: 'cat-6',
    name: 'Publishing / Book',
    description: 'Devotionals, illustrated storybooks, curricula and reading volumes',
    subcategoriesCount: 2,
    assetsCount: 2,
    status: 'Active',
    iconType: 'edu',
    color: 'bg-[#f59e0b]',
  },
  {
    id: 'cat-7',
    name: 'Publishing / Comics',
    description: 'Illustrated graphic novels, character comic strips and manga editions',
    subcategoriesCount: 2,
    assetsCount: 2,
    status: 'Active',
    iconType: 'edu',
    color: 'bg-[#f97316]',
  },
  {
    id: 'cat-8',
    name: 'Digital / Interactive Platform',
    description: 'Streaming apps, interactive web games, reading websites and portals',
    subcategoriesCount: 3,
    assetsCount: 4,
    status: 'Active',
    iconType: 'game',
    color: 'bg-[#06b6d4]',
  },
  {
    id: 'cat-9',
    name: 'Outreach / Event Format',
    description: 'Bible reading fiestas, kids conferences, festivals and global rallies',
    subcategoriesCount: 2,
    assetsCount: 3,
    status: 'Active',
    iconType: 'event',
    color: 'bg-[#a855f7]',
  },
  {
    id: 'cat-10',
    name: 'Character / Named IP',
    description: 'Proprietary character bibles, 3D turnaround rigs, mascots and visual IP',
    subcategoriesCount: 2,
    assetsCount: 3,
    status: 'Active',
    iconType: 'character',
    color: 'bg-[#ef4444]',
  },
  {
    id: 'cat-11',
    name: 'Music / Audio',
    description: 'Original theme songs, sing-alongs, audio dramas and soundtrack stems',
    subcategoriesCount: 2,
    assetsCount: 2,
    status: 'Active',
    iconType: 'music',
    color: 'bg-[#ec4899]',
  },
  {
    id: 'cat-12',
    name: 'Brand & Guidelines',
    description: 'Master logo marks, wordmarks, typography rules and visual identity bibles',
    subcategoriesCount: 2,
    assetsCount: 2,
    status: 'Active',
    iconType: 'other',
    color: 'bg-[#334155]',
  },
]

export const initialSubcategories: SubcategoryItem[] = [
  // Animated Programme
  { id: 'sub-1', name: 'TV Series', parentCategory: 'Animated Programme', assetsCount: 2, status: 'Active', iconType: 'tv', color: 'bg-[#8b5cf6]' },
  { id: 'sub-2', name: 'Short Clips', parentCategory: 'Animated Programme', assetsCount: 1, status: 'Active', iconType: 'tv', color: 'bg-[#8b5cf6]' },
  { id: 'sub-3', name: 'Animated Movies', parentCategory: 'Animated Programme', assetsCount: 0, status: 'Active', iconType: 'tv', color: 'bg-[#8b5cf6]' },

  // TV Programme
  { id: 'sub-4', name: 'Broadcast Series', parentCategory: 'TV Programme', assetsCount: 2, status: 'Active', iconType: 'tv', color: 'bg-[#3b82f6]' },
  { id: 'sub-5', name: 'Episodes', parentCategory: 'TV Programme', assetsCount: 1, status: 'Active', iconType: 'tv', color: 'bg-[#3b82f6]' },
  { id: 'sub-6', name: 'Live Action & Sing-Along', parentCategory: 'TV Programme', assetsCount: 1, status: 'Active', iconType: 'tv', color: 'bg-[#3b82f6]' },

  // Documentary / Video
  { id: 'sub-7', name: 'Feature Documentaries', parentCategory: 'Documentary / Video', assetsCount: 1, status: 'Active', iconType: 'bible', color: 'bg-[#0284c7]' },
  { id: 'sub-8', name: 'Educational Short Videos', parentCategory: 'Documentary / Video', assetsCount: 1, status: 'Active', iconType: 'bible', color: 'bg-[#0284c7]' },

  // Film / Short Movie
  { id: 'sub-9', name: 'Short Films', parentCategory: 'Film / Short Movie', assetsCount: 1, status: 'Active', iconType: 'tv', color: 'bg-[#6366f1]' },
  { id: 'sub-10', name: 'Faith Dramas', parentCategory: 'Film / Short Movie', assetsCount: 1, status: 'Active', iconType: 'tv', color: 'bg-[#6366f1]' },

  // Consumer Product / Merchandise
  { id: 'sub-11', name: 'School Bags & Stationery', parentCategory: 'Consumer Product / Merchandise', assetsCount: 1, status: 'Active', iconType: 'game', color: 'bg-[#10b981]' },
  { id: 'sub-12', name: 'Apparel & Accessories', parentCategory: 'Consumer Product / Merchandise', assetsCount: 1, status: 'Active', iconType: 'game', color: 'bg-[#10b981]' },
  { id: 'sub-13', name: 'Food & Beverage', parentCategory: 'Consumer Product / Merchandise', assetsCount: 1, status: 'Active', iconType: 'game', color: 'bg-[#10b981]' },

  // Publishing / Book
  { id: 'sub-14', name: 'Devotional Books', parentCategory: 'Publishing / Book', assetsCount: 1, status: 'Active', iconType: 'edu', color: 'bg-[#f59e0b]' },
  { id: 'sub-15', name: 'Illustrated Storybooks', parentCategory: 'Publishing / Book', assetsCount: 1, status: 'Active', iconType: 'edu', color: 'bg-[#f59e0b]' },

  // Publishing / Comics
  { id: 'sub-16', name: 'Comic Volumes', parentCategory: 'Publishing / Comics', assetsCount: 1, status: 'Active', iconType: 'edu', color: 'bg-[#f97316]' },
  { id: 'sub-17', name: 'Special Manga Editions', parentCategory: 'Publishing / Comics', assetsCount: 1, status: 'Active', iconType: 'edu', color: 'bg-[#f97316]' },

  // Digital / Interactive Platform
  { id: 'sub-18', name: 'Mobile Applications', parentCategory: 'Digital / Interactive Platform', assetsCount: 2, status: 'Active', iconType: 'game', color: 'bg-[#06b6d4]' },
  { id: 'sub-19', name: 'Web Portals & Apps', parentCategory: 'Digital / Interactive Platform', assetsCount: 1, status: 'Active', iconType: 'game', color: 'bg-[#06b6d4]' },
  { id: 'sub-20', name: 'Interactive Kiddies Games', parentCategory: 'Digital / Interactive Platform', assetsCount: 1, status: 'Active', iconType: 'game', color: 'bg-[#06b6d4]' },

  // Outreach / Event Format
  { id: 'sub-21', name: 'Bible Reading Fiestas', parentCategory: 'Outreach / Event Format', assetsCount: 1, status: 'Active', iconType: 'event', color: 'bg-[#a855f7]' },
  { id: 'sub-22', name: 'Conferences & Rallies', parentCategory: 'Outreach / Event Format', assetsCount: 2, status: 'Active', iconType: 'event', color: 'bg-[#a855f7]' },

  // Character / Named IP
  { id: 'sub-23', name: '3D Rigs & Turnarounds', parentCategory: 'Character / Named IP', assetsCount: 2, status: 'Active', iconType: 'character', color: 'bg-[#ef4444]' },
  { id: 'sub-24', name: '2D Visual Character Bibles', parentCategory: 'Character / Named IP', assetsCount: 1, status: 'Active', iconType: 'character', color: 'bg-[#ef4444]' },

  // Music / Audio
  { id: 'sub-25', name: 'Theme Songs', parentCategory: 'Music / Audio', assetsCount: 1, status: 'Active', iconType: 'music', color: 'bg-[#ec4899]' },
  { id: 'sub-26', name: 'Sing-Alongs & Tracks', parentCategory: 'Music / Audio', assetsCount: 1, status: 'Active', iconType: 'music', color: 'bg-[#ec4899]' },

  // Brand & Guidelines
  { id: 'sub-27', name: 'Master Logo Marks', parentCategory: 'Brand & Guidelines', assetsCount: 1, status: 'Active', iconType: 'other', color: 'bg-[#334155]' },
  { id: 'sub-28', name: 'Network Identity Bibles', parentCategory: 'Brand & Guidelines', assetsCount: 1, status: 'Active', iconType: 'other', color: 'bg-[#334155]' },
]

const rawAssetsData: AssetData[] = [
  // 1. Animated Programme
  {
    id: 'LT-AP-001',
    name: 'Rhapsody of Realities for Early Readers Animation',
    type: 'Series',
    category: 'Animated Programme',
    categoryGroup: 'Animated Programme',
    subcategory: 'TV Series',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Lovetoons Agency Admin',
    contributors: [
          {
                "id": "c-LT-AP-001-1",
                "name": "David Kolawole",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-AP-001-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-AP-001-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-AP-001-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'David Kolawole',
    
    creatorSkill: 'animation',
    status: 'Approved',
    createdDate: 'Sep 21, 2025',
    createdTime: '10:15 AM',
    thumbType: 'tv_series',
    posterUrl: '/tv_series_poster.jpg',
    rightsHolder: 'Pastor Kalu Chelsea (Executive Minister)',
    description: 'Flagship animated daily devotional series bringing scripture truths and inspirational character lessons to young children.',
    tags: ['Devotional', 'Animation', 'Early Readers', 'Faith'],
    fileSize: '6.4 GB',
    version: 'v2.1',
    attributes: {
      episodesCount: 26,
      durationMinutes: 15,
      resolution: '4K UHD',
      audioMix: 'Surround 5.1',
      targetAgeGroup: '3-5 Years',
    },
  },
  {
    id: 'LT-AP-002',
    name: 'Tick Talks (Animation Series)',
    type: 'Series',
    category: 'Animated Programme',
    categoryGroup: 'Animated Programme',
    subcategory: 'TV Series',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Lovetoons Agency Admin',
    contributors: [
          {
                "id": "c-LT-AP-002-1",
                "name": "David Kolawole",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-AP-002-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-AP-002-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-AP-002-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'David Kolawole',
    
    creatorSkill: 'animation',
    status: 'Approved',
    createdDate: 'Sep 20, 2025',
    createdTime: '11:30 AM',
    thumbType: 'character_tilly',
    posterUrl: '/tv_series_showcase.jpg',
    rightsHolder: 'Pastor Kalu Chelsea (Executive Minister)',
    description: 'Dynamic animated clock character teaching children time management, scripture memory and daily prayer habits.',
    tags: ['Tick Talks', 'Animation', 'Values'],
    fileSize: '3.8 GB',
    version: 'v1.2',
    attributes: {
      episodesCount: 14,
      durationMinutes: 12,
      resolution: '1080p Full HD',
      targetAgeGroup: '6-9 Years',
    },
  },
  {
    id: 'LT-AN-001',
    name: 'Brave Boy Adventure (Short)',
    type: 'Short Film',
    category: 'Animated Programme',
    categoryGroup: 'Animated Programme',
    subcategory: 'Short Clips',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Lovetoons Agency Admin',
    contributors: [
          {
                "id": "c-LT-AN-001-1",
                "name": "David Kolawole",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-AN-001-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-AN-001-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-AN-001-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'David Kolawole',
    
    creatorSkill: 'animation',
    status: 'Approved',
    createdDate: 'Sep 18, 2025',
    createdTime: '03:40 PM',
    thumbType: 'brave_boy',
    posterUrl: '/tv_series_poster.jpg',
    rightsHolder: 'Pastor Kalu Chelsea (Executive Minister)',
    description: 'Exciting 3D animated adventure following a young boy who relies on biblical courage to conquer giant challenges.',
    tags: ['Courage', '3D Animation', 'Short'],
    fileSize: '1.4 GB',
    version: 'v1.0',
    attributes: {
      durationMinutes: 8,
      resolution: '4K UHD',
      targetAgeGroup: '6-9 Years',
    },
  },

  // 2. TV Programme
  {
    id: 'LT-TS-001',
    name: 'Lovetoons TV Series (Season 1)',
    type: 'Series',
    category: 'TV Programme',
    categoryGroup: 'TV Programme',
    subcategory: 'Broadcast Series',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Lovetoons Agency Admin',
    contributors: [
          {
                "id": "c-LT-TS-001-1",
                "name": "David Kolawole",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-TS-001-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-TS-001-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-TS-001-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'David Kolawole',
    
    creatorSkill: 'animation',
    status: 'Approved',
    createdDate: 'Sep 20, 2025',
    createdTime: '10:24 AM',
    thumbType: 'tv_series',
    posterUrl: '/tv_series_poster.jpg',
    rightsHolder: 'Pastor Kalu Chelsea (Executive Minister)',
    description: 'A faith-based animated and live broadcast series for children, filled with values, godly teachings and musical fun.',
    tags: ['Broadcast', 'Children', 'Faith', 'Season 1'],
    fileSize: '4.8 GB',
    version: 'v1.4',
    attributes: {
      episodesCount: 12,
      durationMinutes: 22,
      seasonNumber: 1,
      aspectRatio: '16:9',
      resolution: '4K UHD',
      audioMix: 'Surround 5.1',
      targetAgeGroup: '6-9 Years',
    },
  },
  {
    id: 'LT-TV-002',
    name: 'Sing Along With Lovetoons',
    type: 'Series',
    category: 'TV Programme',
    categoryGroup: 'TV Programme',
    subcategory: 'Live Action & Sing-Along',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Lovetoons Agency Admin',
    contributors: [
          {
                "id": "c-LT-TV-002-1",
                "name": "David Kolawole",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-TV-002-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-TV-002-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-TV-002-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'David Kolawole',
    
    creatorSkill: 'video_editor',
    status: 'Approved',
    createdDate: 'Sep 17, 2025',
    createdTime: '01:10 PM',
    thumbType: 'theme_song',
    posterUrl: '/tv_series_showcase.jpg',
    rightsHolder: 'Pastor Kalu Chelsea (Executive Minister)',
    description: 'High-energy sing-along television show with lyric cards, dance steps and children praise choruses.',
    tags: ['Music', 'TV Show', 'Sing-Along'],
    fileSize: '3.2 GB',
    version: 'v1.1',
    attributes: {
      episodesCount: 10,
      durationMinutes: 15,
      resolution: '1080p Full HD',
      targetAgeGroup: 'All Ages',
    },
  },
  {
    id: 'LT-TV-003',
    name: 'Gratia’s Diary',
    type: 'Series',
    category: 'TV Programme',
    categoryGroup: 'TV Programme',
    subcategory: 'Broadcast Series',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Lovetoons Agency Admin',
    contributors: [
          {
                "id": "c-LT-TV-003-1",
                "name": "David Kolawole",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-TV-003-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-TV-003-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-TV-003-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'David Kolawole',
    
    creatorSkill: 'video_editor',
    status: 'Approved',
    createdDate: 'Sep 16, 2025',
    createdTime: '09:45 AM',
    thumbType: 'tv_series',
    posterUrl: '/tv_series_poster.jpg',
    rightsHolder: 'Pastor Kalu Chelsea (Executive Minister)',
    description: 'Heartwarming lifestyle and faith diary series exploring everyday school life and godly friendships.',
    tags: ['Diary', 'Values', 'Live Action'],
    fileSize: '2.9 GB',
    version: 'v1.0',
    attributes: {
      episodesCount: 8,
      durationMinutes: 18,
      resolution: '1080p Full HD',
    },
  },
  {
    id: 'LT-EP-003',
    name: 'Episode 3 – The Courageous Journey',
    type: 'Episode',
    category: 'TV Programme',
    categoryGroup: 'TV Programme',
    subcategory: 'Episodes',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Lovetoons Agency Admin',
    contributors: [
          {
                "id": "c-LT-EP-003-1",
                "name": "David Kolawole",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-EP-003-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-EP-003-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-EP-003-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'David Kolawole',
    
    creatorSkill: 'video_editor',
    status: 'Approved',
    createdDate: 'Sep 19, 2025',
    createdTime: '02:15 PM',
    thumbType: 'tv_series',
    posterUrl: '/tv_series_showcase.jpg',
    rightsHolder: 'Pastor Kalu Chelsea (Executive Minister)',
    description: 'Master broadcast episode with multilingual audio tracks and surround sound mix.',
    tags: ['Broadcast', 'Episode', '4K'],
    fileSize: '2.1 GB',
    version: 'v1.0',
  },

  // 3. Documentary / Video
  {
    id: 'LT-DOC-001',
    name: 'The Deception of Kids Media Industry (Documentary)',
    type: 'Documentary',
    category: 'Documentary / Video',
    categoryGroup: 'Documentary / Video',
    subcategory: 'Feature Documentaries',
    agency: 'Academy Agency',
    unit: 'Academy Agency',
    creatorRole: 'Super Admin',
    contributors: [
          {
                "id": "c-LT-DOC-001-1",
                "name": "Dr. Miriam Peters",
                "role": "Masterclass Dean & Lead Instructor",
                "agency": "Academy Agency",
                "email": "miriam.p@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-DOC-001-2",
                "name": "David Kolawole",
                "role": "Senior Animation Mentor",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-DOC-001-3",
                "name": "Samuel Adeleke",
                "role": "Scriptwriting Workshop Faculty",
                "agency": "Publishing Agency",
                "email": "samuel.a@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          }
    ],
    creatorName: 'Pastor Chelsea Kalu',
    
    creatorSkill: 'legal_counsel',
    status: 'Approved',
    createdDate: 'Sep 14, 2025',
    createdTime: '04:20 PM',
    thumbType: 'tv_series',
    posterUrl: '/tv_series_showcase.jpg',
    rightsHolder: 'Pastor Kalu Chelsea (Executive Minister)',
    description: 'In-depth research documentary evaluating the psychological and spiritual impact of mainstream children media and presenting godly alternatives.',
    tags: ['Documentary', 'Research', 'Child Protection'],
    fileSize: '4.1 GB',
    version: 'v1.0',
    attributes: {
      durationMinutes: 45,
      resolution: '4K UHD',
      targetAgeGroup: 'All Ages',
    },
  },
  {
    id: 'LT-DOC-002',
    name: 'Malaria Vaccine Educational Short Video',
    type: 'Educational Video',
    category: 'Documentary / Video',
    categoryGroup: 'Documentary / Video',
    subcategory: 'Educational Short Videos',
    agency: 'Educational Agency',
    unit: 'Educational Agency',
    creatorRole: 'Super Admin',
    contributors: [
          {
                "id": "c-LT-DOC-002-1",
                "name": "Pastor Joshua Davies",
                "role": "Curriculum Director & Outreach Lead",
                "agency": "Educational Agency",
                "email": "joshua.d@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-DOC-002-2",
                "name": "Grace Emmanuel",
                "role": "Children Praise Coordinator",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-DOC-002-3",
                "name": "Samuel Adeleke",
                "role": "Literacy Manual Editor",
                "agency": "Publishing Agency",
                "email": "samuel.a@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          }
    ],
    creatorName: 'Pastor Chelsea Kalu',
    
    creatorSkill: 'video_editor',
    status: 'Approved',
    createdDate: 'Sep 15, 2025',
    createdTime: '01:50 PM',
    thumbType: 'brave_boy',
    posterUrl: '/tv_series_poster.jpg',
    rightsHolder: 'Pastor Kalu Chelsea (Executive Minister)',
    description: 'Child-friendly animated public health video explaining malaria prevention and healthy habits.',
    tags: ['Health', 'Educational', 'Short Video'],
    fileSize: '850 MB',
    version: 'v1.0',
  },

  // 4. Film / Short Movie
  {
    id: 'LT-FLM-001',
    name: 'Timothia Questions (Short Film)',
    type: 'Film',
    category: 'Film / Short Movie',
    categoryGroup: 'Film / Short Movie',
    subcategory: 'Short Films',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Lovetoons Agency Admin',
    contributors: [
          {
                "id": "c-LT-FLM-001-1",
                "name": "David Kolawole",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-FLM-001-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-FLM-001-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-FLM-001-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'David Kolawole',
    
    creatorSkill: 'video_editor',
    status: 'Approved',
    createdDate: 'Sep 12, 2025',
    createdTime: '11:05 AM',
    thumbType: 'tv_series',
    posterUrl: '/tv_series_showcase.jpg',
    rightsHolder: 'Pastor Kalu Chelsea (Executive Minister)',
    description: 'Award-winning short dramatic film capturing a child heartfelt questions about prayer, answered through miraculous events.',
    tags: ['Short Film', 'Drama', 'Faith'],
    fileSize: '2.8 GB',
    version: 'v1.1',
    attributes: {
      durationMinutes: 24,
      resolution: '4K UHD',
      audioMix: 'Surround 5.1',
    },
  },
  {
    id: 'LT-FLM-002',
    name: 'Water In the Desert (Faith Film)',
    type: 'Film',
    category: 'Film / Short Movie',
    categoryGroup: 'Film / Short Movie',
    subcategory: 'Faith Dramas',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Lovetoons Agency Admin',
    contributors: [
          {
                "id": "c-LT-FLM-002-1",
                "name": "David Kolawole",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-FLM-002-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-FLM-002-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-FLM-002-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'David Kolawole',
    
    creatorSkill: 'video_editor',
    status: 'Approved',
    createdDate: 'Sep 10, 2025',
    createdTime: '05:30 PM',
    thumbType: 'tv_series',
    posterUrl: '/tv_series_poster.jpg',
    rightsHolder: 'Pastor Kalu Chelsea (Executive Minister)',
    description: 'Inspiring children faith movie chronicling biblical trust in barren times and God unfailing provision.',
    tags: ['Film', 'Miracles', 'Faith'],
    fileSize: '3.6 GB',
    version: 'v1.0',
  },

  // 5. Consumer Product / Merchandise
  {
    id: 'LT-CP-001',
    name: 'Tick Talks Kids School Bag',
    type: 'Merchandise',
    category: 'Consumer Product / Merchandise',
    categoryGroup: 'Consumer Product / Merchandise',
    subcategory: 'School Bags & Stationery',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Super Admin',
    contributors: [
          {
                "id": "c-LT-CP-001-1",
                "name": "Pastor Chelsea Kalu",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-CP-001-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-CP-001-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-CP-001-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'Pastor Chelsea Kalu',
    
    creatorSkill: 'designer',
    status: 'Approved',
    createdDate: 'Sep 18, 2025',
    createdTime: '09:20 AM',
    thumbType: 'character_tilly',
    posterUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Consumer Goods Ltd',
    description: 'Durable waterproof backpack with reflective Tick Talks mascot emblem and scripture badge.',
    tags: ['Backpack', 'Tick Talks', 'School'],
    fileSize: '45 MB',
    version: 'v1.0',
    attributes: {
      sku: 'LT-BAG-001',
      manufacturer: 'Lovetoons Gear Partners',
      targetAgeGroup: '6-9 Years',
    },
  },
  {
    id: 'LT-CP-002',
    name: 'Zobo Drink (Special Edition)',
    type: 'Product',
    category: 'Consumer Product / Merchandise',
    categoryGroup: 'Consumer Product / Merchandise',
    subcategory: 'Food & Beverage',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Super Admin',
    contributors: [
          {
                "id": "c-LT-CP-002-1",
                "name": "Pastor Chelsea Kalu",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-CP-002-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-CP-002-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-CP-002-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'Pastor Chelsea Kalu',
    
    creatorSkill: 'designer',
    status: 'In Review',
    createdDate: 'Sep 19, 2025',
    createdTime: '04:12 PM',
    thumbType: 'zobo',
    posterUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Consumer Goods',
    description: 'Nutritious hibiscus kiddies beverage formulated with organic fruit extracts in child-safe pouch containers.',
    tags: ['Merchandise', 'Drink', 'Organic', 'Kids'],
    fileSize: '120 MB',
    version: 'v2.0',
    attributes: {
      sku: 'LT-ZOB-002',
      manufacturer: 'Lovetoons Beverage Ltd',
      targetAgeGroup: 'All Ages',
    },
  },
  {
    id: 'LT-CP-003',
    name: 'Lovetoons Official T-Shirt for Kids & Adults',
    type: 'Apparel',
    category: 'Consumer Product / Merchandise',
    categoryGroup: 'Consumer Product / Merchandise',
    subcategory: 'Apparel & Accessories',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Super Admin',
    contributors: [
          {
                "id": "c-LT-CP-003-1",
                "name": "Pastor Chelsea Kalu",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-CP-003-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-CP-003-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-CP-003-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'Pastor Chelsea Kalu',
    
    creatorSkill: 'designer',
    status: 'Approved',
    createdDate: 'Sep 14, 2025',
    createdTime: '02:00 PM',
    thumbType: 'logo',
    posterUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Brand Ltd',
    description: '100% breathable organic cotton ministry T-shirt with high-definition Lovetoons puff print graphic.',
    tags: ['Apparel', 'T-Shirt', 'Merchandise'],
    fileSize: '30 MB',
    version: 'v1.0',
  },

  // 6. Publishing / Book
  {
    id: 'LT-BK-001',
    name: 'My Book of Bible Prayers',
    type: 'Book',
    category: 'Publishing / Book',
    categoryGroup: 'Publishing / Book',
    subcategory: 'Devotional Books',
    agency: 'Publishing Agency',
    unit: 'Publishing Agency',
    creatorRole: 'Publishing Agency Admin',
    contributors: [
          {
                "id": "c-LT-BK-001-1",
                "name": "Samuel Adeleke",
                "role": "Lead Author & Chief Editor",
                "agency": "Publishing Agency",
                "email": "samuel.a@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-BK-001-2",
                "name": "Joy Okon",
                "role": "Senior Illustrator & Layout Artist",
                "agency": "Publishing Agency",
                "email": "joy.o@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-BK-001-3",
                "name": "Faith Daniel",
                "role": "Doctrinal Accuracy Reviewer",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Reviewer"
          },
          {
                "id": "c-LT-BK-001-4",
                "name": "Emmanuel Vance",
                "role": "E-Book Digital Typesetter",
                "agency": "Digital Agency",
                "email": "emmanuel.v@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          }
    ],
    creatorName: 'Samuel Adeleke',
    
    creatorSkill: 'writer',
    status: 'Approved',
    createdDate: 'Sep 15, 2025',
    createdTime: '09:00 AM',
    thumbType: 'book',
    posterUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Publishing Ltd',
    description: 'Full-color illustrated hardcover devotional prayer book guiding children to develop personal daily communication with God.',
    tags: ['Prayer', 'Devotional', 'Hardcover', 'Scripture'],
    fileSize: '450 MB',
    version: 'v1.2',
    attributes: {
      pageCount: 84,
      isbn: '978-0-998877-01-4',
      formatType: 'Illustrated Hardcover',
      targetAgeGroup: '6-9 Years',
    },
  },
  {
    id: 'LT-BK-002',
    name: 'Lovetoons TV Devotional Storybook (Vol 1)',
    type: 'Book',
    category: 'Publishing / Book',
    categoryGroup: 'Publishing / Book',
    subcategory: 'Illustrated Storybooks',
    agency: 'Publishing Agency',
    unit: 'Publishing Agency',
    creatorRole: 'Publishing Agency Admin',
    contributors: [
          {
                "id": "c-LT-BK-002-1",
                "name": "Samuel Adeleke",
                "role": "Lead Author & Chief Editor",
                "agency": "Publishing Agency",
                "email": "samuel.a@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-BK-002-2",
                "name": "Joy Okon",
                "role": "Senior Illustrator & Layout Artist",
                "agency": "Publishing Agency",
                "email": "joy.o@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-BK-002-3",
                "name": "Faith Daniel",
                "role": "Doctrinal Accuracy Reviewer",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Reviewer"
          },
          {
                "id": "c-LT-BK-002-4",
                "name": "Emmanuel Vance",
                "role": "E-Book Digital Typesetter",
                "agency": "Digital Agency",
                "email": "emmanuel.v@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          }
    ],
    creatorName: 'Samuel Adeleke',
    
    creatorSkill: 'writer',
    status: 'Approved',
    createdDate: 'Sep 11, 2025',
    createdTime: '03:15 PM',
    thumbType: 'book',
    posterUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Publishing Ltd',
    description: 'Companion storybook series featuring illustrated character episodes from Season 1 with scripture verses.',
    tags: ['Storybook', 'Devotional', 'Kids'],
    fileSize: '620 MB',
    version: 'v1.0',
    attributes: {
      pageCount: 112,
      isbn: '978-0-998877-02-1',
      formatType: 'Illustrated Hardcover',
    },
  },

  // 7. Publishing / Comics
  {
    id: 'LT-CM-001',
    name: 'Lovetoons Comics (Volume 1: The Story of Ibra)',
    type: 'Comic',
    category: 'Publishing / Comics',
    categoryGroup: 'Publishing / Comics',
    subcategory: 'Comic Volumes',
    agency: 'Publishing Agency',
    unit: 'Publishing Agency',
    creatorRole: 'Publishing Agency Admin',
    contributors: [
          {
                "id": "c-LT-CM-001-1",
                "name": "Samuel Adeleke",
                "role": "Lead Author & Chief Editor",
                "agency": "Publishing Agency",
                "email": "samuel.a@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-CM-001-2",
                "name": "Joy Okon",
                "role": "Senior Illustrator & Layout Artist",
                "agency": "Publishing Agency",
                "email": "joy.o@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-CM-001-3",
                "name": "Faith Daniel",
                "role": "Doctrinal Accuracy Reviewer",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Reviewer"
          },
          {
                "id": "c-LT-CM-001-4",
                "name": "Emmanuel Vance",
                "role": "E-Book Digital Typesetter",
                "agency": "Digital Agency",
                "email": "emmanuel.v@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          }
    ],
    creatorName: 'Samuel Adeleke',
    
    creatorSkill: 'designer',
    status: 'Approved',
    createdDate: 'Sep 13, 2025',
    createdTime: '10:45 AM',
    thumbType: 'comics',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Publishing Ltd',
    description: 'Dynamic superhero-style comic volume retelling Abraham journey of faith with breathtaking full-color graphics.',
    tags: ['Comic', 'Faith Heroes', 'Abraham', 'Graphic Novel'],
    fileSize: '780 MB',
    version: 'v1.0',
    attributes: {
      pageCount: 48,
      isbn: '978-0-998877-03-8',
      formatType: 'Comic Strip',
      targetAgeGroup: '10-14 Years',
    },
  },
  {
    id: 'LT-CM-002',
    name: 'Faith Heroes Comic Book (Special Edition)',
    type: 'Comic',
    category: 'Publishing / Comics',
    categoryGroup: 'Publishing / Comics',
    subcategory: 'Special Manga Editions',
    agency: 'Publishing Agency',
    unit: 'Publishing Agency',
    creatorRole: 'Publishing Agency Admin',
    contributors: [
          {
                "id": "c-LT-CM-002-1",
                "name": "Samuel Adeleke",
                "role": "Lead Author & Chief Editor",
                "agency": "Publishing Agency",
                "email": "samuel.a@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-CM-002-2",
                "name": "Joy Okon",
                "role": "Senior Illustrator & Layout Artist",
                "agency": "Publishing Agency",
                "email": "joy.o@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-CM-002-3",
                "name": "Faith Daniel",
                "role": "Doctrinal Accuracy Reviewer",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Reviewer"
          },
          {
                "id": "c-LT-CM-002-4",
                "name": "Emmanuel Vance",
                "role": "E-Book Digital Typesetter",
                "agency": "Digital Agency",
                "email": "emmanuel.v@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          }
    ],
    creatorName: 'Samuel Adeleke',
    
    creatorSkill: 'designer',
    status: 'Approved',
    createdDate: 'Sep 09, 2025',
    createdTime: '04:00 PM',
    thumbType: 'comics',
    posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Publishing Ltd',
    description: 'Action-packed comic collection chronicling biblical champions overcoming impossible odds through the Word.',
    tags: ['Heroes', 'Manga', 'Action'],
    fileSize: '540 MB',
    version: 'v1.0',
  },

  // 8. Digital / Interactive Platform
  {
    id: 'LT-DGT-001',
    name: 'Lovetoons TV App',
    type: 'Application',
    category: 'Digital / Interactive Platform',
    categoryGroup: 'Digital / Interactive Platform',
    subcategory: 'Mobile Applications',
    agency: 'Digital Agency',
    unit: 'Digital Agency',
    creatorRole: 'Digital & Tech Admin',
    contributors: [
          {
                "id": "c-LT-DGT-001-1",
                "name": "Emmanuel Vance",
                "role": "Lead Software Architect",
                "agency": "Digital Agency",
                "email": "emmanuel.v@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-DGT-001-2",
                "name": "Kemi Balogun",
                "role": "Senior UI/UX Product Designer",
                "agency": "Digital Agency",
                "email": "kemi.b@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-DGT-001-3",
                "name": "David Kolawole",
                "role": "Sprite & 3D Assets Animator",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-DGT-001-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Data Privacy & COPPA Officer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'Emmanuel Vance',
    
    creatorSkill: 'developer',
    status: 'Approved',
    createdDate: 'Sep 22, 2025',
    createdTime: '08:30 AM',
    thumbType: 'tv_series',
    posterUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Tech Ltd',
    description: 'Official children streaming application featuring all animated programmes, sing-along tracks, audiobooks and parental controls.',
    tags: ['Streaming', 'App', 'iOS', 'Android', 'OTT'],
    fileSize: '95 MB',
    version: 'v2.4.0',
    attributes: {
      platformTarget: 'Cross-Platform',
      repositoryUrl: 'github.com/lovetoons/app-core',
      targetAgeGroup: 'All Ages',
    },
  },
  {
    id: 'LT-DGT-002',
    name: 'Lovetoons TV Official Website',
    type: 'Web Portal',
    category: 'Digital / Interactive Platform',
    categoryGroup: 'Digital / Interactive Platform',
    subcategory: 'Web Portals & Apps',
    agency: 'Digital Agency',
    unit: 'Digital Agency',
    creatorRole: 'Digital & Tech Admin',
    contributors: [
          {
                "id": "c-LT-DGT-002-1",
                "name": "Emmanuel Vance",
                "role": "Lead Software Architect",
                "agency": "Digital Agency",
                "email": "emmanuel.v@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-DGT-002-2",
                "name": "Kemi Balogun",
                "role": "Senior UI/UX Product Designer",
                "agency": "Digital Agency",
                "email": "kemi.b@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-DGT-002-3",
                "name": "David Kolawole",
                "role": "Sprite & 3D Assets Animator",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-DGT-002-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Data Privacy & COPPA Officer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'Emmanuel Vance',
    
    creatorSkill: 'developer',
    status: 'Approved',
    createdDate: 'Sep 16, 2025',
    createdTime: '02:40 PM',
    thumbType: 'logo',
    posterUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Tech Ltd',
    description: 'Responsive global web portal hosting digital broadcasts, schedule programming and online resource center.',
    tags: ['Web Portal', 'Live TV', 'React'],
    fileSize: '150 MB',
    version: 'v3.1.0',
  },
  {
    id: 'LT-DGT-003',
    name: 'Let\'s Read the Bible Website & App',
    type: 'Web & Mobile',
    category: 'Digital / Interactive Platform',
    categoryGroup: 'Digital / Interactive Platform',
    subcategory: 'Mobile Applications',
    agency: 'Digital Agency',
    unit: 'Digital Agency',
    creatorRole: 'Digital & Tech Admin',
    contributors: [
          {
                "id": "c-LT-DGT-003-1",
                "name": "Emmanuel Vance",
                "role": "Lead Software Architect",
                "agency": "Digital Agency",
                "email": "emmanuel.v@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-DGT-003-2",
                "name": "Kemi Balogun",
                "role": "Senior UI/UX Product Designer",
                "agency": "Digital Agency",
                "email": "kemi.b@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-DGT-003-3",
                "name": "David Kolawole",
                "role": "Sprite & 3D Assets Animator",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-DGT-003-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Data Privacy & COPPA Officer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'Emmanuel Vance',
    
    creatorSkill: 'developer',
    status: 'Approved',
    createdDate: 'Sep 11, 2025',
    createdTime: '11:20 AM',
    thumbType: 'book',
    posterUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Tech Ltd',
    description: 'Interactive scripture reading gamification platform with audio narrations, badges and daily reading milestones.',
    tags: ['Bible', 'Reading', 'Gamified'],
    fileSize: '80 MB',
    version: 'v1.5.0',
  },
  {
    id: 'LT-GM-001',
    name: 'Bible Quest Interactive Kiddies App',
    type: 'Game',
    category: 'Digital / Interactive Platform',
    categoryGroup: 'Digital / Interactive Platform',
    subcategory: 'Interactive Kiddies Games',
    agency: 'Digital Agency',
    unit: 'Digital Agency',
    creatorRole: 'Digital & Tech Admin',
    contributors: [
          {
                "id": "c-LT-GM-001-1",
                "name": "Emmanuel Vance",
                "role": "Lead Software Architect",
                "agency": "Digital Agency",
                "email": "emmanuel.v@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-GM-001-2",
                "name": "Kemi Balogun",
                "role": "Senior UI/UX Product Designer",
                "agency": "Digital Agency",
                "email": "kemi.b@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-GM-001-3",
                "name": "David Kolawole",
                "role": "Sprite & 3D Assets Animator",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-GM-001-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Data Privacy & COPPA Officer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'Emmanuel Vance',
    
    creatorSkill: 'developer',
    status: 'In Review',
    createdDate: 'Sep 18, 2025',
    createdTime: '05:15 PM',
    thumbType: 'tv_series',
    posterUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Tech Ltd',
    description: 'Educational 3D adventure mobile game where children explore biblical cities and complete faith quests.',
    tags: ['Gaming', 'Interactive', 'Unity', 'Quest'],
    fileSize: '320 MB',
    version: 'v1.0-beta',
    attributes: {
      platformTarget: 'Cross-Platform',
      engineVersion: 'Unity 2023.2 LTS',
      targetAgeGroup: '6-9 Years',
    },
  },

  // 9. Outreach / Event Format
  {
    id: 'LT-EV-001',
    name: 'Lovetoons Bible Reading Fiesta',
    type: 'Event Format',
    category: 'Outreach / Event Format',
    categoryGroup: 'Outreach / Event Format',
    subcategory: 'Bible Reading Fiestas',
    agency: 'Educational Agency',
    unit: 'Educational Agency',
    creatorRole: 'Educational Agency Admin',
    contributors: [
          {
                "id": "c-LT-EV-001-1",
                "name": "Pastor Joshua Davies",
                "role": "Curriculum Director & Outreach Lead",
                "agency": "Educational Agency",
                "email": "joshua.d@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-EV-001-2",
                "name": "Grace Emmanuel",
                "role": "Children Praise Coordinator",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-EV-001-3",
                "name": "Samuel Adeleke",
                "role": "Literacy Manual Editor",
                "agency": "Publishing Agency",
                "email": "samuel.a@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          }
    ],
    creatorName: 'David Kolawole',
    
    creatorSkill: 'video_editor',
    status: 'Approved',
    createdDate: 'Sep 17, 2025',
    createdTime: '10:00 AM',
    thumbType: 'event',
    posterUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Outreach Ministry',
    description: 'Global annual children festival celebrating scripture reading with stage plays, choir performances and interactive contests.',
    tags: ['Fiesta', 'Bible Reading', 'Outreach'],
    fileSize: '5.1 GB',
    version: 'v2025',
    attributes: {
      eventDate: 'August 15, 2025',
      venueLocation: 'LoveWorld Convocation Arena & Online',
      targetAgeGroup: 'All Ages',
    },
  },
  {
    id: 'LT-EV-002',
    name: 'Global Kids Connect with Pastor Chris',
    type: 'Event Broadcast',
    category: 'Outreach / Event Format',
    categoryGroup: 'Outreach / Event Format',
    subcategory: 'Conferences & Rallies',
    agency: 'Educational Agency',
    unit: 'Educational Agency',
    creatorRole: 'Super Admin',
    contributors: [
          {
                "id": "c-LT-EV-002-1",
                "name": "Pastor Joshua Davies",
                "role": "Curriculum Director & Outreach Lead",
                "agency": "Educational Agency",
                "email": "joshua.d@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-EV-002-2",
                "name": "Grace Emmanuel",
                "role": "Children Praise Coordinator",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-EV-002-3",
                "name": "Samuel Adeleke",
                "role": "Literacy Manual Editor",
                "agency": "Publishing Agency",
                "email": "samuel.a@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          }
    ],
    creatorName: 'Pastor Chelsea Kalu',
    
    creatorSkill: 'admin',
    status: 'Approved',
    createdDate: 'Sep 14, 2025',
    createdTime: '03:30 PM',
    thumbType: 'event',
    posterUrl: '/kmm-logo.png',
    rightsHolder: 'Lovetoons Outreach Ministry',
    description: 'Worldwide live satellite and OTT broadcast conference connecting millions of children in worship and prayer with Pastor Chris.',
    tags: ['Pastor Chris', 'Global', 'Live Broadcast'],
    fileSize: '8.4 GB',
    version: 'v2025.2',
  },
  {
    id: 'LT-EV-003',
    name: 'Kids Praise & Faith Festival 2025',
    type: 'Event Format',
    category: 'Outreach / Event Format',
    categoryGroup: 'Outreach / Event Format',
    subcategory: 'Conferences & Rallies',
    agency: 'Educational Agency',
    unit: 'Educational Agency',
    creatorRole: 'Educational Agency Admin',
    contributors: [
          {
                "id": "c-LT-EV-003-1",
                "name": "Pastor Joshua Davies",
                "role": "Curriculum Director & Outreach Lead",
                "agency": "Educational Agency",
                "email": "joshua.d@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-EV-003-2",
                "name": "Grace Emmanuel",
                "role": "Children Praise Coordinator",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-EV-003-3",
                "name": "Samuel Adeleke",
                "role": "Literacy Manual Editor",
                "agency": "Publishing Agency",
                "email": "samuel.a@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          }
    ],
    creatorName: 'David Kolawole',
    
    creatorSkill: 'video_editor',
    status: 'Approved',
    createdDate: 'Sep 05, 2025',
    createdTime: '01:30 PM',
    thumbType: 'event',
    posterUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Outreach Ministry',
    description: 'Inspiring music and praise festival featuring children dance ministries, puppet stages and live faith stories.',
    tags: ['Festival', 'Praise', 'Live Event'],
    fileSize: '3.6 GB',
    version: 'v2025',
  },

  // 10. Character / Named IP
  {
    id: 'LT-CH-001',
    name: 'Tick Talks Character (3D Turnaround Rig)',
    type: 'Character IP',
    category: 'Character / Named IP',
    categoryGroup: 'Character / Named IP',
    subcategory: '3D Rigs & Turnarounds',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Lovetoons Agency Admin',
    contributors: [
          {
                "id": "c-LT-CH-001-1",
                "name": "David Kolawole",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-CH-001-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-CH-001-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-CH-001-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'David Kolawole',
    
    creatorSkill: 'animation',
    status: 'Approved',
    createdDate: 'Sep 21, 2025',
    createdTime: '10:20 AM',
    thumbType: 'character_tilly',
    posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Brand Ltd',
    description: 'Proprietary animated clock mascot IP with complete Maya 3D turnaround skeleton, facial expression blendshapes and character bible.',
    tags: ['Character Rig', 'Tick Talks', 'Mascot', '3D Model'],
    fileSize: '1.2 GB',
    version: 'v3.0',
    attributes: {
      has3DRig: true,
      trademarkClass: 'Class 41 (Entertainment) & Class 28 (Toys)',
      voiceActor: 'Grace N.',
      targetAgeGroup: 'All Ages',
    },
  },
  {
    id: 'LT-CH-002',
    name: 'Tilly the Kangaroo (Character Rig)',
    type: 'Character IP',
    category: 'Character / Named IP',
    categoryGroup: 'Character / Named IP',
    subcategory: '3D Rigs & Turnarounds',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Lovetoons Agency Admin',
    contributors: [
          {
                "id": "c-LT-CH-002-1",
                "name": "David Kolawole",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-CH-002-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-CH-002-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-CH-002-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'David Kolawole',
    
    creatorSkill: 'animation',
    status: 'Approved',
    createdDate: 'Sep 02, 2025',
    createdTime: '02:00 PM',
    thumbType: 'character_tilly',
    posterUrl: '/tv_series_showcase.jpg',
    rightsHolder: 'Lovetoons Brand Ltd',
    description: 'Lovable kangaroo guide character featured in Lovetoons TV Series and devotional publications.',
    tags: ['Tilly', 'Kangaroo', 'Animation Rig'],
    fileSize: '950 MB',
    version: 'v2.1',
  },
  {
    id: 'LT-CH-003',
    name: 'Stickman Animated Character',
    type: 'Character IP',
    category: 'Character / Named IP',
    categoryGroup: 'Character / Named IP',
    subcategory: '2D Visual Character Bibles',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Lovetoons Agency Admin',
    contributors: [
          {
                "id": "c-LT-CH-003-1",
                "name": "David Kolawole",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-CH-003-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-CH-003-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-CH-003-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'David Kolawole',
    
    creatorSkill: 'animation',
    status: 'Approved',
    createdDate: 'Sep 08, 2025',
    createdTime: '11:45 AM',
    thumbType: 'brave_boy',
    posterUrl: '/tv_series_poster.jpg',
    rightsHolder: 'Lovetoons Brand Ltd',
    description: 'Iconic minimal 2D vector animated stickman character used for instructional Bible lessons and motion graphic explanations.',
    tags: ['Stickman', '2D Rig', 'Vector'],
    fileSize: '320 MB',
    version: 'v1.0',
  },

  // 11. Music / Audio
  {
    id: 'LT-MU-001',
    name: 'Lovetoons Official Theme Song',
    type: 'Audio Track',
    category: 'Music / Audio',
    categoryGroup: 'Music / Audio',
    subcategory: 'Theme Songs',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Lovetoons Agency Admin',
    contributors: [
          {
                "id": "c-LT-MU-001-1",
                "name": "Grace Emmanuel",
                "role": "Lead Music Producer & Composer",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-MU-001-2",
                "name": "David Kolawole",
                "role": "Sound Mixing & Mastering Engineer",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-MU-001-3",
                "name": "Faith Daniel",
                "role": "Lyrics Reviewer & Script Sync",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'Grace Emmanuel',
    
    creatorSkill: 'audio_producer',
    status: 'Approved',
    createdDate: 'Sep 20, 2025',
    createdTime: '04:30 PM',
    thumbType: 'theme_song',
    posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Music Ltd',
    description: 'Official master broadcast theme song, featuring children choir vocals, full orchestral instrumentation and karaoke sing-along stems.',
    tags: ['Theme Song', 'Master Audio', 'WAV', 'Orchestral'],
    fileSize: '420 MB',
    version: 'v2.0 (Mastered)',
    attributes: {
      audioFormat: 'WAV (24-bit/48kHz)',
      bpm: 128,
      keySignature: 'C Major',
      lyricsAuthor: 'Lovetoons Creative Team',
      producer: 'Grace Emmanuel',
      isrcCode: 'NG-LV1-25-00101',
    },
  },
  {
    id: 'LT-MU-002',
    name: 'Let\'s Read the Bible Song & Audio Track',
    type: 'Audio Track',
    category: 'Music / Audio',
    categoryGroup: 'Music / Audio',
    subcategory: 'Sing-Alongs & Tracks',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Lovetoons Agency Admin',
    contributors: [
          {
                "id": "c-LT-MU-002-1",
                "name": "Grace Emmanuel",
                "role": "Lead Music Producer & Composer",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-MU-002-2",
                "name": "David Kolawole",
                "role": "Sound Mixing & Mastering Engineer",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-MU-002-3",
                "name": "Faith Daniel",
                "role": "Lyrics Reviewer & Script Sync",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'Grace Emmanuel',
    
    creatorSkill: 'audio_producer',
    status: 'Approved',
    createdDate: 'Sep 15, 2025',
    createdTime: '01:25 PM',
    thumbType: 'theme_song',
    posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    rightsHolder: 'Lovetoons Music Ltd',
    description: 'Catchy scripture memory anthem used across reading apps, festivals and television broadcasts.',
    tags: ['Bible Song', 'Kids Audio', 'Sing-Along'],
    fileSize: '310 MB',
    version: 'v1.0',
  },

  // 12. Brand & Guidelines
  {
    id: 'LT-BR-001',
    name: 'Lovetoons Official Brand Logo',
    type: 'Brand Asset',
    category: 'Brand & Guidelines',
    categoryGroup: 'Brand & Guidelines',
    subcategory: 'Master Logo Marks',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Super Admin',
    contributors: [
          {
                "id": "c-LT-BR-001-1",
                "name": "Pastor Chelsea Kalu",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-BR-001-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-BR-001-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-BR-001-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'Pastor Chelsea Kalu',
    
    creatorSkill: 'designer',
    status: 'Approved',
    createdDate: 'Aug 10, 2025',
    createdTime: '10:00 AM',
    thumbType: 'logo',
    posterUrl: '/lovetoons-logo.png',
    rightsHolder: 'Lovetoons Brand Ltd',
    description: 'Master trademarked Lovetoons wordmark and visual insignia vector files, color guidelines and clear-space parameters.',
    tags: ['Brand Identity', 'Master Logo', 'Vector', 'SVG', 'Trademark'],
    fileSize: '180 MB',
    version: 'v3.0',
    attributes: {
      trademarkClass: 'Class 41 (Media & Entertainment)',
      colorPalette: ['#09245a', '#0867d9', '#ffcc00', '#ffffff'],
    },
  },
  {
    id: 'LT-BR-002',
    name: 'LovetoonsTV Network Master Identity',
    type: 'Brand Asset',
    category: 'Brand & Guidelines',
    categoryGroup: 'Brand & Guidelines',
    subcategory: 'Network Identity Bibles',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    creatorRole: 'Digital & Tech Admin',
    contributors: [
          {
                "id": "c-LT-BR-002-1",
                "name": "Emmanuel Vance",
                "role": "Lead 3D Animator & Director",
                "agency": "Lovetoons",
                "email": "david.k@kiddiesmedia.org",
                "contributionType": "Lead Author"
          },
          {
                "id": "c-LT-BR-002-2",
                "name": "Faith Daniel",
                "role": "Screenwriter & Showrunner",
                "agency": "Lovetoons",
                "email": "faith.d@kiddiesmedia.org",
                "contributionType": "Core Creative"
          },
          {
                "id": "c-LT-BR-002-3",
                "name": "Grace Emmanuel",
                "role": "Voice Director & Sound Foley",
                "agency": "Lovetoons",
                "email": "grace.e@kiddiesmedia.org",
                "contributionType": "Technical Specialist"
          },
          {
                "id": "c-LT-BR-002-4",
                "name": "Pastor Chelsea Kalu",
                "role": "Executive Producer",
                "agency": "Lovetoons",
                "email": "chelsea.kalu@kiddiesmedia.org",
                "contributionType": "Reviewer"
          }
    ],
    creatorName: 'Emmanuel Vance',
    
    creatorSkill: 'designer',
    status: 'Approved',
    createdDate: 'Sep 01, 2025',
    createdTime: '02:15 PM',
    thumbType: 'brand_guidelines',
    posterUrl: '/kmm-logo.png',
    rightsHolder: 'Lovetoons Brand Ltd',
    description: 'Comprehensive 64-page brand governance bible covering broadcast on-screen bug placement, lower thirds, typography and merchandising standards.',
    tags: ['Brand Bible', 'Identity', 'Guidelines'],
    fileSize: '240 MB',
    version: 'v1.0',
  },
]

export const initialAssetsData: AssetData[] = sortDiscontinuedToBottom(
  attorneyGeneralAssetsData.map((a) => ({
    ...a,
    archive: a.archive || generateAssetArchive(a),
  }))
)

export const initialRightsRecords: RightsRecord[] = attorneyGeneralAssetsData.map((a) => {
  const isAudio = a.category?.toLowerCase().includes('audio') || a.category?.toLowerCase().includes('music') || a.categoryGroup?.toLowerCase().includes('audio')
  const isVideo = a.category?.toLowerCase().includes('tv') || a.category?.toLowerCase().includes('animation') || a.category?.toLowerCase().includes('programme')
  const provenance: ContentProvenance = isVideo ? 'AI Assisted' : isAudio ? 'Fully Custom' : 'AI Assisted'

  return {
    id: 'RG-' + a.id,
    assetId: a.id,
    name: a.name,
    category: a.category,
    categoryGroup: a.categoryGroup,
    subcategory: a.subcategory,
    agency: a.agency,
    unit: a.agency,
    contributors: a.contributors || [],
    owner: 'Esteemed Executive Minister (Pastor Chelsea Kalu)',
    ownerCertificateRef: 'CERT-EXEC-MIN-2026-HQ',
    trademarkStatus: 'Registered',
    distributionLicense: 'Exclusive Ministry Global Distribution',
    productionLicensees: 'Lovetoons Animation Studio, KMM Publishing, LoveWorld Media',
    territory: 'Worldwide / Global',
    territoryClearanceStatus: 'Cleared Global',
    contentProvenance: provenance,
    songWriter: isAudio ? 'KMM In-House Music Ministry' : undefined,
    songWriterProvenance: isAudio ? 'Fully Custom' : undefined,
    status: a.status === 'Under Review' ? 'Review' : 'Pending',
    thumbType: (a.thumbType || 'tv_series'),
    description: a.description || '',
    governanceScore: 92,
    documents: [
      {
        id: `cert-${a.id}-title`,
        name: `Certificate_of_Ownership_${a.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        size: '1.4 MB',
        date: 'Jan 15, 2026',
        type: 'CERT',
        targetScope: 'asset',
        notes: 'Official Title Certificate vested in Esteemed Executive Minister (Pastor Chelsea Kalu)',
      },
      {
        id: `lic-${a.id}-dist`,
        name: `Distribution_License_Deed_${a.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        size: '2.1 MB',
        date: 'Jan 20, 2026',
        type: 'LICENSE',
        targetScope: 'asset',
        notes: 'Exclusive Ministry Global Distribution Deed & clearance terms',
      },
    ],
    governanceChecks: {},
  }
})

export const initialRelationships: RelationshipItem[] = [
  {
    id: 'rel-1',
    sourceAssetId: 'LT-BR-001',
    sourceAsset: 'Lovetoons Official Brand Logo',
    sourceId: 'LT-BR-001',
    sourceIconType: 'logo',
    relationshipType: 'Applied To',
    targetAssetId: 'LT-TS-001',
    targetAsset: 'Lovetoons TV Series (Season 1)',
    targetId: 'LT-TS-001',
    targetIconType: 'tv_series',
    details: 'Master brand logo appears on title sequence, lower thirds and end credits of all Season 1 episodes.',
    createdDate: 'Sep 21, 2025',
    createdTime: '10:14 AM',
    category: 'Brand & Guidelines',
  },
  {
    id: 'rel-2',
    sourceAssetId: 'LT-CH-001',
    sourceAsset: 'Tick Talks Character (3D Turnaround Rig)',
    sourceId: 'LT-CH-001',
    sourceIconType: 'character_tilly',
    relationshipType: 'Appears In',
    targetAssetId: 'LT-AP-002',
    targetAsset: 'Tick Talks (Animation Series)',
    targetId: 'LT-AP-002',
    targetIconType: 'character_tilly',
    details: 'Tick Talks mascot stars as the main character and narrator across all animated episodes.',
    createdDate: 'Sep 21, 2025',
    createdTime: '10:20 AM',
    category: 'Character & Named IP',
  },
  {
    id: 'rel-3',
    sourceAssetId: 'LT-MU-001',
    sourceAsset: 'Lovetoons Official Theme Song',
    sourceId: 'LT-MU-001',
    sourceIconType: 'theme_song',
    relationshipType: 'Used In',
    targetAssetId: 'LT-TS-001',
    targetAsset: 'Lovetoons TV Series (Season 1)',
    targetId: 'LT-TS-001',
    targetIconType: 'tv_series',
    details: 'Master theme track synchronized as intro and outro opening theme for every broadcast episode.',
    createdDate: 'Sep 20, 2025',
    createdTime: '04:30 PM',
    category: 'Music & Audio',
  },
  {
    id: 'rel-4',
    sourceAssetId: 'LT-TS-001',
    sourceAsset: 'Lovetoons TV Series (Season 1)',
    sourceId: 'LT-TS-001',
    sourceIconType: 'tv_series',
    relationshipType: 'Contains',
    targetAssetId: 'LT-EP-003',
    targetAsset: 'Episode 3 – The Courageous Journey',
    targetId: 'LT-EP-003',
    targetIconType: 'tv_series',
    details: 'Season 1 contains Episode 3 as an official episodic installment.',
    createdDate: 'Sep 19, 2025',
    createdTime: '02:30 PM',
    category: 'TV Programme',
  },
  {
    id: 'rel-5',
    sourceAssetId: 'LT-CH-002',
    sourceAsset: 'Tilly the Kangaroo (Character Rig)',
    sourceId: 'LT-CH-002',
    sourceIconType: 'character_tilly',
    relationshipType: 'Appears In',
    targetAssetId: 'LT-BK-001',
    targetAsset: 'My Book of Bible Prayers',
    targetId: 'LT-BK-001',
    targetIconType: 'book',
    details: 'Tilly illustrated on front cover and accompanying daily devotional reflection sections.',
    createdDate: 'Sep 10, 2025',
    createdTime: '11:00 AM',
    category: 'Character & Named IP',
  },
  {
    id: 'rel-6',
    sourceAssetId: 'LT-BR-001',
    sourceAsset: 'Lovetoons Official Brand Logo',
    sourceId: 'LT-BR-001',
    sourceIconType: 'logo',
    relationshipType: 'Applied To',
    targetAssetId: 'LT-CP-002',
    targetAsset: 'Zobo Drink (Special Edition)',
    targetId: 'LT-CP-002',
    targetIconType: 'zobo',
    details: 'Master identity stamped on commercial beverage packaging label for retail distribution.',
    createdDate: 'Sep 12, 2025',
    createdTime: '03:45 PM',
    category: 'Brand & Guidelines',
  },
  {
    id: 'rel-7',
    sourceAssetId: 'LT-TS-001',
    sourceAsset: 'Lovetoons TV Series (Season 1)',
    sourceId: 'LT-TS-001',
    sourceIconType: 'tv_series',
    relationshipType: 'Distributed On',
    targetAssetId: 'LT-DGT-001',
    targetAsset: 'Lovetoons TV App',
    targetId: 'LT-DGT-001',
    targetIconType: 'tv_series',
    details: 'Full episodes and seasonal shorts streamed on demand across mobile and OTT devices.',
    createdDate: 'Sep 22, 2025',
    createdTime: '09:00 AM',
    category: 'TV Programme',
  },
  {
    id: 'rel-8',
    sourceAssetId: 'LT-EV-001',
    sourceAsset: 'Lovetoons Bible Reading Fiesta',
    sourceId: 'LT-EV-001',
    sourceIconType: 'event',
    relationshipType: 'Used By',
    targetAssetId: 'LT-MU-002',
    targetAsset: 'Let\'s Read the Bible Song & Audio Track',
    targetId: 'LT-MU-002',
    targetIconType: 'theme_song',
    details: 'Official theme anthem performed live by youth mass choirs at the annual festival opening.',
    createdDate: 'Sep 17, 2025',
    createdTime: '10:30 AM',
    category: 'Outreach & Events',
  },
  {
    id: 'rel-9',
    sourceAssetId: 'LT-CH-001',
    sourceAsset: 'Tick Talks Character (3D Turnaround Rig)',
    sourceId: 'LT-CH-001',
    sourceIconType: 'character_tilly',
    relationshipType: 'Applied To',
    targetAssetId: 'LT-CP-001',
    targetAsset: 'Tick Talks Kids School Bag',
    targetId: 'LT-CP-001',
    targetIconType: 'character_tilly',
    details: 'Underlying mascot design and logo printed as master badge on the school bag.',
    createdDate: 'Sep 18, 2025',
    createdTime: '09:30 AM',
    category: 'Character & Named IP',
  },
  {
    id: 'rel-10',
    sourceAssetId: 'LT-CM-001',
    sourceAsset: 'Lovetoons Comics (Volume 1: The Story of Ibra)',
    sourceId: 'LT-CM-001',
    sourceIconType: 'comics',
    relationshipType: 'Distributed On',
    targetAssetId: 'LT-DGT-003',
    targetAsset: 'Let\'s Read the Bible Website & App',
    targetId: 'LT-DGT-003',
    targetIconType: 'book',
    details: 'Digital comic volume serialized for interactive web readers.',
    createdDate: 'Sep 13, 2025',
    createdTime: '11:00 AM',
    category: 'Publishing / Comics',
  },
]

export const initialApprovals: ApprovalRequest[] = []

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'act-1',
    title: 'Asset governance verified: Rhapsody for Early Readers',
    subtitle: 'Cleared for global broadcast distribution • 100% Compliance Score',
    time: '10 mins ago',
    user: 'Faith Daniel',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    iconType: 'check',
    color: 'bg-emerald-100 text-emerald-700',
    timestamp: Date.now() - 1000 * 60 * 10,
  },
  {
    id: 'act-2',
    title: 'Rights record registered: Lovetoons TV App',
    subtitle: 'Software source code, privacy & OTT streaming rights logged',
    time: '2 hours ago',
    user: 'Emmanuel Vance',
    agency: 'Digital Agency',
    unit: 'Digital Agency',
    iconType: 'shield',
    color: 'bg-purple-100 text-purple-700',
    timestamp: Date.now() - 1000 * 60 * 120,
  },
  {
    id: 'act-3',
    title: 'New asset registered: Lovetoons Bible Reading Fiesta',
    subtitle: 'Outreach event format & live broadcast recordings catalogued',
    time: '5 hours ago',
    user: 'David Kolawole',
    agency: 'Educational Agency',
    unit: 'Educational Agency',
    iconType: 'file',
    color: 'bg-blue-100 text-blue-700',
    timestamp: Date.now() - 1000 * 60 * 300,
  },
  {
    id: 'act-4',
    title: 'Merchandise clearance submitted: Zobo Drink (Special Edition)',
    subtitle: 'Submitted by Pastor Chelsea Kalu for reviewer quality & trademark audit',
    time: '1 day ago',
    user: 'Pastor Chelsea Kalu',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    iconType: 'alert',
    color: 'bg-amber-100 text-amber-700',
    timestamp: Date.now() - 1000 * 60 * 1440,
  },
]

