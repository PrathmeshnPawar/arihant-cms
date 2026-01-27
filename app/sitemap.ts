import { MetadataRoute } from 'next'
import { connectDB } from './lib/db/connect'
import { Post } from '@/app/models/Post'
import { Category } from '@/app/models/Category' // Ensure you have this import

// Use an environment variable for the domain so it works on Vercel automatically
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://arihant-capital-cms.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB()

  // 1. Fetch only PUBLISHED posts
  // We select only what we need to keep the query fast
  const posts = await Post.find({ status: 'published' })
    .select('slug updatedAt seo')
    .lean()

  const postEntries: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    // Use updatedAt, or fall back to current date
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    // If you ever want to prioritize specific posts, you can logic it here
    priority: 0.8,
  }))

  // 2. Fetch Categories (Publicly accessible)
  const categories = await Category.find().select('slug').lean()

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat: any) => ({
    url: `${BASE_URL}/blog/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  // 3. Main Public Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/latest`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
  ]

  return [...staticRoutes, ...postEntries, ...categoryEntries]
}
