import Image from "next/image";
import { HeroVideo } from "./HeroVideo";

type Props = {
  video: string;
  poster: string;
  imageAlt: string;
  soundOnLabel: string;
  soundOffLabel: string;
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
        poster={poster}
        soundOnLabel={soundOnLabel}
        soundOffLabel={soundOffLabel}
      />
    </>
  );
}
