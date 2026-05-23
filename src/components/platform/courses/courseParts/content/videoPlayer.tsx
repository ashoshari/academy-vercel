import { CheckCircle, Clock, Download, FileText } from "lucide-react";
import { useCustomPost } from "@/hooks/platform/usePlatformMutation";
import { getYoutubeVideoId } from "@/utils/getYoutubeVideoId";
import { useLesson } from "@/store/platform/useLesson";
import { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import {
  decryptAESGCM,
  resolveLessonVideoSrc,
  suppressDefaultInteraction,
  youtubeHqThumbnailUrl,
  youtubeIframeConfig,
} from "./videoPlayerUtils";
import {
  LessonFullscreenButton,
  YoutubeLessonChrome,
  secureReactPlayerWrapper,
} from "./youtubePlayerChrome";
import { useLessonVideoFullscreen } from "./useLessonVideoFullscreen";
import { useYoutubeControlledSeek } from "./useYoutubeControlledSeek";
import { getStoredTokens } from "@/services/platform/userAuth";

const encryptionKey = import.meta.env.VITE_LESSON_LINK_ENCRYPTION_KEY ?? "";

function buildOpenLessonInAppUrl(
  lessonId: string | number | undefined,
  videoId: string | null | undefined,
) {
  const token = getStoredTokens();
  if (!token || lessonId == null) return "";

  const vidPart = videoId ? `&vid=${encodeURIComponent(videoId)}` : "";

  return `mediaplayer://login?token=${encodeURIComponent(String(token))}&is_app=true&lesson=${encodeURIComponent(String(lessonId))}&api=${encodeURIComponent(`https://api.prime-academy-jo.com/`)}${vidPart}`;
}

type VideoPlayerProps = {
  markLessonComplete: () => void;
};

function LessonPlayTriangle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

const VideoPlayer = ({ markLessonComplete }: VideoPlayerProps) => {
  const [inlinePlayerActive, setInlinePlayerActive] = useState(false);
  const [decryptedLink, setDecryptedLink] = useState("");
  const [decryptBusy, setDecryptBusy] = useState(false);

  const user = JSON.parse(
    globalThis.localStorage?.getItem("platform_user") || "{}",
  );
  const isAllowToUseWeb = user?.is_allow_to_use_web;

  const currentLesson = useLesson((s) => s.currentLesson);

  useEffect(() => {
    const link =
      typeof currentLesson?.link === "string" ? currentLesson.link.trim() : "";

    setDecryptedLink("");

    if (!link) {
      setDecryptBusy(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      if (!encryptionKey) {
        setDecryptBusy(false);
        setDecryptedLink(link);
        return;
      }

      setDecryptBusy(true);
      try {
        const plain = await decryptAESGCM(link, encryptionKey);
        if (!cancelled) setDecryptedLink(plain);
      } catch (err) {
        console.error("Decrypt failed:", err);
        if (!cancelled) setDecryptedLink("");
      } finally {
        if (!cancelled) setDecryptBusy(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [currentLesson?.id, currentLesson?.link]);
  const { mutateAsync: downloadFiles } = useCustomPost(
    "/training/students/resources-download/",
    ["downloadFiles"],
  );

  const rawLinkTrimmed = decryptedLink.trim();

  const youtubeVideoId = getYoutubeVideoId(rawLinkTrimmed || null);
  const resolvedSrc = useMemo(
    () =>
      resolveLessonVideoSrc(
        youtubeVideoId,
        rawLinkTrimmed,
        ReactPlayer.canPlay,
      ),
    [youtubeVideoId, rawLinkTrimmed],
  );

  const thumbnailUrl =
    youtubeVideoId != null ? youtubeHqThumbnailUrl(youtubeVideoId) : undefined;

  const showPlayerChrome = resolvedSrc != null && inlinePlayerActive;
  const isYoutubeEmbed = youtubeVideoId != null;

  const yt = useYoutubeControlledSeek({
    lessonKey: currentLesson?.id,
    showPlayer: showPlayerChrome && isYoutubeEmbed,
  });

  const lessonFs = useLessonVideoFullscreen();

  const handleDownload = async (resourceId: string | number) => {
    try {
      await downloadFiles({ resource_id: resourceId });
    } catch (error) {
      console.log(error);
    }
  };

  const useWebRestricted =
    isAllowToUseWeb === false || isAllowToUseWeb === "false";

  const openLessonInAppHref = useMemo(
    () => buildOpenLessonInAppUrl(currentLesson?.id, youtubeVideoId),
    [currentLesson?.id, youtubeVideoId],
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="aspect-video rounded-t-2xl overflow-hidden">
        {useWebRestricted ? (
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-2xl shadow-md">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/55 to-black/45" />
            <div className="absolute inset-0 z-1 flex flex-col items-center justify-center gap-6 px-5 py-8 text-center sm:px-8">
              <div className="max-w-xl space-y-2">
                <h3 className="text-xl font-bold text-white drop-shadow-sm sm:text-2xl">
                  متابعة هذا الدرس عبر التطبيق
                </h3>
                <p className="text-sm leading-relaxed text-white/92 sm:text-base">
                  وفقًا لسياسات الوصول لهذا الحساب، لا يمكن تشغيل الفيديو عبر
                  المتصفح. لمتابعة الدرس، يرجى استخدام التطبيق الرسمي. إذا لم
                  يكن مثبتًا لديك، اضغط على الزر أدناه لتحميل التطبيق.
                </p>
              </div>

              <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
                <a
                  href={openLessonInAppHref || undefined}
                  draggable={false}
                  onClick={(e) => {
                    if (!openLessonInAppHref) e.preventDefault();
                  }}
                  onDragStart={(e) => void e.preventDefault()}
                  className={`btn-brand-slide no-underline inline-flex items-center justify-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-[transform,box-shadow] hover:shadow-xl  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 sm:min-h-12.5 sm:flex-initial`}
                >
                  <Download
                    className="size-5 shrink-0 opacity-95"
                    aria-hidden
                  />
                  فتح الدرس في التطبيق
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                  onDragStart={(e) => void e.preventDefault()}
                  className={`cursor-pointer no-underline inline-flex items-center justify-center gap-2.5 rounded-xl border-2 border-white/90 bg-white/12 px-7 py-3.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-[transform,box-shadow,background-color] hover:border-white hover:bg-white/20 hover:shadow-xl  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-light) focus-visible:ring-offset-2 focus-visible:ring-offset-black/60 sm:min-h-12.5 sm:flex-initial`}
                >
                  <Download
                    className="size-5 shrink-0 opacity-95"
                    aria-hidden
                  />
                  تحميل التطبيق
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative isolate h-0 select-none overflow-hidden pb-[56.25%]">
            {!showPlayerChrome ? (
              <>
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover"
                    onContextMenu={suppressDefaultInteraction}
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-950" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <button
                    type="button"
                    disabled={resolvedSrc == null || decryptBusy}
                    title={
                      resolvedSrc == null
                        ? "لا يوجد مصدر تشغيل صالح"
                        : undefined
                    }
                    onClick={() =>
                      resolvedSrc != null && setInlinePlayerActive(true)
                    }
                    className="flex h-17 w-17 cursor-pointer items-center justify-center rounded-full border border-white transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <LessonPlayTriangle className="h-10 w-10 text-white" />
                  </button>
                </div>
              </>
            ) : (
              resolvedSrc != null && (
                <div
                  ref={lessonFs.containerRef}
                  className="absolute inset-0 bg-black"
                >
                  <ReactPlayer
                    ref={isYoutubeEmbed ? yt.playerRef : undefined}
                    src={resolvedSrc}
                    playing={isYoutubeEmbed ? yt.mediaPlaying : true}
                    controls={!isYoutubeEmbed}
                    muted={isYoutubeEmbed ? yt.muted : true}
                    pip={false}
                    playsInline
                    width="100%"
                    height="100%"
                    disablePictureInPicture
                    disableRemotePlayback
                    controlsList={
                      isYoutubeEmbed ? undefined : "nodownload noplaybackrate"
                    }
                    wrapper={secureReactPlayerWrapper}
                    className="absolute inset-0"
                    style={{ position: "absolute", top: 0, left: 0 }}
                    config={{
                      html: {},
                      mux: {},
                      youtube: youtubeIframeConfig(),
                    }}
                    {...(isYoutubeEmbed ? yt.youtubeReactPlayerEvents : {})}
                  />
                  {isYoutubeEmbed && (
                    <YoutubeLessonChrome
                      onSuppressContextMenu={suppressDefaultInteraction}
                      scrubDisplayedSeconds={yt.scrubDisplayedSeconds}
                      playedSeconds={yt.playedSeconds}
                      durationSeconds={yt.durationSeconds}
                      isMuted={yt.muted}
                      isPlaying={yt.mediaPlaying}
                      seekInputRef={yt.seekInputRef}
                      onSeekInputChange={yt.onSeekInputChange}
                      onSeekCommit={yt.finalizeSeek}
                      onToggleMute={() => yt.setMuted((m) => !m)}
                      onTogglePlay={() => yt.setMediaPlaying((p) => !p)}
                      isFullscreen={lessonFs.isFullscreen}
                      onToggleFullscreen={lessonFs.toggleFullscreen}
                    />
                  )}
                  {!isYoutubeEmbed && (
                    <div className="pointer-events-none absolute inset-0 z-35 flex items-end justify-end p-3 pb-14 pt-24 md:pb-3">
                      <div className="pointer-events-auto flex rounded-full bg-black/55 shadow-lg backdrop-blur-sm ring-1 ring-white/10">
                        <LessonFullscreenButton
                          isFullscreen={lessonFs.isFullscreen}
                          onToggleFullscreen={lessonFs.toggleFullscreen}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              {currentLesson?.title}
            </h2>
            <p className="leading-relaxed text-gray-600">
              {currentLesson?.description}
            </p>
          </div>
          <div className="ml-4 flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{currentLesson?.time_in_minutes} دقيقة</span>
            </div>
          </div>
        </div>

        {currentLesson?.resources && currentLesson.resources.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              ملفات الدرس
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {currentLesson.resources.map(
                (resource: {
                  id?: string | number;
                  title?: string;
                  file?: string;
                  file_size?: number;
                }) => (
                  <a
                    key={resource?.id}
                    href={resource.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    onClick={() =>
                      resource?.id != null && handleDownload(resource.id)
                    }
                    className="flex items-center space-x-3 rounded-xl bg-gray-50 p-3 transition-colors duration-200 hover:bg-gray-100"
                  >
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {resource?.title ?? "ملف"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {resource.file_size != null
                          ? (resource.file_size / 1024).toFixed(1)
                          : 0}{" "}
                        MB
                      </div>
                    </div>
                    <span
                      className="rounded-lg p-2 text-(--brand-secondary)"
                      aria-hidden
                    >
                      <Download className="h-4 w-4" />
                    </span>
                  </a>
                ),
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={markLessonComplete}
            disabled={Boolean(currentLesson?.is_completed)}
            className={`flex cursor-pointer items-center space-x-2 rounded-xl px-6 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-75 ${
              currentLesson?.is_completed
                ? "cursor-not-allowed bg-green-100 text-green-800 transition-all duration-300"
                : "transform bg-[linear-gradient(to_right,var(--brand),var(--brand-light),var(--brand))] bg-size-[200%_100%] bg-left text-white shadow-sm transition-all duration-700 hover:scale-105 hover:bg-right hover:shadow-md"
            }`}
          >
            <CheckCircle className="h-5 w-5" />
            <span>
              {currentLesson?.is_completed ? "مكتمل" : "وضع علامة مكتمل"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
