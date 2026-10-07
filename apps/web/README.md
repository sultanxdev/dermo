# Dermo.ai — Web Application & Clinic Portal

<div align="center">

[![Dermo.ai Hero Preview](../../docs/hero.png)](https://github.com/sultanxdev/dermo)

### **Modern Next.js 15 Web Experience for Dermo.ai**
*High-conversion marketing site, interactive live WhatsApp simulation, and clinic staff management dashboard.*

---

[![Next.js 15](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-Secure_Sessions-blueviolet?style=for-the-badge)](https://better-auth.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Design_Tokens-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 🌟 Overview

The `apps/web` workspace is the front-facing customer and staff interface for **Dermo.ai**. Built with **Next.js 15 App Router** and **React 19**, it incorporates a luxury healthcare brand design system, interactive micro-simulations, and staff management portals.

### Key Highlights:
1. **Interactive iPhone 16 Pro WhatsApp Simulator**: A photorealistic, interactive iPhone demonstration showing patients in real-time how Dermo answers pricing queries, checks doctor availability, reserves slots, and generates UPI deposit requests.
2. **Route Groups Architecture**: Clean isolation between `(marketing)` public pages and `(auth)` clinic staff authentication.
3. **Design System & Centralized Brand Tokens**: Defined in `@/config/brand.ts` featuring tailored clinical luxury colors:
   - Primary: `#553E53` (Deep Mulberry)
   - Background: `#F5F6F0` (Soft Cream White)
   - Secondary: `#B6CBDE` (Air Blue)
   - Accent: `#4B624A` (Sage Forest Green)
   - Font: `Manrope`
4. **Better Auth Authentication**: Server-side cookie sessions with credential sign-in, signup validation, and Google/GitHub OAuth integrations.

---

## 📂 Architecture & Directory Structure

```text
apps/web/
├── public/
│   ├── favicon.svg               # Vector brandmark favicon
│   ├── logo.svg                  # High-resolution clinic logo
│   └── hero.png                  # Marketing preview assets
│
└── src/
    ├── app/
    │   ├── (marketing)/          # Public marketing & conversion pages
    │   │   ├── page.tsx          # Landing page with interactive hero
    │   │   ├── features/         # Deep dive into AI & RAG capabilities
    │   │   ├── pricing/          # ROI calculator and subscription tiers
    │   │   └── faq/              # Frequently asked questions
    │   │
    │   ├── (auth)/               # Clinic staff login & signup flows
    │   │   ├── login/page.tsx    # Secure credential & OAuth login
    │   │   └── signup/page.tsx   # Clinic onboarding & staff registration
    │   │
    │   ├── icon.tsx              # Next.js dynamic metadata icon generator
    │   ├── apple-icon.tsx        # Apple touch icon generator
    │   ├── layout.tsx            # Global layout with Manrope font & metadata
    │   └── globals.css           # Tailwind base styles and CSS variables
    │
    ├── components/
    │   ├── marketing/            # Hero, PhoneDemo, Problem, Workflow, Navbar, Footer
    │   ├── providers/            # Auth and theme context providers
    │   └── ui/                   # Reusable button, card, and modal primitives
    │
    ├── config/
    │   └── brand.ts              # Single source of truth for brand colors & typography
    │
    └── lib/
        └── auth-client.ts        # Client-side Better Auth SDK
```

---

## 🚀 Running Locally

From the root directory:

```bash
# Run web workspace only
npm run dev:web

# Or from inside apps/web
npm run dev
```

The application will be live at [http://localhost:3000](http://localhost:3000).
