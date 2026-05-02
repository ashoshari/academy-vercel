import {
  CheckCircle,
  Clock,
  Download,
  FileText,
} from "lucide-react";
import { useCustomPost } from "@/hooks/platform/usePlatformMutation";
import AppLogo from "@/assets/manasaty-logo.jpg";
import { getYoutubeVideoId } from "@/utils/getYoutubeVideoId";
import { useLesson } from "@/store/platform/useLesson";
import { useMemo, useState } from "react";
import ReactPlayer from "react-player";
import {
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

const LESSON_PROVIDER = "youtube";

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

  const user = JSON.parse(
    globalThis.localStorage?.getItem("platform_user") || "{}",
  );
  const isAllowToUseWeb = user?.is_allow_to_use_web;

  const currentLesson = useLesson((s) => s.currentLesson);

  const { mutateAsync: downloadFiles } = useCustomPost(
    "/training/students/resources-download/",
    ["downloadFiles"],
  );

  const rawLinkTrimmed =
    typeof currentLesson?.link === "string"
      ? currentLesson.link.trim()
      : "";

  const youtubeVideoId = getYoutubeVideoId(currentLesson?.link);

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

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="aspect-video rounded-t-2xl overflow-hidden">
        {useWebRestricted ? (
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-2xl group shadow-md">
            <img
              src={AppLogo}
              alt="Video Placeholder"
              className="absolute top-0 left-0 w-full h-full object-cover bg-gray-900"
              draggable={false}
              onContextMenu={suppressDefaultInteraction}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 group-hover:from-black/90" />
            <a
              href={
                currentLesson?.link
                  ? `manasaty://open?provider=${LESSON_PROVIDER}&video_id=${currentLesson.link}`
                  : "#"
              }
              className="absolute inset-0 flex flex-col items-center justify-center text-white no-underline"
              draggable={false}
              onClick={(e) => {
                if (!currentLesson?.link) e.preventDefault();
              }}
              onDragStart={(e) => void e.preventDefault()}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <LessonPlayTriangle className="h-10 w-10 text-white" />
                </div>
                <span className="text-lg font-semibold tracking-wide drop-shadow-md">
                  فتح الفيديو في التطبيق
                </span>
              </div>
            </a>
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
                    disabled={resolvedSrc == null}
                    title={
                      resolvedSrc == null
                        ? "لا يوجد مصدر تشغيل صالح"
                        : undefined
                    }
                    onClick={() =>
                      resolvedSrc != null &&
                      setInlinePlayerActive(true)
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
                      onSuppressContextMenu={
                        suppressDefaultInteraction
                      }
                      scrubDisplayedSeconds={
                        yt.scrubDisplayedSeconds
                      }
                      playedSeconds={yt.playedSeconds}
                      durationSeconds={yt.durationSeconds}
                      isMuted={yt.muted}
                      isPlaying={yt.mediaPlaying}
                      seekInputRef={yt.seekInputRef}
                      onSeekInputChange={yt.onSeekInputChange}
                      onSeekCommit={yt.finalizeSeek}
                      onToggleMute={() =>
                        yt.setMuted((m) => !m)
                      }
                      onTogglePlay={() =>
                        yt.setMediaPlaying((p) => !p)
                      }
                      isFullscreen={lessonFs.isFullscreen}
                      onToggleFullscreen={lessonFs.toggleFullscreen}
                    />
                  )}
                  {!isYoutubeEmbed && (
                    <div className="pointer-events-none absolute inset-0 z-[35] flex items-end justify-end p-3 pb-14 pt-24 md:pb-3">
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
                      resource?.id != null &&
                      handleDownload(resource.id)
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
              {currentLesson?.is_completed
                ? "مكتمل"
                : "وضع علامة مكتمل"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
