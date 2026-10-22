import { AssetArchive } from '@/types'

export function generateAssetArchive(asset: {
  id: string
  name: string
  category: string
  subcategory?: string
  unit?: string
  version?: string
  attributes?: Record<string, any>
}): AssetArchive {
  const { id, name, category, version = 'v1.0', attributes = {} } = asset

  switch (category) {
    // -------------------------------------------------------------
    // 1. DIGITAL / INTERACTIVE PLATFORMS (Has Repos, Builds & Live URLs)
    // -------------------------------------------------------------
    case 'Digital / Interactive Platform': {
      // Strictly use actual DB attributes; do NOT invent fallback URLs or repos
      const liveUrl = attributes?.liveUrl || (id === 'LT-DGT-001' ? 'https://tv.lovetoons.org/app' : id === 'LT-DGT-002' ? 'https://tv.lovetoons.org' : id === 'LT-DGT-003' ? 'https://learn.lovetoons.tv' : undefined)
      const gitRepo = attributes?.gitRepoUrl || undefined
      const serverHost = attributes?.serverHost || undefined
      const isKnownSeededDemo = id === 'LT-DGT-001' || id === 'LT-DGT-002' || id === 'LT-DGT-003'

      return {
        websiteUrl: liveUrl,
        serverUrl: liveUrl ? `${liveUrl}/api` : undefined,
        serverStatus: liveUrl ? 'Online' : undefined,
        serverRegion: serverHost || 'Cloudflare Edge CDN',
        repositoryUrl: gitRepo,
        repositoryBranch: gitRepo ? `main (${version}-release)` : undefined,
        cloneCommand: gitRepo ? `git clone ${gitRepo}` : undefined,
        documentationUrl: undefined,
        apiEndpoint: undefined,
        appStoreUrl: id === 'LT-DGT-001' ? 'https://apps.apple.com/app/lovetoons-tv/id158930492' : undefined,
        playStoreUrl: id === 'LT-DGT-001' ? 'https://play.google.com/store/apps/details?id=org.lovetoons.tv' : undefined,
        primaryMasterFile: isKnownSeededDemo ? `${id}_Production_Release_Bundle_${version}.zip` : undefined,
        primaryMasterSize: isKnownSeededDemo ? '142 MB' : undefined,
        masterFormat: 'Universal Application Bundle (TypeScript, React & React Native)',
        archiveStorageLocation: 'Lovetoons Cloud Storage (S3: eu-west-1) • Vault: lovetoons-software-masters',
        retentionPolicy: 'Permanent Ministry Heritage Archive (Perpetual Retention)',
        files: isKnownSeededDemo
          ? [
              {
                id: `arch-${id}-01`,
                name: `${id}_Android_Release_${version}.apk`,
                format: 'Android Package (APK)',
                size: '48.5 MB',
                type: 'package',
                updatedDate: 'Sep 22, 2025',
                description: 'Signed Android release binary fetched from Cloud Storage.',
                checksum: 'sha256:7f83b1657ff1...9a4c',
              },
              {
                id: `arch-${id}-02`,
                name: `${id}_iOS_Signed_Bundle_${version}.ipa`,
                format: 'iOS Archive (IPA)',
                size: '64.2 MB',
                type: 'package',
                updatedDate: 'Sep 22, 2025',
                description: 'Apple App Store enterprise signed distribution archive.',
                checksum: 'sha256:3d21a998bc42...1e8f',
              },
              {
                id: `arch-${id}-03`,
                name: `${id}_Source_Code_Archive_${version}.tar.gz`,
                format: 'Git Repository Snapshot',
                size: '32.1 MB',
                type: 'code',
                updatedDate: 'Sep 22, 2025',
                description: 'Full source code tree fetched from repository cloud archive.',
                checksum: 'sha256:e3b0c44298fc...8b44',
              },
            ]
          : [],
      }
    }

    // -------------------------------------------------------------
    // 2. VIDEO / ANIMATION / TV / FILM / DOCUMENTARIES (No Repos)
    // -------------------------------------------------------------
    case 'Animated Programme':
    case 'TV Programme':
    case 'Film / Short Movie':
    case 'Documentary / Video':
      return {
        streamUrl: `https://stream.lovetoons.tv/vod/master/${id}/index.m3u8`,
        serverUrl: 'https://cdn-video.lovetoons.tv/broadcast-masters',
        serverStatus: 'Online',
        serverRegion: 'Global Anycast Video CDN (Edge Acceleration)',
        primaryMasterFile: `${id}_Broadcast_Master_ProRes422HQ_${version}.mov`,
        primaryMasterSize: '48.6 GB',
        masterFormat: 'Apple ProRes 422 HQ (4K UHD 3840x2160 @ 24fps)',
        archiveStorageLocation: 'Lovetoons Cloud Media Storage (S3: eu-west-1) • Vault: lovetoons-broadcast-masters',
        retentionPolicy: 'Permanent Ministry Heritage Archive (Tier 1 Broadcast Master)',
        files: [
          {
            id: `arch-${id}-01`,
            name: `${id}_4K_ProRes422HQ_Master.mov`,
            format: 'Apple ProRes 422 HQ',
            size: '48.6 GB',
            type: 'video',
            updatedDate: 'Sep 21, 2025',
            description: 'Uncompressed broadcast master video with 10-bit color depth and full dynamic range.',
            checksum: 'sha256:8b44c112de90...77ab',
          },
          {
            id: `arch-${id}-02`,
            name: `${id}_MultiTrack_5.1_Audio_Stems.zip`,
            format: '24-bit/48kHz WAV 5.1 Stems',
            size: '4.2 GB',
            type: 'audio',
            updatedDate: 'Sep 21, 2025',
            description: 'Discrete multi-track audio stems: Dialogue, Foley, Music Score, and Sound Effects (DME).',
            checksum: 'sha256:5a9e1441cd88...bb22',
          },
          {
            id: `arch-${id}-03`,
            name: `${id}_Production_Script_and_Storyboards.pdf`,
            format: 'Adobe PDF Production Bible',
            size: '86.4 MB',
            type: 'document',
            updatedDate: 'Sep 20, 2025',
            description: 'Full verified production script, dialogue cue sheets, and approved color storyboard panels.',
            checksum: 'sha256:11bb22cc33dd...44ee',
          },
          {
            id: `arch-${id}-04`,
            name: `${id}_Clean_Textless_Master_Plates.mov`,
            format: 'ProRes 422 HQ Clean Feed',
            size: '22.8 GB',
            type: 'video',
            updatedDate: 'Sep 21, 2025',
            description: 'Clean video rendition without titles or lower-thirds for international localization and foreign dubbing.',
            checksum: 'sha256:fa234190cb87...1210',
          },
        ],
      }

    // -------------------------------------------------------------
    // 3. MUSIC / AUDIO (No Repos)
    // -------------------------------------------------------------
    case 'Music / Audio':
      return {
        streamUrl: `https://music.lovetoons.tv/tracks/${id}/master.m3u8`,
        serverUrl: 'https://audio-cdn.lovetoons.tv/dsp-ingest',
        serverStatus: 'Online',
        serverRegion: 'Global DSP Distribution Ingest Network',
        primaryMasterFile: `${id}_Master_Uncompressed_WAV_24bit_48kHz.wav`,
        primaryMasterSize: '98.5 MB',
        masterFormat: 'WAV Uncompressed (24-bit / 48kHz Stereo Master)',
        archiveStorageLocation: 'Lovetoons Cloud Media Storage • Vault: lovetoons-music-masters',
        retentionPolicy: 'Permanent Ministry Heritage Archive (Master Audio)',
        files: [
          {
            id: `arch-${id}-01`,
            name: `${id}_Master_Recording_24bit_48kHz.wav`,
            format: 'PCM Uncompressed Audio (WAV)',
            size: '98.5 MB',
            type: 'audio',
            updatedDate: 'Sep 20, 2025',
            description: 'Master recording with pristine dynamic headroom ready for international DSP streaming and broadcast.',
            checksum: 'sha256:998877665544...3322',
          },
          {
            id: `arch-${id}-02`,
            name: `${id}_Full_16_Track_Stems_Package.zip`,
            format: 'Studio Multitrack Stems ZIP',
            size: '840 MB',
            type: 'audio',
            updatedDate: 'Sep 20, 2025',
            description: 'Individual stems for Lead Vocals, Backing Kids Choir, Acoustic Guitars, Bass, Brass, Synths, and Drums.',
            checksum: 'sha256:33221100ffed...ccba',
          },
          {
            id: `arch-${id}-03`,
            name: `${id}_Karaoke_and_Instrumental_Master.wav`,
            format: 'WAV Instrumental Master',
            size: '98.5 MB',
            type: 'audio',
            updatedDate: 'Sep 20, 2025',
            description: 'Full backing track without lead vocals for church services, sing-alongs, and children festivals.',
            checksum: 'sha256:aabbccddee00...1122',
          },
          {
            id: `arch-${id}-04`,
            name: `${id}_Sheet_Music_Lead_Sheet_and_Lyrics.pdf`,
            format: 'Score Sheet & Chords PDF',
            size: '6.4 MB',
            type: 'document',
            updatedDate: 'Sep 20, 2025',
            description: 'Piano/vocal chord chart, melody notation, and verified lyric sheet for ministry distribution.',
            checksum: 'sha256:556677889900...aabb',
          },
        ],
      }

    // -------------------------------------------------------------
    // 4. PUBLISHING / BOOKS & COMICS (No Repos)
    // -------------------------------------------------------------
    case 'Publishing / Book':
    case 'Publishing / Comics':
      return {
        serverUrl: 'https://cdn-publishing.lovetoons.tv/digital-prints',
        serverStatus: 'Online',
        serverRegion: 'Lovetoons Cloud Publishing Storage',
        primaryMasterFile: `${id}_Print_Ready_CMYK_300DPI_with_Bleed.pdf`,
        primaryMasterSize: '480 MB',
        masterFormat: 'PDF/X-1a:2001 (Print-Ready CMYK with 3mm Bleed & Crop Marks)',
        archiveStorageLocation: 'Lovetoons Cloud Storage • Vault: lovetoons-publishing-vault',
        retentionPolicy: 'Permanent Ministry Heritage Archive (Print & Digital Master)',
        files: [
          {
            id: `arch-${id}-01`,
            name: `${id}_Print_Ready_CMYK_Bleed.pdf`,
            format: 'Print-Ready PDF/X-1a',
            size: '480 MB',
            type: 'document',
            updatedDate: 'Sep 15, 2025',
            description: 'High-resolution press-ready PDF with embedded fonts, CMYK color profiles, and 3mm trim marks.',
            checksum: 'sha256:ffeeddccbbaa...9988',
          },
          {
            id: `arch-${id}-02`,
            name: `${id}_Enhanced_Interactive_EBook.epub`,
            format: 'Digital E-Book (EPUB3)',
            size: '78.2 MB',
            type: 'document',
            updatedDate: 'Sep 15, 2025',
            description: 'Reflowable and fixed-layout EPUB3 with embedded audio narration and interactive illustration popups.',
            checksum: 'sha256:112233445566...7788',
          },
          {
            id: `arch-${id}-03`,
            name: `${id}_Layered_InDesign_Source_Package.zip`,
            format: 'Adobe InDesign (.INDD) Package',
            size: '1.4 GB',
            type: 'design',
            updatedDate: 'Sep 15, 2025',
            description: 'Complete InDesign project file with linked high-res TIFF artwork, paragraph style sheets, and vector glyphs.',
            checksum: 'sha256:445566778899...0011',
          },
        ],
      }

    // -------------------------------------------------------------
    // 5. CHARACTER / NAMED IP (No Repos)
    // -------------------------------------------------------------
    case 'Character / Named IP':
      return {
        serverUrl: 'https://cdn-assets.lovetoons.tv/3d-rigs',
        serverStatus: 'Online',
        serverRegion: 'Global 3D Asset Cloud Vault',
        primaryMasterFile: `${id}_3D_Character_Rig_Master_Maya_Blender.zip`,
        primaryMasterSize: '740 MB',
        masterFormat: 'Autodesk Maya (.MB) & Blender (.BLEND) with 4K PBR Material Sets',
        archiveStorageLocation: 'Lovetoons Cloud Storage • Vault: lovetoons-character-3d-vault',
        retentionPolicy: 'Permanent Ministry Heritage Archive (3D Character Rig Master)',
        files: [
          {
            id: `arch-${id}-01`,
            name: `${id}_Maya_Blender_Rig_v2.4.zip`,
            format: 'Maya (.MB) & Blender (.BLEND) Rig',
            size: '640 MB',
            type: '3d',
            updatedDate: 'Sep 21, 2025',
            description: 'Full body IK/FK skeletal rig with 52 facial blendshapes and dynamic cloth/hair simulation physics.',
            checksum: 'sha256:223344556677...8899',
          },
          {
            id: `arch-${id}-02`,
            name: `${id}_4K_PBR_Texture_Maps.zip`,
            format: '4K UDIM Textures (TIFF/PNG)',
            size: '1.2 GB',
            type: 'design',
            updatedDate: 'Sep 21, 2025',
            description: 'PBR texture maps: Base Color/Albedo, Normal Map, Roughness, Metallic, Subsurface Scattering, and Ambient Occlusion.',
            checksum: 'sha256:6677889900aa...bbcc',
          },
          {
            id: `arch-${id}-03`,
            name: `${id}_Vector_2D_Character_Bible_and_Turnarounds.ai`,
            format: 'Adobe Illustrator Vector (.AI)',
            size: '185 MB',
            type: 'design',
            updatedDate: 'Sep 20, 2025',
            description: 'Official 2D turnaround views (Front, 3/4, Side, Back), proportion charts, model sheets, and color palette tokens.',
            checksum: 'sha256:bbccddeeff00...1122',
          },
        ],
      }

    // -------------------------------------------------------------
    // 6. CONSUMER PRODUCT / MERCHANDISE (No Repos)
    // -------------------------------------------------------------
    case 'Consumer Product / Merchandise':
      return {
        serverUrl: 'https://supply.lovetoons.tv/products',
        serverStatus: 'Online',
        serverRegion: 'Lovetoons Cloud Merchandise Vault',
        primaryMasterFile: `${id}_Packaging_and_Manufacturing_TechPack.zip`,
        primaryMasterSize: '240 MB',
        masterFormat: 'Vector Die-Cut Packaging Template (.AI / .PDF) & Tech Spec',
        archiveStorageLocation: 'Lovetoons Cloud Storage • Vault: lovetoons-merchandise-vault',
        retentionPolicy: 'Permanent Ministry Heritage Archive (Product Master)',
        files: [
          {
            id: `arch-${id}-01`,
            name: `${id}_DieCut_Packaging_Template.ai`,
            format: 'Vector Packaging Die-Cut (.AI)',
            size: '120 MB',
            type: 'design',
            updatedDate: 'Sep 18, 2025',
            description: 'Factory-ready box/pouch die-cut template with fold lines, glue tabs, barcode placement, and Pantone color specs.',
            checksum: 'sha256:334455667788...9900',
          },
          {
            id: `arch-${id}-02`,
            name: `${id}_Manufacturing_TechPack_Specs.pdf`,
            format: 'Production Specification PDF',
            size: '34.5 MB',
            type: 'document',
            updatedDate: 'Sep 18, 2025',
            description: 'Detailed material specifications, stitching tolerances, Pantone color codes, and factory quality standards.',
            checksum: 'sha256:77889900aabb...ccdd',
          },
          {
            id: `arch-${id}-03`,
            name: `${id}_Food_Safety_and_Lab_Registration_Deed.pdf`,
            format: 'Statutory Safety Certificate',
            size: '8.4 MB',
            type: 'document',
            updatedDate: 'Sep 18, 2025',
            description: 'Official NAFDAC / Food Safety / CE Child Toy safety certification and non-toxic material laboratory clearance.',
            checksum: 'sha256:ccddeeff0011...2233',
          },
        ],
      }

    // -------------------------------------------------------------
    // 7. OUTREACH / EVENT FORMAT (No Repos)
    // -------------------------------------------------------------
    case 'Outreach / Event Format':
      return {
        streamUrl: `https://live.lovetoons.tv/events/${id}/manifest.m3u8`,
        serverUrl: 'https://broadcast-hub.lovetoons.tv',
        serverStatus: 'Online',
        serverRegion: 'Lovetoons Global Event Cloud Storage',
        primaryMasterFile: `${id}_Global_Event_Production_Playbook.pdf`,
        primaryMasterSize: '95 MB',
        masterFormat: 'Complete Event Operations Playbook & Stage Visual Assets',
        archiveStorageLocation: 'Lovetoons Cloud Storage • Vault: lovetoons-events-masters',
        retentionPolicy: 'Permanent Ministry Heritage Archive (Event Format)',
        files: [
          {
            id: `arch-${id}-01`,
            name: `${id}_Event_Production_Playbook_and_RunOfShow.pdf`,
            format: 'Operations Playbook PDF',
            size: '48.2 MB',
            type: 'document',
            updatedDate: 'Sep 17, 2025',
            description: 'Comprehensive operational manual, stage cue sheets, minister coordination guide, and regional hosting blueprint.',
            checksum: 'sha256:445566778899...aabb',
          },
          {
            id: `arch-${id}-02`,
            name: `${id}_8K_Stage_LED_Motion_Graphics.zip`,
            format: 'LED Motion Graphics (ProRes/H.265)',
            size: '14.6 GB',
            type: 'video',
            updatedDate: 'Sep 17, 2025',
            description: 'Ultra-wide format animated stage backdrops, praise countdown loops, and interactive lyric motion backgrounds.',
            checksum: 'sha256:8899aabbccdd...eeff',
          },
        ],
      }

    // -------------------------------------------------------------
    // 8. BRAND & GUIDELINES (No Repos)
    // -------------------------------------------------------------
    case 'Brand & Guidelines':
    default:
      return {
        serverUrl: 'https://cdn-brand.lovetoons.tv',
        serverStatus: 'Online',
        serverRegion: 'Global Identity Asset CDN',
        primaryMasterFile: `${id}_Master_Vector_Brand_Identity_Suite.zip`,
        primaryMasterSize: '180 MB',
        masterFormat: 'Vector Brand Identity Suite (.AI, .EPS, .SVG, .PNG 8K)',
        archiveStorageLocation: 'Lovetoons Cloud Storage • Vault: lovetoons-brand-vault',
        retentionPolicy: 'Permanent Ministry Heritage Archive (Brand Core)',
        files: [
          {
            id: `arch-${id}-01`,
            name: `${id}_Master_Vector_Logos_Suite.zip`,
            format: 'Vector Package (SVG, EPS, AI, PNG)',
            size: '145 MB',
            type: 'design',
            updatedDate: 'Sep 22, 2025',
            description: 'Master vector logo in all variations: Primary Color, Reverse White, Monochrome Dark, Badge Icon, and Horizontal Lockup.',
            checksum: 'sha256:5566778899aa...bbcc',
          },
          {
            id: `arch-${id}-02`,
            name: `${id}_Brand_Identity_and_Governance_Bible_2025.pdf`,
            format: 'Brand Identity Bible PDF',
            size: '92.4 MB',
            type: 'document',
            updatedDate: 'Sep 22, 2025',
            description: 'Complete visual guidelines manual: Logo clearspace, minimum sizing, unacceptable usages, color tokens, and typography.',
            checksum: 'sha256:99aabbccddee...ff00',
          },
          {
            id: `arch-${id}-03`,
            name: `${id}_Official_Ministry_Custom_Fonts.zip`,
            format: 'OpenType / WOFF2 Font Family',
            size: '42.8 MB',
            type: 'package',
            updatedDate: 'Sep 22, 2025',
            description: 'Licensed custom Lovetoons Display, Rounded Headline, and Body typeface files for desktop and web applications.',
            checksum: 'sha256:eef001122334...4556',
          },
        ],
      }
  }
}
