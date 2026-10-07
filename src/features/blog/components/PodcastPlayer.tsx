import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import styles from "./PodcastPlayer.module.css";

interface PodcastPlayerProps {
  postSlug: string;
  activeLang: "pt" | "en" | "es";
  postTitle: string;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}:${remMins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function PodcastPlayer({ postSlug, activeLang, postTitle }: PodcastPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isAudioAvailable, setIsAudioAvailable] = useState<boolean | null>(null);

  const audioSrc = `/audio/podcasts/${postSlug}-${activeLang}.mp3`;

  // Verifica se o arquivo de áudio está disponível
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    const checkAudio = async () => {
      try {
        const res = await fetch(audioSrc, { method: "HEAD" });
        const contentType = res.headers.get("content-type") || "";
        // Rejeita fallbacks de SPA onde o servidor retorna index.html (200 OK) para rotas inexistentes
        const isValidAudio = res.ok && !contentType.includes("text/html");
        setIsAudioAvailable(isValidAudio);
      } catch {
        setIsAudioAvailable(false);
      }
    };

    checkAudio();
  }, [audioSrc]);

  // Atualiza taxa de reprodução no elemento de áudio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Se o áudio não existir para este post, não renderiza o player
  if (isAudioAvailable === false || isAudioAvailable === null) {
    return null;
  }

  const handleTogglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      try {
        await audio.play();
      } catch (err) {
        console.error("Erro ao reproduzir áudio:", err);
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    const target = Math.max(0, Math.min(duration || 0, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const labels = {
    pt: {
      title: "Ouvir em Podcast",
      badge: "Voz pastoral neural • Baseada no sermão do Pr. Davi Ribeiro",
      download: "Baixar áudio MP3"
    },
    en: {
      title: "Listen to Podcast",
      badge: "Pastoral neural voice • Based on Pr. Davi Ribeiro's sermon",
      download: "Download MP3 audio"
    },
    es: {
      title: "Escuchar en Podcast",
      badge: "Voz pastoral neural • Basada en el sermón del Pr. Davi Ribeiro",
      download: "Descargar audio MP3"
    }
  }[activeLang];

  const updateDuration = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
      setDuration(audioRef.current.duration);
    }
  };

  return (
    <section className={styles.container} aria-label={labels.title}>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={updateDuration}
        onDurationChange={updateDuration}
        onCanPlay={updateDuration}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={(e) => {
          console.error("Erro no elemento de áudio:", e);
          setIsPlaying(false);
        }}
      />

      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.podcastIcon} aria-hidden="true">
            <Icon name="mic-fill" />
          </div>
          <div className={styles.titleText}>
            <h3 className={styles.title}>{labels.title}</h3>
            <span className={styles.badge}>{labels.badge}</span>
          </div>
        </div>

        <a
          href={audioSrc}
          download={`${postSlug}-${activeLang}.mp3`}
          className={styles.downloadLink}
          title={labels.download}
        >
          <Icon name="download" />
          <span>MP3</span>
        </a>
      </div>

      <div className={styles.timelineArea}>
        <span className={styles.timeText}>{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className={styles.progressBar}
          aria-label="Progresso do podcast"
        />
        <span className={`${styles.timeText} ${styles.timeEnd}`}>{formatTime(duration)}</span>
      </div>

      <div className={styles.controls}>
        <div className={styles.mainControls}>
          <button
            type="button"
            className={styles.skipBtn}
            onClick={() => handleSkip(-15)}
            title="Voltar 15 segundos"
            aria-label="Voltar 15 segundos"
          >
            <Icon name="arrow-counterclockwise" />
            <span>15s</span>
          </button>

          <button
            type="button"
            className={styles.playBtn}
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pausar podcast" : "Reproduzir podcast"}
          >
            <Icon name={isPlaying ? "pause-fill" : "play-fill"} />
          </button>

          <button
            type="button"
            className={styles.skipBtn}
            onClick={() => handleSkip(15)}
            title="Avançar 15 segundos"
            aria-label="Avançar 15 segundos"
          >
            <span>15s</span>
            <Icon name="arrow-clockwise" />
          </button>
        </div>

        <div className={styles.speedSelector} aria-label="Velocidade de reprodução">
          {[1, 1.25, 1.5, 2].map((speed) => (
            <button
              key={speed}
              type="button"
              className={`${styles.speedBtn} ${playbackRate === speed ? styles.speedBtnActive : ""}`}
              onClick={() => setPlaybackRate(speed)}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
