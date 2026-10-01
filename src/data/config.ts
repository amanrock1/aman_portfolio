const config = {
  title: "Aman Kumar Prabhat | Software Developer · AI/ML",
  description: {
    long: "Portfolio of Aman Kumar Prabhat — Software Developer focused on full-stack development, AI/ML applications, and interactive digital experiences.",
    short:
      "Aman Kumar Prabhat — Software Developer · AI/ML. Building software, AI-powered applications, and interactive digital experiences.",
  },
  keywords: [
    "Aman Kumar Prabhat",
    "Aman Prabhat",
    "Software Developer",
    "Software Engineer",
    "AI/ML",
    "Full-Stack",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "C++",
    "Three.js",
    "WebGL",
    "VIT Bhopal",
  ],
  author: "Aman Kumar Prabhat",
  email: "amanprabhat438@gmail.com",
  site: "https://amanprabhat.dev",

  // for github stars button
  githubUsername: "amanrock1",
  githubRepo: "aman_portfolio",

  get ogImg() {
    return this.site + "/assets/seo/og-image.png";
  },
  social: {
    instagram: "https://www.instagram.com/aman_kumar._.18/",
    linkedin: "https://www.linkedin.com/in/aman-kumar-prabhat-b75735325",
    github: "https://github.com/amanrock1",
  },
};
export { config };
