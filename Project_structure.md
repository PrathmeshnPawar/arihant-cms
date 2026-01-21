my-cms-blog/
├── src/
│   ├── app/
│   │   ├── (public)/                      # Public website routes
│   │   │   ├── page.tsx                   # Home
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx               # Blog list
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx           # Single post
│   │   │   │   ├── category/
│   │   │   │   │   └── [slug]/page.tsx
│   │   │   │   ├── tag/
│   │   │   │   │   └── [slug]/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── layout.tsx                 # Public layout (Header/Footer)
│   │   │
│   │   ├── (admin)/                       # Admin CMS routes
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx               # Dashboard
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── posts/
│   │   │   │   │   ├── page.tsx           # Posts list
│   │   │   │   │   ├── new/page.tsx       # Create post
│   │   │   │   │   └── [id]/edit/page.tsx # Edit post
│   │   │   │   ├── categories/page.tsx
│   │   │   │   ├── tags/page.tsx
│   │   │   │   ├── users/page.tsx
│   │   │   │   ├── media/page.tsx         # Media uploader/library
│   │   │   │   ├── settings/page.tsx      # Website settings (SEO etc.)
│   │   │   │   └── layout.tsx             # Admin layout (Sidebar)
│   │   │
│   │   ├── api/                           # Next.js route handlers (API)
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   └── refresh/route.ts
│   │   │   ├── posts/
│   │   │   │   ├── route.ts               # GET posts, POST post
│   │   │   │   └── [id]/route.ts          # GET/PUT/DELETE post
│   │   │   ├── categories/route.ts
│   │   │   ├── tags/route.ts
│   │   │   ├── users/route.ts
│   │   │   ├── media/
│   │   │   │   └── upload/route.ts
│   │   │   └── settings/route.ts
│   │   │
│   │   ├── sitemap.ts                     # SEO: sitemap
│   │   ├── robots.ts                      # SEO: robots.txt
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                            # shadcn/MUI wrappers
│   │   ├── layout/
│   │   │   ├── PublicHeader.tsx
│   │   │   ├── PublicFooter.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── AdminTopbar.tsx
│   │   ├── blog/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostGrid.tsx
│   │   │   ├── PostContent.tsx
│   │   │   └── AuthorBox.tsx
│   │   └── admin/
│   │       ├── PostEditor.tsx             # rich text editor component
│   │       ├── PostTable.tsx
│   │       ├── MediaUploader.tsx
│   │       └── SettingsForm.tsx
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── connect.ts                 # DB connection
│   │   │   └── migrations/                # optional
│   │   ├── auth/
│   │   │   ├── auth.ts                    # session/auth logic
│   │   │   ├── jwt.ts
│   │   │   └── middleware.ts
│   │   ├── validators/
│   │   │   ├── post.schema.ts             # zod validations
│   │   │   ├── user.schema.ts
│   │   │   └── settings.schema.ts
│   │   ├── utils/
│   │   │   ├── slug.ts
│   │   │   ├── seo.ts
│   │   │   └── date.ts
│   │   └── constants.ts
│   │
│   ├── services/
│   │   ├── post.service.ts                # business logic
│   │   ├── category.service.ts
│   │   ├── tag.service.ts
│   │   ├── user.service.ts
│   │   └── media.service.ts
│   │
│   ├── models/                            # DB Models (Prisma/Mongoose/etc.)
│   │   ├── Post.ts
│   │   ├── Category.ts
│   │   ├── Tag.ts
│   │   ├── User.ts
│   │   └── Settings.ts
│   │
│   ├── types/
│   │   ├── post.ts
│   │   ├── user.ts
│   │   └── common.ts
│   │
│   └── middleware.ts                      # Next middleware (auth + route protection)
│
├── public/
│   ├── images/
│   ├── uploads/                           # if local media storage
│   └── favicon.ico
│
├── prisma/                                # only if using Prisma
│   ├── schema.prisma
│   └── seed.ts
│
├── .env.local
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
