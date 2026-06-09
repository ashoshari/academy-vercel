import { useMemo } from "react";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import SliderCarousel, { type SliderSlide } from "./SliderCarousel";

interface PlatformSliderProps {
  className?: string;
}

export default function PlatformSlider({ className }: PlatformSliderProps) {
  const { data } = useCustomQuery("training/students/sliders/", ["sliders"]);

  const slides = useMemo<SliderSlide[]>(() => data?.data ?? [], [data?.data]);

  return <SliderCarousel slides={slides} className={className} />;
}
