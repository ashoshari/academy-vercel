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
  if (
    rawLinkTrimmed &&
    typeof canPlay === "function" &&
    Boolean(canPlay(rawLinkTrimmed))
  )
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

export function suppressDefaultInteraction(e: { preventDefault: () => void }) {
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

function stripQuotes(s: string): string {
  const t = s.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1).trim();
  }
  return t;
}

/** Base64 (standard or URL-safe) → Uint8Array (Web Crypto-friendly copy). */
function base64UrlToBytes(b64: string): Uint8Array {
  const normalized = stripQuotes(b64)
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .replace(/\s+/g, "");
  const pad =
    normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const bin = atob(normalized + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function hexToUint8Array(hex: string): Uint8Array {
  const clean = stripQuotes(hex).replace(/\s+/g, "");
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/** AES-256 key: 44-char base64 (32 raw bytes) or 64 hex chars. */
function parseAes256Key(secret: string): Uint8Array {
  const trimmed = stripQuotes(secret);
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) return hexToUint8Array(trimmed);
  const fromB64 = base64UrlToBytes(trimmed);
  if (fromB64.length !== 32) {
    throw new Error("LESSON_LINK_ENCRYPTION_KEY must decode to 32 bytes (AES-256)");
  }
  return new Uint8Array(fromB64);
}

const GCM_IV_LEN = 12;
const GCM_TAG_BITS = 128;

/**
 * Decrypts AES-256-GCM lesson links from the API.
 *
 * Expected wire format (matches backend sample): URL-safe Base64 decode →
 * `12-byte nonce || ciphertext_with_auth_tag` (last 16 bytes = GCM tag).
 *
 * Legacy: `iv_hex:ciphertext_hex:tag_hex` (hex segments) — still accepted for old data.
 */
export async function decryptAESGCM(encrypted: string, keySecret: string) {
  const enc = encrypted.trim();

  /** Web Crypto rejects SharedArrayBuffer-backed views → copy bytes. */
  const asBufferCopy = (u: Uint8Array) => new Uint8Array(u);

  if (keySecret.trim().length === 0) {
    throw new Error("Missing VITE_LESSON_LINK_ENCRYPTION_KEY");
  }

  const keyRaw = parseAes256Key(keySecret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    asBufferCopy(keyRaw),
    { name: "AES-GCM" },
    false,
    ["decrypt"],
  );

  if (enc.includes(":")) {
    const parts = enc.split(":");
    if (parts.length === 3) {
      const iv = asBufferCopy(hexToUint8Array(parts[0]));
      const data = hexToUint8Array(parts[1]);
      const tag = hexToUint8Array(parts[2]);
      const combined = new Uint8Array(data.length + tag.length);
      combined.set(data);
      combined.set(tag, data.length);
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv, tagLength: GCM_TAG_BITS },
        cryptoKey,
        asBufferCopy(combined),
      );
      return new TextDecoder().decode(decrypted);
    }
  }

  const combined = base64UrlToBytes(enc);
  if (combined.length <= GCM_IV_LEN + 16) {
    throw new Error("Encrypted payload too short");
  }

  const iv = asBufferCopy(combined.slice(0, GCM_IV_LEN));
  const cipherWithTag = asBufferCopy(combined.slice(GCM_IV_LEN));

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv, tagLength: GCM_TAG_BITS },
    cryptoKey,
    cipherWithTag,
  );

  return new TextDecoder().decode(decrypted);
}
