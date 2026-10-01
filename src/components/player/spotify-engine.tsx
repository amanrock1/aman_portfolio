"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePlayer } from "./player-context";

// Spotify iFrame API: https://developer.spotify.com/documentation/embeds/references/iframe-api
//
// ONE embed lives for the whole visit, so play/pause from the mini-player works on every page.
// On /soundtrack it is positioned over the page's slot, fully visible. Elsewhere it stays in
// the viewport but clipped to nothing, because lazy-loaded iframes only load near the viewport.
// Spotify's own controls remain available on /soundtrack for logging in and as the fallback.

type SpotifyController = {
  loadUri: (uri: string) => void;
  play: () => void;
  togglePlay: () => void;
  destroy: () => void;
  addListener: (event: string, cb: (e: { data: { isPaused: boolean; position: number; duration: number } }) => void) => void;
};
type IFrameAPI = {
  createController: (el: HTMLElement, options: { uri: string; width: string; height: number }, cb: (c: SpotifyController) => void) => void;
};
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
  }
}

const SCRIPT = "https://open.spotify.com/embed/iframe-api/v1";
let apiPromise: Promise<IFrameAPI> | null = null;

function loadApi() {
  apiPromise ??= new Promise<IFrameAPI>((resolve, reject) => {
    window.onSpotifyIframeApiReady = resolve;
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onerror = () => {
      apiPromise = null; // allow a retry on the next tap
      reject(new Error("Spotify embed script failed to load"));
    };
    document.body.appendChild(s);
  });
  return apiPromise;
}

const HEIGHT = 152;

export function SpotifyHost() {
  const { tracks, mode, wantEmbed, slot, registerEngine, reportPlayback } = usePlayer();
  const host = useRef<HTMLDivElement>(null);
  const report = useRef(reportPlayback);
  report.current = reportPlayback;

  // Create the controller once, the first time the embed is wanted.
  useEffect(() => {
    if (mode !== "spotify" || !wantEmbed || !host.current) return;
    const first = tracks.find((t) => t.spotifyUri)?.spotifyUri;
    if (!first) return;
    let controller: SpotifyController | null = null;
    let cancelled = false;

    loadApi()
      .then((api) => {
        if (cancelled || !host.current) return;
        // The API replaces the element it is given, so give it a fresh child.
        const mount = document.createElement("div");
        host.current.appendChild(mount);
        api.createController(mount, { uri: first, width: "100%", height: HEIGHT }, (c) => {
          if (cancelled) return c.destroy();
          controller = c;
          c.addListener("playback_update", (e) => report.current({ paused: e.data.isPaused, position: e.data.position, duration: e.data.duration }));
          registerEngine({
            load: (uri) => c.loadUri(uri),
            play: () => c.play(),
            toggle: () => c.togglePlay(),
          });
        });
      })
      .catch(() => {
        /* Script blocked (ad blocker, offline): the Spotify link stays as the fallback. */
      });

    return () => {
      cancelled = true;
      registerEngine(null);
      controller?.destroy();
    };
  }, [mode, wantEmbed, tracks, registerEngine]);

  // Show the embed over the page slot on /soundtrack; hide it (but keep it loaded) elsewhere.
  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    if (!slot) {
      Object.assign(el.style, { position: "fixed", left: "0px", bottom: "0px", top: "auto", width: "300px", height: `${HEIGHT}px`, clipPath: "inset(100%)", pointerEvents: "none", opacity: "0" });
      return;
    }
    const place = () => {
      const r = slot.getBoundingClientRect();
      Object.assign(el.style, {
        position: "absolute",
        left: `${r.left + window.scrollX}px`,
        top: `${r.top + window.scrollY}px`,
        bottom: "auto",
        width: `${r.width}px`,
        height: `${HEIGHT}px`,
        clipPath: "none",
        pointerEvents: "auto",
        opacity: "1",
      });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(slot);
    ro.observe(document.documentElement);
    window.addEventListener("resize", place);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [slot, wantEmbed]);

  if (mode !== "spotify" || !wantEmbed) return null;
  return <div ref={host} className="z-20" aria-label="Spotify player" />;
}
