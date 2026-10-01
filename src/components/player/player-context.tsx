"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { tracks, type Track } from "@/content/about";

// Soundtrack player state shared by the mini-player and /soundtrack.
//
// Three modes, picked from the tracklist:
//   "spotify"     any track has a spotifyUri. A SpotifyEngine (mounted on /soundtrack only)
//                 registers itself here and our buttons drive Spotify's embed.
//   "audio"       tracks have a url and play through one <audio> element.
//   "placeholder" no real tracks yet: buttons only change the UI.

export type PlayerMode = "spotify" | "audio" | "placeholder";

/** What the Spotify embed exposes to us. Registered by <SpotifyEngine>. */
export type Engine = {
  load: (uri: string) => void;
  play: () => void;
  toggle: () => void;
};

type PlaybackReport = { paused: boolean; position: number; duration: number };

type PlayerState = {
  tracks: Track[];
  index: number;
  playing: boolean;
  progress: number; // 0..1
  mode: PlayerMode;
  engineReady: boolean;
  toggle: () => void;
  play: (i: number) => void;
  next: () => void;
  prev: () => void;
  shuffle: () => void;
  registerEngine: (e: Engine | null) => void;
  reportPlayback: (r: PlaybackReport) => void;
};

const PlayerContext = createContext<PlayerState | null>(null);

const mode: PlayerMode = tracks.some((t) => t.spotifyUri) ? "spotify" : tracks.some((t) => t.url) ? "audio" : "placeholder";

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const engine = useRef<Engine | null>(null);
  const endedFor = useRef<number>(-1);
  const [engineReady, setEngineReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Audio mode: one shared <audio> element.
  useEffect(() => {
    if (mode !== "audio") return;
    const el = new Audio();
    el.preload = "none";
    const onTime = () => setProgress(el.duration ? el.currentTime / el.duration : 0);
    const onEnd = () => setIndex((i) => (i + 1) % tracks.length);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    audio.current = el;
    return () => {
      el.pause();
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  useEffect(() => {
    if (mode !== "audio") return;
    const el = audio.current;
    const current = tracks[index];
    if (!el) return;
    setProgress(0);
    if (!current?.url) {
      el.pause();
      el.removeAttribute("src");
      return;
    }
    el.src = current.url;
    if (playing) void el.play().catch(() => setPlaying(false));
    // Track changes only; play/pause is handled in toggle().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  /** Move to a track. In Spotify mode this loads it into the embed and starts it. */
  const goTo = useCallback((i: number, autoplay: boolean) => {
    setIndex(i);
    setProgress(0);
    endedFor.current = -1;
    if (mode === "spotify") {
      const uri = tracks[i]?.spotifyUri;
      if (engine.current && uri) {
        engine.current.load(uri);
        if (autoplay) engine.current.play();
      }
    } else if (autoplay) {
      setPlaying(true);
    }
  }, []);

  const next = useCallback(() => goTo((index + 1) % tracks.length, true), [goTo, index]);
  const prev = useCallback(() => goTo((index - 1 + tracks.length) % tracks.length, true), [goTo, index]);
  const shuffle = useCallback(
    () => goTo((index + 1 + Math.floor(Math.random() * Math.max(1, tracks.length - 1))) % tracks.length, true),
    [goTo, index],
  );

  const toggle = useCallback(() => {
    if (mode === "spotify") {
      // Without a registered embed (not on /soundtrack) the mini-player links to the page instead.
      engine.current?.toggle();
      return;
    }
    const el = audio.current;
    const current = tracks[index];
    setPlaying((p) => {
      if (el && current?.url) {
        if (p) el.pause();
        else void el.play().catch(() => setPlaying(false));
      }
      return !p;
    });
  }, [index]);

  const registerEngine = useCallback((e: Engine | null) => {
    engine.current = e;
    setEngineReady(Boolean(e));
    if (!e) setPlaying(false);
  }, []);

  /** Called by the Spotify embed on every playback update. */
  const reportPlayback = useCallback(
    ({ paused, position, duration }: PlaybackReport) => {
      setPlaying(!paused);
      setProgress(duration > 0 ? Math.min(1, position / duration) : 0);
      // Embeds stop at the end of a track: advance to the next one once.
      if (duration > 0 && position >= duration - 400 && endedFor.current !== index) {
        endedFor.current = index;
        goTo((index + 1) % tracks.length, true);
      }
    },
    [goTo, index],
  );

  const value = useMemo<PlayerState>(
    () => ({
      tracks,
      index,
      playing,
      progress,
      mode,
      engineReady,
      toggle,
      play: (i) => goTo(i, true),
      next,
      prev,
      shuffle,
      registerEngine,
      reportPlayback,
    }),
    [index, playing, progress, engineReady, toggle, goTo, next, prev, shuffle, registerEngine, reportPlayback],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}
