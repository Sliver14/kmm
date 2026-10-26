import { neon } from '@neondatabase/serverless'
import fs from 'fs'
import bcrypt from 'bcryptjs'

const envContent = fs.readFileSync('.env', 'utf8')
const match = envContent.match(/DATABASE_URL="?([^"\n\r]+)"?/)
const dbUrl = match ? match[1] : null

if (!dbUrl) {
  console.error('No DATABASE_URL found in .env')
  process.exit(1)
}

const sql = neon(dbUrl)

async function hashPwd(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

async function main() {
  console.log('🔄 Initializing Neon Postgres Database Schema...')

  // 1. Create Tables
  await sql`
    CREATE TABLE IF NOT EXISTS ministries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      description TEXT,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `

  await sql`
    CREATE TABLE IF NOT EXISTS agencies (
      id TEXT PRIMARY KEY,
      ministry_id TEXT REFERENCES ministries(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      unit TEXT,
      code TEXT,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      ministry_id TEXT REFERENCES ministries(id) ON DELETE SET NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      role_label TEXT NOT NULL,
      agency TEXT NOT NULL,
      unit TEXT,
      initials TEXT NOT NULL,
      avatar TEXT,
      skills JSONB DEFAULT '[]'::jsonb,
      bio TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `

  await sql`
    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      ministry_id TEXT REFERENCES ministries(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      category_group TEXT,
      subcategory TEXT,
      agency TEXT NOT NULL,
      unit TEXT,
      creator_name TEXT NOT NULL,
      creator_role TEXT NOT NULL,
      creator_skill TEXT,
      contributors JSONB DEFAULT '[]'::jsonb,
      status TEXT NOT NULL,
      created_date TEXT,
      created_time TEXT,
      thumb_type TEXT,
      poster_url TEXT,
      rights_holder TEXT,
      description TEXT,
      tags JSONB DEFAULT '[]'::jsonb,
      attributes JSONB DEFAULT '{}'::jsonb,
      archive_status TEXT DEFAULT 'pending_cloud_storage',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `

  // 2. Enterprise Archive Structure for Asset Files (e.g. video, audio stems, dubs, etc.)
  await sql`
    CREATE TABLE IF NOT EXISTS asset_files (
      id TEXT PRIMARY KEY,
      asset_id TEXT REFERENCES assets(id) ON DELETE CASCADE,
      ministry_id TEXT REFERENCES ministries(id) ON DELETE SET NULL,
      file_name TEXT NOT NULL,
      file_type TEXT NOT NULL, -- 'video_master', 'audio_stem', 'subtitle', 'script_doc', 'trailer', 'dub', 'render_pack'
      mime_type TEXT,
      file_size_bytes BIGINT,
      formatted_size TEXT,
      resolution TEXT, -- '4K UHD', '1080p', 'Audio 24-bit/48kHz'
      duration_seconds INTEGER,
      codec TEXT, -- 'ProRes 422 HQ', 'H.264', 'WAV', 'PDF'
      channels TEXT, -- 'Stereo', '5.1 Surround', '14 Multi-track'
      language TEXT DEFAULT 'English',
      checksum_sha256 TEXT,
      storage_provider TEXT DEFAULT 'pending_secure_cloud', -- 's3', 'r2', 'gcs', 'cloud_vault'
      storage_bucket TEXT,
      storage_path TEXT,
      storage_key TEXT,
      stream_manifest_url TEXT,
      download_url TEXT,
      is_master BOOLEAN DEFAULT false,
      version TEXT DEFAULT 'v1.0',
      status TEXT DEFAULT 'pending_upload', -- 'active', 'archived', 'pending_upload'
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `

  await sql`
    CREATE TABLE IF NOT EXISTS rights_records (
      id TEXT PRIMARY KEY,
      asset_id TEXT REFERENCES assets(id) ON DELETE CASCADE,
      ministry_id TEXT REFERENCES ministries(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      rights_type TEXT DEFAULT '',
      territory TEXT DEFAULT '',
      validity TEXT DEFAULT '',
      status TEXT DEFAULT 'Pending Representative Review',
      governance_score INTEGER DEFAULT 0,
      exclusivity TEXT DEFAULT '',
      licence_type TEXT DEFAULT '',
      royalty_terms TEXT DEFAULT '',
      description TEXT DEFAULT '',
      documents JSONB DEFAULT '[]'::jsonb,
      governance_checks JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `

  await sql`
    CREATE TABLE IF NOT EXISTS approvals (
      id TEXT PRIMARY KEY,
      asset_id TEXT REFERENCES assets(id) ON DELETE CASCADE,
      ministry_id TEXT REFERENCES ministries(id) ON DELETE SET NULL,
      asset_name TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      agency TEXT NOT NULL,
      unit TEXT,
      requester_name TEXT NOT NULL,
      requester_role TEXT NOT NULL,
      requester_skill TEXT,
      reviewer_name TEXT,
      stage TEXT DEFAULT 'Awaiting Representative Clearance & Documentation',
      current_step INTEGER DEFAULT 1,
      total_steps INTEGER DEFAULT 3,
      status TEXT DEFAULT 'Pending',
      priority TEXT DEFAULT 'Medium',
      submitted_date TEXT,
      submitted_time TEXT,
      feedback_notes TEXT,
      history JSONB DEFAULT '[]'::jsonb,
      documents JSONB DEFAULT '[]'::jsonb,
      rights_type TEXT DEFAULT '',
      territory TEXT DEFAULT '',
      term TEXT DEFAULT '',
      exclusivity TEXT DEFAULT '',
      licence_type TEXT DEFAULT '',
      royalty_terms TEXT DEFAULT '',
      description TEXT DEFAULT '',
      governance_score INTEGER DEFAULT 0,
      governance_checks JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `

  await sql`
    CREATE TABLE IF NOT EXISTS relationships (
      id TEXT PRIMARY KEY,
      ministry_id TEXT REFERENCES ministries(id) ON DELETE SET NULL,
      source_id TEXT REFERENCES assets(id) ON DELETE CASCADE,
      source_asset_id TEXT,
      source_asset TEXT NOT NULL,
      source_icon_type TEXT,
      target_id TEXT REFERENCES assets(id) ON DELETE CASCADE,
      target_asset_id TEXT,
      target_asset TEXT NOT NULL,
      target_icon_type TEXT,
      relationship_type TEXT NOT NULL,
      details TEXT,
      category TEXT,
      created_date TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      ministry_id TEXT REFERENCES ministries(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      asset_count INTEGER DEFAULT 0
    );
  `

  await sql`
    CREATE TABLE IF NOT EXISTS subcategories (
      id TEXT PRIMARY KEY,
      category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      code_prefix TEXT NOT NULL
    );
  `

  await sql`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      ministry_id TEXT REFERENCES ministries(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
      time TEXT,
      user_name TEXT,
      agency TEXT,
      type TEXT,
      color TEXT,
      icon TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `

  console.log('✅ Tables created successfully.')

  // 3. Seed Ministry: ONLY KMM
  await sql`
    INSERT INTO ministries (id, name, code, description, status)
    VALUES (
      'min-kmm',
      'Kiddies Media Ministry',
      'KMM',
      'Global intellectual property, broadcast animation, publishing and kids media network.',
      'active'
    )
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
  `
  console.log('✅ Seeded Ministry: Kiddies Media Ministry (KMM).')

  // 4. Seed Agencies for KMM
  const agencies = [
    { id: 'ag-lovetoons', name: 'Lovetoons', unit: 'Lovetoons', code: 'LT', desc: 'Animation, TV, character IP and kids entertainment' },
    { id: 'ag-digital', name: 'Digital Agency', unit: 'Digital Agency', code: 'DA', desc: 'Interactive games, educational mobile apps, and online portals' },
    { id: 'ag-publishing', name: 'Publishing & Literature', unit: 'Publishing', code: 'PUB', desc: 'Comics, devotional books, storybooks, and curriculum' },
    { id: 'ag-music', name: 'Music & Soundtracks', unit: 'Music', code: 'MUS', desc: 'Praise soundtracks, musical albums, voice acting and audio masters' },
    { id: 'ag-events', name: 'Events & Outreach', unit: 'Events', code: 'EVT', desc: 'Stage productions, festival materials, and global live tours' },
  ]

  for (const ag of agencies) {
    await sql`
      INSERT INTO agencies (id, ministry_id, name, unit, code, description)
      VALUES (${ag.id}, 'min-kmm', ${ag.name}, ${ag.unit}, ${ag.code}, ${ag.desc})
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
    `
  }
  console.log('✅ Seeded KMM Agencies.')

  // 5. Seed Users with Bcrypt Hashed Passwords
  const defaultPassword = 'Password2026!'
  const adminPassword = 'SuperAdmin2026!'
  const reviewerPassword = 'Reviewer2026!'

  const hashedDefault = await hashPwd(defaultPassword)
  const hashedAdmin = await hashPwd(adminPassword)
  const hashedReviewer = await hashPwd(reviewerPassword)

  const users = [
    {
      id: 'usr-1',
      email: 'superadmin@kiddiesmedia.org',
      name: 'Super Admin',
      role: 'super_admin',
      roleLabel: 'Super Admin (KMM Network)',
      agency: 'Lovetoons',
      unit: 'Lovetoons',
      initials: 'PCK',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      passwordHash: hashedAdmin,
      skills: JSON.stringify(['admin', 'legal_counsel', 'video_editor']),
      bio: 'Oversees intellectual asset governance, ministry rights registry and final sign-offs across all Kiddies Media Ministries agencies.',
    },
    {
      id: 'usr-2',
      email: 'faith.d@kiddiesmedia.org',
      name: 'Faith Daniel',
      role: 'reviewer',
      roleLabel: 'Content Reviewer & Approver',
      agency: 'Lovetoons',
      unit: 'Lovetoons',
      initials: 'FD',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      passwordHash: hashedReviewer,
      skills: JSON.stringify(['animation', 'video_editor', 'writer']),
      bio: 'Lead reviewer for media compliance, doctrine consistency and broadcast clearances across agencies.',
    },
    {
      id: 'usr-3',
      email: 'david.k@kiddiesmedia.org',
      name: 'David Kolawole',
      role: 'unit_admin',
      roleLabel: 'Lovetoons Agency Admin',
      agency: 'Lovetoons',
      unit: 'Lovetoons',
      initials: 'DK',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      passwordHash: hashedDefault,
      skills: JSON.stringify(['animation', 'video_editor']),
      bio: 'Agency administrator managing animated series production assets, character turnarounds and rights submissions.',
    },
    {
      id: 'usr-4',
      email: 'emmanuel.v@kiddiesmedia.org',
      name: 'Emmanuel Vance',
      role: 'unit_admin',
      roleLabel: 'Digital Agency Admin',
      agency: 'Digital Agency',
      unit: 'Digital Agency',
      initials: 'EV',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      passwordHash: hashedDefault,
      skills: JSON.stringify(['software_developer', 'admin']),
      bio: 'Leads interactive media, mobile applications and cloud platform engineering for Kiddies Media Ministry.',
    },
  ]

  for (const u of users) {
    await sql`
      INSERT INTO users (id, ministry_id, email, password_hash, name, role, role_label, agency, unit, initials, avatar, skills, bio)
      VALUES (${u.id}, 'min-kmm', ${u.email}, ${u.passwordHash}, ${u.name}, ${u.role}, ${u.roleLabel}, ${u.agency}, ${u.unit}, ${u.initials}, ${u.avatar}, ${u.skills}::jsonb, ${u.bio})
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role,
        role_label = EXCLUDED.role_label,
        agency = EXCLUDED.agency,
        unit = EXCLUDED.unit;
    `
  }
  console.log('✅ Seeded Users with bcrypt secure password hashes.')

  // 6. Seed Core Assets for KMM (Documents left blank as requested!)
  const initialAssets = [
    {
      id: 'LT-AP-001',
      name: 'Rhapsody of Realities for Early Readers Animation',
      type: 'Animation',
      category: 'Animated Programme',
      categoryGroup: 'Broadcast & Media',
      subcategory: 'TV Series',
      agency: 'Lovetoons',
      unit: 'Lovetoons',
      creatorName: 'David Kolawole',
      creatorRole: 'Lead 3D Animator & Director',
      creatorSkill: 'animation',
      status: 'Approved',
      createdDate: 'Sep 21, 2025',
      createdTime: '10:30 AM',
      thumbType: 'tv_series',
      posterUrl: '/tv_series_showcase.jpg',
      rightsHolder: 'Lovetoons Media Ltd',
      description: 'Flagship animated daily devotional series bringing scripture truths and inspirational character lessons to young children.',
      tags: JSON.stringify(['Devotional', 'Animation', 'Early Readers', 'Faith']),
      attributes: JSON.stringify({ durationMinutes: 15, episodeCount: 26, resolution: '4K UHD' }),
    },
    {
      id: 'LT-TS-001',
      name: 'Tilly & Friends TV Series',
      type: 'Animation',
      category: 'Television Series',
      categoryGroup: 'Broadcast & Media',
      subcategory: 'Children Animation',
      agency: 'Lovetoons',
      unit: 'Lovetoons',
      creatorName: 'Faith Daniel',
      creatorRole: 'Screenwriter & Showrunner',
      creatorSkill: 'writer',
      status: 'Approved',
      createdDate: 'Sep 20, 2025',
      createdTime: '02:15 PM',
      thumbType: 'tv_series',
      posterUrl: '/tv_series_poster.jpg',
      rightsHolder: 'Lovetoons Media Ltd',
      description: 'Charming 3D animated series following Tilly and her animal companions learning kindness, sharing, and scripture morals.',
      tags: JSON.stringify(['Preschool', 'Moral Education', 'Animation', 'Animals']),
      attributes: JSON.stringify({ durationMinutes: 12, episodeCount: 52, resolution: '4K UHD' }),
    },
    {
      id: 'DA-APP-001',
      name: 'Bible Quest Interactive Kiddies App',
      type: 'Interactive',
      category: 'Digital / Interactive Platform',
      categoryGroup: 'Technology & Gaming',
      subcategory: 'Interactive Games',
      agency: 'Digital Agency',
      unit: 'Digital Agency',
      creatorName: 'Emmanuel Vance',
      creatorRole: 'Digital & Tech Lead',
      creatorSkill: 'software_developer',
      status: 'In Review',
      createdDate: 'Sep 23, 2025',
      createdTime: '11:40 AM',
      thumbType: 'interactive',
      posterUrl: '/placeholder.jpg',
      rightsHolder: 'Kiddies Media Ministry',
      description: 'Gamified interactive scripture adventure featuring quiz battles, 3D animated biblical scenes and rewards for kids.',
      tags: JSON.stringify(['Interactive', 'Mobile Game', 'Bible Quizzes', 'Unity 3D']),
      attributes: JSON.stringify({ platform: 'iOS / Android / Web', engine: 'Unity 2023.2' }),
    },
    {
      id: 'LT-CP-002',
      name: 'Zobo Drink (Special Edition)',
      type: 'Product',
      category: 'Consumer Product / Merchandise',
      categoryGroup: 'Merchandise & Goods',
      subcategory: 'Food & Beverage',
      agency: 'Lovetoons',
      unit: 'Lovetoons',
      creatorName: 'Super Admin',
      creatorRole: 'Super Admin',
      creatorSkill: 'admin',
      status: 'Pending',
      createdDate: 'Sep 24, 2025',
      createdTime: '09:15 AM',
      thumbType: 'product',
      posterUrl: '/placeholder.jpg',
      rightsHolder: 'Lovetoons Media Ltd',
      description: 'Submission for commercial child beverage launch. Formulation lab certificates and packaging designs.',
      tags: JSON.stringify(['Merchandise', 'Beverage', 'Kids Snack', 'Licensed Product']),
      attributes: JSON.stringify({ sku: 'ZB-2025-ED1', volume: '330ml' }),
    },
  ]

  for (const a of initialAssets) {
    await sql`
      INSERT INTO assets (
        id, ministry_id, name, type, category, category_group, subcategory,
        agency, unit, creator_name, creator_role, creator_skill, status,
        created_date, created_time, thumb_type, poster_url, rights_holder,
        description, tags, attributes
      )
      VALUES (
        ${a.id}, 'min-kmm', ${a.name}, ${a.type}, ${a.category}, ${a.categoryGroup}, ${a.subcategory},
        ${a.agency}, ${a.unit}, ${a.creatorName}, ${a.creatorRole}, ${a.creatorSkill}, ${a.status},
        ${a.createdDate}, ${a.createdTime}, ${a.thumbType}, ${a.posterUrl}, ${a.rightsHolder},
        ${a.description}, ${a.tags}::jsonb, ${a.attributes}::jsonb
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        status = EXCLUDED.status,
        description = EXCLUDED.description;
    `
  }
  console.log('✅ Seeded Initial Assets.')

  // 7. Seed Rights Records (NOTE: documents and governance checks left BLANK as requested!)
  const initialRights = [
    {
      id: 'RR-2025-001',
      assetId: 'LT-AP-001',
      name: 'Rhapsody of Realities for Early Readers Animation Rights',
      rightsType: 'Worldwide Master Broadcast & Educational Rights',
      territory: 'Worldwide',
      validity: '2025 - 2035',
      status: 'Pending Representative Review',
      governanceScore: 0,
      exclusivity: 'Exclusive Ministry Retained',
      licenceType: 'Proprietary Broadcast License',
      royaltyTerms: '100% In-House Retained',
      description: 'Awaiting representative to attach chain of title documents and execute doctrinal checklist.',
    },
    {
      id: 'RR-2025-002',
      assetId: 'LT-TS-001',
      name: 'Tilly & Friends TV Series Rights & Syndication',
      rightsType: 'Worldwide Television & VOD Rights',
      territory: 'Worldwide',
      validity: '2025 - 2035',
      status: 'Pending Representative Review',
      governanceScore: 0,
      exclusivity: 'Exclusive Ministry Retained',
      licenceType: 'Proprietary Broadcast License',
      royaltyTerms: '100% In-House Retained',
      description: 'Awaiting representative to upload script clearance certificates and talent releases.',
    },
    {
      id: 'RR-2025-003',
      assetId: 'DA-APP-001',
      name: 'Bible Quest App Store & Interactive Publishing Rights',
      rightsType: 'Global Digital Software Distribution',
      territory: 'Worldwide',
      validity: '2025 - 2030',
      status: 'Pending Representative Review',
      governanceScore: 0,
      exclusivity: 'Exclusive Ministry Retained',
      licenceType: 'Digital App Store License',
      royaltyTerms: '100% In-House Retained',
      description: 'Awaiting representative to upload COPPA compliance and third-party Unity asset licenses.',
    },
    {
      id: 'RR-2025-004',
      assetId: 'LT-CP-002',
      name: 'Zobo Drink Commercial Beverage License',
      rightsType: 'Commercial Merchandise & Beverage Licensing',
      territory: 'West Africa & UK',
      validity: '2025 - 2027',
      status: 'Pending Representative Review',
      governanceScore: 0,
      exclusivity: 'Non-Exclusive Franchise',
      licenceType: 'Commercial Beverage License',
      royaltyTerms: '12% Gross Revenue',
      description: 'Awaiting representative to upload food safety lab certificates and trademark filing.',
    },
  ]

  for (const r of initialRights) {
    await sql`
      INSERT INTO rights_records (
        id, asset_id, ministry_id, name, rights_type, territory, validity,
        status, governance_score, exclusivity, licence_type, royalty_terms,
        description, documents, governance_checks
      )
      VALUES (
        ${r.id}, ${r.assetId}, 'min-kmm', ${r.name}, ${r.rightsType}, ${r.territory}, ${r.validity},
        ${r.status}, ${r.governanceScore}, ${r.exclusivity}, ${r.licenceType}, ${r.royaltyTerms},
        ${r.description}, '[]'::jsonb, '{}'::jsonb
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        rights_type = EXCLUDED.rights_type,
        status = EXCLUDED.status;
    `
  }
  console.log('✅ Seeded Rights Records (documents & governance left BLANK for representative update).')

  // 8. Seed Approvals Queue (NOTE: documents left blank!)
  const initialApprovals = [
    {
      id: 'APP-2025-001',
      assetId: 'LT-CP-002',
      assetName: 'Zobo Drink (Special Edition)',
      category: 'Consumer Product / Merchandise',
      subcategory: 'Food & Beverage',
      agency: 'Lovetoons',
      unit: 'Lovetoons',
      requesterName: 'Super Admin',
      requesterRole: 'Super Admin',
      requesterSkill: 'admin',
      reviewerName: 'Faith Daniel',
      stage: 'Awaiting Representative Food Safety & Trademark Documents',
      currentStep: 1,
      totalSteps: 3,
      status: 'Pending',
      priority: 'High',
      submittedDate: 'Sep 24, 2025',
      submittedTime: '09:15 AM',
      rightsType: 'Commercial Merchandise & Beverage Licensing',
      territory: 'West Africa & United Kingdom',
      term: '2 Years (2025 - 2027)',
      exclusivity: 'Non-Exclusive Franchise',
      licenceType: 'Commercial Beverage License',
      royaltyTerms: '12% Gross Revenue',
      governanceScore: 0,
      description: 'Submission for commercial child beverage launch. Representative will attach lab certificates.',
    },
    {
      id: 'APP-2025-002',
      assetId: 'DA-APP-001',
      assetName: 'Bible Quest Interactive Kiddies App',
      category: 'Digital / Interactive Platform',
      subcategory: 'Interactive Games',
      agency: 'Digital Agency',
      unit: 'Digital Agency',
      requesterName: 'Emmanuel Vance',
      requesterRole: 'Digital & Tech Admin',
      requesterSkill: 'software_developer',
      reviewerName: 'Faith Daniel',
      stage: 'Awaiting Representative COPPA & Narrative Documentation',
      currentStep: 1,
      totalSteps: 3,
      status: 'Pending',
      priority: 'Urgent',
      submittedDate: 'Sep 23, 2025',
      submittedTime: '11:40 AM',
      rightsType: 'Interactive Digital Software Distribution',
      territory: 'Worldwide',
      term: '10 Years',
      exclusivity: 'Exclusive Ministry Software',
      licenceType: 'Proprietary Interactive Game License',
      royaltyTerms: '100% In-House Retained',
      governanceScore: 0,
      description: 'Beta build submission for 3D educational game. Representative will upload child safety certificates.',
    },
  ]

  for (const app of initialApprovals) {
    await sql`
      INSERT INTO approvals (
        id, asset_id, ministry_id, asset_name, category, subcategory, agency, unit,
        requester_name, requester_role, requester_skill, reviewer_name, stage,
        current_step, total_steps, status, priority, submitted_date, submitted_time,
        rights_type, territory, term, exclusivity, licence_type, royalty_terms,
        governance_score, description, documents, governance_checks, history
      )
      VALUES (
        ${app.id}, ${app.assetId}, 'min-kmm', ${app.assetName}, ${app.category}, ${app.subcategory}, ${app.agency}, ${app.unit},
        ${app.requesterName}, ${app.requesterRole}, ${app.requesterSkill}, ${app.reviewerName}, ${app.stage},
        ${app.currentStep}, ${app.totalSteps}, ${app.status}, ${app.priority}, ${app.submittedDate}, ${app.submittedTime},
        ${app.rightsType}, ${app.territory}, ${app.term}, ${app.exclusivity}, ${app.licenceType}, ${app.royaltyTerms},
        ${app.governanceScore}, ${app.description}, '[]'::jsonb, '{}'::jsonb, '[]'::jsonb
      )
      ON CONFLICT (id) DO UPDATE SET
        asset_name = EXCLUDED.asset_name,
        stage = EXCLUDED.stage,
        status = EXCLUDED.status;
    `
  }
  console.log('✅ Seeded Approvals Queue (documents left blank for rep update).')

  console.log('🎉 Neon Database Initialization & Seeding Complete!')
}

main().catch((err) => {
  console.error('Fatal error during DB initialization:', err)
  process.exit(1)
})
