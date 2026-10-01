"use client";

import { PlayerProvider } from "./player/player-context";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <PlayerProvider>{children}</PlayerProvider>;
};
