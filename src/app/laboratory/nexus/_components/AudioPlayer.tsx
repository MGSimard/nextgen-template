"use client";
import { useState, useRef } from "react";

export function AudioPlayer() {
  const [trackName, setTrackName] = useState(
    "Cyberpunk 2077 - The Rebel PathCyberpunk 2077 - The Rebel PathCyberpunk 2077 - The Rebel PathCyberpunk 2077 - The Rebel Path"
  );
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
      <audio ref={audioRef} id="proto-nexus-music-player" />
      <img
        alt="LOGO"
        src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
      />
      <div id="proto-nexus-music-meta">
        <span id="proto-nexus-music-title">{trackName}</span>
        <div id="proto-nexus-music-controls">
          <span id="proto-nexus-music-time">{formatTime(currentTime)}</span>
          <button type="button">&lt;</button>
          <button type="button">P</button>
          <button type="button">&gt;</button>
          <input ref={volumeRef} type="range" defaultValue={100} onChange={handleVolume} />
        </div>
        <input
          id="proto-nexus-music-seeker"
          ref={seekerRef}
          type="range"
          defaultValue={currentTime}
          onChange={handleSeek}
        />
      </div>
    </div>
  );
}

const trackSrcs = [];
