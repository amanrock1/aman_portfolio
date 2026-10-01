"use client";

import { PlayerProvider } from "./player/player-context";
import { SpotifyHost } from "./player/spotify-engine";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <PlayerProvider>
      {children}
      <SpotifyHost />
    </PlayerProvider>
  );
};
