"use client";
import { useState, useEffect, useRef } from "react";
import { IconPrevious, IconNext, IconPlay, IconPause } from "../../_components/Icons";

/** TASK LIST
 * - RESPONSIVE
 * - Audio control is hard to tap
 * - Prevent scrolling while dragging a control on mobile
 * - Add album image for Cyberpunk 2077 soundtrack
 * - Add track title scrolling
 */

const toLogarithmicVolume = (value: number) => {
  const logarithmicVolume = (Math.pow(10, value / 100) - 1) / 9;
  return Math.min(Math.max(logarithmicVolume, 0), 1);
};

const formatTime = (seconds: number) => {
  if (!isFinite(seconds) || seconds === 0) return "00:00:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const initialVolume = 25;

export function AudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [wasPlayingBeforeSeek, setWasPlayingBeforeSeek] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const seekerRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDuration(0);
    setCurrentTime(0);
    setIsLoading(true);
  }, [currentTrack]);

  useEffect(() => {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) return;
    audioPlayer.volume = toLogarithmicVolume(initialVolume);
  }, [audioPlayerRef]);

  useEffect(() => {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) return;
    const controller = new AbortController();
    const signal = controller.signal;

    const updateDuration = () => {
      setDuration(audioPlayer.duration);
      setIsLoading(false);
    };

    const updateCurrentTime = () => {
      setCurrentTime(audioPlayer.currentTime);
      if (duration === 0 && audioPlayer.duration > 0) {
        setDuration(audioPlayer.duration);
        setIsLoading(false);
      }
    };

    const handleCanPlay = () => {
      if (duration === 0 && audioPlayer.duration > 0) {
        setDuration(audioPlayer.duration);
      }
      setIsLoading(false);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => handleNextTrack();

    const handleError = () => {
      audioPlayer.pause();
      setIsPlaying(false);
      setIsLoading(false);
    };

    if (audioPlayer.readyState >= 2 && audioPlayer.duration) {
      setDuration(audioPlayer.duration);
      setIsLoading(false);
    }

    audioPlayer.addEventListener("loadedmetadata", updateDuration, { signal });
    audioPlayer.addEventListener("timeupdate", updateCurrentTime, { signal });
    audioPlayer.addEventListener("canplay", handleCanPlay, { signal });
    audioPlayer.addEventListener("play", handlePlay, { signal });
    audioPlayer.addEventListener("pause", handlePause, { signal });
    audioPlayer.addEventListener("ended", handleEnded, { signal });
    audioPlayer.addEventListener("error", handleError, { signal });

    return () => {
      controller.abort();
    };
  }, [currentTrack, duration]);

  const handlePreviousTrack = () => {
    const prevTrack = (currentTrack - 1 + trackSrcs.length) % trackSrcs.length;
    changeTrack(prevTrack);
  };

  const handleNextTrack = () => {
    const nextTrack = (currentTrack + 1) % trackSrcs.length;
    changeTrack(nextTrack);
  };

  const changeTrack = (newTrackIndex: number) => {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) return;
    setIsPlaying(false);
    setDuration(0);
    setCurrentTime(0);
    setIsLoading(true);
    setCurrentTrack(newTrackIndex);
    setTimeout(() => {
      audioPlayer.load();
      audioPlayer.play().catch((err) => {
        setIsLoading(false);
      });
    }, 0);
  };

  const handlePlayPause = () => {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) return;
    if (audioPlayer.paused || audioPlayer.ended) {
      if (audioPlayer.error) audioPlayer.load();
      audioPlayer.play().catch((err) => console.error("Error playing:", err));
    } else {
      audioPlayer.pause();
    }
  };

  const handleSeekStart = (e: React.PointerEvent<HTMLDivElement>) => {
    const seekBar = seekerRef.current;
    if (!seekBar) return;
    seekBar.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setWasPlayingBeforeSeek(isPlaying);
    if (isPlaying) audioPlayerRef.current?.pause();
    updateSeekPosition(e);
  };

  const handleSeeking = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateSeekPosition(e);
  };

  const handleSeekEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const seekBar = seekerRef.current;
    if (!seekBar || !isDragging) return;
    seekBar.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    if (wasPlayingBeforeSeek) {
      audioPlayerRef.current?.play().catch((err) => console.error("Error resuming:", err));
      setIsPlaying(true);
    }
  };

  const updateSeekPosition = (e: React.PointerEvent<HTMLDivElement>) => {
    const seekBar = seekerRef.current;
    const audio = audioPlayerRef.current;
    if (!seekBar || !audio || duration <= 0) return;
    const rect = seekBar.getBoundingClientRect();
    const position = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
    const newTime = position * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeStart = (e: React.PointerEvent<HTMLDivElement>) => {
    const volumeBar = volumeRef.current;
    if (!volumeBar) return;
    volumeBar.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handleVolumeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateVolumePosition(e);
  };

  const handleVolumeEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const volumeBar = volumeRef.current;
    if (!volumeBar || !isDragging) return;
    volumeBar.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  const updateVolumePosition = (e: React.PointerEvent<HTMLDivElement>) => {
    const volumeBar = volumeRef.current;
    const audio = audioPlayerRef.current;
    if (!volumeBar || !audio || duration <= 0) return;
    const rect = volumeBar.getBoundingClientRect();
    const position = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
    const newVolume = position * 100;
    audio.volume = toLogarithmicVolume(newVolume);
    setVolume(newVolume);
  };

  return (
    <div id="proto-nexus-music">
      <audio ref={audioPlayerRef} id="pnm-player" preload="metadata">
        {trackSrcs[currentTrack] ? <source src={trackSrcs[currentTrack]?.src} type="audio/mp3" /> : null}
      </audio>
      <img alt="Cover" src="/assets/phantom_liberty.webp" />
      <div id="pnm-right">
        <div id="pnm-head">
          <span id="pnm-title">{trackSrcs[currentTrack]?.trackName ?? "-"}</span>
          <div id="pnm-group">
            <span id="pnm-time">
              {formatTime(currentTime)}/{isLoading ? "--:--:--" : formatTime(duration)}
            </span>
            <div id="pnm-controls">
              <button className="pnm-prevnext" type="button" onClick={handlePreviousTrack} disabled={isLoading}>
                <IconPrevious aria-label="Previous" />
              </button>
              <button id="pnm-playpause" type="button" onClick={handlePlayPause} disabled={isLoading}>
                {isPlaying ? <IconPause aria-label="Pause" /> : <IconPlay aria-label="Play" />}
              </button>
              <button className="pnm-prevnext" type="button" onClick={handleNextTrack} disabled={isLoading}>
                <IconNext aria-label="Next" />
              </button>
              <div
                ref={volumeRef}
                id="pnm-volume"
                className="pnm-range-wrapper"
                aria-label="Volume"
                onPointerDown={handleVolumeStart}
                onPointerMove={handleVolumeMove}
                onPointerUp={handleVolumeEnd}
                onPointerCancel={handleVolumeEnd}>
                <div className="pnm-range-track">
                  <div className="pnm-range-thumb" style={{ left: `${volume}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          ref={seekerRef}
          id="pnm-seek"
          className="pnm-range-wrapper"
          aria-label="Seek"
          onPointerDown={handleSeekStart}
          onPointerMove={handleSeeking}
          onPointerUp={handleSeekEnd}
          onPointerCancel={handleSeekEnd}>
          <div className="pnm-range-track">
            <div className="pnm-range-progress" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const trackSrcs = [
  {
    id: 1,
    trackName: "Cyberpunk 2077 - V",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/xpmflnnvtl/1-01%20V.mp3",
  },
  {
    id: 2,
    trackName: "Cyberpunk 2077 - Extraction Action",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/ktymmlfcob/1-02%20Extraction%20Action.mp3",
  },
  {
    id: 3,
    trackName: "Cyberpunk 2077 - The Rebel Path",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/zalnnwrhwh/1-03%20The%20Rebel%20Path.mp3",
  },
  {
    id: 4,
    trackName: "Cyberpunk 2077 - The Streets Are Long-Ass Gutters",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/arylyavpku/1-04%20The%20Streets%20Are%20Long-Ass%20Gutters.mp3",
  },
  {
    id: 5,
    trackName: "Cyberpunk 2077 - Outsider No More",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/ufdivjskln/1-05%20Outsider%20No%20More.mp3",
  },
  {
    id: 6,
    trackName: "Cyberpunk 2077 - Cloudy Day",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/diabzrdzpt/1-06%20Cloudy%20Day.mp3",
  },
  {
    id: 7,
    trackName: "Cyberpunk 2077 - Wushu Dolls",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/rmkmhthjcv/1-07%20Wushu%20Dolls.mp3",
  },
  {
    id: 8,
    trackName: "Cyberpunk 2077 - Scavenger Hunt",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/dwqsbtoezc/1-08%20Scavenger%20Hunt.mp3",
  },
  {
    id: 9,
    trackName: "Cyberpunk 2077 - Scavengers",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/nxjwruyxhx/1-09%20Scavengers.mp3",
  },
  {
    id: 10,
    trackName: "Cyberpunk 2077 - Close Probing",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/nggeaphukf/1-10%20Close%20Probing.mp3",
  },
  {
    id: 11,
    trackName: "Cyberpunk 2077 - There's Gonna Be A Parade!",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/gswqxgrpiz/1-11%20There%27s%20Gonna%20Be%20A%20Parade%21.mp3",
  },
  {
    id: 12,
    trackName: "Cyberpunk 2077 - Trouble Finds Trouble",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/vncgkmuwxd/1-12%20Trouble%20Finds%20Trouble.mp3",
  },
  {
    id: 13,
    trackName: "Cyberpunk 2077 - You Shall Never Have To Forgive Me Again",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/jcynbainmd/1-13%20You%20Shall%20Never%20Have%20To%20Forgive%20Me%20Again.mp3",
  },
  {
    id: 14,
    trackName: "Cyberpunk 2077 - Code Red Initiated",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/zslcvaudcb/1-14%20Code%20Red%20Initiated.mp3",
  },
  {
    id: 15,
    trackName: "Cyberpunk 2077 - The Heist",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/rgpmcplzkj/1-15%20The%20Heist.mp3",
  },
  {
    id: 16,
    trackName: "Cyberpunk 2077 - Streetfighters",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/bkhjrabxko/1-16%20Streetfighters.mp3",
  },
  {
    id: 17,
    trackName: "Cyberpunk 2077 - Patri(di)ots",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/gedrnfffjy/1-17%20Patri%28di%29ots.mp3",
  },
  {
    id: 18,
    trackName: "Cyberpunk 2077 - Mining Minds",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/wtkopoybes/1-18%20Mining%20Minds.mp3",
  },
  {
    id: 19,
    trackName: "Cyberpunk 2077 - Rite Of Passage",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/vcvvxbjbni/1-19%20Rite%20Of%20Passage.mp3",
  },
  {
    id: 20,
    trackName: "Cyberpunk 2077 - The Voice In My Head",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/uzqlgjjiie/2-01%20The%20Voice%20In%20My%20Head.mp3",
  },
  {
    id: 21,
    trackName: "Cyberpunk 2077 - Modern Anthill",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/faboymqdgi/2-02%20Modern%20Anthill.mp3",
  },
  {
    id: 22,
    trackName: "Cyberpunk 2077 - The Sacred And The Profane",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/irffpyvzyz/2-03%20The%20Sacred%20And%20The%20Profane.mp3",
  },
  {
    id: 23,
    trackName: "Cyberpunk 2077 - Kang Tao Down",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/okgxenhwjg/2-04%20Kang%20Tao%20Down.mp3",
  },
  {
    id: 24,
    trackName: "Cyberpunk 2077 - Cyberwildlife Park",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/cvgebfhrcx/2-05%20Cyberwildlife%20Park.mp3",
  },
  {
    id: 25,
    trackName: "Cyberpunk 2077 - Consumer Cathedral",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/fbobbmldep/2-06%20Consumer%20Cathedral.mp3",
  },
  {
    id: 26,
    trackName: "Cyberpunk 2077 - Juiced Up",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/yzroymezlm/2-07%20Juiced%20Up.mp3",
  },
  {
    id: 27,
    trackName: "Cyberpunk 2077 - Bells Of Laguna Bend",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/lkrndjcmiv/2-08%20Bells%20Of%20Laguna%20Bend.mp3",
  },
  {
    id: 28,
    trackName: "Cyberpunk 2077 - Urban Downunder",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/wzdekvqmcv/2-09%20Urban%20Downunder.mp3",
  },
  {
    id: 29,
    trackName: "Cyberpunk 2077 - Atlantis",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/npxuxlkfyh/2-10%20Atlantis.mp3",
  },
  {
    id: 30,
    trackName: "Cyberpunk 2077 - Cyberninja",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/jmiietsmhd/2-11%20Cyberninja.mp3",
  },
  {
    id: 31,
    trackName: "Cyberpunk 2077 - The Suits Are Scared",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/sbyqlzgpyy/2-12%20The%20Suits%20Are%20Scared.mp3",
  },
  {
    id: 32,
    trackName: "Cyberpunk 2077 - Tower Lockdown",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/klaieeqtua/2-13%20Tower%20Lockdown.mp3",
  },
  {
    id: 33,
    trackName: "Cyberpunk 2077 - To Hell and Back",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/qvyjpqwkuw/2-14%20To%20Hell%20and%20Back.mp3",
  },
  {
    id: 34,
    trackName: "Cyberpunk 2077 - Adam Smasher",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/sjafhpgsdr/2-15%20Adam%20Smasher.mp3",
  },
  {
    id: 35,
    trackName: "Cyberpunk 2077 - Hanako & Yorinobu",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/giysupjmjx/2-16%20Hanako%20%26%20Yorinobu.mp3",
  },
  {
    id: 36,
    trackName: "Cyberpunk 2077 - Been Good To Know Ya",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/qyiigwzhjb/2-17%20Been%20Good%20To%20Know%20Ya.mp3",
  },
  {
    id: 37,
    trackName: "Cyberpunk 2077 - Never Fade Away (SAMURAI Cover) - feat. Olga Jankowska",
    image: "",
    src: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/przowadfle/2-18%20Never%20Fade%20Away%20%28SAMURAI%20Cover%29%20-%20feat.%20Olga%20Jankowska.mp3",
  },
];
