// About page facts, all from the resume.
export const intro =
  "I'm Aman, a B.Tech Computer Science student at VIT Bhopal. I build full-stack and AI-powered projects, and I'm learning AI/ML and exploring how AI can combine with 3D and interactive worlds.";

export const education = {
  school: "VIT Bhopal University",
  degree: "B.Tech Computer Science and Engineering",
  period: "Nov 2024 – present",
  grade: "CGPA 8.40 / 10 (through Semester 6)",
};

export type Hackathon = { name: string; result: string; host?: string; highlight?: boolean };

// Hackathons reached beyond the first round, in display order. Each result is shown exactly as written.
export const hackathons: Hackathon[] = [
  { name: "The KEN Great Rewiring", result: "3rd round · finalist", highlight: true },
  { name: "Adobe Hackathon", result: "3rd round", highlight: true },
  { name: "Codex India Hackathon 2026", result: "Final round", highlight: true },
  { name: "Design2Code 2.0 Frontend Hackathon", result: "Final rounds", highlight: true },
  { name: "Dawn of Code Hackathon", result: "Final rounds", highlight: true },
  { name: "Bharatiya Antariksh Hackathon 2026", result: "2nd round" },
];

// Shown behind "Show more" on the About page.
export const participatedHackathons: Hackathon[] = [
  { name: "Claw&Shield 2026", result: "Participated" },
  { name: "Haxplore", result: "Participated", host: "Indian Institute of Technology (IIT), Delhi" },
  { name: "Indian Institute of Technology, Banaras Hindu University (IIT-BHU)", result: "Participated" },
];

// Certificates live in public/assets/certificates (file names include spaces, so the page URL-encodes them).
// Titles and issuers are read from the certificates themselves.
export type Certification = { name: string; issuer: string; file?: string };

export const certifications: Certification[] = [
  { name: "Machine Learning A-Z [2026]: ML, DL, AI with AWS, Python & R", issuer: "Udemy", file: "Machine Learning A-Z udemy.jpg" },
  { name: "Google AI Essentials", issuer: "Google · Coursera", file: "Google AI Essentials.png" },
  { name: "Google Prompting Essentials", issuer: "Google · Coursera", file: "Google Prompting Essentials.png" },
  { name: "AI Readiness Foundation", issuer: "IICT & AI Skills House, with Google and YouTube", file: "AI Readiness Foundation iict abd ai skill house with colaboration of googl and you tube.png" },
  { name: "Intro to AR/VR/MR/XR: Technologies, Applications & Issues", issuer: "University of Michigan · Coursera", file: "Intro to ARVRMRXR.jpeg" },
  { name: "Introduction to Internet of Things", issuer: "NPTEL · IIT Kharagpur", file: "nptel iot.png" },
  { name: "TCS iON Career Edge - Young Professional", issuer: "TCS iON", file: "TCS iON Career Edge - Young Professional.png" },
  { name: "MATLAB Onramp", issuer: "MathWorks", file: "matlab.jpeg" },
  { name: "Python Essentials", issuer: "VITyarthi · VIT Bhopal", file: "vitryarthi PYTHON.png" },
  { name: "Fundamentals of AI and ML", issuer: "VITyarthi · VIT Bhopal", file: "vitryarthi ai ml.png" },
  { name: "Open Source Software", issuer: "VITyarthi · VIT Bhopal", file: "vitryarthi open source.png" },
  // No certificate image in the folder yet, so this one is listed but not clickable.
  { name: "Introduction to Generative AI", issuer: "Google" },
];

// Soundtrack: Aman's Spotify playlist "2k26" (12 tracks). Titles, artists and lengths come from the
// playlist itself; update this list if the playlist changes.
//
// To make a track playable, give it ONE of:
//   spotifyUri: "spotify:track:<id>"   (Spotify: right-click song > Share > Copy Song Link,
//                                        then use the id in the URL, or "Copy Spotify URI")
//   url: "/audio/song.mp3"             (self-hosted file you have the rights to)
// If any track has a spotifyUri the player runs in Spotify mode. Visitors who are not
// logged into Spotify hear 30-second previews; that is Spotify's rule, not a bug.
export type Track = { title: string; artist: string; length: string; spotifyUri?: string; url?: string };

export const tracks: Track[] = [
  { title: "Right Round (feat. Ke$ha)", artist: "Flo Rida, Kesha", length: "3:27", spotifyUri: "spotify:track:3YZUdbRzjjSn4i8ADgCObA" },
  { title: "Golden Brown x Love Story - Super Slowed", artist: "rudo made it, COSKO", length: "3:09", spotifyUri: "spotify:track:3ygjKivh5XS9HauwcmJCyF" },
  { title: "Espresso", artist: "Sabrina Carpenter", length: "2:55", spotifyUri: "spotify:track:2qSkIjg1o9h3YT9RAgYN75" },
  { title: "FA9LA", artist: "Flipperachi", length: "1:45", spotifyUri: "spotify:track:23p1uP74XiVYCXjPP23Kz7" },
  { title: "Hotel Room Service", artist: "Pitbull", length: "3:58", spotifyUri: "spotify:track:6Rb0ptOEjBjPPQUlQtQGbL" },
  { title: "Attention", artist: "Charlie Puth", length: "3:29", spotifyUri: "spotify:track:5cF0dROlMOK5uNZtivgu50" },
  { title: "That's What I Like", artist: "Bruno Mars", length: "3:27", spotifyUri: "spotify:track:0KKkJNfGyhkQ5aFogxQAPU" },
  { title: "Hips Don't Lie (feat. Wyclef Jean)", artist: "Shakira, Wyclef Jean", length: "3:40", spotifyUri: "spotify:track:3d0WouFnFmr0K3kjeza3fF" },
  { title: "Diet Mountain Dew", artist: "Lana Del Rey", length: "3:43", spotifyUri: "spotify:track:2vtmY2mSccRzKGjtcHSzI3" },
  { title: "Hotel Room", artist: "FLVCKKA, Sleezy O, Maury", length: "2:53", spotifyUri: "spotify:track:7sSDJUkOWcNyDMPs8Epg6t" },
  { title: "I Thought I Saw Your Face Today", artist: "She & Him", length: "2:50", spotifyUri: "spotify:track:0myRViRgmQ3J8izICXEAVO" },
  { title: "I Think They Call This Love", artist: "Elliot James Reay", length: "3:14", spotifyUri: "spotify:track:4oHQ8n9OKQ3599e8noCrDX" },
];

// Set this to a Spotify playlist URL to show the "Open on Spotify" link.
export const spotifyPlaylist: string | undefined = "https://open.spotify.com/playlist/5GmRjA2YNQA8yXN0eTqDno";
