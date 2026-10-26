import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const ministryId = searchParams.get('ministryId') || 'min-kmm'

    const [catRows, subRows] = await Promise.all([
      sql`
        SELECT 
          id, name, description, 
          subcategories_count as "subcategoriesCount",
          assets_count as "assetsCount", 
          status, 
          icon_type as "iconType", 
          color, 
          sub_asset_structure as "subAssetStructure",
          supports_episodes as "supportsEpisodes",
          sub_asset_type as "subAssetType"
        FROM categories
        WHERE ministry_id = ${ministryId}
        ORDER BY id ASC
      `,
      sql`
        SELECT 
          id, 
          category_id as "categoryId",
          parent_category as "parentCategory", 
          name, 
          assets_count as "assetsCount",
          status, 
          icon_type as "iconType", 
          color, 
          code_prefix as "codePrefix"
        FROM subcategories
        ORDER BY id ASC
      `
    ])

    return NextResponse.json({
      success: true,
      categories: catRows,
      subcategories: subRows,
    })
  } catch (error: any) {
    console.error('Error fetching categories from DB:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      type = 'category', // 'category' | 'subcategory'
      name,
      description = '',
      iconType = 'tv',
      color = 'bg-[#3b82f6]',
      parentCategory,
      categoryId,
      subAssetStructure = 'nil',
      supportsEpisodes = false,
      subAssetType = 'none',
      ministryId = 'min-kmm',
    } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (type === 'subcategory') {
      const id = `sub-${Date.now().toString().slice(-6)}`
      await sql`
        INSERT INTO subcategories (
          id, category_id, parent_category, name, assets_count,
          status, icon_type, color, code_prefix
        ) VALUES (
          ${id}, ${categoryId || 'cat-1'}, ${parentCategory || 'General'}, ${name}, 0,
          'Active', ${iconType}, ${color}, ${name.slice(0, 3).toUpperCase()}
        )
      `
      return NextResponse.json({ success: true, message: 'Subcategory created', id })
    } else {
      const id = `cat-${Date.now().toString().slice(-6)}`
      await sql`
        INSERT INTO categories (
          id, ministry_id, name, description, subcategories_count,
          assets_count, status, icon_type, color, sub_asset_structure,
          supports_episodes, sub_asset_type
        ) VALUES (
          ${id}, ${ministryId}, ${name}, ${description}, 0,
          0, 'Active', ${iconType}, ${color}, ${subAssetStructure},
          ${supportsEpisodes}, ${subAssetType}
        )
      `
      return NextResponse.json({ success: true, message: 'Category created', id })
    }
  } catch (error: any) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create category' }, { status: 500 })
  }
}
