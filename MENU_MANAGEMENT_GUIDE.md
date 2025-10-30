# Peacock London Menu Management Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Database Setup](#database-setup)
3. [Managing Menu Items](#managing-menu-items)
4. [Image Management](#image-management)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)

---

## Introduction

Peacock London is a professional restaurant menu website built with:
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Lovable Cloud (Supabase)
- **Features**: Bilingual menu (English/Chinese), search, category filtering, image carousels

This guide will help you manage your menu items, images, and database without technical expertise.

---

## Database Setup

### Accessing the Backend

Your menu data is stored in Lovable Cloud (powered by Supabase). To access it:

1. Open your Lovable project
2. Click on the **Cloud** tab in the top navigation
3. Navigate to **Database** > **Tables** > `menu_items`

### Database Schema

The `menu_items` table contains:

| Column Name | Type | Description | Required |
|------------|------|-------------|----------|
| `id` | UUID | Unique identifier (auto-generated) | Yes |
| `category_en` | Text | Category name in English | Yes |
| `category_cn` | Text | Category name in Chinese | Yes |
| `name_en` | Text | Dish name in English | Yes |
| `name_cn` | Text | Dish name in Chinese | Yes |
| `price` | Decimal | Price in £ (e.g., 10.50) | Yes |
| `ingredients_en` | Text | Ingredients in English | Optional |
| `ingredients_cn` | Text | Ingredients in Chinese | Optional |
| `image_urls` | Text Array | URLs of dish images | Yes |
| `display_order` | Integer | Order to display items (lower = first) | Optional |
| `is_available` | Boolean | Show/hide item (true = visible) | Yes |
| `created_at` | Timestamp | Created date (auto-generated) | Yes |
| `updated_at` | Timestamp | Last update (auto-updated) | Yes |

---

## Managing Menu Items

### Adding a New Menu Item

**Method 1: Using Lovable Cloud UI**

1. Go to **Cloud** > **Database** > `menu_items`
2. Click **Insert row** button
3. Fill in the fields:
   - `category_en`: e.g., "Meat", "Rice", "Vegetables", "Appetizers"
   - `category_cn`: e.g., "肉", "米饭", "蔬菜", "开胃菜"
   - `name_en`: English dish name
   - `name_cn`: Chinese dish name
   - `price`: Numeric value (e.g., 12.50)
   - `ingredients_en`: Description in English
   - `ingredients_cn`: Description in Chinese
   - `image_urls`: Click **Edit** and add image URLs as an array (see [Image Management](#image-management))
   - `display_order`: Number (e.g., 1, 2, 3... lower numbers appear first)
   - `is_available`: `true` (to show) or `false` (to hide)
4. Click **Save**

**Method 2: Using SQL (Advanced)**

If you're comfortable with SQL, you can insert items directly:

```sql
INSERT INTO public.menu_items (
  category_en, 
  category_cn, 
  name_en, 
  name_cn, 
  price, 
  ingredients_en, 
  ingredients_cn, 
  image_urls, 
  display_order
) VALUES (
  'Meat',
  '肉',
  'Kung Pao Chicken',
  '宫保鸡丁',
  13.50,
  'Chicken, peanuts, dried chili peppers, Sichuan peppercorns',
  '鸡肉、花生、干辣椒、花椒',
  ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  8
);
```

### Editing an Existing Item

1. Go to **Cloud** > **Database** > `menu_items`
2. Find the item you want to edit
3. Click on the row to expand it
4. Click **Edit** button
5. Modify the fields you want to change
6. Click **Save**

### Deleting a Menu Item

**Option 1: Hide the item (Recommended)**
- Set `is_available` to `false` - the item will be hidden from the menu but data is preserved

**Option 2: Permanently delete**
1. Go to **Cloud** > **Database** > `menu_items`
2. Find the item
3. Click the **Delete** icon (trash can)
4. Confirm deletion

⚠️ **Warning**: Deletion is permanent and cannot be undone!

### Changing Item Order

The `display_order` field controls the order items appear:
- Lower numbers appear first (e.g., `1` before `10`)
- Edit the `display_order` value for any item to reorder

---

## Image Management

### Image URL Format

Images are stored as an **array of URLs**. Each menu item can have **multiple images** that users can swipe through.

### Where to Host Images

You have several options for hosting images:

#### Option 1: Using Lovable Cloud Storage (Recommended)

1. Go to **Cloud** > **Storage**
2. Create a bucket called `menu-images` (set it to **public**)
3. Upload your images
4. Copy the public URLs
5. Add them to the `image_urls` array

#### Option 2: External Image Hosting

Use services like:
- **Cloudinary**: https://cloudinary.com
- **ImgBB**: https://imgbb.com
- **Imgur**: https://imgur.com
- Your own website's hosting

### Adding Multiple Images

In the `image_urls` field, use this format:

```
["https://example.com/dish1.jpg", "https://example.com/dish2.jpg", "https://example.com/dish3.jpg"]
```

**In the Lovable Cloud UI:**
1. Click **Edit** on the `image_urls` field
2. It will open an array editor
3. Add each URL as a separate item
4. Click **Save**

### Image Best Practices

- **Aspect Ratio**: Use 4:3 ratio images (e.g., 1600x1200, 800x600)
- **File Size**: Keep images under 500KB for fast loading
- **Format**: Use JPG or WebP format
- **Quality**: High resolution but compressed
- **Consistency**: Use similar lighting/style for all dish photos

### Placeholder Images

If you don't have a photo yet, you can use:
```
["/placeholder.svg"]
```

---

## Common Tasks

### Task 1: Add a New Dish with 3 Images

```sql
INSERT INTO public.menu_items (
  category_en, category_cn, name_en, name_cn, 
  price, ingredients_en, ingredients_cn, 
  image_urls, display_order
) VALUES (
  'Vegetables', '蔬菜',
  'Stir-Fried Bok Choy', '清炒小白菜',
  8.50,
  'Baby bok choy, garlic, oyster sauce',
  '小白菜、大蒜、蚝油',
  ARRAY[
    'https://yoursite.com/bokchoy1.jpg',
    'https://yoursite.com/bokchoy2.jpg',
    'https://yoursite.com/bokchoy3.jpg'
  ],
  20
);
```

### Task 2: Update Price for Multiple Items

```sql
UPDATE public.menu_items 
SET price = 14.99 
WHERE category_en = 'Meat' AND price < 15;
```

### Task 3: Hide Items Temporarily

```sql
UPDATE public.menu_items 
SET is_available = false 
WHERE name_en = 'Szechuan Beef';
```

### Task 4: Add a New Category

When adding a new category:
1. Add items with the new category names
2. Update `src/data/menuData.ts` to include the category:

```typescript
export const categories = [
  { en: "All", cn: "全部" },
  { en: "Meat", cn: "肉" },
  { en: "Vegetables", cn: "蔬菜" },
  { en: "Rice", cn: "米饭" },
  { en: "Appetizers", cn: "开胃菜" },
  { en: "Soups", cn: "汤" }, // NEW CATEGORY
];
```

### Task 5: Bulk Import from Excel

If you have an Excel file with menu items:

1. Export your Excel to CSV
2. Go to **Cloud** > **Database** > `menu_items`
3. Use the **Import** feature (if available) or
4. Convert CSV data to SQL INSERT statements using an online converter
5. Run the SQL in the SQL Editor

---

## Troubleshooting

### Images Not Displaying

**Problem**: Images show as broken links

**Solutions**:
1. ✅ Verify the URL is publicly accessible (open in browser)
2. ✅ Check the URL is in the correct array format: `["url1", "url2"]`
3. ✅ Ensure images are HTTPS (not HTTP)
4. ✅ Check if storage bucket is set to **public**

### Items Not Appearing in Menu

**Problem**: Added items don't show up

**Solutions**:
1. ✅ Check `is_available` is set to `true`
2. ✅ Verify category names match existing categories exactly
3. ✅ Clear browser cache and refresh page
4. ✅ Check browser console for errors (F12 key)

### Search Not Finding Items

**Problem**: Search doesn't return expected results

**Solutions**:
1. ✅ Ensure data is saved in both English and Chinese fields
2. ✅ Search is case-insensitive, so spelling must match
3. ✅ Try searching by ingredients as well as dish names

### Database Connection Issues

**Problem**: Menu shows "Loading..." indefinitely

**Solutions**:
1. ✅ Check your internet connection
2. ✅ Verify Lovable Cloud is enabled for the project
3. ✅ Check browser console for specific error messages
4. ✅ Contact Lovable support if issues persist

---

## Quick Reference

### Categories Available
- **Meat** (肉)
- **Vegetables** (蔬菜)
- **Rice** (米饭)
- **Appetizers** (开胃菜)

### Example Complete Item

```sql
INSERT INTO public.menu_items (
  category_en, category_cn,
  name_en, name_cn,
  price,
  ingredients_en, ingredients_cn,
  image_urls,
  display_order,
  is_available
) VALUES (
  'Meat', '肉',
  'Peking Duck', '北京烤鸭',
  28.00,
  'Duck, pancakes, spring onions, hoisin sauce',
  '鸭肉、薄饼、葱、海鲜酱',
  ARRAY[
    'https://images.example.com/peking-duck-1.jpg',
    'https://images.example.com/peking-duck-2.jpg'
  ],
  1,
  true
);
```

---

## Getting Help

If you need assistance:
1. Check this guide first
2. Review the [Lovable Cloud Documentation](https://docs.lovable.dev/features/cloud)
3. Contact your developer or Lovable support
4. Check browser console (F12) for error messages

---

**Last Updated**: 2025
**Version**: 1.0
**Restaurant**: Peacock London (孔雀餐厅)
