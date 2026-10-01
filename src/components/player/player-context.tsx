"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { tracks, type Track } from "@/content/about";

// Soundtrack player state shared by the mini-player and /soundtrack.
//
// Three modes, picked from the tracklist:
//   "spotify"     any track has a spotifyUri. <SpotifyHost> (mounted once, for the whole
//                 visit) registers an engine here and our buttons drive Spotify's embed
//                 from ANY page. The embed is only loaded after the first tap or when the
//                 Soundtrack page is opened, so other pages stay light.
//   "audio"       tracks have a url and play through one <audio> element.
//   "placeholder" no real tracks yet: buttons only change the UI.

export type PlayerMode = "spotify" | "audio" | "placeholder";

/** What the Spotify embed exposes to us. Registered by <SpotifyHost>. */
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
  /** True once the Spotify embed should be mounted. */
  wantEmbed: boolean;
  /** The element on /soundtrack where the embed is shown (null elsewhere). */
  slot: HTMLElement | null;
  setSlot: (el: HTMLElement | null) => void;
  activate: () => void;
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
  const pendingPlay = useRef(false);
  const endedFor = useRef<number>(-1);
  const [wantEmbed, setWantEmbed] = useState(false);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

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

  const activate = useCallback(() => setWantEmbed(true), []);

  /** Move to a track. In Spotify mode this loads it into the embed and starts it. */
  const goTo = useCallback((i: number, autoplay: boolean) => {
    setIndex(i);
    indexRef.current = i;
    setProgress(0);
    endedFor.current = -1;
    if (mode === "spotify") {
      if (engine.current) {
        const uri = tracks[i]?.spotifyUri;
        if (uri) {
          engine.current.load(uri);
          if (autoplay) engine.current.play();
        }
      } else if (autoplay) {
        // Embed not loaded yet: start it as soon as it is ready.
        pendingPlay.current = true;
        setWantEmbed(true);
      }
    } else if (autoplay) {
      setPlaying(true);
    }
  }, []);

  const next = useCallback(() => goTo((indexRef.current + 1) % tracks.length, true), [goTo]);
  const prev = useCallback(() => goTo((indexRef.current - 1 + tracks.length) % tracks.length, true), [goTo]);
  const shuffle = useCallback(
    () => goTo((indexRef.current + 1 + Math.floor(Math.random() * Math.max(1, tracks.length - 1))) % tracks.length, true),
    [goTo],
  );

  const toggle = useCallback(() => {
    if (mode === "spotify") {
      if (engine.current) {
        engine.current.toggle();
      } else {
        // First tap on any page: load the embed, then play when it is ready.
        pendingPlay.current = true;
        setWantEmbed(true);
      }
      return;
    }
    const el = audio.current;
    const current = tracks[indexRef.current];
    setPlaying((p) => {
      if (el && current?.url) {
        if (p) el.pause();
        else void el.play().catch(() => setPlaying(false));
      }
      return !p;
    });
  }, []);

  const registerEngine = useCallback((e: Engine | null) => {
    engine.current = e;
    if (!e) {
      setPlaying(false);
      return;
    }
    if (pendingPlay.current) {
      pendingPlay.current = false;
      const uri = tracks[indexRef.current]?.spotifyUri;
      if (uri) e.load(uri);
      e.play();
    }
  }, []);

  /** Called by the Spotify embed on every playback update. */
  const reportPlayback = useCallback(
    ({ paused, position, duration }: PlaybackReport) => {
      setPlaying(!paused);
      setProgress(duration > 0 ? Math.min(1, position / duration) : 0);
      // Embeds stop at the end of a track: advance to the next one once.
      const i = indexRef.current;
      if (duration > 0 && position >= duration - 400 && endedFor.current !== i) {
        endedFor.current = i;
        goTo((i + 1) % tracks.length, true);
      }
    },
    [goTo],
  );

  const value = useMemo<PlayerState>(
    () => ({
      tracks,
      index,
      playing,
      progress,
      mode,
      wantEmbed,
      slot,
      setSlot,
      activate,
      toggle,
      play: (i) => goTo(i, true),
      next,
      prev,
      shuffle,
      registerEngine,
      reportPlayback,
    }),
    [index, playing, progress, wantEmbed, slot, activate, toggle, goTo, next, prev, shuffle, registerEngine, reportPlayback],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}
