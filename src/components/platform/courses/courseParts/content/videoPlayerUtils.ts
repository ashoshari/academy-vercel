export function formatMediaClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m)}:${String(s).padStart(2, "0")}`;
}

/** Privacy-oriented embed URL (react-player resolves to nocookie iframe). */
export function youtubePrivacyWatchUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/watch?v=${videoId}`;
}

export function youtubeHqThumbnailUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function resolveLessonVideoSrc(
  youtubeVideoId: string | null | undefined,
  rawLinkTrimmed: string,
  canPlay?: (url: string) => boolean | undefined,
): string | null {
  if (youtubeVideoId) return youtubePrivacyWatchUrl(youtubeVideoId);
  if (rawLinkTrimmed && typeof canPlay === "function" && Boolean(canPlay(rawLinkTrimmed)))
    return rawLinkTrimmed;
  return null;
}

export function youtubeIframeConfig(): Record<string, unknown> {
  if (typeof globalThis.window === "undefined") return {};
  return {
    origin: globalThis.window.location.origin,
    disablekb: 1 as const,
  };
}

export function scrubTimelineMaxSeconds(
  duration: number,
  played: number,
  displayed: number,
) {
  if (Number.isFinite(duration) && duration > 1) return duration;
  return Math.max(played * 1.5, displayed, 90);
}

export function isSeekTimelineReady(duration: number) {
  return Number.isFinite(duration) && duration > 1;
}

export function suppressDefaultInteraction(e: {
  preventDefault: () => void;
}) {
  e.preventDefault();
}

type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  mozCancelFullScreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
};

type FsHTMLElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

/** Active fullscreen element across common vendor prefixes. */
export function getFullscreenElement(): Element | null {
  const d = document as FsDocument;
  return (
    document.fullscreenElement ??
    d.webkitFullscreenElement ??
    d.mozFullScreenElement ??
    d.msFullscreenElement ??
    null
  );
}

export function isElementFullScreen(container: Element | null): boolean {
  if (!container) return false;
  return getFullscreenElement() === container;
}

/**
 * Toggle native fullscreen on a **container** (player shell). The YouTube iframe
 * cannot be fullscreen’d cross-origin; wrapping the embed keeps custom controls visible.
 */
export async function toggleElementFullscreen(
  container: HTMLElement,
): Promise<void> {
  const d = document as FsDocument;
  const c = container as FsHTMLElement;

  if (isElementFullScreen(container)) {
    if (typeof document.exitFullscreen === "function") {
      await document.exitFullscreen().catch(() => {});
    } else if (typeof d.webkitExitFullscreen === "function") {
      await Promise.resolve(d.webkitExitFullscreen());
    } else if (typeof d.mozCancelFullScreen === "function") {
      await Promise.resolve(d.mozCancelFullScreen());
    } else if (typeof d.msExitFullscreen === "function") {
      await Promise.resolve(d.msExitFullscreen());
    }
    return;
  }

  if (typeof container.requestFullscreen === "function") {
    await container.requestFullscreen().catch(() => {});
  } else if (typeof c.webkitRequestFullscreen === "function") {
    await Promise.resolve(c.webkitRequestFullscreen());
  } else if (typeof c.mozRequestFullScreen === "function") {
    await Promise.resolve(c.mozRequestFullScreen());
  } else if (typeof c.msRequestFullscreen === "function") {
    await Promise.resolve(c.msRequestFullscreen());
  }
}
