"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "./player-context";

// Spotify iFrame API: https://developer.spotify.com/documentation/embeds/references/iframe-api
// The embed stays visible (compact) on /soundtrack: our receipt buttons drive it, and
// Spotify's own controls remain available as the fallback and for logging in.

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
      apiPromise = null; // allow a retry on the next visit
      reject(new Error("Spotify embed script failed to load"));
    };
    document.body.appendChild(s);
  });
  return apiPromise;
}

export function SpotifyEngine() {
  const { tracks, registerEngine, reportPlayback } = usePlayer();
  const host = useRef<HTMLDivElement>(null);
  const report = useRef(reportPlayback);
  report.current = reportPlayback;

  useEffect(() => {
    const first = tracks.find((t) => t.spotifyUri)?.spotifyUri;
    if (!first || !host.current) return;
    let controller: SpotifyController | null = null;
    let cancelled = false;

    loadApi()
      .then((api) => {
        if (cancelled || !host.current) return;
        // The API replaces the element it is given, so give it a fresh child.
        const mount = document.createElement("div");
        host.current.appendChild(mount);
        api.createController(mount, { uri: first, width: "100%", height: 152 }, (c) => {
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
  }, [tracks, registerEngine]);

  return <div ref={host} className="min-h-[152px] w-full" aria-label="Spotify player" />;
}
