"use client";
import { IconClock } from "../../_components/Icons";
import { useState, useEffect } from "react";

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHours}:${displayMinutes}`;
}

export function Clock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const formattedTime = currentTime ? formatTime(currentTime) : "";
  const ampm = currentTime ? (currentTime.getHours() >= 12 ? "PM" : "AM") : "";
  const minuteHandRotation = currentTime ? currentTime.getMinutes() * 6 - 90 : -90;
  const hourHandRotation = currentTime ? (currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5 - 90 : -90;

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
    };
    updateTime();

    // Sync with minute boundary to avoid per-second checks
    const now = new Date();
    const timeToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    const initialTimeout = setTimeout(() => {
      updateTime();
      const interval = setInterval(updateTime, 60000);
      return () => clearInterval(interval);
    }, timeToNextMinute);

    return () => clearTimeout(initialTimeout);
  }, []);

  return (
    <div id="proto-nexus-time">
      <div id="pnt-clock">
        <IconClock />
        <div id="pnt-minute-hand" style={{ transform: `rotate(${minuteHandRotation}deg)` }}></div>
        <div id="pnt-hour-hand" style={{ transform: `rotate(${hourHandRotation}deg)` }}></div>
      </div>
      <div id="pnt-numbers" role="timer" aria-label="Current time">
        {formattedTime}
        <span>{ampm}</span>
      </div>
    </div>
  );
}
