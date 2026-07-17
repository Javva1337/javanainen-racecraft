"use client";

import { useEffect, useRef, useState } from "react";

const VOLUME_RAMP_MS = 500;

type Props = {
  src: string;
  soundOnLabel: string;
  soundOffLabel: string;
  /**
   * Ladda videon först efter mount och bara på ≥769 px — mobil får stillbilden
   * i stället (sparar ~4 MB och LCP-bandbredd). Opt-in per sida.
   */
  deferOnMobile?: boolean;
};

/**
 * Bakgrundsvideon i heron + ljudknapp. Startar alltid ljudlös (autoplay-
 * reglerna kräver det); klicket på knappen räknas som user gesture och får
 * unmuta. Volymen rampas upp mjukt i stället för att slå på tvärt.
 * Vid prefers-reduced-motion döljs både video och knapp — stillbilden
 * under (renderas av Hero) tar över. OBS: inget poster-attribut på videon —
 * den optimerade stillbilden ligger redan under, och attributet skulle
 * ladda ned rå-JPEG:en en gång till.
 */
export function HeroVideo({ src, soundOnLabel, soundOffLabel, deferOnMobile }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isDeferredOff, setIsDeferredOff] = useState(deferOnMobile === true);

  useEffect(() => {
    if (!deferOnMobile) return;
    if (window.matchMedia("(min-width: 769px)").matches) setIsDeferredOff(false);
  }, [deferOnMobile]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (video === null) return;

    if (isSoundOn) {
      video.muted = true;
      setIsSoundOn(false);
      return;
    }

    video.muted = false;
    video.volume = 0;
    const start = performance.now();
    const ramp = (now: number) => {
      if (video.muted) return; // avbruten av nytt klick
      // rAF-timestampen kan ligga före start (frame-startens tid) — clamp,
      // annars blir volume negativ och kastar IndexSizeError.
      const t = Math.min(Math.max((now - start) / VOLUME_RAMP_MS, 0), 1);
      video.volume = t * (2 - t); // ease-out
      if (t < 1) requestAnimationFrame(ramp);
    };
    requestAnimationFrame(ramp);
    setIsSoundOn(true);
  };

  if (isDeferredOff) return null;

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
      />
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={isSoundOn}
        aria-label={isSoundOn ? soundOffLabel : soundOnLabel}
        title={isSoundOn ? soundOffLabel : soundOnLabel}
        className="absolute bottom-5 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-snow/20 bg-midnight/50 text-snow/80 backdrop-blur-sm transition duration-150 hover:border-snow/45 hover:text-snow active:scale-95 motion-reduce:hidden sm:bottom-6 sm:right-6"
      >
        {isSoundOn ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none" />
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
          </svg>
        )}
      </button>
    </>
  );
}
