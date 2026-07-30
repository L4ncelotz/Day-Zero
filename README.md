# Day Zero: Internship Countdown

A premium, highly-polished countdown application designed to track the remaining days until the end of an internship (October 30, 2026). Built with a focus on Awwwards-style aesthetics, accessibility, and robust edge-caching.

## 🚀 Tech Stack

The project leverages a modern, highly optimized React ecosystem:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with native CSS variables for dynamic theming
- **Animation**: [Framer Motion](https://motion.dev/) (Native CSS 3D Parallax & SVGs)
- **UI Primitives**: [Radix UI](https://www.radix-ui.com/) for accessible, unstyled components (Dialog, Focus Trap)
- **Database / Cache**: [Upstash Redis](https://upstash.com/) for edge-ready key-value storage
- **Validation**: [Zod](https://zod.dev/) for strict runtime type safety

## 🏗️ Architecture & Features

- **Cinematic Native Orbit**: A purely code-driven 3D parallax orbit (using SVG and Framer Motion) that scales visually based on the "urgency" (time remaining) without relying on heavy WebGL or external assets.
- **Smart Edge Caching**: Utilizes Next.js `unstable_cache` and `revalidateTag` to cache the Redis response globally. The cache is immediately invalidated only when an admin updates the schedule, ensuring zero-delay updates with O(1) database hits for public users.
- **Graceful Fallback**: In development (or if Redis is unreachable), the system seamlessly falls back to a locally computed calendar baseline without breaking the public-facing UI.
- **Accessibility First (a11y)**: 
  - Strictly respects `prefers-reduced-motion` at the OS level, instantly halting complex animations and parallax effects without requiring a page reload.
  - Ensures a minimum 44x44px touch target size for all interactive elements.

## 📦 Deployment

This application is built to be deployed on **Vercel** with **Upstash Redis**.

### Prerequisites

You need an Upstash Redis database. Once created, grab the REST URL and Token.

```env
# .env
UPSTASH_REDIS_REST_URL="https://your-upstash-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-secure-token"
ADMIN_PASSWORD_HASH="your-bcrypt-hashed-password"
```

### Vercel Setup

1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Add the three environment variables above in the Vercel Project Settings.
4. Deploy. Vercel will automatically detect Next.js and optimize the build.

> **Security Note**: In production mode, the application will refuse to build or run if the Upstash environment variables are missing, preventing silent failures.

## 🛠️ Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Run the test suite (Vitest):
   ```bash
   npm test
   ```
4. Build for production locally:
   ```bash
   npm run build
   ```
