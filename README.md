<div align="center">
  <img src="public/logo.svg" alt="Darpan Logo" width="120" />

  <h1>Darpan | Premium Video Editing Agency</h1>

  <p>
    <strong>Monopolizing Human Attention.</strong> Precision engineered telemetry, striking visuals, and mathematically formulated retention systems for creators and brands.
  </p>

  <p>
    <a href="#tech-stack"><img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js"></a>
    <a href="#tech-stack"><img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React"></a>
    <a href="#tech-stack"><img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS"></a>
    <a href="#tech-stack"><img src="https://img.shields.io/badge/GSAP-3.15-88CE02?style=for-the-badge&logo=greensock" alt="GSAP"></a>
    <a href="#tech-stack"><img src="https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js" alt="Three.js"></a>
    <a href="#tech-stack"><img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"></a>
    <a href="https://vercel.com"><img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel" alt="Vercel"></a>
  </p>
</div>

<br />

## 🌟 Overview

Welcome to the **Darpan** frontend codebase. This repository powers a highly-optimized, premium agency portfolio experience designed with state-of-the-art web technologies. Built to convert, the site features **fluid 60fps animations**, **WebGL fluid simulations**, and **zero-layout-shift routing**.

The application utilizes **Next.js App Router (v15)** paired with **React 19** and **Tailwind CSS v4** to deliver incredibly fast static pages while allowing for immersive runtime interactivity via **GSAP** and **Three.js**.

---

## ⚡ Features

### 🖥 Immersive UI & UX
- **WebGL Interactive Background**: A custom Three.js fluid simulation reacts to user cursor movements, creating continuous engaging visual feedback.
- **Magnetic UI Elements**: Buttons and layout components feature physical magnetism and spring physics powered by QuickTo (`GSAP`).
- **Smooth Scrolling**: Implemented globally via `Lenis` for premium scroll elasticity perfectly synced with ScrollTrigger.
- **Cinematic Route Transitions**: Uses Custom Next.js Router transitions with preloading to completely eliminate white flashes between pages.

### 🚀 Extreme Performance
- **Turbopack Build**: Extremely fast dev server startup and hot-reloads via Next.js Turbopack.
- **Zero-Dependency Junk**: Audited and strictly configured to ensure minimum bundle-size overhead.
- **Optimized Fonts & Media**: Utilizing `next/font` for Layout Shift prevention, and optimized image loading.
- **Statically Pre-rendered**: Fully statically generated (SSG) deployment meaning maximum edge caching on Vercel.

---

## 🛠 Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Framework** | Next.js 15 | React framework using the App Router and Turbopack. |
| **Language** | TypeScript | Strictly typed codebase with zero `any` exceptions for enterprise-grade integrity. |
| **Styling** | Tailwind CSS v4 | Utility-first styling wrapped with custom design system variables. |
| **Animation** | GSAP 3 | Deeply integrated green-sock timelines (`useGSAP()`, ScrollTrigger) for UI motion. |
| **WebGL** | Three.js | Used for custom shaders and the interactive background. |
| **Scrolling** | Lenis | Best-in-class smooth scroll hijacking synchronized to RequestAnimationFrame. |
| **Package Manager** | pnpm | Fast, disk-space efficient package management. |

---

## 🏗 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** `v20.x` or higher
- **pnpm** `v9.x` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd darpan
   ```

2. **Install dependencies:**
   Using `pnpm` is strictly enforced to ensure deterministic resolving and fast installation.
   ```bash
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   pnpm run dev
   ```
   *The server will launch at `http://localhost:3000` with Turbopack enabled.*

### Build for Production

1. **Test Type Checking & Linting:**
   ```bash
   pnpm tsc --noEmit
   pnpm lint
   ```

2. **Create the optimized build:**
   ```bash
   pnpm run build
   ```

3. **Preview the production build locally:**
   ```bash
   pnpm start
   ```

---

## ☁️ Deployment

This project is perfectly optimized and completely ready to be deployed on **Vercel**. 

1. Push your code to your Git provider.
2. Import the project in Vercel.
3. The build settings should automatically be configured to:
   - **Framework:** Next.js
   - **Build Command:** `next build` (Vercel automatically detects `pnpm run build`)
   - **Install Command:** `pnpm install`
4. Click **Deploy**.

---

<div align="center">
  <p>Engineered with pixel-perfect precision.</p>
</div>
