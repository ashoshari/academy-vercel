import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import type {
  ComponentType,
  HTMLAttributes,
  PropsWithChildren,
  RefObject,
  SyntheticEvent,
} from "react";
import {
  useCallback,
  useMemo,
  type CSSProperties,
  type MouseEvent,
} from "react";
import {
  formatMediaClock,
  isSeekTimelineReady,
  scrubTimelineMaxSeconds,
} from "./videoPlayerUtils";

export function SecureReactPlayerShell({
  children,
  slot,
  className,
  style,
}: PropsWithChildren<
  Pick<HTMLAttributes<HTMLDivElement>, "slot" | "className" | "style">
>) {
  const styleMerged: CSSProperties = useMemo(() => {
    const base =
      style && typeof style === "object" ? { ...(style as object) } : {};
    return {
      ...base,
      userSelect: "none",
      WebkitUserSelect: "none",
    };
  }, [style]);

  const killContextMenu = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const classMerged = ["relative isolate select-none", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      slot={slot}
      className={classMerged}
      style={styleMerged}
      role="presentation"
      onContextMenu={killContextMenu}
      onDragStart={(e) => void e.preventDefault()}
    >
      {children}
    </div>
  );
}

export const secureReactPlayerWrapper: ComponentType<
  PropsWithChildren<
    Pick<HTMLAttributes<HTMLDivElement>, "slot" | "className" | "style">
  >
> = SecureReactPlayerShell;

/** Full-surface overlay: cross-origin iframe never receives clicks / context menus. */
export function YoutubePointerShield({
  onSuppressContextMenu,
}: {
  onSuppressContextMenu: (e: { preventDefault: () => void }) => void;
}) {
  const absorbPointer = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div
      aria-hidden
      role="presentation"
      className="pointer-events-auto absolute inset-0 z-20 touch-none bg-transparent [-webkit-touch-callout:none] [-webkit-tap-highlight-color:transparent] outline-none"
      onContextMenu={onSuppressContextMenu}
      onDragStart={(e) => void e.preventDefault()}
      onClick={absorbPointer}
      onAuxClick={absorbPointer}
      onDoubleClick={absorbPointer}
    />
  );
}

export type LessonFullscreenControlProps = {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
};

export function LessonFullscreenButton({
  isFullscreen,
  onToggleFullscreen,
}: LessonFullscreenControlProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggleFullscreen();
      }}
      className="cursor-pointer rounded-full p-2.5 text-white transition hover:bg-white/15"
      aria-label={isFullscreen ? "الخروج من ملء الشاشة" : "ملء الشاشة"}
      title={isFullscreen ? "الخروج من ملء الشاشة" : "ملء الشاشة"}
    >
      {isFullscreen ? (
        <Minimize2 className="h-6 w-6" aria-hidden />
      ) : (
        <Maximize2 className="h-6 w-6" aria-hidden />
      )}
    </button>
  );
}

export type YoutubeLessonToolbarProps = {
  scrubDisplayedSeconds: number;
  playedSeconds: number;
  durationSeconds: number;
  isMuted: boolean;
  isPlaying: boolean;
  seekInputRef: RefObject<HTMLInputElement | null>;
  onSeekInputChange: (e: SyntheticEvent<HTMLInputElement>) => void;
  onSeekCommit: () => void;
  onToggleMute: () => void;
  onTogglePlay: () => void;
} & LessonFullscreenControlProps;

/** Custom chrome for nocookie Youtube when native controls are off. */
export function YoutubeLessonChrome({
  onSuppressContextMenu,
  ...bar
}: {
  onSuppressContextMenu: (e: { preventDefault: () => void }) => void;
} & YoutubeLessonToolbarProps) {
  const seekReady = isSeekTimelineReady(bar.durationSeconds);
  const scrubMax = scrubTimelineMaxSeconds(
    bar.durationSeconds,
    bar.playedSeconds,
    bar.scrubDisplayedSeconds,
  );

  return (
    <>
      <YoutubePointerShield onSuppressContextMenu={onSuppressContextMenu} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-stretch gap-2 px-3 pb-4 pt-16">
        <div className="pointer-events-auto rounded-lg bg-black/60 px-3 py-2.5 shadow-lg backdrop-blur-sm">
          <div
            className="flex w-full flex-wrap items-center gap-x-3 gap-y-2"
            dir="ltr"
          >
            <span className="min-w-11 text-center font-mono text-[11px] font-medium whitespace-nowrap text-white tabular-nums">
              {formatMediaClock(bar.scrubDisplayedSeconds)}
            </span>
            <input
              ref={bar.seekInputRef}
              type="range"
              aria-label="الانتقال لوقت محدد"
              min={0}
              step={1}
              max={scrubMax}
              value={Math.min(bar.scrubDisplayedSeconds, scrubMax)}
              onPointerDown={(e) => e.stopPropagation()}
              onChange={bar.onSeekInputChange}
              onPointerUp={bar.onSeekCommit}
              onPointerCancel={bar.onSeekCommit}
              onMouseUpCapture={bar.onSeekCommit}
              onTouchEndCapture={bar.onSeekCommit}
              onBlur={bar.onSeekCommit}
              className="h-1.5 min-w-40 flex-[1_1_60%] cursor-pointer accent-(--brand)"
            />
            <span className="min-w-11 flex-1 text-end font-mono text-[11px] font-medium whitespace-nowrap text-white/90 tabular-nums md:flex-none md:text-start">
              {seekReady ? formatMediaClock(bar.durationSeconds) : "…"}
            </span>
          </div>
          {!seekReady && (
            <p className="mt-2 text-[10px] text-white/70">
              جاري تحميل مدة الفيديو… يمكن السحب قريبًا
            </p>
          )}
        </div>
        <div className="pointer-events-auto flex justify-center">
          <div className="flex flex-row-reverse items-center gap-2 rounded-full bg-black/55 px-3 py-2 shadow-lg backdrop-blur-sm">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                bar.onTogglePlay();
              }}
              className="cursor-pointer rounded-full p-2.5 text-white transition hover:bg-white/15"
              aria-label={bar.isPlaying ? "إيقاف مؤقت" : "تشغيل"}
              title={bar.isPlaying ? "إيقاف" : "تشغيل"}
            >
              {bar.isPlaying ? (
                <Pause className="h-7 w-7" fill="currentColor" />
              ) : (
                <Play className="h-7 w-7" fill="currentColor" />
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                bar.onToggleMute();
              }}
              className="cursor-pointer rounded-full p-2.5 text-white transition hover:bg-white/15"
              aria-label={bar.isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
              title={bar.isMuted ? "إلغاء الكتم" : "كتم"}
            >
              {bar.isMuted ? (
                <VolumeX className="h-6 w-6" />
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
            </button>

            <LessonFullscreenButton
              isFullscreen={bar.isFullscreen}
              onToggleFullscreen={bar.onToggleFullscreen}
            />
          </div>
        </div>
      </div>
    </>
  );
}
