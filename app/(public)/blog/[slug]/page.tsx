// 1. Move ALL imports to the top
import Link from 'next/link'
import { Box, Typography, Chip, Divider, Paper, Stack } from '@mui/material'
import { formatDate, readingTime } from '../../../lib/utils/blogformat'
import { getBaseUrl } from '@/app/lib/utils/baseUrl'
import type { Metadata } from 'next'
import { resolvePostSEO } from '@/app/lib/utils/seo'
import { connectDB } from '@/app/lib/db/connect'
import { Post } from '@/app/models/Post'
import ShareButtons from '@/app/components/blog/ShareButtons'

// Force models to register
import '@/app/models/Media'
import '@/app/models/Category'
import '@/app/models/Tag'

export const dynamic = 'force-dynamic'

// 2. The getPost function
async function getPost(slug: string) {
  try {
    await connectDB()
    const post = await Post.findOne({ slug, status: 'published' })
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .populate('coverImage', 'url originalName mimeType')
      .populate('gallery', 'url originalName mimeType')
      .populate('seo.ogImage', 'url originalName mimeType')
      .populate('appFlow.media', 'url originalName mimeType')
      .lean()

    if (!post) return null
    return { success: true, data: post }
  } catch (err) {
    console.error('❌ getPost direct DB error:', err)
    return null
  }
}

// 3. Metadata and Page components follow...

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const json = await getPost(slug)

  // 1. Basic fallback if post isn't found
  if (!json?.success) {
    return {
      title: 'Post not found | Arihant CMS',
      robots: { index: false, follow: false },
    }
  }

  const post = json.data
  const baseUrl = await getBaseUrl()
  const canonical = `${baseUrl.replace(/\/$/, '')}/blog/${slug}`

  // 2. USE THE RESOLVER HERE ✅
  // This will trigger your logs and fix the [object Object] date issue
  return resolvePostSEO(post, { canonical })
}
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const json = await getPost(slug)

  if (!json?.success) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={900}>
          Post not found
        </Typography>
      </Box>
    )
  }

  const post = json.data
  const cover = post.coverImage?.url || ''
  const baseUrl = getBaseUrl()
  // This ensures no double slashes regardless of how baseUrl is formatted
  const currentUrl = `${baseUrl.replace(/\/$/, '')}/blog/${slug}`

  return (
    <Box>
      {/* ===== HERO ===== */}
      <Box
        sx={{
          mb: 6,
          borderRadius: 5,
          overflow: 'hidden',
          position: 'relative',
          background: cover
            ? `url(${cover})`
            : 'linear-gradient(135deg, #020617, #0f172a)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: 420,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(2,6,23,.9), rgba(2,6,23,.2))',
          }}
        />

        {/* Hero Content */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            p: { xs: 3, md: 5 },
            maxWidth: 820,
            color: '#fff',
          }}
        >
          <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
            {post.category?.name && (
              <Chip
                label={post.category.name}
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: '#fff',
                  fontWeight: 800,
                }}
              />
            )}
            <Chip
              size="small"
              label={readingTime(post.content || '')}
              sx={{ bgcolor: 'rgba(255,255,255,.15)', color: '#fff' }}
            />
          </Stack>

          <Typography
            variant="h3"
            fontWeight={950}
            sx={{ lineHeight: 1.15, letterSpacing: -0.8, mb: 1 }}
          >
            {post.title}
          </Typography>

          <Typography sx={{ opacity: 0.85 }}>
            {formatDate(post.publishedAt || post.createdAt)}
          </Typography>
        </Box>
      </Box>

      {/* ===== ARTICLE BODY ===== */}
      <Box sx={{ maxWidth: 820, mx: 'auto' }}>
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
            <Typography variant="caption" sx={{ opacity: 0.5 }}>{">"}</Typography>
            
            <Link href="/blog" style={{ textDecoration: 'none', color: 'inherit' }}>Blog</Link>
            <Typography variant="caption" sx={{ opacity: 0.5 }}>{">"}</Typography>

            {post.category?.name && (
              <>
                <Link href={`/blog/category/${post.category.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {post.category.name}
                </Link>
                <Typography variant="caption" sx={{ opacity: 0.5 }}>{">"}</Typography>
              </>
            )}

            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.primary', 
                fontWeight: 600,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {post.title}
            </Typography>
          </Stack>
        </Box>
        {/* ✅ BREADCRUMB MAP END */}
        {/* Tags */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {(post.tags || []).map((t: any) => (
            <Chip
              key={t._id}
              label={t.name}
              size="small"
              component="a"
              href={`/blog/tag/${t.slug}`}
              clickable
            />
          ))}
        </Box>

        {/* Excerpt */}
        {post.excerpt && (
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(180deg, #f8fafc, #ffffff)',
              borderLeft: '4px solid',
              borderColor: 'primary.main',
            }}
          >
            <Typography
              sx={{
                fontSize: 18,
                lineHeight: 1.9,
                color: 'text.secondary',
              }}
            >
              {post.excerpt}
            </Typography>
          </Paper>
        )}

        {/* Content */}
        <Box
          sx={{
            '& p': {
              fontSize: 17,
              lineHeight: 2.05,
              mb: 2.5,
            },
            '& h2': {
              mt: 6,
              mb: 2,
              fontWeight: 900,
              letterSpacing: -0.4,
            },
            '& h3': {
              mt: 4,
              mb: 1.5,
              fontWeight: 900,
            },
            '& ul': { pl: 3, mb: 3 },
            '& li': { mb: 1 },
            '& img': {
              maxWidth: '100%',
              borderRadius: 3,
              my: 3,
              boxShadow: '0 15px 40px rgba(2,6,23,.15)',
            },
            '& blockquote': {
              borderLeft: '4px solid #020617',
              pl: 3,
              py: 1,
              my: 3,
              color: 'text.secondary',
              fontStyle: 'italic',
              backgroundColor: '#f8fafc',
            },
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {/* ✅ PASTE START: MOBILE APP FLOW SECTION */}
        {post.appFlow && post.appFlow.length > 0 && (
          <Box sx={{ mt: 8, mb: 6 }}>
            <Typography variant="h4" fontWeight={950} sx={{ mb: 4, letterSpacing: -0.5 }}>
              Step-by-Step App Guide
            </Typography>
            
            <Stack spacing={4}>
              {post.appFlow.map((step: any, idx: number) => (
                <Paper 
                  key={idx} 
                  elevation={0} 
                  sx={{ 
                    p: { xs: 2, md: 4 }, 
                    borderRadius: 5, 
                    bgcolor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                    alignItems: 'center'
                  }}
                >
                  {/* Step Image (Phone UI look) */}
                  {(step.imageUrl || step.media?.url) && (
                    <Box 
                      component="img"
                      src={step.imageUrl || step.media?.url}
                      alt={step.title}
                      sx={{ 
                        width: { xs: '100%', md: 220 }, 
                        height: 'auto',
                        borderRadius: 4,
                        objectFit: 'cover',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                        border: '4px solid #fff'
                      }}
                    />
                  )}

                  {/* Step Description */}
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="overline" 
                      fontWeight={900} 
                      color="primary.main" 
                      sx={{ display: 'block', mb: 1 }}
                    >
                      Step {idx + 1}
                    </Typography>
                    <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: 16 }}>
                      {step.description}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
        {/* ✅ PASTE END */}
        {/* SHARE FEATURE SECTION */}
        <ShareButtons url={currentUrl} title={post.title} />

        {/* Footer */}
        <Divider sx={{ my: 6 }} />

        <Link href="/blog" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontWeight: 900 }}>← Back to Blog</Typography>
        </Link>
      </Box>
    </Box>
  )
}
