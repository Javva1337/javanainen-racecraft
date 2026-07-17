import Image from "next/image";
import { HeroVideo } from "./HeroVideo";

type Props = {
  video: string;
  poster: string;
  imageAlt: string;
  soundOnLabel: string;
  soundOffLabel: string;
  /** Hoppa över videon på mobil (≤768 px) — stillbilden tar över. */
  deferVideoOnMobile?: boolean;
};

/**
 * Fullyte-videobakgrund för hero-sektioner: stillbild (videons första frame)
 * i botten, video-loop med ljudknapp ovanpå. Bilden tar över vid
 * prefers-reduced-motion eller om videon inte kan spelas. Läggs i en
 * relativt positionerad section; gradient-overlay ansvarar sidan själv för.
 */
export function VideoBackdrop({
  video,
  poster,
  imageAlt,
  soundOnLabel,
  soundOffLabel,
  deferVideoOnMobile,
}: Props) {
  return (
    <>
      <Image
        src={poster}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <HeroVideo
        src={video}
        soundOnLabel={soundOnLabel}
        soundOffLabel={soundOffLabel}
        deferOnMobile={deferVideoOnMobile}
      />
    </>
  );
}
