import "./local.css";
import {
  IconClock,
  IconGlobe,
  IconKey,
  IconPartlyClouded,
  IconRain,
  IconSettings,
  IconCalendar,
  IconBattery,
} from "../_components/Icons";
import { AudioPlayer } from "./_components/AudioPlayer";

export default function PageNexus() {
  const buttons = [
    { label: "Vault", icon: <IconKey aria-label="Vault" /> },
    { label: "Internet", icon: <IconGlobe aria-label="Internet" /> },
    { label: "Calendar", icon: <IconCalendar aria-label="Calendar" /> },
    { label: "Battery Usage", icon: <IconBattery aria-label="Battery Usage" /> },
    { label: "Settings", icon: <IconSettings aria-label="Settings" /> },
  ];
  const weather = [
    { quarter: "Current", temp: 68, rain: 0, icon: <IconPartlyClouded aria-label="Partly Cloudy" /> },
    { quarter: "Night", temp: 74, rain: 1, icon: <IconPartlyClouded aria-label="Partly Cloudy" /> },
    { quarter: "Morning", temp: 72, rain: 2, icon: <IconPartlyClouded aria-label="Partly Cloudy" /> },
    { quarter: "Noon", temp: 67, rain: 0, icon: <IconPartlyClouded aria-label="Partly Cloudy" /> },
  ];

  return (
    <>
      <header>
        <h1>Nexus</h1>
      </header>
      <main>
        <section id="proto-nexus">
          <div id="proto-nexus-left">
            <div id="proto-nexus-time">
              <div id="proto-nexus-time-clock">
                <IconClock />
              </div>
              <div id="proto-nexus-time-numbers">
                06:30<span>PM</span>
              </div>
            </div>
            <div id="proto-nexus-buttons">
              {buttons.map((button) => (
                <button type="button" key={button.label}>
                  {button.icon}
                </button>
              ))}
            </div>
            <ul id="proto-nexus-weather">
              {weather.map((item) => (
                <li key={item.quarter} className="proto-nexus-weather-item">
                  <span className="proto-nexus-weather-label">{item.quarter}</span>
                  <div>
                    {item.icon}
                    <span>{item.temp}°</span>
                  </div>
                  <div>
                    <IconRain aria-label="Chance of rain" />
                    <span>{item.rain}%</span>
                  </div>
                </li>
              ))}
            </ul>
            <AudioPlayer />
          </div>
          <div id="proto-nexus-right">
            <div id="proto-nexus-thing1"></div>
            <div id="proto-nexus-thing2"></div>
          </div>
        </section>
      </main>
    </>
  );
}
