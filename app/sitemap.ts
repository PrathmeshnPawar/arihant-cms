import 'server-only'
import { MetadataRoute } from 'next'
import { connectDB } from './lib/db/connect'
import { Post } from '@/app/models/Post'
import { Category } from '@/app/models/Category'

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://arihant-capital-cms.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB()

  // Published posts
  const posts = await Post.find({ status: 'published' })
    .select('slug updatedAt')
    .lean()

  const postEntries: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Categories
  const categories = await Category.find().select('slug').lean()

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat: any) => ({
    url: `${BASE_URL}/blog/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  // Static pages
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
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  return [...staticRoutes, ...postEntries, ...categoryEntries]
}
