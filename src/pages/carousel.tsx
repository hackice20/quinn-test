import { CAROUSEL_DATA } from "../data-sets/carousel";
import { useState, useEffect } from "react";

export default function Carousel() {
  return (
    <div className="w-full relative overflow-hidden bg-neutral-100 h-[100vh] flex items-center justify-center">
      <CarouselPerformance />
      <div
        className="flex gap-4 overflow-x-auto scrollbar-hide p-4"
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
    </div>
  );
}

function CarouselPerformance() {
  const totalVideos = CAROUSEL_DATA.length;
  const [metrics, setMetrics] = useState({
    totalLoaded: 0, // Videos that have fully loaded
    currentlyLoading: 0, // Videos currently in loading state
    totalMemory: 0, // Estimated memory usage
    networkRequests: 0, // Active network requests
  });

  useEffect(() => {
    const updateMetrics = () => {
      const videos = document.querySelectorAll("video");
      let loading = 0;
      let loaded = 0;
      let memoryUsage = 0;
      let activeRequests = 0;

      videos.forEach((video) => {
        // Check loading state
        if (video.dataset.loading === "true") {
          loading++;
          activeRequests++;
        }
        // Check loaded state
        if (video.dataset.loaded === "true") {
          loaded++;
          // Rough estimation of video memory usage (based on dimensions and duration)
          if (video.videoWidth && video.videoHeight) {
            const resolution = video.videoWidth * video.videoHeight;
            // Rough estimate: 3 bytes per pixel (RGB) * resolution * 1 second
            memoryUsage += (resolution * 3) / (1024 * 1024); // Convert to MB
          }
        }
        // Check if video has source but not loaded
        if (video.src && !video.dataset.loaded) {
          activeRequests++;
        }
      });

      setMetrics({
        totalLoaded: loaded,
        currentlyLoading: loading,
        totalMemory: Math.round(memoryUsage * 100) / 100,
        networkRequests: activeRequests,
      });
    };

    // Initial update
    updateMetrics();

    // Set up observers
    const observer = new MutationObserver(updateMetrics);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "data-loading", "data-loaded"],
    });

    // Update metrics periodically for dynamic values
    const interval = setInterval(updateMetrics, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-4 z-10">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-800">
          Performance Metrics
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-gray-600">Videos Loaded in memory:</span>
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
