export const SYSTEM_IP = '192.168.4.1'
export const TARGET_FREQUENCY_MHZ = 446.0
export const FIRMWARE_VERSION = 'ESP32 fw v1.2.0'
export const SQLITE_ENGINE = 'SQLite 3'
export const SPIFFS_ROOT = '/spiffs'

export const MODE_DETAILS = {
  scanner: {
    label: 'Scanner',
    color: '#3399ff',
    description:
      'Ecoute passive sur le canal PMR446. Le CC1101 remonte les trames RF vers l ESP32, puis le dashboard affiche RSSI, spectre et captures.',
  },
  jamming: {
    label: 'Jamming',
    color: '#ff3355',
    description:
      'Emission de bruit sur 446.0 MHz. L ESP32 force le transceiver RF a brouiller le canal et expose le niveau de puissance au dashboard.',
  },
  replay: {
    label: 'Replay',
    color: '#ffcc00',
    description:
      'Reemission d une capture IQ deja stockee sur SPIFFS. La couche Application selectionne la capture puis lance la lecture distante.',
  },
  normal: {
    label: 'Signal Normal',
    color: '#00ff88',
    description:
      'Reference baseline sans activite malveillante. L application montre un signal sinusoidal propre a 1 kHz pour comparaison.',
  },
}

export const API_ENDPOINTS = [
  'GET /api/status',
  'GET /api/captures',
  'GET /api/signal',
  'POST /api/mode',
  'POST /api/jammer',
  'POST /api/replay/start',
  'POST /api/replay/stop',
]

export const SQLITE_SCHEMA = {
  captures: `CREATE TABLE captures (
  id          INTEGER PRIMARY KEY,
  timestamp   DATETIME,
  frequency   REAL,
  duration    INTEGER,
  size_bytes  INTEGER,
  rssi_peak   REAL,
  file_path   TEXT
);`,
  signalLogs: `CREATE TABLE signal_logs (
  id        INTEGER PRIMARY KEY,
  timestamp DATETIME,
  frequency REAL,
  rssi      REAL,
  mode      TEXT
);`,
}

export const HARDWARE = {
  esp32: {
    id: 'esp32',
    name: 'ESP32 DevKit v1',
    summary: '240MHz dual-core | 520KB SRAM | 4MB Flash | Wi-Fi 802.11 b/g/n',
    layer: 'Traitement',
    connection: 'Hub central | SPI / I2C / GPIO / WiFi',
    role:
      'Microcontroleur principal. Il recoit les bits du CC1101, pilote l OLED, lit les boutons, publie l API REST et conserve les metadonnees de captures.',
    specs: [
      'CPU Xtensa dual-core 240MHz',
      '520KB SRAM',
      '4MB Flash',
      'Wi-Fi 802.11 b/g/n',
      'GPIO 5 SCK',
      'GPIO 19 MISO',
      'GPIO 27 MOSI',
      'GPIO 16 CSN',
      'GPIO 2 GDO0',
      'GPIO 4 GDO2',
      'GPIO 21 SDA',
      'GPIO 22 SCL',
    ],
  },
  cc1101: {
    id: 'cc1101',
    name: 'CC1101 RF Transceiver',
    summary: '300-928 MHz | PMR446 front-end | SPI controlled',
    layer: 'Perception',
    connection: 'SPI + GPIO vers ESP32',
    role:
      'Transceiver sub-GHz. Il capte ou emet le trafic 446 MHz et expose les evenements radio bruts a l ESP32 via SPI et lignes GDO.',
    specs: [
      'Bande 300-928 MHz',
      'Canal cible 446.0 MHz',
      'Pins VCC, GND, MOSI, MISO, SCK, CSN, GDO0, GDO2',
      'Module RF principal du systeme',
    ],
  },
  antenna: {
    id: 'antenna',
    name: 'Antenne SMA 446 MHz',
    summary: 'Whip SMA accordee PMR446',
    layer: 'Perception',
    connection: 'Liaison RF orange vers CC1101',
    role:
      'Convertit les ondes radio en signal electrique pour le CC1101, puis rayonne le brouillage ou la reemission vers la cible.',
    specs: [
      'SMA femelle',
      'Frequence centrale 446 MHz',
      'Usage emission / reception',
    ],
  },
  oled: {
    id: 'oled',
    name: 'OLED SSD1306 128x64',
    summary: 'Ecran I2C 128x64 | adresse 0x3C',
    layer: 'Perception',
    connection: 'I2C | SDA GPIO21 | SCL GPIO22',
    role:
      'Interface locale du dispositif. Affiche le mode actif, la frequence et la navigation physique des boutons.',
    specs: [
      '128x64 pixels',
      'Controleur SSD1306',
      'Adresse I2C 0x3C',
      'Alimentation 3.3V',
    ],
  },
  buttonUp: {
    id: 'buttonUp',
    name: 'Bouton UP',
    summary: 'Tactile 6x6mm | pull-up 10k',
    layer: 'Perception',
    connection: 'GPIO 12',
    role: 'Navigation physique vers le haut dans le menu local.',
    specs: ['Bouton momentane 6x6mm', 'Resistance de pull-up 10k', 'Entree GPIO 12'],
  },
  buttonDown: {
    id: 'buttonDown',
    name: 'Bouton DOWN',
    summary: 'Tactile 6x6mm | pull-up 10k',
    layer: 'Perception',
    connection: 'GPIO 13',
    role: 'Navigation physique vers le bas dans le menu local.',
    specs: ['Bouton momentane 6x6mm', 'Resistance de pull-up 10k', 'Entree GPIO 13'],
  },
  buttonSelect: {
    id: 'buttonSelect',
    name: 'Bouton SELECT',
    summary: 'Tactile 6x6mm | pull-up 10k',
    layer: 'Perception',
    connection: 'GPIO 14',
    role: 'Validation d une action: lancement du scanner, jamming, replay ou retour a la reference.',
    specs: ['Bouton momentane 6x6mm', 'Resistance de pull-up 10k', 'Entree GPIO 14'],
  },
  battery: {
    id: 'battery',
    name: 'Batterie Li-ion 18650',
    summary: 'Cellule unique 3.7V nominale',
    layer: 'Perception',
    connection: 'Rail puissance principal',
    role:
      'Source d energie du systeme autonome. Elle alimente le chargeur TP4056 puis le regulateur 3.3V du reste du montage.',
    specs: ['Cellule 18650', '3.7V nominal', 'Alimente le TP4056'],
  },
  tp4056: {
    id: 'tp4056',
    name: 'Module TP4056',
    summary: 'Charge USB pour cellule Li-ion',
    layer: 'Traitement',
    connection: 'USB alimentation -> batterie',
    role:
      'Assure la charge de la cellule 18650 depuis USB et fournit le point d entree energie pour le montage.',
    specs: ['Chargeur Li-ion', 'Entree micro/USB 5V', 'Sortie vers batterie 18650'],
  },
  regulator: {
    id: 'regulator',
    name: 'AMS1117-3.3V',
    summary: 'Regulateur lineaire 3.3V',
    layer: 'Traitement',
    connection: 'Distribution VCC 3.3V',
    role:
      'Convertit la tension batterie/charge vers un rail 3.3V stable pour l ESP32, le CC1101 et l ecran OLED.',
    specs: ['Sortie 3.3V', 'Boitier type TO-220 / SOT', 'Rail systeme principal'],
  },
  capacitors: {
    id: 'capacitors',
    name: 'Condensateurs 100uF + 100nF',
    summary: 'Filtrage bulk et decouplage',
    layer: 'Perception',
    connection: 'Entre VCC et GND',
    role:
      'Stabilisent le rail d alimentation et limitent le bruit transitoire autour du regulateur et du transceiver RF.',
    specs: ['100uF electrolytique', '100nF decouplage', 'Montes sur le rail 3.3V'],
  },
  target: {
    id: 'target',
    name: 'Walkie-talkie PMR446',
    summary: 'Cible radio analogique sur 446 MHz',
    layer: 'Reseau',
    connection: 'Milieu RF',
    role:
      'Emetteur ou recepteur cible observe par le montage. Le scanner ecoute ses emissions, le jamming brouille son canal, le replay reemet vers lui.',
    specs: ['PMR446', 'Canal analogique 446 MHz', 'Cible distante du systeme'],
  },
  wifi: {
    id: 'wifi',
    name: 'Lien WiFi 192.168.4.1',
    summary: 'HTTP REST sur reseau local ESP32',
    layer: 'Reseau',
    connection: 'WiFi violet',
    role:
      'Transporte les commandes et la telemetrie entre l ESP32 et le navigateur. C est le pont reseau de la couche Application.',
    specs: ['ESP32 soft AP', 'HTTP REST', 'JSON status / captures / signal'],
  },
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard React',
    summary: 'Couche Application distante',
    layer: 'Application',
    connection: 'fetch() HTTP',
    role:
      'Visualise les donnees du systeme, pilote les modes a distance, affiche les captures SQLite et explique la topologie hardware.',
    specs: ['React 18 + Vite', 'Recharts', 'React Router', 'UI de supervision'],
  },
}

export const TOPOLOGY_COMPONENTS = [
  HARDWARE.buttonUp,
  HARDWARE.buttonDown,
  HARDWARE.buttonSelect,
  HARDWARE.battery,
  HARDWARE.tp4056,
  HARDWARE.regulator,
  HARDWARE.capacitors,
  HARDWARE.cc1101,
  HARDWARE.esp32,
  HARDWARE.oled,
  HARDWARE.antenna,
  HARDWARE.wifi,
  HARDWARE.dashboard,
  HARDWARE.target,
]

export const INITIAL_CAPTURES = [
  {
    id: 1,
    timestamp: '2026-04-28 02:15:33',
    frequency: 446.0,
    duration: 4,
    size_bytes: 38400,
    rssi_peak: -61,
    file_path: '/spiffs/capture_001.iq',
  },
  {
    id: 2,
    timestamp: '2026-04-28 01:48:12',
    frequency: 446.0,
    duration: 7,
    size_bytes: 67200,
    rssi_peak: -58,
    file_path: '/spiffs/capture_002.iq',
  },
  {
    id: 3,
    timestamp: '2026-04-27 23:41:09',
    frequency: 445.9875,
    duration: 5,
    size_bytes: 48000,
    rssi_peak: -66,
    file_path: '/spiffs/capture_003.iq',
  },
  {
    id: 4,
    timestamp: '2026-04-27 21:09:44',
    frequency: 446.0063,
    duration: 9,
    size_bytes: 86400,
    rssi_peak: -55,
    file_path: '/spiffs/capture_004.iq',
  },
  {
    id: 5,
    timestamp: '2026-04-27 18:52:17',
    frequency: 446.0188,
    duration: 3,
    size_bytes: 28800,
    rssi_peak: -73,
    file_path: '/spiffs/capture_005.iq',
  },
]

export const INITIAL_SIGNAL_LOGS = [
  { id: 1, timestamp: '2026-04-28 02:15:33', frequency: 446.0, rssi: -72, mode: 'scanner' },
  { id: 2, timestamp: '2026-04-28 02:15:36', frequency: 446.0, rssi: -69, mode: 'scanner' },
  { id: 3, timestamp: '2026-04-28 02:15:42', frequency: 446.0, rssi: -76, mode: 'normal' },
  { id: 4, timestamp: '2026-04-28 02:16:03', frequency: 446.0, rssi: -60, mode: 'replay' },
]

export const INITIAL_DETECTIONS = [
  {
    id: 'pmr-1',
    label: 'Porteuse PMR CH-06',
    frequency: 446.0063,
    rssi: -67,
    status: 'ACTIVE',
    note: 'Activite vocale stable',
  },
  {
    id: 'pmr-2',
    label: 'Burst etroit intermittent',
    frequency: 445.9875,
    rssi: -79,
    status: 'INTERMITTENT',
    note: 'Faible duree utile',
  },
  {
    id: 'pmr-3',
    label: 'Porteuse quasi-fixe',
    frequency: 446.0188,
    rssi: -63,
    status: 'LOCKED',
    note: 'Candidat replay',
  },
]

export const IOT_LAYERS = [
  {
    key: 'perception',
    title: 'PERCEPTION',
    summary: 'CC1101 + Antenne + Boutons + OLED',
    protocol: 'RF / GPIO / I2C',
    description:
      'Couche physique du montage. Elle capture le signal RF, fournit les boutons d interaction locaux et restitue l etat sur l ecran SSD1306.',
    components: ['CC1101', 'Antenne SMA 446 MHz', 'Boutons UP / DOWN / SELECT', 'OLED SSD1306'],
  },
  {
    key: 'reseau',
    title: 'RESEAU',
    summary: 'WiFi ESP32 -> REST HTTP -> 192.168.4.1',
    protocol: '802.11 + HTTP/JSON',
    description:
      'Couche de transport entre l embarque et le navigateur. L ESP32 expose son etat, ses captures et ses commandes via des endpoints REST.',
    components: ['Soft AP ESP32', 'API /api/status', 'API /api/captures', 'API /api/signal'],
  },
  {
    key: 'traitement',
    title: 'TRAITEMENT',
    summary: 'ESP32 : traitement signal + SQLite + SPIFFS',
    protocol: 'SPI / filesystem',
    description:
      'Couche logique embarquee. Elle traite les donnees du CC1101, maintient les metadonnees SQLite, stocke les captures sur SPIFFS et pilote les modes.',
    components: ['ESP32 DevKit v1', 'SQLite embarque', 'SPIFFS', 'AMS1117-3.3V'],
  },
  {
    key: 'application',
    title: 'APPLICATION',
    summary: 'Dashboard React de supervision distante',
    protocol: 'fetch() / UI state',
    description:
      'Cette application. Elle visualise la topologie hardware, les spectres RF, les captures et permet de controler scanner, jamming et replay a distance.',
    components: ['Dashboard React', 'FFT temps reel', 'Table SQLite', 'Topologie hardware'],
  },
]

export function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${bytes} B`
}

export function formatUptime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')
}

export function formatModeLabel(mode) {
  return MODE_DETAILS[mode]?.label ?? MODE_DETAILS.normal.label
}

export function estimateSnr(power) {
  if (power <= 0) {
    return Number.POSITIVE_INFINITY
  }

  return -10 * Math.log10(power)
}

export function formatDbm(value) {
  return `${value.toFixed(0)} dBm`
}
