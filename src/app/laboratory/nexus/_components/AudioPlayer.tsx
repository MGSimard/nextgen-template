"use client";
import { useState, useEffect, useRef } from "react";
import { IconForward, IconBackward, IconPlay } from "../../_components/Icons";
import { IconPause } from "../../_components/Icons";

export function AudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) return;

    audioPlayer.volume = 0.5;

    const updateDuration = () => {
      setDuration(audioPlayer.duration);
    };
    const updateCurrentTime = () => {
      setCurrentTime(audioPlayer.currentTime);
    };

    audioPlayer.addEventListener("loadedmetadata", updateDuration);
    audioPlayer.addEventListener("timeupdate", updateCurrentTime);

    return () => {
      audioPlayer.removeEventListener("loadedmetadata", updateDuration);
      audioPlayer.removeEventListener("timeupdate", updateCurrentTime);
    };
  }, []);

  const handlePlayPause = () => {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) return;

    if (audioPlayer.paused) {
      audioPlayer.play().catch(() => console.error("ERROR PLAYING AUDIO"));
    } else {
      audioPlayer.pause();
    }
  };

  const handleNext = () => {
    console.log("Next");
  };
  const handlePrevious = () => {
    console.log("Previous");
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) return;

    const percentage = Number(e.target.value) / 100;
    const time = duration * percentage;
    audioPlayer.currentTime = time;
  };

  const handleEnd = () => {
    console.log("End");
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) return;
    // Implement logarithmic scaling later (lol)
    audioPlayer.volume = Number(e.target.value) / 100;
  };

  const updateSeeker = (time: number, limit: number) => {
    if (isFinite(time) && isFinite(limit)) {
      return ((time / limit) * 100).toFixed(2);
    }

    return "0.00";
  };

  const formatTime = (seconds: number) => {
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
        {trackSrcs[currentTrack] ? <source src={trackSrcs[currentTrack]?.url} type="audio/mp3" /> : null}
      </audio>
      <img
        alt="LOGO"
        src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
      />
      <div id="pnm-meta">
        <div id="pnm-head">
          <span id="pnm-title">{trackSrcs[currentTrack]?.trackName ?? "-"}</span>
          <div id="pnm-controls">
            {/* NEED NEW SHARPER BUTTON ICONS */}
            <span id="pnm-time">
              {formatTime(currentTime)}/{formatTime(duration)}
            </span>
            <button type="button" onClick={handlePrevious}>
              <IconBackward aria-label="Previous" />
            </button>
            <button type="button" onClick={handlePlayPause}>
              {isPlaying ? <IconPause aria-label="Pause" /> : <IconPlay aria-label="Play" />}
            </button>
            <button type="button" onClick={handleNext}>
              <IconForward aria-label="Next" />
            </button>
            <input type="range" defaultValue={50} onChange={handleVolume} />
          </div>
        </div>
        <input
          id="pnm-seeker"
          type="range"
          value={duration > 0 ? updateSeeker(currentTime, duration) : 0}
          onChange={handleSeek}
        />
      </div>
    </div>
  );
}

const trackSrcs = [
  {
    trackName: "Cyberpunk 2077 - V",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/xpmflnnvtl/1-01%20V.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Extraction Action",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/ktymmlfcob/1-02%20Extraction%20Action.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - The Rebel Path",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/zalnnwrhwh/1-03%20The%20Rebel%20Path.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - The Streets Are Long-Ass Gutters",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/arylyavpku/1-04%20The%20Streets%20Are%20Long-Ass%20Gutters.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Outsider No More",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/ufdivjskln/1-05%20Outsider%20No%20More.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Cloudy Day",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/diabzrdzpt/1-06%20Cloudy%20Day.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Wushu Dolls",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/rmkmhthjcv/1-07%20Wushu%20Dolls.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Scavenger Hunt",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/dwqsbtoezc/1-08%20Scavenger%20Hunt.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Scavengers",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/nxjwruyxhx/1-09%20Scavengers.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Close Probing",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/nggeaphukf/1-10%20Close%20Probing.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - There's Gonna Be A Parade!",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/gswqxgrpiz/1-11%20There%27s%20Gonna%20Be%20A%20Parade%21.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Trouble Finds Trouble",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/vncgkmuwxd/1-12%20Trouble%20Finds%20Trouble.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - You Shall Never Have To Forgive Me Again",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/jcynbainmd/1-13%20You%20Shall%20Never%20Have%20To%20Forgive%20Me%20Again.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Code Red Initiated",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/zslcvaudcb/1-14%20Code%20Red%20Initiated.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - The Heist",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/rgpmcplzkj/1-15%20The%20Heist.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Streetfighters",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/bkhjrabxko/1-16%20Streetfighters.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Patri(di)ots",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/gedrnfffjy/1-17%20Patri%28di%29ots.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Mining Minds",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/wtkopoybes/1-18%20Mining%20Minds.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Rite Of Passage",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/vcvvxbjbni/1-19%20Rite%20Of%20Passage.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - The Voice In My Head",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/uzqlgjjiie/2-01%20The%20Voice%20In%20My%20Head.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Modern Anthill",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/faboymqdgi/2-02%20Modern%20Anthill.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - The Sacred And The Profane",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/irffpyvzyz/2-03%20The%20Sacred%20And%20The%20Profane.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Kang Tao Down",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/okgxenhwjg/2-04%20Kang%20Tao%20Down.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Cyberwildlife Park",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/cvgebfhrcx/2-05%20Cyberwildlife%20Park.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Consumer Cathedral",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/fbobbmldep/2-06%20Consumer%20Cathedral.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Juiced Up",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/yzroymezlm/2-07%20Juiced%20Up.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Bells Of Laguna Bend",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/lkrndjcmiv/2-08%20Bells%20Of%20Laguna%20Bend.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Urban Downunder",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/wzdekvqmcv/2-09%20Urban%20Downunder.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Atlantis",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/npxuxlkfyh/2-10%20Atlantis.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Cyberninja",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/jmiietsmhd/2-11%20Cyberninja.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - The Suits Are Scared",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/sbyqlzgpyy/2-12%20The%20Suits%20Are%20Scared.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Tower Lockdown",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/klaieeqtua/2-13%20Tower%20Lockdown.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - To Hell and Back",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/qvyjpqwkuw/2-14%20To%20Hell%20and%20Back.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Adam Smasher",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/sjafhpgsdr/2-15%20Adam%20Smasher.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Hanako & Yorinobu",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/giysupjmjx/2-16%20Hanako%20%26%20Yorinobu.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Been Good To Know Ya",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/qyiigwzhjb/2-17%20Been%20Good%20To%20Know%20Ya.mp3",
  },
  {
    trackName: "Cyberpunk 2077 - Never Fade Away (SAMURAI Cover) - feat. Olga Jankowska",
    image: "",
    url: "https://eta.vgmtreasurechest.com/soundtracks/cyberpunk-2077-original-game-score/przowadfle/2-18%20Never%20Fade%20Away%20%28SAMURAI%20Cover%29%20-%20feat.%20Olga%20Jankowska.mp3",
  },
];
