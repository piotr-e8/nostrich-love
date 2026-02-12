# Nostrich.love

A comprehensive, beginner-friendly web application for learning about the Nostr protocol. Built with Astro 5.x, React, TypeScript, and Tailwind CSS.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Astro-5.x-BC52EE?logo=astro)](https://astro.build)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org)

## 🌟 Features

- **🔐 Interactive Key Generator** - Generate Nostr keys securely in your browser using the Web Crypto API
- **📚 Comprehensive Guides** - Learn Nostr from the ground up with progressive, MDX-based documentation
- **🛠️ Interactive Tools** - Client recommender, NIP-05 checker, relay explorer, and more
- **🎓 Step-by-Step Learning Path** - Beginner to advanced guides with clear progression
- **🔒 Privacy-First** - No tracking, no cookies, no data collection. Privacy-friendly analytics only.
- **🌙 Dark Mode** - Full light/dark theme support with system preference detection
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **⚡ Fast Performance** - Static site generation with Astro for optimal loading speeds
- **🔍 SEO Optimized** - Meta tags, Open Graph, sitemap, and structured data
- **♿ Accessible** - WCAG compliant with keyboard navigation, ARIA labels, and screen reader support

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nostrich-love.git
cd nostrich-love
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:4321`

## 📜 Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build for production (static site)       |
| `npm run preview` | Preview production build locally         |
| `npm run astro`   | Run Astro CLI commands                   |

## 🏗️ Project Structure

```
├── public/                  # Static assets
│   ├── favicon.ico         # Favicon files
│   ├── apple-touch-icon.png
│   ├── og-image.png        # Open Graph image
│   ├── robots.txt          # Search engine directives
│   ├── humans.txt          # Site credits
│   └── site.webmanifest    # PWA manifest
├── src/
│   ├── components/         # React & Astro components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── interactive/   # Interactive React components (tools)
│   │   ├── layout/        # Header, Footer, etc.
│   │   └── SEO.astro      # SEO component
│   ├── config/            # Site configuration
│   │   ├── site.ts        # Site-wide config
│   │   └── seo-types.ts   # SEO TypeScript types
│   ├── content/           # MDX content files
│   │   └── guides/        # Guide documentation
│   ├── layouts/           # Astro layout templates
│   │   └── Layout.astro   # Main page layout
│   ├── pages/             # Astro pages (routes)
│   │   ├── index.astro    # Homepage
│   │   ├── guides/        # Guide pages
│   │   ├── tools.astro    # Interactive tools
│   │   ├── resources.astro
│   │   ├── glossary.astro
│   │   ├── about.astro
│   │   └── 404.astro      # 404 page
│   ├── styles/            # Global styles
│   └── utils/             # Utility functions
├── astro.config.mjs       # Astro configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🛠️ Tech Stack

- **Framework**: [Astro 5.x](https://astro.build) - Static site generator with React islands
- **UI Library**: [React 19](https://react.dev) - Interactive components
- **Styling**: [Tailwind CSS 3.4+](https://tailwindcss.com) - Utility-first CSS
- **Components**: [shadcn/ui](https://ui.shadcn.com) + Custom components
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Smooth animations
- **Icons**: [Lucide React](https://lucide.dev) - Beautiful icons
- **Crypto**: [@noble/secp256k1](https://github.com/paulmillr/noble-secp256k1) - Secure key generation
- **Type Safety**: [TypeScript](https://www.typescriptlang.org) - Type-safe development
- **Content**: [MDX](https://mdxjs.com) - Markdown with JSX
- **Search**: Built-in Pagefind integration
- **SEO**: @astrojs/sitemap for automatic sitemap generation

## 🎨 Color Palette

| Color            | Hex       | Usage                            |
| ---------------- | --------- | -------------------------------- |
| Primary          | `#8B5CF6` | Purple - Buttons, links, accents |
| Secondary        | `#6366F1` | Indigo - Gradients, highlights   |
| Background Light | `#FFFFFF` | Light mode background            |
| Background Dark  | `#0F0A1A` | Dark mode background             |
| Success          | `#22C55E` | Success states, confirmations    |
| Danger           | `#EF4444` | Errors, warnings, critical       |
| Warning          | `#F59E0B` | Caution, notices                 |

## 🔐 Security & Privacy

- **Client-Side Key Generation**: All keys are generated locally in your browser using the Web Crypto API
- **No Data Collection**: We don't store or transmit any user data
- **Privacy-First Analytics**: Uses Cloudflare Web Analytics (no cookies, GDPR compliant)
- **Open Source**: Full transparency - you can audit all code
- **HTTPS Only**: All resources loaded over secure connections

## 📝 Content Management

Guides are written in MDX format in `src/content/guides/`. Each guide should include frontmatter:

```mdx
---
title: "Guide Title"
description: "Brief description for SEO"
estimatedTime: "10 min"
difficulty: "beginner" | "intermediate" | "advanced"
prerequisites: ["optional-guide-id"]
---

# Guide Content

Your markdown content here...
```

## 🌍 SEO & Meta Tags

The site includes comprehensive SEO:

- Dynamic title templates: `Page Title | Nostrich.love`
- Meta descriptions on all pages
- Open Graph tags (og:title, og:description, og:image, og:url)

- Canonical URLs
- Sitemap generation (`/sitemap-index.xml`)
- Robots.txt configuration
- Structured data ready for rich snippets

### Updating SEO

Edit `src/config/site.ts` for site-wide settings:

```typescript
export const siteConfig = {
  name: "Nostrich.love",
  url: "https://nostrich.love",
  // ...
};
```

## 📊 Analytics Setup

The site uses **Cloudflare Web Analytics** (privacy-friendly, no cookies):

1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your site to Cloudflare
3. Enable Web Analytics
4. Copy your analytics token
5. Update `src/config/site.ts`:

```typescript
analytics: {
  cloudflareToken: 'YOUR_ACTUAL_TOKEN',
  enabled: true,
}
```

Alternative: Uncomment the Plausible Analytics script in `src/layouts/Layout.astro`

## 🚀 Deployment

### Static Hosting (Recommended)

Build the site:

```bash
npm run build
```

Deploy the `dist/` folder to:

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [Cloudflare Pages](https://pages.cloudflare.com)
- [GitHub Pages](https://pages.github.com)
- Any static web server

### Environment Variables

Create `.env` file for local development:

```env
# Optional: Override site URL for local testing
PUBLIC_SITE_URL=http://localhost:4321
```

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add TypeScript types for new components
- Test your changes locally with `npm run build`
- Update documentation if needed
- Be respectful and constructive in discussions

### Reporting Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/yourusername/nostrich-love/issues) with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Content is licensed under [Creative Commons CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## 🙏 Acknowledgments

- [fiatjaf](https://github.com/fiatjaf) and all Nostr protocol contributors
- [Nostr Community](https://nostr.com) for feedback and support
- [Astro](https://astro.build) team for the amazing framework
- All open-source contributors who make this possible

## 🔗 Resources

- [Nostr Protocol](https://nostr.com)
- [Nostr GitHub](https://github.com/nostr-protocol/nostr)
- [NIPs (Nostr Implementation Possibilities)](https://github.com/nostr-protocol/nips)
- [Awesome Nostr](https://github.com/aljazceru/awesome-nostr)

## 📬 Contact

- Website: [nostrich.love](https://nostrich.love)
- GitHub: [github.com/yourusername/nostrich-love](https://github.com/yourusername/nostrich-love)
- Nostr: `npub1...` (coming soon)

---

Built with ❤️ for the Nostr community

**Note**: Replace `yourusername` with your actual GitHub username and update contact information before publishing.
