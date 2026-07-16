# 🛰️ Quantum Signal — Interactive Sci-Fi Portfolio

> A futuristic personal portfolio site with true 3D starfield, cyberpunk UI, glitch aesthetics, and interactive Easter eggs. Built with React + Vite + Three.js.

**Live:** [quantum-portfolio-react.vercel.app](https://quantum-portfolio-react.vercel.app)  
**Author:** YZTXA

---

## ✨ Features

- **True 3D Universe** — 18,000+ star particles with depth layers, fog, and mouse-driven parallax rotation
- **Glitch Effects** — Multi-layer RGB-split title animations, screen tears, color flashes
- **Cyberpunk UI** — Glassmorphism panels, scanning lines, noise overlays, neon glows
- **Interactive Easter Eggs** — Click-count hidden modes, secret text reveals, idle sleep transmissions
- **Responsive** — Mobile hamburger menu, adaptive star count, touch-friendly
- **Multi-Page** — 8 standalone pages with consistent design system

---

## 📡 Pages

| Page | Description |
|------|-------------|
| **Home** | 3D starfield + glitch title + interactive orbit ring with parallax tilt & custom crosshair cursor |
| **About** | Profile data, ability matrix, external portal links |
| **Works** | Project cards with hover glitch feedback |
| **Lab** | Experimental controls: glitch burst, signal messages, chaos mode |
| **Blackbox** | System diagnostics dashboard — live metrics, waveform monitor, encrypted archives (hover 3s to decrypt), idle sleep mode with cosmic broadcasts |
| **Contact** | Sci-fi signal transmission form |
| **404** | Glitch overload — flashing body filters, random colored bars, static noise bursts, RGB channel split, screen tears, text corruption, intense shake |
| **Emergency Cabin** | 3D claustrophobic spaceship interior — broken lights, red emergency strobe, CCTV-style view with color stripe interference, 404 screen |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build | Vite 5 |
| 3D Engine | Three.js |
| Styling | Custom CSS (Orbitron + Inter fonts) |
| Deployment | Vercel (auto-deploy from `main`) |

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/anqiushi767-cell/quantum-portfolio-react.git
cd quantum-portfolio-react

# Install
npm install

# Dev server
npm run dev

# Production build
npm run build
```

---

## 📂 Project Structure

```
quantum-portfolio/
├── index.html              # Home page (3D starfield)
├── about.html              # About / bio
├── works.html              # Project gallery
├── lab.html                # Experiment bay
├── blackbox.html           # System diagnostics
├── contact.html            # Contact form
├── 404.html                # Glitch 404 page
├── cabin.html              # Emergency cabin 3D scene
├── public/
│   └── favicon.svg         # Site icon
├── src/
│   ├── main.js             # Page router
│   ├── shared.js           # Shared utils: starfield, topbar, glitch, mobile helpers
│   ├── style.css           # Global styles
│   └── pages/
│       ├── home.js         # Home page logic
│       ├── about.js
│       ├── works.js
│       ├── lab.js
│       ├── blackbox.js
│       ├── contact.js
│       ├── notfound.js     # 404 page
│       └── cabin.js        # Emergency cabin 3D scene
├── vite.config.js
└── package.json
```

---

## 🎨 Design Philosophy

The site treats the web as a **space to explore**, not a poster to read. Every page responds to user input — mouse movement, clicks, idle time — making the experience feel alive. The aesthetic draws from cyberpunk UI, retro CRT monitors, and deep-space isolation.

> "网页不是海报，而是一个会呼吸、有情绪、可被探索的数字空间。"

---

## 🙏 Acknowledgments

- **Three.js** — the incredible 3D library that powers the starfield and cabin scenes
- **Vite** — for the blazing-fast dev experience
- **Google Fonts** — Orbitron & Inter
- **Meshy AI** — for 3D model generation experiments (local version)
- **Vercel** — for hosting and continuous deployment
- **All the glitch artists, cyberpunk designers, and space enthusiasts** who inspire this aesthetic

---

## 📄 License

MIT — feel free to use, modify, and explore.

---

*SYSTEM ONLINE · SIGNAL STABLE · READY FOR TRANSMISSION*
