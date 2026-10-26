import { AssetData, AssetStatus, Agency, AssetEpisode } from '@/types'

export interface RawScheduleEntry {
  sn: number
  name: string
  docCategory: string
  docStatus: string
}

export const attorneyGeneralScheduleRaw: RawScheduleEntry[] = [
  { sn: 1, name: 'Rhapsody of Realities for Early Readers Animation', docCategory: 'Animation', docStatus: 'Existing - Active/Current' },
  { sn: 2, name: 'Tick Talks', docCategory: 'Animation', docStatus: 'Existing - Active/Current' },
  { sn: 3, name: 'Kids Sunday School Animation', docCategory: 'Animation', docStatus: 'Existing - Active/Current' },
  { sn: 4, name: 'Video Bible Series', docCategory: 'Animation', docStatus: 'Existing - Active/Current' },
  { sn: 5, name: 'Rules of the Game', docCategory: 'Animation', docStatus: 'Existing - Active/Current' },
  { sn: 6, name: 'Animal World', docCategory: 'Animation', docStatus: 'Existing - Active/Current' },
  { sn: 7, name: 'Talk Time', docCategory: 'Animation', docStatus: 'Existing - Active/Current' },
  { sn: 8, name: 'Find It', docCategory: 'Animation', docStatus: 'Existing - Discontinued' },
  { sn: 9, name: 'Voucher Claim', docCategory: 'Animation', docStatus: 'Existing - Discontinued' },
  { sn: 10, name: 'Lovetoons Short Stories', docCategory: 'Animation', docStatus: 'Existing - Active/Current' },
  { sn: 11, name: 'Great Stories', docCategory: 'Animation', docStatus: 'Existing - Active/Current' },
  { sn: 12, name: 'Stickman', docCategory: 'Animation', docStatus: 'Existing - Active/Current' },
  { sn: 13, name: 'Pastor Chris Teaching Kids', docCategory: 'Animation', docStatus: 'Existing - Discontinued' },
  { sn: 14, name: 'Folk Tales', docCategory: 'Animation', docStatus: 'Existing - Active/Current' },
  { sn: 15, name: 'Timi Talks', docCategory: 'Animation', docStatus: 'Existing – Under Review' },
  { sn: 16, name: 'Bible Documentary', docCategory: 'Animation', docStatus: 'Existing – Under Review' },
  { sn: 17, name: 'Rangers Adventure', docCategory: 'Animation', docStatus: 'Existing - Active/Current' },
  { sn: 18, name: 'Learning with Lilly', docCategory: 'Animation', docStatus: 'Existing – Under Review' },
  { sn: 19, name: 'Boom Balloons', docCategory: 'Animation', docStatus: 'Existing - Discontinued' },
  { sn: 20, name: 'Animated Sing Along', docCategory: 'Animation', docStatus: 'Existing - Active/Current' },
  { sn: 21, name: 'Astrokids', docCategory: 'Animation', docStatus: 'Existing – Under Review' },
  { sn: 22, name: 'Joe Ben and Friends', docCategory: 'Animation', docStatus: 'Existing – Under Review' },
  { sn: 23, name: 'Basic Knowledge', docCategory: 'Animation', docStatus: 'Existing - Active/Current' },
  { sn: 24, name: 'Myth Buster', docCategory: 'Animation', docStatus: 'Existing - Discontinued' },
  { sn: 25, name: 'I Know who I Am Series', docCategory: 'Animation', docStatus: 'Existing - Discontinued' },
  { sn: 26, name: 'Lovetoons Bible Quiz game', docCategory: 'Animation', docStatus: 'Existing - Active/Current' },
  { sn: 27, name: 'Sing Along', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 28, name: 'Gratia’s Diary', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 29, name: 'Kiddies Pray-a-thon', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 30, name: 'Review of Rhapsody of Realities for Early Readers', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 31, name: 'Kids Craft', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 32, name: 'Tami’s Podcast', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 33, name: 'Classic Crusade with Pastor Chris', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 34, name: 'Nugget for excellence with Pastor Chris', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 35, name: 'Affirmations for Kids', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 36, name: 'Story Time', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 37, name: 'Scripture/Word Unscrambled', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 38, name: 'Game Time', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 39, name: 'Faith Proclamation of Healing and Health', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 40, name: 'Know the Scripture', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 41, name: 'Art Class', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 42, name: 'Bible Recital', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 43, name: 'Precious Words', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 44, name: 'Treasure Hunt', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 45, name: 'Let’s Read the Bible TV', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 46, name: 'Healthy Living', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 47, name: 'Bible Facts', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 48, name: 'Le Monde D’Arielle', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 49, name: 'Food for Thoughts', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 50, name: 'Lovetoons Comic Topical', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 51, name: 'Kids’ Corner', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 52, name: 'Knowledge Hub', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 53, name: 'Parent’s Blog', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 54, name: 'Out and About with Trinity', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 55, name: 'Psalm Rendition', docCategory: 'TV Programme / Series', docStatus: 'Existing - Discontinued' },
  { sn: 56, name: 'Career Talks', docCategory: 'TV Programme / Series', docStatus: 'Existing - Discontinued' },
  { sn: 57, name: 'Lovetoons Tidbits', docCategory: 'TV Programme / Series', docStatus: 'Existing - Discontinued' },
  { sn: 58, name: 'Let’s Talk', docCategory: 'TV Programme / Series', docStatus: 'Existing - Discontinued' },
  { sn: 59, name: 'Word Seed', docCategory: 'TV Programme / Series', docStatus: 'Existing - Discontinued' },
  { sn: 60, name: 'Scripture Time', docCategory: 'TV Programme / Series', docStatus: 'Existing - Discontinued' },
  { sn: 61, name: 'General Knowledge Quiz', docCategory: 'TV Programme / Series', docStatus: 'Existing - Discontinued' },
  { sn: 62, name: 'Living with Pearl And Zoe', docCategory: 'TV Programme / Series', docStatus: 'Existing - Discontinued' },
  { sn: 63, name: 'Henry’s Podcast', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 64, name: 'Healing to the Nation', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 65, name: 'Kids Etiquette', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 66, name: 'Lovetoons Comics Review', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 67, name: 'Kids Memory Verse', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 68, name: 'Fashion & Style', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 69, name: 'Spelling Bee', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 70, name: 'Amazing Facts', docCategory: 'TV Programme / Series', docStatus: 'Existing - Discontinued' },
  { sn: 71, name: 'Healing Adventures', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 72, name: 'Jenny’s Podcast', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 73, name: 'Did You Know', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 74, name: 'Derren’s House Rules', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 75, name: 'Kids Hour of Prayer', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 76, name: 'Bible Heroes', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 77, name: 'Andrea’s PodCast', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 78, name: 'Fun Facts', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 79, name: 'Kids Can Farm', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 80, name: 'Animal Kingdom', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 81, name: 'Word of the Month Recap', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 82, name: 'Let’s Read the Bible on Radio', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 83, name: 'Question Kids Ask', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 84, name: 'RORK Time', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 85, name: 'Lovetoons TV News', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 86, name: 'Alphabet and Animal Sound', docCategory: 'TV Programme / Series', docStatus: 'Existing - Active/Current' },
  { sn: 87, name: 'The Deception of Kids Media Industry', docCategory: 'Documentary Video', docStatus: 'Existing - Active' },
  { sn: 88, name: 'Malaria Vaccine short video', docCategory: 'Documentary Video', docStatus: 'Existing - Active' },
  { sn: 89, name: 'Timothia Questions', docCategory: 'Short Movie', docStatus: 'Existing - Active/Current' },
  { sn: 90, name: 'Water In the Desert', docCategory: 'Short Movie', docStatus: 'Existing - Active/Current' },
  { sn: 91, name: 'Tick Talks Bag', docCategory: 'Consumer Product / Merchandise', docStatus: 'Existing - Active/Current' },
  { sn: 92, name: 'T-Shirt for Kids and Adults', docCategory: 'Consumer Product / Merchandise', docStatus: 'Existing - Active/Current' },
  { sn: 93, name: 'Customized Bed Spread', docCategory: 'Consumer Product / Merchandise', docStatus: 'Existing - Active/Current' },
  { sn: 94, name: 'Tote Bag', docCategory: 'Consumer Product / Merchandise', docStatus: 'Existing - Active/Current' },
  { sn: 95, name: 'Lovetoons TV Comics', docCategory: 'Publication / Book', docStatus: 'Existing - Active/Current' },
  { sn: 96, name: 'Special Comics Series', docCategory: 'Publication / Book', docStatus: 'Potential - Yet to Launch' },
  { sn: 97, name: 'Lovetoons TV App', docCategory: 'Digital / Interactive Platform', docStatus: 'Existing - Active/Current' },
  { sn: 98, name: 'Lovetoons TV Website', docCategory: 'Digital / Interactive Platform', docStatus: 'Existing - Active/Current' },
  { sn: 99, name: 'Lovetoons Kiddies', docCategory: 'Digital / Interactive Platform', docStatus: 'Existing - Discontinued' },
  { sn: 100, name: 'Let\'s Read the Bible Website', docCategory: 'Digital / Interactive Platform', docStatus: 'Existing - Active/Current' },
  { sn: 101, name: 'Lovetoons Confession App', docCategory: 'Digital / Interactive Platform', docStatus: 'Potential - Yet to Launch' },
  { sn: 102, name: 'Loveworld Kiddies Network', docCategory: 'Digital / Interactive Platform', docStatus: 'Existing - Discontinued' },
  { sn: 103, name: 'Lovetoons Bible Reading Fiesta', docCategory: 'Outreach / Event Format', docStatus: 'Existing - Active/Current' },
  { sn: 104, name: 'Global Kids Connect with Pastor Chris', docCategory: 'Outreach / Event Format', docStatus: 'Existing - Active/Current' },
  { sn: 105, name: 'Lovetoons Affirmation Extravaganza', docCategory: 'Outreach / Event Format', docStatus: 'Existing - Active/Current' },
  { sn: 106, name: 'Prayer Program', docCategory: 'Outreach / Event Format', docStatus: 'Existing - Active/Current' },
  { sn: 107, name: 'Gratia and Friends Live', docCategory: 'Outreach / Event Format', docStatus: 'Existing - Active/Current' },
  { sn: 108, name: 'Kids Aglow', docCategory: 'Outreach / Event Format', docStatus: 'Existing - Discontinued' },
  { sn: 109, name: 'Tick Talks Character', docCategory: 'Character / Named IP', docStatus: 'Existing - Active/Current' },
  { sn: 110, name: 'Stickman Character', docCategory: 'Character / Named IP', docStatus: 'Existing - Active/Current' },
  { sn: 111, name: 'Voucher Claim Character', docCategory: 'Character / Named IP', docStatus: 'Existing - Active/Current' },
  { sn: 112, name: 'Let\'s Read the Bible Song', docCategory: 'Music / Audio', docStatus: 'Existing - In Use' },
  { sn: 113, name: 'Lovetoons Comics', docCategory: 'Publication / Comics', docStatus: 'Existing - Active/Current' },
  { sn: 114, name: 'LovetoonsTV', docCategory: 'Brand / Broadcast Platform', docStatus: 'Existing - Active/Current' },
  { sn: 115, name: 'Fit Kids', docCategory: 'Audiovisual Programme / Format', docStatus: 'Existing - Discontinued' },
  { sn: 116, name: 'Super Virtues', docCategory: 'Animated Programme / Series', docStatus: 'Existing - Discontinued' },
  { sn: 117, name: 'Spotlight', docCategory: 'Audiovisual Programme / Format', docStatus: 'Existing - Discontinued' },
  { sn: 118, name: 'Coding with Grant', docCategory: 'Audiovisual Programme / Format', docStatus: 'Existing - Discontinued' },
  { sn: 119, name: 'How Well Do You Know The Scriptures', docCategory: 'Audiovisual Programme / Format', docStatus: 'Existing - Discontinued' },
  { sn: 120, name: 'Musical Instruments', docCategory: 'Audiovisual Programme / Format', docStatus: 'Existing - Discontinued' },
  { sn: 121, name: 'Basic Knowledge for Kids', docCategory: 'Animated Programme / Series', docStatus: 'Existing - Discontinued' },
  { sn: 122, name: 'Life & Style with S-Squad', docCategory: 'Audiovisual Programme / Format', docStatus: 'Existing - Discontinued' },
  { sn: 123, name: 'Kids in the Kitchen', docCategory: 'Audiovisual Programme / Format', docStatus: 'Existing - Discontinued' },
  { sn: 124, name: 'Learn a Language', docCategory: 'Audiovisual Programme / Format', docStatus: 'Existing - Discontinued' },
  { sn: 125, name: 'Recipes on the Go', docCategory: 'Audiovisual Programme / Format', docStatus: 'Existing - Discontinued' },
]

export function mapScheduleEntryToAsset(entry: RawScheduleEntry): AssetData {
  const paddedSn = String(entry.sn).padStart(3, '0')
  const id = `KMP-${paddedSn}`

  // 1. Category mapping
  let category = 'TV Programme'
  let categoryGroup = 'Broadcast Series'
  let subcategory = 'Broadcast Series'
  let agency: Agency = 'Lovetoons'
  let type = 'Broadcast Show'
  let thumbType: any = 'tv_series'
  let posterUrl = '/tv_series_poster.jpg'

  const catRaw = entry.docCategory.trim()

  if (catRaw === 'Animation' || catRaw === 'Animated Programme / Series') {
    category = 'Animated Programme'
    categoryGroup = 'Animated Programme'
    subcategory = entry.name.toLowerCase().includes('quiz')
      ? 'Interactive & Games'
      : entry.name.toLowerCase().includes('sing along')
      ? 'Music & Sing-Along'
      : entry.name.toLowerCase().includes('short') || entry.name.toLowerCase().includes('stories')
      ? 'Shorts'
      : 'TV Series'
    agency = 'Lovetoons'
    type = 'Animated Series'
    thumbType = 'tv_series'
    posterUrl = '/tv_series_poster.jpg'
  } else if (catRaw === 'TV Programme / Series' || catRaw === 'Audiovisual Programme / Format') {
    category = 'TV Programme'
    categoryGroup = 'TV Programme'
    subcategory = entry.name.toLowerCase().includes('podcast')
      ? 'Podcasts & Audio Shows'
      : entry.name.toLowerCase().includes('quiz') || entry.name.toLowerCase().includes('game') || entry.name.toLowerCase().includes('unscrambled') || entry.name.toLowerCase().includes('spelling')
      ? 'Quizzes & Games'
      : entry.name.toLowerCase().includes('craft') || entry.name.toLowerCase().includes('art') || entry.name.toLowerCase().includes('etiquette') || entry.name.toLowerCase().includes('coding') || entry.name.toLowerCase().includes('farm') || entry.name.toLowerCase().includes('kitchen') || entry.name.toLowerCase().includes('language')
      ? 'Educational Shows'
      : entry.name.toLowerCase().includes('radio')
      ? 'Radio & Audio Broadcast'
      : 'Broadcast Series'
    agency = 'Lovetoons'
    type = 'TV Programme'
    thumbType = 'tv_series'
    posterUrl = '/tv_series_showcase.jpg'
  } else if (catRaw === 'Documentary Video') {
    category = 'Documentary / Video'
    categoryGroup = 'Documentary / Video'
    subcategory = entry.name.toLowerCase().includes('vaccine') || entry.name.toLowerCase().includes('health')
      ? 'Health Awareness'
      : 'Special Investigative Features'
    agency = 'Lovetoons'
    type = 'Documentary'
    thumbType = 'tv_series'
    posterUrl = '/tv_series_showcase.jpg'
  } else if (catRaw === 'Short Movie') {
    category = 'Film / Short Movie'
    categoryGroup = 'Film / Short Movie'
    subcategory = 'Short Faith Dramas'
    agency = 'Lovetoons'
    type = 'Short Film'
    thumbType = 'tv_series'
    posterUrl = '/tv_series_showcase.jpg'
  } else if (catRaw === 'Consumer Product / Merchandise') {
    category = 'Consumer Product / Merchandise'
    categoryGroup = 'Consumer Product / Merchandise'
    subcategory = entry.name.toLowerCase().includes('bag')
      ? 'School Bags & Gear'
      : entry.name.toLowerCase().includes('bed')
      ? 'Home Goods & Beddings'
      : 'Apparel & Branded Goods'
    agency = 'Lovetoons'
    type = 'Merchandise'
    thumbType = 'product'
    posterUrl = '/merchandise_showcase.jpg'
  } else if (catRaw === 'Publication / Book') {
    category = 'Publishing / Book'
    categoryGroup = 'Publishing / Book'
    subcategory = entry.name.toLowerCase().includes('comic')
      ? 'Comic Magazines'
      : 'Children Storybooks'
    agency = 'Publishing Agency'
    type = 'Publication'
    thumbType = 'book'
    posterUrl = '/books_showcase.jpg'
  } else if (catRaw === 'Publication / Comics') {
    category = 'Publishing / Comics'
    categoryGroup = 'Publishing / Comics'
    subcategory = 'Comic Strips & Graphic Novels'
    agency = 'Publishing Agency'
    type = 'Comics'
    thumbType = 'comics'
    posterUrl = '/comics_showcase.jpg'
  } else if (catRaw === 'Digital / Interactive Platform') {
    category = 'Digital / Interactive Platform'
    categoryGroup = 'Digital / Interactive Platform'
    subcategory = entry.name.toLowerCase().includes('app')
      ? 'Mobile Applications'
      : 'Web Portals & Streaming Platforms'
    agency = 'Digital Agency'
    type = 'Digital Platform'
    thumbType = 'interactive'
    posterUrl = '/interactive_showcase.jpg'
  } else if (catRaw === 'Outreach / Event Format') {
    category = 'Outreach / Event Format'
    categoryGroup = 'Outreach / Event Format'
    subcategory = entry.name.toLowerCase().includes('fiesta')
      ? 'Bible Reading Fiestas'
      : entry.name.toLowerCase().includes('connect') || entry.name.toLowerCase().includes('live')
      ? 'Global Broadcast Rallies'
      : 'Prayer Programs'
    agency = 'Lovetoons'
    type = 'Outreach Event'
    thumbType = 'event'
    posterUrl = '/event_showcase.jpg'
  } else if (catRaw === 'Character / Named IP') {
    category = 'Character / Named IP'
    categoryGroup = 'Character / Named IP'
    subcategory = 'Original IP Characters'
    agency = 'Lovetoons'
    type = 'Character IP'
    thumbType = 'character_tilly'
    posterUrl = '/character_showcase.jpg'
  } else if (catRaw === 'Music / Audio') {
    category = 'Music / Audio'
    categoryGroup = 'Music / Audio'
    subcategory = 'Theme Songs & Sing-Alongs'
    agency = 'Lovetoons'
    type = 'Music / Audio Track'
    thumbType = 'theme_song'
    posterUrl = '/audio_cover.jpg'
  } else if (catRaw === 'Brand / Broadcast Platform') {
    category = 'Brand & Guidelines'
    categoryGroup = 'Brand & Guidelines'
    subcategory = 'Master Broadcast Brand'
    agency = 'Lovetoons'
    type = 'Broadcast Brand'
    thumbType = 'brand_guidelines'
    posterUrl = '/kmm-logo.png'
  }

  // 2. Status mapping strictly based on schedule document: In Production, Discontinued, or Yet to Launch
  let status: AssetStatus = 'In Production'
  const stRaw = entry.docStatus.toLowerCase()

  if (stRaw.includes('discontinued')) {
    status = 'Discontinued'
  } else if (stRaw.includes('yet to launch') || stRaw.includes('potential') || stRaw.includes('under review')) {
    status = 'Yet to Launch'
  } else {
    // Active, Current, In Use
    status = 'In Production'
  }

  // 3. Contributor & Creator Assignment - left empty as requested ("without adding contributor, every other details would be added later")
  const creatorName = ''
  const creatorRole = ''
  const creatorSkill = undefined

  const sampleEpisodes: AssetEpisode[] | undefined =
    entry.sn === 1
      ? [
          {
            id: 'ep-kmp-001-1',
            episodeNumber: 1,
            title: 'The Shield of Faith',
            durationMinutes: 12,
            synopsis: 'Early readers learn how faith quenches every fiery dart through scripture recitation and practical faith application.',
            airDate: 'Jan 20, 2025',
            status: 'Broadcast Ready',
          },
          {
            id: 'ep-kmp-001-2',
            episodeNumber: 2,
            title: 'Walking in Divine Wisdom',
            durationMinutes: 14,
            synopsis: 'Children discover what divine wisdom accomplishes in school, at home, and in daily interactions.',
            airDate: 'Jan 27, 2025',
            status: 'Approved',
          },
          {
            id: 'ep-kmp-001-3',
            episodeNumber: 3,
            title: 'Angels on Assignment',
            durationMinutes: 11,
            synopsis: 'Animated teaching on ministerial angels working on behalf of believers according to Hebrews 1:14.',
            airDate: 'Feb 03, 2025',
            status: 'Mastered',
          },
        ]
      : entry.sn === 2
      ? [
          {
            id: 'ep-kmp-002-1',
            episodeNumber: 1,
            title: 'Tick Goes to Bible Camp',
            durationMinutes: 15,
            synopsis: 'Tick the clock and his friends embark on a weekend adventure uncovering God\'s purpose for time.',
            airDate: 'Jan 18, 2025',
            status: 'Broadcast Ready',
          },
          {
            id: 'ep-kmp-002-2',
            episodeNumber: 2,
            title: 'The Golden Rule in Motion',
            durationMinutes: 13,
            synopsis: 'Teaching kids kindness, sharing, and godly character when faced with challenges in the schoolyard.',
            airDate: 'Jan 25, 2025',
            status: 'Approved',
          },
        ]
      : entry.sn === 4
      ? [
          {
            id: 'ep-kmp-004-1',
            episodeNumber: 1,
            title: 'David and Goliath: Triumph of Faith',
            durationMinutes: 18,
            synopsis: 'Full 3D animated retelling of 1 Samuel 17 showing youth the victory of trusting in the Living God.',
            airDate: 'Feb 01, 2025',
            status: 'Broadcast Ready',
          },
        ]
      : entry.sn === 27
      ? [
          {
            id: 'ep-kmp-027-1',
            episodeNumber: 1,
            title: 'Joyful Praise & Worship',
            durationMinutes: 20,
            synopsis: 'Children lead energetic worship session with uplifting kingdom melodies and scripture choruses.',
            airDate: 'Feb 05, 2025',
            status: 'Broadcast Ready',
          },
          {
            id: 'ep-kmp-027-2',
            episodeNumber: 2,
            title: 'Songs of Victory',
            durationMinutes: 22,
            synopsis: 'Sing-along episode celebrating victory in Christ Jesus with full studio kid choir.',
            airDate: 'Feb 12, 2025',
            status: 'Approved',
          },
        ]
      : entry.sn === 28
      ? [
          {
            id: 'ep-kmp-028-1',
            episodeNumber: 1,
            title: 'First Day of Elementary School',
            durationMinutes: 16,
            synopsis: 'Gratia journals her adventures, trusting the Holy Spirit for peace and excellence on day one.',
            airDate: 'Feb 08, 2025',
            status: 'Broadcast Ready',
          },
        ]
      : undefined

  return {
    id,
    name: entry.name,
    type,
    category,
    categoryGroup,
    subcategory,
    agency,
    unit: agency,
    creatorName,
    creatorRole,
    creatorSkill,
    status,
    createdDate: 'Jan 15, 2025',
    createdTime: '09:00 AM',
    thumbType,
    posterUrl,
    rightsHolder: 'Esteemed Executive Minister (Super Admin)',
    ownerCertificateRef: 'CERT-EXEC-MIN-2026-HQ',
    trademarkStatus: 'Registered',
    distributionLicense: 'Exclusive Ministry Global Distribution',
    productionLicensees: 'Lovetoons Animation Studio, KMM Publishing, LoveWorld Media',
    territoryClearanceStatus: 'Cleared Global',
    contentProvenance: category.toLowerCase().includes('music') || category.toLowerCase().includes('audio')
      ? 'Fully Custom'
      : category.toLowerCase().includes('animated') || category.toLowerCase().includes('programme')
        ? 'AI Assisted'
        : 'Fully Custom',
    songWriter: category.toLowerCase().includes('music') || category.toLowerCase().includes('audio') ? 'KMM Music Ministry (Staff Composer)' : undefined,
    songWriterProvenance: category.toLowerCase().includes('music') || category.toLowerCase().includes('audio') ? 'Fully Custom' : undefined,
    description: `${entry.name} - ${entry.docCategory}. Status: ${status}. Official intellectual asset Schedule Item #${entry.sn} catalogued under Lovetoons / Kiddies Media Ministries.`,
    tags: Array.from(
      new Set(
        [
          `S/N ${entry.sn}`,
          entry.docCategory,
          status,
          category,
        ].filter(Boolean)
      )
    ),
    attributes: {
      scheduleNumber: entry.sn,
      officialStatus: entry.docStatus,
      status,
      attorneyGeneralSchedule: 'Schedule of Existing and Potential Intellectual Assets',
      episodes: sampleEpisodes,
      episodesCount: sampleEpisodes ? sampleEpisodes.length : undefined,
    },
    contributors: [],
  }
}

export const attorneyGeneralAssetsData: AssetData[] = attorneyGeneralScheduleRaw.map(mapScheduleEntryToAsset)
