"use client";
import { useState, useEffect, useRef } from "react";
import { IconForward, IconBackward, IconPlay } from "../../_components/Icons";
import { IconPause } from "../../_components/Icons";

/** TASK LIST
 * - Swap to a vertical popover volume control
 * - Override input[type="range"] appearance across all browsers (or make my own element)
 * - Add album image for Cyberpunk 2077 soundtrack
 * - Add track title scrolling
 * - Find sharper control icons or make them myself
 */

const toLogarithmicVolume = (value: number) => {
  const logarithmicVolume = (Math.pow(10, value / 100) - 1) / 9;
  const clampedOutput = Math.min(Math.max(logarithmicVolume, 0), 1);
  return clampedOutput;
};

export function AudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [wasPlayingBeforeSeek, setWasPlayingBeforeSeek] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const initialVolume = 25;

  useEffect(() => {
    setDuration(0);
    setCurrentTime(0);
    setIsLoading(true);
  }, [currentTrack]);

  useEffect(() => {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) return;

    audioPlayer.volume = toLogarithmicVolume(initialVolume);

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

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      handleNextTrack();
    };

    const handleError = () => {
      audioPlayer.pause();
      setIsPlaying(false);
      setIsLoading(false);
    };

    if (audioPlayer.readyState >= 2 && audioPlayer.duration) {
      setDuration(audioPlayer.duration);
      setIsLoading(false);
    }

    audioPlayer.addEventListener("loadedmetadata", updateDuration);
    audioPlayer.addEventListener("timeupdate", updateCurrentTime);
    audioPlayer.addEventListener("canplay", handleCanPlay);
    audioPlayer.addEventListener("play", handlePlay);
    audioPlayer.addEventListener("pause", handlePause);
    audioPlayer.addEventListener("ended", handleEnded);
    audioPlayer.addEventListener("error", handleError);

    return () => {
      audioPlayer.removeEventListener("loadedmetadata", updateDuration);
      audioPlayer.removeEventListener("timeupdate", updateCurrentTime);
      audioPlayer.removeEventListener("canplay", handleCanPlay);
      audioPlayer.removeEventListener("play", handlePlay);
      audioPlayer.removeEventListener("pause", handlePause);
      audioPlayer.removeEventListener("ended", handleEnded);
      audioPlayer.removeEventListener("error", handleError);
    };
  }, [currentTrack, duration]);

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
        console.error("Error playing track:", err);
        setIsLoading(false);
      });
    }, 0);
  };

  const handleNextTrack = () => {
    const nextTrack = (currentTrack + 1) % trackSrcs.length;
    changeTrack(nextTrack);
  };

  const handlePreviousTrack = () => {
    const prevTrack = (currentTrack - 1 + trackSrcs.length) % trackSrcs.length;
    changeTrack(prevTrack);
  };

  const handlePlayPause = () => {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) return;
    if (audioPlayer.paused || audioPlayer.ended) {
      if (audioPlayer.error) {
        audioPlayer.load();
      }
      audioPlayer.play().catch((err) => console.error("Error playing:", err));
    } else {
      audioPlayer.pause();
    }
  };

  const handleSeekStart = () => {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer || duration <= 0) return;
    setWasPlayingBeforeSeek(isPlaying);
    if (isPlaying) audioPlayer.pause();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer || duration <= 0) return;
    const percentage = Number(e.target.value) / 100;
    const time = duration * percentage;
    audioPlayer.currentTime = time;
    setCurrentTime(time);
  };

  const handleSeekEnd = () => {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer || duration <= 0) return;
    if (wasPlayingBeforeSeek) {
      audioPlayer.play().catch((err) => console.error("Error resuming after seek:", err));
      setIsPlaying(true);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) return;
    const logarithmicVolume = toLogarithmicVolume(Number(e.target.value));
    audioPlayer.volume = logarithmicVolume;
  };

  const updateSeeker = (time: number, limit: number) => {
    if (isFinite(time) && isFinite(limit) && limit > 0) {
      return ((time / limit) * 100).toFixed(2);
    }
    return "0";
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds === 0) {
      return "--:--:--";
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div id="proto-nexus-music">
      <audio ref={audioPlayerRef} id="pnm-player" preload="metadata">
        {trackSrcs[currentTrack] ? <source src={trackSrcs[currentTrack]?.src} type="audio/mp3" /> : null}
      </audio>
      <img
        alt="Cover"
        src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
      />
      <div id="pnm-meta">
        <div id="pnm-head">
          <span id="pnm-title">{trackSrcs[currentTrack]?.trackName ?? "-"}</span>
          <div id="pnm-controls">
            <span id="pnm-time">
              {formatTime(currentTime)}/{isLoading ? "--:--:--" : formatTime(duration)}
            </span>
            <button type="button" onClick={handlePreviousTrack} disabled={isLoading}>
              <IconBackward aria-label="Previous" />
            </button>
            <button type="button" onClick={handlePlayPause} disabled={isLoading}>
              {isPlaying ? <IconPause aria-label="Pause" /> : <IconPlay aria-label="Play" />}
            </button>
            <button type="button" onClick={handleNextTrack} disabled={isLoading}>
              <IconForward aria-label="Next" />
            </button>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue={initialVolume}
              onChange={handleVolume}
              aria-label="Volume"
            />
          </div>
        </div>
        <input
          id="pnm-seeker"
          type="range"
          min="0"
          max="100"
          value={duration > 0 ? updateSeeker(currentTime, duration) : 0}
          onChange={handleSeek}
          onPointerDown={handleSeekStart}
          onPointerUp={handleSeekEnd}
          disabled={duration <= 0 || isLoading}
          aria-label="Seek"
        />
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
