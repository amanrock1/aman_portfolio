const config = {
  title: "Aman Kumar Prabhat | CS Student & Developer",
  description: {
    long: "Explore the portfolio of Aman Kumar Prabhat, a B.Tech CSE student passionate about building modern websites, interactive UI experiences, and AI-assisted projects. Discover my latest work including my 3D Portfolio, Agricycle, 360 Campus Tour, and more. Let's build something amazing together!",
    short:
      "Portfolio of Aman Kumar Prabhat — CS student building modern websites, interactive UI, and AI-assisted projects.",
  },
  keywords: [
    "Aman Kumar Prabhat",
    "Aman Prabhat",
    "portfolio",
    "CS student",
    "developer",
    "VIT Bhopal",
    "web development",
    "React",
    "Next.js",
    "3D animations",
    "interactive websites",
    "AI projects",
    "DSA",
    "competitive programming",
    "full stack developer",
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
    linkedin: "https://www.linkedin.com/in/aman-prabhat-b75735325",
    github: "https://github.com/amanrock1",
  },
};
export { config };
