# Aman Kumar Prabhat Portfolio
> A jaw-dropping, space-themed interactive 3D portfolio to showcase my journey and work.

## 1. About The Project
- **Purpose of the portfolio:** To showcase my development skills, projects, and professional experience.
- **What visitors can do on the website:** Explore my work, interact with a fully 3D keyboard where each key represents a specific technical skill, and reach out to me directly through the site.
- **What makes it unique:** The seamless blend of 3D web elements with smooth scrolling and animations, creating an immersive experience rather than a digital resume.

## 2. Design Philosophy
- **Visual style:** Space-themed aesthetic, featuring floating particles and a cosmic vibe with dark mode.
- **User experience goals:** Fluidity and discovery, encouraging users to "play" with the website.
- **Inspiration behind the design:** Inspired by modern WebGL experiences and a desire to merge 3D modeling with practical front-end web development.

## 3. Features
- **Interactive UI:** Custom interactive elements that respond to user input.
- **Responsive design:** Carefully optimized to look and function perfectly across mobile, tablet, and desktop screens.
- **3D elements and animations:** Spline keyboard revealing titles and descriptions on hover, along with GSAP scroll animations.
- **Project showcase:** Detailed cards for my past work with tech stacks, descriptions, and live links.
- **Skills section:** Interactive 3D centerpiece mapping technical skills to keyboard keys.
- **Contact section:** A fully functional email form.
- **Theme Support:** Light and Dark mode toggles.

## 4. Screenshots

*(Note: Add your images to a `screenshots` folder in `public/assets/` to make them appear)*

**Hero section**  
![Hero Section](./public/assets/screenshots/hero.png)

**Projects section**  
![Projects Section](./public/assets/screenshots/projects.png)

**Mobile view**  
![Mobile View](./public/assets/screenshots/mobile.png)

**Other notable pages (3D Skills Keyboard)**  
![3D Skills Keyboard](./public/assets/screenshots/keyboard.png)

## 5. Live Demo
**Website link:** [https://amankumarprabhat.vercel.app/](https://amankumarprabhat.vercel.app/)

## 6. Tech Stack
- **Frontend technologies:** Next.js, React, TypeScript, Tailwind CSS
- **Animation libraries:** GSAP, Framer Motion, Lenis (for smooth scrolling)
- **3D libraries:** Spline Runtime, Three.js
- **Deployment platform:** Vercel

## 7. Highlights
- **Most technically impressive features:** Integrating a heavy Spline 3D scene smoothly with React state.
- **Creative design decisions:** Mapping out technical skills to individual 3D keycaps on a mechanical keyboard.
- **Performance optimizations:** Lazy loading 3D assets and utilizing Next.js image optimization.

## 8. Project Structure
- `src/app/` - Next.js App Router pages and core layouts
- `src/components/` - Reusable UI components
- `src/data/` - Portfolio content, config, skills list, and project data
- `public/assets/` - Static files, Spline 3D models, and images

## 9. Installation & Setup
- **Clone repository:**
  ```bash
  git clone https://github.com/amanrock1/aman_portfolio.git
  cd aman_portfolio
  ```
- **Install dependencies:**
  ```bash
  pnpm install
  ```
- **Run locally:**
  ```bash
  pnpm dev
  ```

## 10. Challenges Faced
- **Technical difficulties:** Managing the initial load time of the heavy 3D Spline models.
- **How they were solved:** Implemented custom loaders to render text content immediately while the 3D model loads asynchronously.

## 11. Lessons Learned
- **Skills gained:** Deepened knowledge of complex GSAP timeline animations and React state management with a 3D canvas.
- **Technologies explored:** Connecting Next.js Server Actions with email handling services.

## 12. Future Improvements
- **Planned features:** Blog integration for sharing technical articles.
- **Enhancements:** Adding interactive 3D models to individual project cards.

## 13. Author
- **Name:** Aman Kumar Prabhat
- **GitHub:** [https://github.com/amanrock1](https://github.com/amanrock1)
- **LinkedIn:** [https://www.linkedin.com/in/aman-prabhat-b75735325/](https://www.linkedin.com/in/aman-prabhat-b75735325/)
- **Portfolio link:** [https://amankumarprabhat.vercel.app/](https://amankumarprabhat.vercel.app/)
