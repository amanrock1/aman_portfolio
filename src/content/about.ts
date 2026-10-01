// About page facts, all from the resume.
export const intro =
  "I'm Aman, a B.Tech Computer Science student at VIT Bhopal. I build full-stack and AI-powered projects, and I'm learning AI/ML and exploring how AI can combine with 3D and interactive worlds.";

export const education = {
  school: "VIT Bhopal University",
  degree: "B.Tech Computer Science and Engineering",
  period: "Nov 2024 – present",
  grade: "CGPA 8.40 / 10 (through Semester 6)",
};

export const hackathons = [
  { result: "Final rounds", name: "Design2Code 2.0 Frontend Hackathon" },
  { result: "Final rounds", name: "Dawn of Code Hackathon" },
  { result: "Participated", name: "Bharatiya Antariksh Hackathon 2026" },
  { result: "Participated", name: "Codex India Hackathon 2026" },
];

export const certifications = [
  { name: "Machine Learning A-Z", issuer: "Udemy" },
  { name: "Introduction to Generative AI", issuer: "Google" },
  { name: "Google AI Essentials", issuer: "Google" },
  { name: "Intro to AR/VR/MR/XR", issuer: "University of Michigan" },
  { name: "Introduction to Internet of Things", issuer: "NPTEL" },
  { name: "VITYARTHI Open Source Certificate", issuer: "VIT" },
  { name: "MATLAB Certified", issuer: "MATLAB" },
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
