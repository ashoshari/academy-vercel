// LessonPlayer.tsx
import React from "react";

const LessonPlayer = ({ lesson }: any) => {
  return (
    <div className="w-full">
      {lesson?.type === "video" ? (
        <div className="w-full mb-4">
          <div className="aspect-video rounded-xl overflow-hidden">
            <iframe
              src={lesson?.link}
              className="w-full h-full border-none"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      ) : (
        <div className="w-full mb-4">
          <div className="w-full h-[300px] bg-muted rounded-xl flex items-center justify-center">
            <span className="text-muted-foreground text-xl">
              {lesson?.title || "Exam"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPlayer;
