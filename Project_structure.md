.(app)
│   favicon.ico
│   globals.css
│   layout.tsx
│   page.tsx
│   providers.tsx
│   sitemap.ts
│
├───(admin)
│   │   layout.tsx
│   │
│   └───admin
│       │   page.tsx
│       │
│       ├───categories
│       │       page.tsx
│       │
│       ├───dashboard
│       │       page.tsx
│       │
│       ├───media
│       │       page.tsx
│       │
│       ├───posts
│       │   │   page.tsx
│       │   │
│       │   ├───drafts
│       │   │       page.tsx
│       │   │
│       │   ├───new
│       │   │       page.tsx
│       │   │
│       │   └───[id]
│       │       └───edit
│       │               page.tsx
│       │
│       ├───search
│       │       page.tsx
│       │       SearchClient.tsx
│       │
│       ├───tags
│       │       page.tsx
│       │
│       └───users
│           └───page.tsx
├───(auth)
│   │   layout.tsx
│   │
│   └───admin
│       └───login
│               page.tsx
│
├───(public)
│   │   layout.tsx
│   │
│   └───blog
│       │   page.tsx
│       │
│       ├───category
│       │   └───[slug]
│       │           page.tsx
│       │
│       ├───latest
│       │       page.tsx
│       │
│       ├───tag
│       │   └───[slug]
│       │           page.tsx
│       │
│       └───[slug]
│               page.tsx
│
├───api
│   ├───admin
│   │   └───search
│   │           route.ts
│   │
│   ├───auth
│   │   ├───login
│   │   │       route.ts
│   │   │
│   │   ├───logout
│   │   │       route.ts
│   │   │
│   │   └───me
│   │           route.ts
│   │
│   ├───categories
│   │   │   route.ts
│   │   │
│   │   └───[id]
│   │           route.ts
│   │
│   ├───media
│   │   │   route.ts
│   │   │
│   │   ├───upload
│   │   │       route.ts
│   │   │
│   │   └───[id]
│   │           route.ts
│   │
│   ├───posts
│   │   │   route.ts
│   │   │
│   │   ├───latest
│   │   │       route.ts
│   │   │
│   │   └───[id]
│   │       │   route.ts
│   │       │
│   │       ├───publish
│   │       │       route.ts
│   │       │
│   │       └───unpublish
│   │               route.ts
│   │
│   ├───public
│   │   │   route.ts
│   │   │
│   │   ├───categories
│   │   │   │   route.ts
│   │   │   │
│   │   │   └───[slug]
│   │   │       └───posts
│   │   │               route.ts
│   │   │
│   │   ├───posts
│   │   │   │   route.ts
│   │   │   │
│   │   │   └───[slug]
│   │   │           route.ts
│   │   │
│   │   └───tags
│   │       │   route.ts
│   │       │
│   │       └───[slug]
│   │           └───post
│   │                   route.ts
│   │
│   └───tags
│       │   route.ts
│       │
│       └───[id]
│               route.ts
│
├───components
│   ├───admin
│   │   ├───Category
│   │   │       CategoryDialog.tsx
│   │   │
│   │   ├───common
│   │   │       AdminShell.tsx
│   │   │       ConfirmDialouge.tsx
│   │   │       Sidebar.tsx
│   │   │       TipTapEditor.tsx
│   │   │       Topbar.tsx
│   │   │
│   │   ├───media
│   │   │       MediaGrid.tsx
│   │   │       MediaUploader.tsx
│   │   │
│   │   ├───posts
│   │   │       AppFlowEditor.tsx
│   │   │       MediaPickerDialog.tsx
│   │   │       PostForm.tsx
│   │   │
│   │   └───tags
│   │           TagDialog.tsx
│   │
│   ├───blog
│   │       AuthorBox.tsx
│   │       BlogNavbar.tsx
│   │       PostCard.tsx
│   │       PostContent.tsx
│   │       PostGrid.tsx
│   │       PostList.tsx
│   │       PublicFooter.tsx
│   │       PublicNavbar.tsx
│   │       SidebarWidgets.tsx
│   │
│   ├───layout
│   │       ThemeRegistry.tsx
│   │
│   └───ui
├───lib
│   │   guard.ts
│   │   http.ts
│   │   response.ts
│   │
│   ├───auth
│   │       auth.ts
│   │       cookies.ts
│   │       jwt.ts
│   │       middleware.ts
│   │       password.ts
│   │
│   ├───db
│   │       connect.ts
│   │
│   ├───utils
│   │       baseUrl.ts
│   │       blogformat.ts
│   │       seo.ts
│   │       slug.ts
│   │
│   └───validators
│           category.schema.ts
│           post.schema.ts
│           tag.schema.ts
│           user.schema.ts
│
├───models
│       Category.ts
│       Media.ts
│       Post.ts
│       Tag.ts
│       User.ts
│
├───services
│       category.service.ts
│       media.service.ts
│       post.service.ts
│       tag.service.ts
│       user.service.ts
│
└───types
        post.ts


