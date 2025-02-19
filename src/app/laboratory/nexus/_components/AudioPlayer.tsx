"use client";
import { useState, useRef } from "react";
import { IconForward, IconBackward, IconPlay } from "../../_components/Icons";
import { IconPause } from "../../_components/Icons";

export function AudioPlayer() {
  const [trackName, setTrackName] = useState(trackSrcs[12]?.trackName ?? "");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);
  const seekerRef = useRef<HTMLInputElement>(null);

  const handlePlayPause = () => {
    console.log("Play/Pause");
  };
  const handleEnd = () => {
    console.log("End");
  };
  const handleNext = () => {
    console.log("Next");
  };
  const handlePrevious = () => {
    console.log("Previous");
  };
  const handleSeek = () => {
    console.log("Seek");
  };
  const handleVolume = () => {
    console.log("Volume");
  };
  const handleMute = () => {
    console.log("Mute");
  };
  const handleLoop = () => {
    console.log("Loop");
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div id="proto-nexus-music">
      <audio ref={audioRef} id="pnm-player" />
      <img
        alt="LOGO"
        src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
      />
      <div id="pnm-meta">
        <div id="pnm-head">
          <span id="pnm-title">{trackName}</span>
          <div id="pnm-controls">
            {/* NEED NEW SHARPER BUTTON ICONS */}
            <span id="pnm-time">{formatTime(currentTime)}</span>
            <button type="button" onClick={handlePrevious}>
              <IconBackward aria-label="Previous" />
            </button>
            <button type="button" onClick={handlePlayPause}>
              {isPlaying ? <IconPause aria-label="Pause" /> : <IconPlay aria-label="Play" />}
            </button>
            <button type="button" onClick={handleNext}>
              <IconForward aria-label="Next" />
            </button>
            <input ref={volumeRef} type="range" defaultValue={100} onChange={handleVolume} />
          </div>
        </div>
        <input id="pnm-seeker" ref={seekerRef} type="range" defaultValue={currentTime} onChange={handleSeek} />
      </div>
    </div>
  );
}

const trackSrcs = [
  { trackName: "Cyberpunk 2077 - V", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Extraction Action", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - The Rebel Path", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - The Streets Are Long-Ass Gutters", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Outsider No More", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Cloudy Day", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Wushu Dolls", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Scavenger Hunt", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Scavengers", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Close Probing", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - There's Gonna Be A Parade!", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Trouble Finds Trouble", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - You Shall Never Have To Forgive Me Again", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Code Red Initiated", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - The Heist", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Streetfighters", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Patri(di)ots", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Mining Minds", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Rite Of Passage", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - The Voice In My Head", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Modern Anthill", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - The Sacred And The Profane", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Kang Tao Down", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Cyberwildlife Park", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Consumer Cathedral", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Juiced Up", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Bells Of Laguna Bend", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Urban Downunder", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Atlantis", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Cyberninja", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - The Suits Are Scared", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Tower Lockdown", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - To Hell and Back", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Adam Smasher", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Hanako & Yorinobu", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Been Good To Know Ya", image: "", url: "" },
  { trackName: "Cyberpunk 2077 - Never Fade Away (SAMURAI Cover) - feat. Olga Jankowska", image: "", url: "" },
];
