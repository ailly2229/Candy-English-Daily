"use client";

import { useEffect, useRef, useState } from "react";
import { Headphones, Pause, Play, Repeat, RotateCcw, Timer } from "lucide-react";
import { motion } from "framer-motion";
import { CandyButton } from "@/components/UI/CandyButton";

const speeds = [0.8, 1, 1.25, 1.5];
const sleepTimerOptions = [20, 30, 40, 50, 60];

export function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const [sleepMinutes, setSleepMinutes] = useState(0);
  const sleepTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = loop;
    }
  }, [loop]);

  useEffect(() => {
    if (sleepTimerRef.current) {
      window.clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }

    if (!sleepMinutes) return;

    sleepTimerRef.current = window.setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
      }
      setIsPlaying(false);
      setSleepMinutes(0);
    }, sleepMinutes * 60 * 1000);

    return () => {
      if (sleepTimerRef.current) {
        window.clearTimeout(sleepTimerRef.current);
      }
    };
  }, [sleepMinutes]);

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
        onEnded={() => {
          if (!loop) {
            setIsPlaying(false);
          }
        }}
      />

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#FF4D9A] shadow-md">
            <Headphones size={24} />
          </span>
          <div>
            <p className="text-sm font-black text-[#B52B70]">Listen</p>
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
        <button
          className={`candy-button inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-black ${
            loop ? "bg-[#ECFFF0] text-[#157A33]" : "bg-white/78 text-slate-700"
          }`}
          type="button"
          onClick={() => setLoop((current) => !current)}
        >
          <Repeat size={16} />
          单曲循环
        </button>
        <label className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/78 px-4 text-sm font-black text-slate-700">
          <Timer size={16} />
          <select
            className="bg-transparent font-black outline-none"
            value={sleepMinutes}
            onChange={(event) => setSleepMinutes(Number(event.target.value))}
          >
            <option value={0}>定时关闭</option>
            {sleepTimerOptions.map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes}分钟
              </option>
            ))}
          </select>
        </label>
      </div>
    </motion.section>
  );
}
