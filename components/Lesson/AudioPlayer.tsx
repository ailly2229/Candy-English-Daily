"use client";

import { useEffect, useRef, useState } from "react";
import { Headphones, Pause, Play, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { CandyButton } from "@/components/UI/CandyButton";

const speeds = [0.8, 1, 1.25, 1.5];

export function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function handleSeek(value: string) {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const nextProgress = Number(value);
    audio.currentTime = (nextProgress / 100) * audio.duration;
    setProgress(nextProgress);
  }

  return (
    <motion.section
      className="rounded-[24px] bg-gradient-to-br from-[#FFB5D8] to-[#FFD9EC] p-5 shadow-[0_18px_50px_rgba(255,126,182,0.22)] sm:p-7"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          if (audio.duration) {
            setProgress((audio.currentTime / audio.duration) * 100);
          }
        }}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#FF4D9A] shadow-md">
            <Headphones size={24} />
          </span>
          <div>
            <p className="text-sm font-black text-[#B52B70]">Listen</p>
            <h2 className="text-xl font-black text-slate-950">卡通播放器</h2>
          </div>
        </div>
        <CandyButton tone="plain" onClick={togglePlay} aria-label={isPlaying ? "暂停" : "播放"}>
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          {isPlaying ? "暂停" : "播放"}
        </CandyButton>
      </div>

      <input
        aria-label="播放进度"
        className="h-3 w-full accent-[#FF7EB6]"
        max="100"
        min="0"
        type="range"
        value={progress}
        onChange={(event) => handleSeek(event.target.value)}
      />

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <CandyButton
          type="button"
          tone="plain"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              setProgress(0);
            }
          }}
        >
          <RotateCcw size={16} />
          重播
        </CandyButton>
        {speeds.map((item) => (
          <button
            key={item}
            className={`candy-button min-h-10 rounded-full px-4 text-sm font-black ${
              speed === item ? "bg-slate-950 text-white" : "bg-white/78 text-slate-700"
            }`}
            type="button"
            onClick={() => setSpeed(item)}
          >
            {item}x
          </button>
        ))}
      </div>
    </motion.section>
  );
}
