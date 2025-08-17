import { CAROUSEL_DATA } from "../data-sets/carousel";

export default function Carousel() {
  return (
    <div className="w-full overflow-hidden bg-neutral-100 h-[100vh] flex items-center justify-center">
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
            className="group flex flex-col items-center w-[190px]  h-[360px] sm:w-[300px] sm:h-[540px] flex-shrink-0 rounded-2xl overflow-hidden"
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
