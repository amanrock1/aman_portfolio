# Aman Kumar Prabhat | 3D Interactive Portfolio
> A cosmic, space-themed developer portfolio featuring a fully interactive 3D mechanical keyboard, custom-designed page physics, and seamless transitions.

---

## 🌌 About The Project

This portfolio is my personal digital playground, built not just to present a list of links and bullet points, but to tell a story through high-fidelity interactive elements. The project's main purpose is to showcase my skills, projects, and learning journey as a Computer Science student in a memorable way. 

### What visitors can do:
- **Play with the 3D Mechanical Keyboard:** Turn, rotate, and physically click on keycaps where each key represents a specific technology I work with.
- **Explore Projects:** Browse a curated collection of my full-stack and front-end projects with detailed case studies, screenshots, and live links.
- **Interactive Customizations:** Switch between full-featured light and dark themes, triggering custom toasts, confetti rewards, and interactive visual feedback.
- **Get in touch:** Connect directly via a contact form that routes emails straight to my inbox in real time.

### What makes it unique:
Instead of standard static lists, the skills showcase is built inside a real-time web-rendered 3D workspace. It merges 3D modeling with modern web technologies, ensuring high performance while displaying heavy 3D canvases.

---

## 🎨 Design Philosophy

- **Visual Style:** A sleek, space-themed environment with deep-space dark modes, subtle floating particles, glow boundaries, and modern typography.
- **User Experience (UX) Goals:** High interactivity and discovery. The goal is to make the user feel like they are exploring an application rather than just scrolling down a document. Every hover, click, and scroll trigger is matched with responsive micro-interactions.
- **The Inspiration:** Inspired by retro-futuristic interfaces and the mechanical keyboard community, combined with the mystery of space exploration. I wanted to build something that bridges the gap between pure 3D design and fast, usable front-end development.

---

## ⚡ Features

- **Interactive 3D mechanical keyboard** built with Spline, allowing visitors to click keycaps to reveal technical details.
- **Buttery smooth scroll physics** powered by Lenis and custom GSAP scroll-triggered animations.
- **Dynamic Projects showcase** with interactive filtering, visual sliders, and structured technology badges.
- **Responsive responsive layout** that gracefully handles heavy canvas rendering on desktop and fluidly switches to optimized static sections on mobile.
- **Theme control system** (Dark & Light theme) that updates the design system variables dynamically.
- **Direct message form** using secure backend email delivery.

---

## 📸 Screenshots

*(Note: Create a directory named `screenshots` under `public/assets/` and upload your images with the filenames below to render them)*

### Hero Section
![Hero Section](./public/assets/screenshots/hero.png)

### 3D Skills Keyboard
![3D Skills Keyboard](./public/assets/screenshots/keyboard.png)

### Projects Section
![Projects Section](./public/assets/screenshots/projects.png)

### Mobile View
![Mobile View](./public/assets/screenshots/mobile.png)

---

## 🔗 Live Demo

You can experience the live website here:  
👉 **[amankumarprabhat.vercel.app](https://amankumarprabhat.vercel.app/)**

---

## 🛠️ Tech Stack

- **Frontend & Core Framework:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Animation & Physics:** GSAP (GreenSock Animation Platform), Framer Motion, Lenis Smooth Scroll
- **3D Graphics & Canvas:** Spline Runtime, Three.js, `@react-three/fiber`
- **UI Components:** Shadcn UI, Radix UI primitives, Aceternity UI
- **Services & Tools:** Resend (Email API), Zod (Validation), next-themes

---

## 🏆 Technical Highlights & Optimizations

- **High-Performance 3D Integration:** Rather than displaying a raw, unoptimized 3D model, the Spline canvas is lazy-loaded and only initialized once the user scrolls near it. This dramatically decreases the initial page load time and maintains a steady 60 FPS.
- **Reactive State Sync:** Seamlessly bound Spline keycap press actions directly to React UI states, triggering matching details cards, custom alerts, and dynamic content changes based on 3D cursor events.
- **Polished Animation Timelines:** Designed unified timelines using GSAP ScrollTrigger to ensure that text fades, element translations, and particle scaling remain in sync with the user's natural scroll rate.

---

## 📂 Project Structure

```
├── public/
│   └── assets/                  # 3D models (.spline), logos, and project screenshots
├── src/
│   ├── app/                     # Next.js App Router pages, global layouts, and styles
│   ├── components/              # Interactive UI, slide-show, logos, and custom wrappers
│   ├── contexts/                # Theme and site-wide state contexts
│   ├── data/                    # Unified configuration, projects lists, and constants
│   ├── hooks/                   # Custom React hooks for responsive design and layout measures
│   └── lib/                     # Configured helpers (Resend API client, Tailwind utilities)
```

---

## 💻 Installation & Setup

To run this project on your machine, follow these instructions:

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended), npm, or yarn

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amanrock1/aman_portfolio.git
   cd aman_portfolio
   ```

2. **Install all dependencies:**
   ```bash
   pnpm install
   # or: npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   Add your keys:
   ```env
   RESEND_API_KEY=your_resend_api_key_here
   ```

4. **Launch the development server:**
   ```bash
   pnpm dev
   # or: npm run dev
   ```
   Open your browser and navigate to **`http://localhost:3000`** to view the application.

---

## 🧠 Challenges Faced & Solutions

### 1. 3D Model Loading Times & Page Speed
- **The Challenge:** High-poly 3D models can take several seconds to fetch, causing the site to feel slow and unresponsive on load.
- **The Solution:** Implemented a pre-rendered layout with a custom progress loading screen. Text elements, layout shapes, and layout images load instantly, while the Spline 3D assets are loaded asynchronously in the background.

### 2. Canvas Responsiveness & Touch Devices
- **The Challenge:** 3D canvases do not automatically resize nicely like standard responsive divs, and mouse-hover events don't translate well to mobile screens.
- **The Solution:** Used custom layout hooks (`react-use-measure`) to feed bounding values directly to the canvas container, and built a fallback static grid showcase for touch devices to guarantee a smooth mobile experience.

---

## 📖 Lessons Learned

- **Advanced WebGL & React Integration:** Learned how to bridge the gap between 3D vectors in Spline scenes and the React ecosystem, managing camera position updates dynamically.
- **GSAP Animation Sequencing:** Mastered complex timelines, understanding how to construct performance-friendly animations using class triggers rather than triggering continuous visual layout recalculations.
- **Serverless Architecture:** Gained experience building lightweight contact forms using Next.js Server Actions connected to Resend, ensuring quick email delivery with zero server maintenance.

---

## 🚀 Future Improvements

- [ ] **Blog Engine:** Add an MDX-powered technical blog to share articles on coding challenges, system design, and 3D web interfaces.
- [ ] **Expanded 3D Scenes:** Create interactive 3D dioramas or miniature cards representing specific project achievements.
- [ ] **Custom Shaders:** Add custom WebGL fragment shaders for even more premium background elements.

---

## ✍️ Author

- **Name:** Aman Kumar Prabhat
- **GitHub:** [@amanrock1](https://github.com/amanrock1)
- **LinkedIn:** [Aman Kumar Prabhat](https://www.linkedin.com/in/aman-prabhat-b75735325/)
- **Portfolio:** [amankumarprabhat.vercel.app](https://amankumarprabhat.vercel.app/)
