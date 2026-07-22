# Loomingo Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15.0-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://gsap.com/)

**Loomingo Frontend** is the modern web application for **Smart Instagram Automation**, digital creator tools, invoice generation, and e-commerce storefronts. Built on **Next.js 16** (App Router) and **React 19**, it combines high-performance server/client rendering with editorial-grade animations, rich interactive micro-apps, and a modular component design system.

---

## 📑 Table of Contents

- [Overview & Key Capabilities](#-overview--key-capabilities)
- [Technology Stack](#-technology-stack)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Environment Variables Setup](#-environment-variables-setup)
- [Getting Started (Local Development)](#-getting-started-local-development)
- [Docker & Containerization](#-docker--containerization)
- [Available Scripts](#-available-scripts)
- [Key Features & Modules Breakdown](#-key-features--modules-breakdown)
- [Contributing & Development Guidelines](#-contributing--development-guidelines)

---

## 🚀 Overview & Key Capabilities

Loomingo bridges **social media automation (AutoDM)** with **creator business workflows** and **storefront management**. The frontend is engineered with an emphasis on visual excellence, responsive design, and smooth scroll-triggered transitions (`GSAP` & `Motion`).

### Core Features:
1. **Smart Instagram Automation (`/autodm`)**
   - Automated direct messaging workflows, trigger setups, and engagement analytics for creators and brands.
2. **Creator Micro-Apps (`/apps/invoice-generator`)**
   - **Full-featured Invoice Generator**: Create professional invoices with customizable creator profiles (`/apps/invoice-generator/creator-details`), invoice history (`/apps/invoice-generator/history`), and real-time live preview scaling (`InvoiceHtmlPreview` & `ScaledInvoicePreview`).
   - Connected directly to dedicated invoice microservices.
3. **E-Commerce & Storefronts (`/store`, `/shop`)**
   - Dynamic product pages (`/shop/[handle]`), curated collections (`/shop/collection`), and checkout management for creator merchandise.
4. **Immersive Marketing & Editorial Experiences (`/`, `/home-page`)**
   - Above-the-fold hero sections (`AgencyHeroSection`), interactive scroll progress indicators, counter-scrolling marquee bands (`MarqueeBand`), editorial ink reveal statements (`StatementDivider`), and interactive FAQ sections.
5. **Backend & Microservice Integrations (`/integration`)**
   - Seamless authentication and data synchronization with Spring Boot backend APIs on Render and external microservices on Vercel.

---

## 🛠 Technology Stack

| Category | Technologies & Libraries |
| :--- | :--- |
| **Core Framework** | [Next.js 16.2.4](https://nextjs.org/) (App Router, Server/Client Components, Standalone build) |
| **UI & State Engine** | [React 19.2.4](https://react.dev/), [React DOM 19.2.4](https://react.dev/) |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/postcss`), Radix UI (`^1.4.3`), [`shadcn/ui`](https://ui.shadcn.com/) (`^4.4.0`), `class-variance-authority`, `clsx`, `tailwind-merge` |
| **Animations & Motion** | [GSAP (`^3.15.0`)](https://gsap.com/) with `@gsap/react`, [Motion (`^12.38.0`)](https://motion.dev/), `tw-animate-css`, `rough-notation` |
| **Data Fetching & Backend** | [SWR (`^2.4.2`)](https://swr.vercel.app/), Firebase SDK (`^12.12.1`) (Auth & Cloud Storage), ImgBB API |
| **Forms & Validation** | [React Hook Form (`^7.81.0`)](https://react-hook-form.com/) with `@hookform/resolvers`, [Zod (`^4.4.3`)](https://zod.dev/) |
| **Media & Image Utilities** | `react-easy-crop`, `browser-image-compression` |
| **Icons & Notifications** | Lucide React (`^1.11.0`), Iconify (`^6.0.2`), Sonner (`^2.0.7`), `next-themes` (`^0.4.6`) |

---

## 📂 Project Architecture & Directory Structure

```text
Loomingo-Frontend/
├── app/                             # Next.js 16 App Router pages & layouts
│   ├── layout.tsx                   # Root layout with ThemeProvider, TransitionProvider & custom fonts
│   ├── page.tsx                     # Main landing page with dynamic GSAP scroll sections & hero
│   ├── fonts.ts                     # Custom font imports (Geist, Inter, Instrument Serif)
│   ├── globals.css                  # Global Tailwind v4 styles and custom utility classes
│   ├── apps/                        # Creator productivity micro-apps
│   │   └── invoice-generator/       # Invoice Generator app (Creator details, history, preview)
│   ├── autodm/                      # Smart Instagram Automation & AutoDM interface
│   ├── home-page/                   # Alternative/extended home page views
│   ├── integration/                 # OAuth & API integration success/callback flows
│   ├── shop/                        # E-commerce storefront ([handle] product pages, collections)
│   ├── store/                       # Creator store management & dashboard
│   ├── about/                       # About us section
│   ├── help/                        # Documentation and help center
│   └── terms/ / privacy-policy/     # Legal documents
├── components/                      # Modular UI & Feature Components
│   ├── features/                    # Feature-specific interactive components
│   ├── forms/                       # Reusable form primitives with React Hook Form & Zod
│   ├── home/                        # Home page specific GSAP fx (scroll-fx, section-reveal)
│   ├── invoice/                     # Invoice preview templates (InvoiceHtmlPreview, ScaledInvoicePreview)
│   ├── layout/                      # Global headers, footers, navigation, theme & transition providers
│   ├── modals/                      # Global dialogs and popups
│   ├── providers/                   # Context providers (TransitionProvider, ThemeProvider)
│   ├── sections/                    # Page section blocks (marketing, process, testimonial, dashboard)
│   ├── shadcn-space/                # Custom block components built on Radix UI & shadcn/ui
│   └── ui/                          # Base atomic UI elements (buttons, inputs, scroll indicators)
├── hooks/                           # Custom React hooks for state, scroll, and responsive logic
├── lib/                             # Core utilities and external service configurations
│   ├── firebase.ts                  # Firebase client SDK initialization & config
│   ├── store.ts                     # Global state & persistence helpers
│   ├── cropImage.ts                 # Image cropping & compression utilities
│   └── utils.ts                     # cn() class name merging & common helpers
├── public/                          # Static assets (icons, manifest.json, images)
├── Dockerfile                       # Multi-stage production container build (deps -> builder -> runner)
├── next.config.ts                   # Next.js configuration (standalone output, headers, image hosts)
├── package.json                     # Project dependencies & script definitions
└── tsconfig.json                    # TypeScript compiler & alias path definitions (`@/*`)
```

---

## 🔑 Environment Variables Setup

Create a `.env.local` file in the root of the project. You can use `.env.example` as a reference template:

```bash
cp .env.example .env.local
```

### Required Variables:

| Variable Name | Description | Example / Note |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Main Loomingo backend URL (Spring Boot API on Render) | `https://loomingo-backend-1.onrender.com` |
| `NEXT_PUBLIC_INVOICE_SERVICE_URL` | Invoice Microservice URL used for PDF/invoice generation | `https://invoice-microservice.vercel.app` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key for client-side authentication | `AIzaSy...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase authentication domain | `your-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project identifier | `your-project-id` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`| Firebase cloud storage bucket URL | `your-project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase application client ID | `1:123456789:web:abcdef` |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB API key for handling direct image uploads | `your_imgbb_api_key` |

---

## 💻 Getting Started (Local Development)

### Prerequisites
- **Node.js**: Version **20.x** or higher recommended.
- **Package Manager**: `npm` (v9+), `yarn`, `pnpm`, or `bun`.

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd Loomingo-Frontend

# Install dependencies using npm
npm install
```

### 2. Configure Environment

Ensure your `.env.local` file is populated with appropriate API endpoints and Firebase credentials (see [Environment Variables Setup](#-environment-variables-setup)).

### 3. Start Development Server

```bash
npm run dev
```

The app will launch on `http://localhost:3000` (listening across `0.0.0.0` by default). Any modifications to `app/` or `components/` will auto-refresh hot-reloaded changes instantly.

---

## 🐳 Docker & Containerization

Loomingo includes a production-ready, multi-stage **Dockerfile** utilizing Next.js's `standalone` output for minimal container image sizes and enhanced security (running under a non-root `nextjs` system user).

### Build & Run Container Locally:

```bash
# 1. Build the Docker image
docker build -t loomingo-frontend:latest .

# 2. Run the container on port 3000
docker run -p 3000:3000 --env-file .env.local loomingo-frontend:latest
```

### Docker Stages:
- **`deps` (`node:20-alpine`)**: Installs dependencies securely handling lockfiles (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`).
- **`builder` (`node:20-alpine`)**: Copies dependencies, disables Next.js telemetry, and compiles production bundles via `npm run build`.
- **`runner` (`node:20-alpine`)**: Strips development artifacts, creates system user (`uid 1001`), copies standalone server assets (`server.js`), and exposes port `3000`.

---

## 📜 Available Scripts

Run any of the following commands using `npm run <script>`:

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `next dev --hostname 0.0.0.0` | Starts the Next.js local development server with hot reloading accessible on LAN. |
| `build` | `next build` | Creates an optimized production build, generating client and standalone server bundles. |
| `start` | `next start` | Runs the compiled production application server (requires running `build` first). |
| `lint` | `eslint` | Runs ESLint checks across TypeScript and JSX/TSX files to ensure code quality. |

---

## 🎯 Key Features & Modules Breakdown

### 1. Dynamic Scroll & Animation System (`/components/home/home-scroll-fx.tsx`)
- **`ScrollProgressBar`**: Tracks page reading progress using GSAP `ScrollTrigger` and updates the top navigation indicator smoothly.
- **`MarqueeBand`**: Creates a tilted, counter-scrolling infinite text band that bridges the hero banner into detailed marketing sections.
- **`StatementDivider`**: Editorial word-by-word ink-reveal statement powered by scroll position combined with animated count-up statistics.
- **`SectionReveal`**: Sticky-pinned viewport reveal wrappers that manage performance and visual hierarchy.

### 2. Invoice Generator Suite (`/app/apps/invoice-generator`)
- **Customizable Creator Details**: Manage branding, billing details, payment methods, and tax settings (`/creator-details`).
- **Live Preview & Scaling**: `InvoiceHtmlPreview` renders pixel-perfect print-ready invoices, while `ScaledInvoicePreview` dynamically fits previews across different device viewports.
- **Invoice History**: Local and cloud-backed tracking of previously issued client invoices (`/history`).

### 3. Font & Typography System (`/app/fonts.ts` & `layout.tsx`)
- Integrates Google Fonts (`Inter`, `Geist`, `Geist_Mono`) along with custom serif typography (`Instrument Serif`) to deliver an editorial aesthetic.

---

## 🤝 Contributing & Development Guidelines

1. **Component Modularity**: Keep components focused. Place reusable shadcn/ui components inside `components/ui/` or `components/shadcn-space/` and feature blocks inside `components/sections/`.
2. **Styling Consistency**: Use utility classes via Tailwind CSS v4 and merge conditional class names using the `cn()` helper function (`@/lib/utils`).
3. **State Management**: Prefer server components where feasible. For client components requiring remote fetching, leverage **SWR** (`useSWR`) for caching and revalidation.
4. **Form Handling**: Use **React Hook Form** paired with **Zod** schema validation for all user inputs and multi-step workflows.
5. **Code Review**: Ensure `npm run lint` and `npm run build` pass cleanly prior to submitting pull requests.

---

## 📄 License

This project is proprietary and confidential. All rights reserved by **Loomingo**.
