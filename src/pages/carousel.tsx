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
  const totalVideos = CAROUSEL_DATA.length;
  const [metrics, setMetrics] = useState({
    totalLoaded: 0,
    currentlyLoading: 0,
    totalMemory: 0,
    networkRequests: 0,
  });

  useEffect(() => {
    const updateMetrics = () => {
      const videos = document.querySelectorAll("video");
      let loading = 0;
      let loaded = 0;
      let memoryUsage = 0;
      let activeRequests = 0;

      videos.forEach((video) => {
        // Check if video has source
        if (video.src) {
          // Video is considered loading if it's not ready to play
          if (!video.readyState) {
            loading++;
            activeRequests++;
          }
          // HAVE_ENOUGH_DATA = 4, means video is loaded and ready to play
          if (video.readyState === 4) {
            loaded++;
            // Calculate memory only for loaded videos
            if (video.videoWidth && video.videoHeight) {
              const resolution = video.videoWidth * video.videoHeight;
              memoryUsage += (resolution * 3) / (1024 * 1024);
            }
          }
          // Count as network request if still loading
          if (video.readyState < 4) {
            activeRequests++;
          }
        }
      });

      setMetrics({
        totalLoaded: loaded,
        currentlyLoading: loading,
        totalMemory: Math.round(memoryUsage * 100) / 100,
        networkRequests: activeRequests,
      });
    };

    const interval = setInterval(updateMetrics, 500);
    const observer = new MutationObserver(updateMetrics);

    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className=" bg-white inline-flex rounded-lg shadow-sm p-4 z-10">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-800">
          Performance Metrics
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-gray-600">Videos Loaded:</span>
            <span className="font-medium text-gray-900">
              {metrics.totalLoaded} / {totalVideos}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-gray-600">Currently Loading:</span>
            <span
              className={`font-medium ${
                metrics.currentlyLoading > 0
                  ? "text-orange-500"
                  : "text-gray-900"
              }`}
            >
              {metrics.currentlyLoading}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-gray-600">Network Requests:</span>
            <span
              className={`font-medium ${
                metrics.networkRequests > 0 ? "text-blue-500" : "text-gray-900"
              }`}
            >
              {metrics.networkRequests}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-gray-600">Est. Memory Usage:</span>
            <span className="font-medium text-gray-900">
              {metrics.totalMemory} MB
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(metrics.totalLoaded / totalVideos) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
