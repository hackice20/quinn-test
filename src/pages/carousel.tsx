import Layout from "../components/layout";
import { CAROUSEL_DATA } from "../data-sets/carousel";
import { useState, useEffect } from "react";

export default function Carousel() {
  return (
    <Layout title="Carousel">
      <div>
        <CarouselPerformance />
      </div>
      <div
        className="flex gap-4 overflow-x-auto scrollbar-hide "
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {CAROUSEL_DATA.map((item, index) => (
          <div
            key={index}
            className="group flex flex-col items-center w-[190px] h-[360px] sm:w-[300px] sm:h-[540px] flex-shrink-0 rounded-2xl overflow-hidden"
          >
            <div className="relative w-full h-full">
              <video
                src={item.urls.SHORT}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 to-transparent">
                <div className="h-[45px] sm:h-[52px] flex items-center px-4 sm:px-5">
                  <p className="w-full text-white/90 text-center tracking-wide uppercase text-[11px] sm:text-[13px] font-light truncate">
                    {item.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

function CarouselPerformance() {
  const [metrics, setMetrics] = useState({
    loadedVideos: new Set(),
    totalVideos: 0,
  });

  // Track total videos in the carousel
  useEffect(() => {
    setMetrics((prev) => ({
      ...prev,
      totalVideos: CAROUSEL_DATA.length,
    }));
  }, []);

  // Setup video load tracking
  useEffect(() => {
    const handleVideoLoad = (event: Event) => {
      const video = event.target as HTMLVideoElement;
      setMetrics((prev) => ({
        ...prev,
        loadedVideos: new Set([...prev.loadedVideos, video.src]),
      }));
    };

    const handleVideoUnload = (event: Event) => {
      const video = event.target as HTMLVideoElement;
      setMetrics((prev) => {
        const newLoadedVideos = new Set(prev.loadedVideos);
        newLoadedVideos.delete(video.src);
        return {
          ...prev,
          loadedVideos: newLoadedVideos,
        };
      });
    };

    // Add listeners to all videos
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      // loadeddata fires when the video is loaded and ready to play
      video.addEventListener("loadeddata", handleVideoLoad);
      // emptied fires when the video is unloaded
      video.addEventListener("emptied", handleVideoUnload);
    });

    return () => {
      const videos = document.querySelectorAll("video");
      videos.forEach((video) => {
        video.removeEventListener("loadeddata", handleVideoLoad);
        video.removeEventListener("emptied", handleVideoUnload);
      });
    };
  }, []);

  return (
    <div className="bg-white inline-flex rounded-lg shadow-sm p-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-800">
          Performance Metrics
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-gray-600">Videos Loaded in memory:</span>
            <span className="font-medium text-gray-900">
              {metrics.loadedVideos.size} / {metrics.totalVideos}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
