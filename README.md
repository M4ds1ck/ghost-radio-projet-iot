# 👻 Ghost Radio — Couche Application

Interactive operator dashboard for the **Ghost Radio** IoT project.
This repository is the **Application Layer** of a 4-layer IoT architecture built
for an IoT university module.

## Architecture

```text
┌──────────────────────────────────────────┐
│  APPLICATION  ← this repo                │  Operator UI, ESP32 simulator, dashboards
├──────────────────────────────────────────┤
│  TRAITEMENT                              │  ESP32-S3 microcontroller, payload logic
├──────────────────────────────────────────┤
│  RÉSEAU       ← teammate's part          │  GNU Radio 3.10.12 — Sniffer / Jamming /
│                                          │  Replay_Attack / signal_normal (.grc + .py)
├──────────────────────────────────────────┤
│  PERCEPTION                              │  Hardware: ESP32-S3 on Wokwi, nav buttons,
│                                          │  OLED screen, RF antenna
└──────────────────────────────────────────┘
```

## Pages

| Page | GNU Radio module | Description |
|---|---|---|
| Dashboard | — | Overview of all 4 modules + architecture panel + live FFT |
| Signal Normal | `signal_normal.py` | 1 kHz baseline sine · 32 kSps · FFT 1024 Blackman-Harris |
| Scanner (Sniffer) | `Sniffer.py` | NBFM capture → `captured_target.raw` (62 MB · 16.3 s · 480 kSps) |
| Jamming | `Jamming.py` | Gaussian noise injection · adjustable power · live SNR readout |
| Replay Attack | `Replay_Attack.py` | Looped playback of captured IQ file · gain ×0.5 |

## Features

- **ESP32 screen simulator** — navigable OLED menu (UP / SELECT / DOWN / BACK), mirrors
  the physical ESP32-S3 interface
- **GNU Radio flowgraph viewer** — block-level topology for each module with hover tooltips
- **Live FFT & IQ waveform charts** — parametrically driven by the actual `.py` constants
- **All parameters mirror the real scripts** — every constant in `src/constants/gnuradio.js`
  is pulled directly from the réseau layer's Python files

## Run locally

```bash
npm install
npm run dev
```

## Tech stack

React 18 · Vite · Tailwind CSS · Framer Motion · Recharts · React Router DOM
