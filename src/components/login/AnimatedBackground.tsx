import React from "react";

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Elegant orange gradient base */}
      <div className="absolute inset-0 bg-linear-to-br from-orange-50 via-orange-100 to-amber-50"></div>

      {/* Soft animated overlay */}
      <div
        className="absolute inset-0 bg-linear-to-tr from-orange-200/20 via-transparent to-orange-300/15 animate-pulse"
        style={{ animationDuration: "8s" }}
      ></div>

      {/* Elegant floating elements */}
      <div className="absolute inset-0">
        {/* Large elegant circles */}
        <div
          className="absolute top-20 right-20 w-40 h-40 bg-linear-to-br from-orange-300/15 to-orange-400/10 rounded-full animate-float shadow-2xl"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-32 left-16 w-32 h-32 bg-linear-to-br from-orange-200/20 to-orange-300/15 rounded-full animate-float shadow-xl"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-24 h-24 bg-linear-to-br from-orange-400/12 to-orange-500/8 rounded-full animate-float shadow-lg"
          style={{ animationDuration: "12s", animationDelay: "4s" }}
        ></div>

        {/* Medium floating shapes */}
        <div
          className="absolute top-1/3 left-1/4 w-20 h-20 bg-linear-to-br from-orange-300/18 to-orange-400/12 rounded-full animate-pulse shadow-md"
          style={{ animationDuration: "6s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-linear-to-br from-orange-200/25 to-orange-300/18 rounded-full animate-pulse shadow-sm"
          style={{ animationDuration: "7s", animationDelay: "3s" }}
        ></div>

        {/* Small elegant dots */}
        <div
          className="absolute top-1/4 left-1/2 w-12 h-12 bg-orange-300/30 rounded-full animate-ping shadow-lg"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-8 h-8 bg-orange-400/35 rounded-full animate-ping shadow-md"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-2/3 right-1/2 w-6 h-6 bg-orange-500/40 rounded-full animate-ping shadow-sm"
          style={{ animationDuration: "3s", animationDelay: "1s" }}
        ></div>
      </div>

      {/* Elegant geometric patterns */}
      <div className="absolute inset-0">
        {/* Soft rotating squares */}
        <div
          className="absolute top-16 left-1/3 w-16 h-16 border-2 border-orange-300/25 transform rotate-45 animate-spin shadow-lg"
          style={{ animationDuration: "20s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/4 w-12 h-12 border-2 border-orange-400/30 transform rotate-12 animate-spin shadow-md"
          style={{ animationDuration: "15s", animationDirection: "reverse" }}
        ></div>

        {/* Diamond shapes */}
        <div
          className="absolute top-1/2 left-16 w-14 h-14 bg-linear-to-br from-orange-300/20 to-transparent transform rotate-45 animate-pulse shadow-lg"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-20 w-10 h-10 bg-linear-to-br from-orange-400/25 to-transparent transform rotate-45 animate-pulse shadow-md"
          style={{ animationDuration: "6s", animationDelay: "3s" }}
        ></div>
      </div>

      {/* Subtle wave patterns */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-0 right-0 h-full bg-linear-to-r from-transparent via-orange-200/8 to-transparent animate-pulse"
          style={{ animationDuration: "12s" }}
        ></div>
        <div
          className="absolute top-0 left-0 right-0 h-full bg-linear-to-l from-transparent via-orange-300/6 to-transparent animate-pulse"
          style={{ animationDuration: "15s", animationDelay: "5s" }}
        ></div>
      </div>

      {/* Elegant flowing lines */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-1/4 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-orange-300/40 to-transparent animate-pulse"
          style={{ animationDuration: "10s" }}
        ></div>
        <div
          className="absolute top-3/4 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-orange-400/35 to-transparent animate-pulse"
          style={{ animationDuration: "8s", animationDelay: "4s" }}
        ></div>
      </div>

      {/* Soft radial gradients for depth */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-orange-200/10 via-orange-300/5 to-transparent rounded-full animate-pulse"
        style={{ animationDuration: "15s" }}
      ></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-orange-300/8 via-orange-400/4 to-transparent rounded-full animate-pulse"
        style={{ animationDuration: "18s", animationDelay: "6s" }}
      ></div>

      {/* Elegant particle system */}
      <div className="absolute inset-0">
        <div
          className="absolute top-32 right-1/3 w-2 h-2 bg-orange-400/60 rounded-full animate-bounce shadow-sm"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute top-1/2 left-20 w-1.5 h-1.5 bg-orange-500/70 rounded-full animate-bounce shadow-sm"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-16 w-1 h-1 bg-orange-600/80 rounded-full animate-bounce"
          style={{ animationDuration: "3s", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/2 w-2.5 h-2.5 bg-orange-300/50 rounded-full animate-bounce shadow-md"
          style={{ animationDuration: "6s", animationDelay: "3s" }}
        ></div>
      </div>

      {/* Soft atmospheric overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-orange-100/20 via-transparent to-orange-200/15"></div>

      {/* Elegant vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-orange-100/20"></div>

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-noise"></div>
    </div>
  );
};

export default AnimatedBackground;
