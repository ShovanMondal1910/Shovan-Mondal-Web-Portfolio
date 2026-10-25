# Shovan Mondal - Web Engineering Portfolio

A modern, high-performance, responsive personal developer portfolio featuring cyberpunk-inspired glassmorphism aesthetics, interactive physics simulations, and a curated project showcase.

---

## 🚀 Live Demo & Deployment

This project is configured for one-click deployment on **[Netlify](https://www.netlify.com/)**.

### How to Deploy on Netlify

#### Option A: Continuous Deployment via GitHub (Recommended)
1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Organize assets for production Netlify deployment"
   git push origin main
   ```
2. Log in to [Netlify](https://app.netlify.com/).
3. Click **"Add new site"** &rarr; **"Import an existing project"**.
4. Select **GitHub** and authorize access to this repository.
5. In build settings:
   - **Base directory:** *(Leave blank)*
   - **Build command:** *(Leave blank - this is a static site)*
   - **Publish directory:** `.` (or root `/`)
6. Click **"Deploy site"**. Your site is now live with an automatic HTTPS certificate!

#### Option B: Instant Drag-and-Drop
1. Open the [Netlify App Dashboard](https://app.netlify.com/drop).
2. Drag and drop the `Shovan-Mondal-Web-Portfolio` root folder directly onto the upload zone.
3. Your portfolio will go live within seconds!

---

## 📁 Project Architecture & File Organization

```
Shovan-Mondal-Web-Portfolio/
├── assets/                          # Static media assets
│   ├── certificates/                # Accredited certificates (clean kebab-case)
│   │   ├── art-of-problem-definition.jpg
│   │   ├── cognitive-empowerment.jpg
│   │   ├── excel-essentials.jpg
│   │   ├── online-ict-course.jpg
│   │   └── workplace-communication.jpg
│   ├── docs/                        # Formal documents
│   │   └── cv-shovan.pdf            # Professional Resume
│   ├── icons/                       # Platform & brand iconography
│   │   └── social/                  # Social & developer icons archive
│   └── images/                      # Visual interface assets
│       ├── coffee-cup.png           # Interactive workspace coffee cup
│       ├── experience.png           # Professional experience graphic
│       ├── laptop.png               # Interactive workspace laptop
│       └── shovan.jpeg              # Profile photo & author avatar
├── _redirects                       # Netlify backward-compatibility 301 rules
├── netlify.toml                     # Netlify build, security & cache configurations
├── index.html                       # Semantic HTML5 architecture
├── style.css                        # Modern CSS design system & animations
├── script.js                        # Dynamic interactions & physics simulation
└── README.md                        # Documentation & deployment guide
```

---

## 🛠️ Built With

- **HTML5**: Semantic markup, accessible modals, and microdata.
- **Vanilla CSS3**: Cyberpunk glassmorphism, fluid responsive layouts (`clamp`, CSS Grid, Flexbox), and custom keyframe animations.
- **Vanilla JavaScript (ES6+)**: Custom lerping pointer cursor, interactive lightbox preview modals, 1-click clipboard APIs, and HTML5 Canvas particle simulation.
- **Netlify**: Global edge CDN hosting, immutable caching headers, and automated security policies.

---

## 📬 Contact & Connect

- **Portfolio Owner:** Shovan Mondal
- **Email:** [shovanmondal746826@gmail.com](mailto:shovanmondal746826@gmail.com)
- **LinkedIn:** [Shovan Mondal](https://www.linkedin.com/in/shovan-mondal-krishanu)
- **GitHub:** [@ShovanMondal1910](https://github.com/ShovanMondal1910)
