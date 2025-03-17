import "./local.css";
import {
  IconGlobe,
  IconKey,
  IconPartlyCloudy,
  IconRain,
  IconSettings,
  IconCalendar,
  IconBattery,
} from "../_components/Icons";
import { AudioPlayer } from "./_components/AudioPlayer";
import { Clock } from "./_components/Clock";

export default function PageNexus() {
  const buttons = [
    { label: "Vault", icon: <IconKey aria-label="Vault" /> },
    { label: "Internet", icon: <IconGlobe aria-label="Internet" /> },
    { label: "Calendar", icon: <IconCalendar aria-label="Calendar" /> },
    { label: "Battery Usage", icon: <IconBattery aria-label="Battery Usage" /> },
    { label: "Settings", icon: <IconSettings aria-label="Settings" /> },
  ];
  const weather = [
    { quarter: "Current", temp: 68, rain: 0, icon: <IconPartlyCloudy aria-label="Partly Cloudy" /> },
    { quarter: "Night", temp: 74, rain: 1, icon: <IconPartlyCloudy aria-label="Partly Cloudy" /> },
    { quarter: "Morning", temp: 72, rain: 2, icon: <IconPartlyCloudy aria-label="Partly Cloudy" /> },
    { quarter: "Noon", temp: 67, rain: 0, icon: <IconPartlyCloudy aria-label="Partly Cloudy" /> },
  ];

  return (
    <>
      <header>
        <h1 id="proto-h1">
          Nexus
          <span>
            Based on:{" "}
            <a className="link" href="https://www.behance.net/gallery/118663901/Cyberpunk-2077User-Interface-(Part-1)">
              Cyberpunk 2077
            </a>{" "}
            (Firefox gradient rendering lmao){" "}
          </span>
        </h1>
      </header>
      <main>
        <section id="proto-nexus">
          <Clock />

          <div id="proto-nexus-buttons">
            {buttons.map((button) => (
              <button type="button" key={button.label}>
                {/* NEED NEW SHARPER BUTTON ICONS */}
                {button.icon}
              </button>
            ))}
          </div>

          <ul id="proto-nexus-weather">
            {weather.map((item) => (
              <li key={item.quarter} className="pnw-item">
                <span className="pnw-label">{item.quarter}</span>
                <div className="pnw-temp">
                  {item.icon}
                  <span>{item.temp}°</span>
                </div>
                <div className="pnw-rain">
                  <IconRain aria-label="Chance of rain" />
                  <span>{item.rain}%</span>
                </div>
              </li>
            ))}
          </ul>
          <AudioPlayer />
        </section>
      </main>
    </>
  );
}
