import { flushSync } from "react-dom";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";

const SEEK_COMMIT_TIMEOUT_MS = 2000;

/**
 * Seeks on the embedded media element while cooperating with react-player’s
 * synchronous play/pause effect (YouTube briefly reports paused mid-seek).
 */
export function useYoutubeControlledSeek(options: {
  lessonKey: string | number | undefined;
  showPlayer: boolean;
}) {
  const { lessonKey, showPlayer } = options;

  const [mediaPlaying, setMediaPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [seekPreviewSeconds, setSeekPreviewSeconds] = useState<number | null>(
    null,
  );

  const playerRef = useRef<HTMLVideoElement | null>(null);
  const seekInputRef = useRef<HTMLInputElement | null>(null);
  const seekLockRef = useRef(false);
  const seekFinalizeBusyRef = useRef(false);

  useEffect(() => {
    if (showPlayer) {
      setMediaPlaying(true);
      setMuted(true);
    }
  }, [showPlayer, lessonKey]);

  useEffect(() => {
    setPlayedSeconds(0);
    setDurationSeconds(0);
    setSeekPreviewSeconds(null);
    seekLockRef.current = false;
    seekFinalizeBusyRef.current = false;
  }, [lessonKey]);

  useEffect(() => {
    return () => {
      seekLockRef.current = false;
      seekFinalizeBusyRef.current = false;
    };
  }, []);

  const scrubDisplayedSeconds = seekPreviewSeconds ?? playedSeconds;

  const applySeekSeconds = useCallback(
    (nextSec: number) => {
      const el = playerRef.current;
      if (!el || !Number.isFinite(nextSec)) return;

      const max =
        Number.isFinite(durationSeconds) && durationSeconds > 1
          ? durationSeconds
          : undefined;
      const clamped = Math.max(
        0,
        max != null ? Math.min(nextSec, max) : nextSec,
      );
      try {
        el.currentTime = clamped;
      } catch {
        /* autoplay / embed edge cases */
      }
    },
    [durationSeconds],
  );

  const onSeekInputChange = useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => {
      setSeekPreviewSeconds(+e.currentTarget.value);
    },
    [],
  );

  const finalizeSeek = useCallback(() => {
    const input = seekInputRef.current;
    const raw = +(input?.value ?? NaN);
    if (seekFinalizeBusyRef.current || !input || !Number.isFinite(raw)) {
      setSeekPreviewSeconds(null);
      return;
    }

    seekFinalizeBusyRef.current = true;
    seekLockRef.current = true;

    const el = playerRef.current;
    if (!el) {
      seekLockRef.current = false;
      seekFinalizeBusyRef.current = false;
      setSeekPreviewSeconds(null);
      return;
    }

    const wantResume = mediaPlaying;
    setSeekPreviewSeconds(null);

    flushSync(() => {
      setMediaPlaying(false);
    });

    let finished = false;
    let timeoutHandle: ReturnType<typeof window.setTimeout> | undefined;

    const done = () => {
      if (finished) return;
      finished = true;

      if (timeoutHandle !== undefined) {
        window.clearTimeout(timeoutHandle);
        timeoutHandle = undefined;
      }
      el.removeEventListener("seeked", onSeeked);

      seekLockRef.current = false;
      seekFinalizeBusyRef.current = false;

      const t = playerRef.current?.currentTime;
      if (Number.isFinite(t)) setPlayedSeconds(t as number);

      flushSync(() => {
        setMediaPlaying(wantResume);
      });

      if (wantResume) {
        queueMicrotask(() => {
          const node = playerRef.current ?? el;
          if (node && typeof node.play === "function") {
            void Promise.resolve(node.play()).catch(() => undefined);
          }
        });
      }
    };

    const onSeeked = () => done();

    el.addEventListener("seeked", onSeeked, { passive: true });
    applySeekSeconds(raw);
    timeoutHandle = window.setTimeout(done, SEEK_COMMIT_TIMEOUT_MS);
  }, [applySeekSeconds, mediaPlaying]);

  const youtubeReactPlayerEvents = useMemo(
    () => ({
      onTimeUpdate: (e: SyntheticEvent<HTMLVideoElement>) => {
        if (seekPreviewSeconds != null) return;
        if (seekLockRef.current) return;
        setPlayedSeconds(e.currentTarget.currentTime);
      },
      onDurationChange: (e: SyntheticEvent<HTMLVideoElement>) => {
        const d = e.currentTarget.duration;
        if (Number.isFinite(d) && d > 0) setDurationSeconds(d);
      },
    }),
    [seekPreviewSeconds],
  );

  return {
    playerRef,
    seekInputRef,
    mediaPlaying,
    setMediaPlaying,
    muted,
    setMuted,
    playedSeconds,
    durationSeconds,
    scrubDisplayedSeconds,
    onSeekInputChange,
    finalizeSeek,
    youtubeReactPlayerEvents,
  };
}
