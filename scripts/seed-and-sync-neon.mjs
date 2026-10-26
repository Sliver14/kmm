import { neon } from '@neondatabase/serverless'
import fs from 'fs'

const envContent = fs.readFileSync('.env', 'utf8')
const match = envContent.match(/DATABASE_URL="?([^"\n\r]+)"?/)
const dbUrl = match ? match[1] : null

if (!dbUrl) {
  console.error('No DATABASE_URL found in .env')
  process.exit(1)
}

const sql = neon(dbUrl)

async function main() {
  console.log('🔄 Checking & Upgrading Neon DB Schema for Complete Sync...')

  // 1. Upgrade categories table schema
  await sql`
    ALTER TABLE categories
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS subcategories_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS assets_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active',
    ADD COLUMN IF NOT EXISTS icon_type TEXT DEFAULT 'tv',
    ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'bg-[#3b82f6]',
    ADD COLUMN IF NOT EXISTS sub_asset_structure TEXT,
    ADD COLUMN IF NOT EXISTS supports_episodes BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS sub_asset_type TEXT;
  `

  // 2. Upgrade subcategories table schema
  await sql`
    ALTER TABLE subcategories
    ADD COLUMN IF NOT EXISTS parent_category TEXT,
    ADD COLUMN IF NOT EXISTS assets_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active',
    ADD COLUMN IF NOT EXISTS icon_type TEXT DEFAULT 'tv',
    ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'bg-[#3b82f6]',
    ADD COLUMN IF NOT EXISTS code_prefix TEXT DEFAULT '';
  `

  // 3. Upgrade activities table schema
  await sql`
    ALTER TABLE activities
    ADD COLUMN IF NOT EXISTS icon_type TEXT,
    ADD COLUMN IF NOT EXISTS unit TEXT,
    ADD COLUMN IF NOT EXISTS timestamp BIGINT;
  `

  // 4. Upgrade relationships table schema
  await sql`
    ALTER TABLE relationships
    ADD COLUMN IF NOT EXISTS created_time TEXT;
  `

  console.log('✅ Tables altered with missing columns.')

  // Check counts
  const catRows = await sql`SELECT count(*) FROM categories`
  const subRows = await sql`SELECT count(*) FROM subcategories`
  const relRows = await sql`SELECT count(*) FROM relationships`
  const actRows = await sql`SELECT count(*) FROM activities`

  console.log('Current DB Counts:', {
    categories: catRows[0].count,
    subcategories: subRows[0].count,
    relationships: relRows[0].count,
    activities: actRows[0].count,
  })

  // Read initialData from file
  const initialDataRaw = fs.readFileSync('lib/data/initialData.ts', 'utf8')

  // Seed Categories if empty
  if (parseInt(catRows[0].count) === 0) {
    console.log('🌱 Seeding categories...')
    // We can define the 8 categories from initialCategories
    const categoriesToSeed = [
      { id: 'cat-1', name: 'Animated Programme', description: 'Animated series, cartoons, 3D animated episodes and short films', subCount: 3, assetCount: 3, status: 'Active', iconType: 'tv', color: 'bg-[#8b5cf6]', subAssetStructure: 'Product → Episodes', supportsEpisodes: true, subAssetType: 'episodes' },
      { id: 'cat-2', name: 'TV Programme', description: 'Live action children shows, puppets, broadcast series and episodes', subCount: 3, assetCount: 4, status: 'Active', iconType: 'tv', color: 'bg-[#3b82f6]', subAssetStructure: 'Product → Episodes', supportsEpisodes: true, subAssetType: 'episodes' },
      { id: 'cat-3', name: 'Documentary / Video', description: 'Children educational documentaries, health awareness and special features', subCount: 2, assetCount: 2, status: 'Active', iconType: 'bible', color: 'bg-[#0284c7]', subAssetStructure: 'nil', supportsEpisodes: false, subAssetType: 'none' },
      { id: 'cat-4', name: 'Film / Short Movie', description: 'Theatrical kiddies faith films, dramatic narratives and festival shorts', subCount: 2, assetCount: 2, status: 'Active', iconType: 'tv', color: 'bg-[#6366f1]', subAssetStructure: 'nil', supportsEpisodes: false, subAssetType: 'none' },
      { id: 'cat-5', name: 'Digital Platform', description: 'Mobile apps, interactive web apps, learning platforms and OTT streaming portals', subCount: 4, assetCount: 4, status: 'Active', iconType: 'game', color: 'bg-[#10b981]', subAssetStructure: 'Digital / Web', supportsEpisodes: false, subAssetType: 'none' },
      { id: 'cat-6', name: 'Music / Audio Track', description: 'Worship tracks, sing-alongs, nursery rhymes and audio stem multi-tracks', subCount: 3, assetCount: 3, status: 'Active', iconType: 'music', color: 'bg-[#f59e0b]', subAssetStructure: 'Audio Master', supportsEpisodes: false, subAssetType: 'none' },
      { id: 'cat-7', name: 'Publishing / Book', description: 'Storybooks, devotionals, comic books and illustrated activity manuals', subCount: 3, assetCount: 3, status: 'Active', iconType: 'bible', color: 'bg-[#ec4899]', subAssetStructure: 'Publishing Volume', supportsEpisodes: false, subAssetType: 'none' },
      { id: 'cat-8', name: 'Merchandise / Product', description: 'Children branded apparel, school supplies, toys and themed consumer products', subCount: 3, assetCount: 3, status: 'Active', iconType: 'character', color: 'bg-[#f97316]', subAssetStructure: 'SKU / Physical', supportsEpisodes: false, subAssetType: 'none' },
    ]

    for (const c of categoriesToSeed) {
      await sql`
        INSERT INTO categories (
          id, ministry_id, name, description, subcategories_count,
          assets_count, status, icon_type, color, sub_asset_structure,
          supports_episodes, sub_asset_type
        ) VALUES (
          ${c.id}, 'min-kmm', ${c.name}, ${c.description}, ${c.subCount},
          ${c.assetCount}, ${c.status}, ${c.iconType}, ${c.color}, ${c.subAssetStructure},
          ${c.supportsEpisodes}, ${c.subAssetType}
        ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
      `
    }
    console.log('✅ Seeded 8 categories.')
  }

  // Seed Subcategories if empty
  if (parseInt(subRows[0].count) === 0) {
    console.log('🌱 Seeding subcategories...')
    const subcategoriesToSeed = [
      { id: 'sub-1', name: '3D CGI Series', parentCategory: 'Animated Programme', catId: 'cat-1', assetCount: 2, status: 'Active', iconType: 'tv', color: 'bg-[#8b5cf6]', codePrefix: 'ANI-3D' },
      { id: 'sub-2', name: '2D Traditional Cartoon', parentCategory: 'Animated Programme', catId: 'cat-1', assetCount: 1, status: 'Active', iconType: 'tv', color: 'bg-[#8b5cf6]', codePrefix: 'ANI-2D' },
      { id: 'sub-3', name: 'Animated Shorts', parentCategory: 'Animated Programme', catId: 'cat-1', assetCount: 0, status: 'Active', iconType: 'tv', color: 'bg-[#8b5cf6]', codePrefix: 'ANI-SH' },
      { id: 'sub-4', name: 'Puppet & Live Action', parentCategory: 'TV Programme', catId: 'cat-2', assetCount: 2, status: 'Active', iconType: 'tv', color: 'bg-[#3b82f6]', codePrefix: 'TV-PUP' },
      { id: 'sub-5', name: 'Studio Variety Show', parentCategory: 'TV Programme', catId: 'cat-2', assetCount: 1, status: 'Active', iconType: 'tv', color: 'bg-[#3b82f6]', codePrefix: 'TV-VAR' },
      { id: 'sub-6', name: 'Talent & Quiz Broadcast', parentCategory: 'TV Programme', catId: 'cat-2', assetCount: 1, status: 'Active', iconType: 'tv', color: 'bg-[#3b82f6]', codePrefix: 'TV-QZ' },
      { id: 'sub-7', name: 'Bible History Documentary', parentCategory: 'Documentary / Video', catId: 'cat-3', assetCount: 1, status: 'Active', iconType: 'bible', color: 'bg-[#0284c7]', codePrefix: 'DOC-BH' },
      { id: 'sub-8', name: 'Health & Nature Feature', parentCategory: 'Documentary / Video', catId: 'cat-3', assetCount: 1, status: 'Active', iconType: 'bible', color: 'bg-[#0284c7]', codePrefix: 'DOC-HN' },
      { id: 'sub-9', name: 'Theatrical Faith Movie', parentCategory: 'Film / Short Movie', catId: 'cat-4', assetCount: 1, status: 'Active', iconType: 'tv', color: 'bg-[#6366f1]', codePrefix: 'FLM-TH' },
      { id: 'sub-10', name: 'Festival Short Movie', parentCategory: 'Film / Short Movie', catId: 'cat-4', assetCount: 1, status: 'Active', iconType: 'tv', color: 'bg-[#6366f1]', codePrefix: 'FLM-SH' },
      { id: 'sub-11', name: 'Mobile App (iOS/Android)', parentCategory: 'Digital Platform', catId: 'cat-5', assetCount: 2, status: 'Active', iconType: 'game', color: 'bg-[#10b981]', codePrefix: 'DGT-MOB' },
      { id: 'sub-12', name: 'OTT & Web Streaming Portal', parentCategory: 'Digital Platform', catId: 'cat-5', assetCount: 1, status: 'Active', iconType: 'game', color: 'bg-[#10b981]', codePrefix: 'DGT-OTT' },
      { id: 'sub-13', name: 'Interactive Kids Game', parentCategory: 'Digital Platform', catId: 'cat-5', assetCount: 1, status: 'Active', iconType: 'game', color: 'bg-[#10b981]', codePrefix: 'DGT-GAM' },
      { id: 'sub-14', name: 'Theme Song & Sing-Along', parentCategory: 'Music / Audio Track', catId: 'cat-6', assetCount: 2, status: 'Active', iconType: 'music', color: 'bg-[#f59e0b]', codePrefix: 'MUS-THM' },
      { id: 'sub-15', name: 'Nursery Rhyme & Lullaby', parentCategory: 'Music / Audio Track', catId: 'cat-6', assetCount: 1, status: 'Active', iconType: 'music', color: 'bg-[#f59e0b]', codePrefix: 'MUS-RHY' },
      { id: 'sub-16', name: 'Illustrated Devotional', parentCategory: 'Publishing / Book', catId: 'cat-7', assetCount: 1, status: 'Active', iconType: 'bible', color: 'bg-[#ec4899]', codePrefix: 'PUB-DEV' },
      { id: 'sub-17', name: 'Comic Book & Graphic Novel', parentCategory: 'Publishing / Book', catId: 'cat-7', assetCount: 1, status: 'Active', iconType: 'bible', color: 'bg-[#ec4899]', codePrefix: 'PUB-CMC' },
      { id: 'sub-18', name: 'Activity Book & Colouring', parentCategory: 'Publishing / Book', catId: 'cat-7', assetCount: 1, status: 'Active', iconType: 'bible', color: 'bg-[#ec4899]', codePrefix: 'PUB-ACT' },
      { id: 'sub-19', name: 'School Bag & Accessories', parentCategory: 'Merchandise / Product', catId: 'cat-8', assetCount: 1, status: 'Active', iconType: 'character', color: 'bg-[#f97316]', codePrefix: 'MER-BAG' },
      { id: 'sub-20', name: 'Packaged Beverage & Snacks', parentCategory: 'Merchandise / Product', catId: 'cat-8', assetCount: 1, status: 'Active', iconType: 'character', color: 'bg-[#f97316]', codePrefix: 'MER-BEV' },
      { id: 'sub-21', name: 'Plush Mascot Toy', parentCategory: 'Merchandise / Product', catId: 'cat-8', assetCount: 1, status: 'Active', iconType: 'character', color: 'bg-[#f97316]', codePrefix: 'MER-TOY' },
    ]

    for (const s of subcategoriesToSeed) {
      await sql`
        INSERT INTO subcategories (
          id, category_id, parent_category, name, assets_count,
          status, icon_type, color, code_prefix
        ) VALUES (
          ${s.id}, ${s.catId}, ${s.parentCategory}, ${s.name}, ${s.assetCount},
          ${s.status}, ${s.iconType}, ${s.color}, ${s.codePrefix}
        ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
      `
    }
    console.log('✅ Seeded 21 subcategories.')
  }

  // Seed Relationships if empty
  if (parseInt(relRows[0].count) === 0) {
    console.log('🌱 Seeding relationships...')
    const relationshipsToSeed = [
      { id: 'rel-1', sourceId: 'KMP-001', sourceAsset: 'Rhapsody of Realities for Early Readers Animation', sourceIconType: 'tv_series', targetId: 'KMP-004', targetAsset: 'Video Bible Series', targetIconType: 'bible', relType: 'Spin-off From', details: 'Animated devotional teaching spin-off in shared universe.', cat: 'Animated Programme' },
      { id: 'rel-2', sourceId: 'KMP-004', sourceAsset: 'Video Bible Series', sourceIconType: 'bible', targetId: 'KMP-001', targetAsset: 'Rhapsody of Realities for Early Readers Animation', targetIconType: 'tv_series', relType: 'Features In', details: 'Devotional animation adapted into Sunday school curriculum.', cat: 'Animated Programme' },
      { id: 'rel-3', sourceId: 'KMP-006', sourceAsset: 'Animal World', sourceIconType: 'tv_series', targetId: 'KMP-010', targetAsset: 'Lovetoons Short Stories', targetIconType: 'tv_series', relType: 'Shared Broadcast Segment', details: 'Broadcast segment featured in weekly children festival programming.', cat: 'TV Programme' },
      { id: 'rel-4', sourceId: 'KMP-005', sourceAsset: 'Rules of the Game', sourceIconType: 'game', targetId: 'KMP-010', targetAsset: 'Lovetoons Short Stories', targetIconType: 'tv_series', relType: 'Interactive Format', details: 'Quiz and moral gaming format paired with animated shorts.', cat: 'TV Programme' },
    ]

    for (const r of relationshipsToSeed) {
      await sql`
        INSERT INTO relationships (
          id, ministry_id, source_id, source_asset, source_icon_type,
          target_id, target_asset, target_icon_type, relationship_type,
          details, category
        ) VALUES (
          ${r.id}, 'min-kmm', ${r.sourceId}, ${r.sourceAsset}, ${r.sourceIconType},
          ${r.targetId}, ${r.targetAsset}, ${r.targetIconType}, ${r.relType},
          ${r.details}, ${r.cat}
        ) ON CONFLICT (id) DO NOTHING
      `
    }
    console.log('✅ Seeded relationships.')
  }

  // Seed Activities if empty
  if (parseInt(actRows[0].count) === 0) {
    console.log('🌱 Seeding activities...')
    const activitiesToSeed = [
      { id: 'act-1', title: 'Asset governance verified: Rhapsody for Early Readers', subtitle: 'Cleared for global broadcast distribution • 100% Compliance Score', time: '10 mins ago', userName: 'Super Admin', agency: 'Lovetoons', unit: 'Lovetoons', type: 'check', color: 'bg-emerald-100 text-emerald-700', iconType: 'check', timestamp: Date.now() - 600000 },
      { id: 'act-2', title: 'Rights record registered: Video Bible Series', subtitle: 'Global multi-territory digital clearance logged', time: '2 hours ago', userName: 'Super Admin', agency: 'Lovetoons', unit: 'Lovetoons', type: 'shield', color: 'bg-purple-100 text-purple-700', iconType: 'shield', timestamp: Date.now() - 7200000 },
      { id: 'act-3', title: 'New asset registered: Lovetoons Short Stories', subtitle: 'Intake logged under Esteemed Executive Minister (Super Admin)', time: '5 hours ago', userName: 'Super Admin', agency: 'Lovetoons', unit: 'Lovetoons', type: 'file', color: 'bg-blue-100 text-blue-700', iconType: 'file', timestamp: Date.now() - 18000000 },
      { id: 'act-4', title: 'Compliance review completed: Rules of the Game', subtitle: 'Verified safe content rating and educational value', time: '1 day ago', userName: 'Super Admin', agency: 'Lovetoons', unit: 'Lovetoons', type: 'alert', color: 'bg-amber-100 text-amber-700', iconType: 'alert', timestamp: Date.now() - 86400000 },
    ]

    for (const a of activitiesToSeed) {
      await sql`
        INSERT INTO activities (
          id, ministry_id, title, subtitle, time,
          user_name, agency, unit, type, color, icon_type, timestamp
        ) VALUES (
          ${a.id}, 'min-kmm', ${a.title}, ${a.subtitle}, ${a.time},
          ${a.userName}, ${a.agency}, ${a.unit}, ${a.type}, ${a.color},
          ${a.iconType}, ${a.timestamp}
        ) ON CONFLICT (id) DO NOTHING
      `
    }
    console.log('✅ Seeded activities.')
  }

  console.log('✨ All tables in Neon DB are now 100% populated and aligned!')
}

main().catch(console.error)
