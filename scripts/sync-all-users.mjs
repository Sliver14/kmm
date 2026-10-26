import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const envContent = fs.readFileSync('.env', 'utf8');
const match = envContent.match(/DATABASE_URL="?([^"\n\r]+)"?/);
const dbUrl = match ? match[1] : null;

if (!dbUrl) {
  console.error('No DATABASE_URL found');
  process.exit(1);
}

const sql = neon(dbUrl);

async function hashPwd(pwd) {
  return bcrypt.hash(pwd, 10);
}

const allUsers = [
  {
    id: 'usr-admin',
    name: 'Super Admin',
    email: 'superadmin@kiddiesmedia.org',
    role: 'super_admin',
    roleLabel: 'Super Admin (KMM Network)',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    initials: 'SA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    pwd: 'SuperAdmin2026!',
    skills: ['admin', 'legal_counsel', 'video_editor'],
    bio: 'Oversees intellectual asset governance, ministry rights registry and final sign-offs across all Kiddies Media Ministries agencies.',
  },
  {
    id: 'usr-1',
    name: 'Pastor Chelsea Kalu',
    email: 'chelsea.kalu@kiddiesmedia.org',
    role: 'super_admin',
    roleLabel: 'Executive Minister & Super Admin',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    initials: 'PCK',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    pwd: 'SuperAdmin2026!',
    skills: ['admin', 'legal_counsel'],
    bio: 'Executive Minister presiding over Kiddies Media Ministries asset portfolio.',
  },
  {
    id: 'usr-2',
    name: 'Faith Daniel',
    email: 'faith.d@kiddiesmedia.org',
    role: 'reviewer',
    roleLabel: 'Content Reviewer & Approver',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    initials: 'FD',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    pwd: 'Reviewer2026!',
    skills: ['animation', 'video_editor', 'writer'],
    bio: 'Lead reviewer for media compliance, doctrine consistency and broadcast clearances.',
  },
  {
    id: 'usr-3',
    name: 'David Kolawole',
    email: 'david.k@kiddiesmedia.org',
    role: 'agency_admin',
    roleLabel: 'Lovetoons Agency Admin',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    initials: 'DK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    pwd: 'Password2026!',
    skills: ['animation', 'video_editor'],
    bio: 'Agency administrator managing animated series production assets.',
  },
  {
    id: 'usr-4',
    name: 'Emmanuel Vance',
    email: 'emmanuel.v@kiddiesmedia.org',
    role: 'agency_admin',
    roleLabel: 'Digital Agency Admin',
    agency: 'Digital Agency',
    unit: 'Digital Agency',
    initials: 'EV',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    pwd: 'Password2026!',
    skills: ['developer', 'designer'],
    bio: 'Leads kiddies digital streaming platform, interactive web games and mobile apps.',
  },
  {
    id: 'usr-5',
    name: 'Samuel Adeleke',
    email: 'samuel.a@kiddiesmedia.org',
    role: 'agency_admin',
    roleLabel: 'Publishing Agency Admin',
    agency: 'Publishing Agency',
    unit: 'Publishing Agency',
    initials: 'SA',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    pwd: 'Password2026!',
    skills: ['writer', 'designer'],
    bio: 'Directs illustrated devotional storybooks, comic magazines and faith literature.',
  },
  {
    id: 'usr-6',
    name: 'Dr. Miriam Peters',
    email: 'miriam.p@kiddiesmedia.org',
    role: 'agency_admin',
    roleLabel: 'Academy Agency Admin',
    agency: 'Academy Agency',
    unit: 'Academy Agency',
    initials: 'MP',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    pwd: 'Password2026!',
    skills: ['writer', 'admin'],
    bio: 'Oversees Kiddies Media Academy creative training programs and masterclasses.',
  },
  {
    id: 'usr-7',
    name: 'Pastor Joshua Davies',
    email: 'joshua.d@kiddiesmedia.org',
    role: 'agency_admin',
    roleLabel: 'Educational Agency Admin',
    agency: 'Educational Agency',
    unit: 'Educational Agency',
    initials: 'JD',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    pwd: 'Password2026!',
    skills: ['writer', 'designer'],
    bio: 'Heads faith-based school outreach curricula and early literacy initiatives.',
  },
  {
    id: 'usr-8',
    name: 'Grace Emmanuel',
    email: 'grace.e@kiddiesmedia.org',
    role: 'agency_admin',
    roleLabel: 'Lovetoons Audio & Music Admin',
    agency: 'Lovetoons',
    unit: 'Lovetoons',
    initials: 'GE',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    pwd: 'Password2026!',
    skills: ['audio_producer'],
    bio: 'Coordinates children music recordings, animated soundtrack stems and audio licensing.',
  },
];

async function sync() {
  console.log('Syncing all users into Neon DB...');
  for (const u of allUsers) {
    const passwordHash = await hashPwd(u.pwd);
    // Use upsert on email
    const existing = await sql`SELECT id FROM users WHERE LOWER(email) = LOWER(${u.email}) LIMIT 1`;
    if (existing.length > 0) {
      await sql`
        UPDATE users SET
          password_hash = ${passwordHash},
          name = ${u.name},
          role = ${u.role},
          role_label = ${u.roleLabel},
          agency = ${u.agency},
          unit = ${u.unit},
          initials = ${u.initials},
          avatar = ${u.avatar}
        WHERE id = ${existing[0].id};
      `;
      console.log(`Updated user: ${u.email} (${u.roleLabel})`);
    } else {
      await sql`
        INSERT INTO users (id, ministry_id, email, password_hash, name, role, role_label, agency, unit, initials, avatar, skills, bio)
        VALUES (${u.id}, 'min-kmm', ${u.email}, ${passwordHash}, ${u.name}, ${u.role}, ${u.roleLabel}, ${u.agency}, ${u.unit}, ${u.initials}, ${u.avatar}, ${JSON.stringify(u.skills)}::jsonb, ${u.bio});
      `;
      console.log(`Inserted user: ${u.email} (${u.roleLabel})`);
    }
  }
  console.log('All users synced successfully!');
}

sync().catch(console.error);
