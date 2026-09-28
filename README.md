<div align="center">

# 🛰️ Project ELPIS
### Resilient Disaster Communication & Ground Intelligence

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Offline_Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<p align="center">
  <b>Smart India Hackathon 2026 (SIH26206)</b> · <i>Student Innovation: Disaster Management</i>
</p>

> *“When the network fails, disaster information shouldn't stop moving.”*

[Live Demo](#-deployment) • [Key Features](#-core-experiences) • [Architecture](#-system-architecture) • [Getting Started](#-getting-started) • [Safety Disclaimer](#-safety--operational-limits)

---

</div>

## 📌 Overview

**Project ELPIS** is a resilient, offline-first ground intelligence and emergency communication platform engineered for disaster scenarios where cellular networks and power grids collapse. 

By combining **local IndexedDB persistence**, an interactive **store-and-forward mesh propagation model**, and a **simulated GIS command centre**, ELPIS ensures field volunteers, responders, and coordinators can record vital observations offline and synchronize ground truth intelligence the moment partial connectivity resumes.

---

## 🗺️ System Architecture

```mermaid
graph TD
    subgraph Zero-Connectivity Zone [Zone 0: Zero Connectivity Field]
        A[Field Reporter / Volunteer Device] -->|Atomic Save| B[(IndexedDB: elpis-field-intelligence)]
        B --> C[Local Report Queue: Unverified]
    end

    subgraph Store-and-Forward Mesh [Store-and-Forward Delay-Tolerant Transport]
        C -->|Device Proximity / Physical Carry| D[Hop 1: Mobile Relay Device]
        D -->|Opportunistic P2P Handshake| E[Hop 2: Regional Drone / Vehicle Relay]
    end

    subgraph Restored-Connectivity Edge [Connectivity Restored]
        E -->|Simulated Sync / Uplink| F[Edge Gateway / Base Station]
    end

    subgraph Command Centre [GIS Command & Coordination Centre]
        F --> G[Simulated GIS Command Centre]
        G --> H[Interactive Geo-Map & Layers]
        G --> I[Priority Filtering & SOS Triage]
        G --> J[Verification Timeline & Advisory Dispatch]
    end

    style Zero-Connectivity Zone fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#fff
    style Store-and-Forward Mesh fill:#14532d,stroke:#22c55e,stroke-width:2px,color:#fff
    style Restored-Connectivity Edge fill:#78350f,stroke:#f59e0b,stroke-width:2px,color:#fff
    style Command Centre fill:#1e293b,stroke:#0ea5e9,stroke-width:2px,color:#fff
```

---

## ⚡ Core Experiences

| Module | Route | Highlights |
| :--- | :--- | :--- |
| **Cinematic Overview** | `/` | Immersive introduction, 5-stage interactive data lifecycle, architectural guarantees, and humanitarian design positioning. |
| **Store-and-Forward Lab** | `/#network` | Six-stage delay-tolerant network sandbox with step controls, finite playback, packet metadata inspection, and real-time event logging. |
| **GIS Command Centre** | `/#command` | Simulated emergency operations center featuring interactive SVG map markers, zoom/layer controls, category filtering, SOS handling, local sync queue, and review workflows. |
| **Field Reporting Interface** | `/#field` | Six standardized disaster report categories, GPS coordinate detection with manual override, triage severity tags, and atomic IndexedDB local storage. |

---

## 🛡️ Offline Application Shell & Resilience

- **Service Worker Precaching (`sw.js`)**: Production build caches HTML, bundled JS/CSS, and web manifest. Once loaded, the app boots instantly with zero connectivity.
- **Atomic Browser IndexedDB**: Field reports are saved locally to `elpis-field-intelligence` database. Even on sudden power failure or browser crash, observations remain intact.
- **Embedded Local SVG GIS Engine**: Terrain, topology, facilities, and markers are rendered purely using client-side SVG and Canvas, avoiding reliance on remote tile servers (e.g. Mapbox/Google Maps).
- **Zero Remote Font/Asset Blocking**: System font fallbacks and embedded vector icons ensure 100% functionality in air-gapped environments.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20+ or v22.12+ recommended
- **Package Manager**: `pnpm` (preferred) or `npm`

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Insane-Sadhin/project-elpis.git
   cd project-elpis
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start local development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```
   *Application will be available at `http://localhost:5173/`*

4. **Build for production with strict type-checking:**
   ```bash
   pnpm build
   # or
   npm run build
   ```

5. **Preview production bundle:**
   ```bash
   pnpm preview
   ```

---

## ☁️ Deployment

### Deploy to Vercel in 1-Click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Insane-Sadhin/project-elpis)

#### Method 1: Continuous Deployment via GitHub (Recommended)
1. Push this repository to your GitHub account (`https://github.com/Insane-Sadhin/project-elpis`).
2. Log in to [Vercel](https://vercel.com).
3. Click **"Add New"** > **"Project"** and import `project-elpis`.
4. Framework Preset will be automatically detected as **Vite**.
5. Click **"Deploy"**. Any future commit pushed to `main` will automatically build and deploy!

#### Method 2: Via Vercel CLI
```bash
npx vercel
```
Follow the interactive CLI prompts to link and deploy to production:
```bash
npx vercel --prod
```

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Browser IndexedDB API (`idb`)
- **PWA**: Service Worker Cache API & Web App Manifest

---

## ⚠️ Safety & Operational Limits

> **Important Operational Notice**  
> ELPIS is a prototype designed to complement, not replace, authorized national and state disaster management authorities (such as **NDMA/SACHET**, **IMD**, and **CWC**).
> - SOS transmissions within this prototype are stored locally or in simulation; they **do not dispatch real emergency personnel**.
> - For life-threatening emergencies in India, dial **112** or use designated civil defense channels.
> - Full operational deployment requires verified transport protocols, authenticated server-side gateways, role-based access control (RBAC), and regulatory compliance.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Developed for Smart India Hackathon 2026 · Committed to resilient community response</sub>
</div>
