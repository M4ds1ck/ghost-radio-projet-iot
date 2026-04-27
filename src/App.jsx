import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import ESP32Screen from './components/ESP32Screen/ESP32Screen'
import CRTOverlay from './components/Layout/CRTOverlay'
import Sidebar from './components/Layout/Sidebar'
import TopBar from './components/Layout/TopBar'
import { GNURADIO } from './constants/gnuradio'
import Dashboard from './pages/Dashboard'
import JammingPage from './pages/JammingPage'
import ReplayPage from './pages/ReplayPage'
import ScannerPage from './pages/ScannerPage'
import SignalNormalPage from './pages/SignalNormalPage'
import TopologyPage from './pages/TopologyPage'

const pageTitles = {
  '/': 'Dashboard',
  '/signal-normal': 'Signal Normal',
  '/scanner': 'Scanner',
  '/jamming': 'Jamming',
  '/replay': 'Replay',
  '/topology': 'Hardware Topology',
}

const pageTransition = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -18 },
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signal-normal" element={<SignalNormalPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/jamming" element={<JammingPage />} />
          <Route path="/replay" element={<ReplayPage />} />
          <Route path="/topology" element={<TopologyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function Shell() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [esp32Open, setEsp32Open] = useState(false)
  const [scannerActive, setScannerActive] = useState(false)
  const [jammerActive, setJammerActive] = useState(false)
  const [replayPlaying, setReplayPlaying] = useState(false)
  const [jammerPower, setJammerPower] = useState(
    GNURADIO.jamming.jammer_power_default,
  )
  const pageToMenuIndex = {
    '/scanner': 0,
    '/jamming': 1,
    '/replay': 2,
    '/signal-normal': 3,
  }
  const defaultSelection = pageToMenuIndex[location.pathname] ?? 0
  const esp32InstanceKey = esp32Open
    ? `open-${defaultSelection}`
    : `closed-${defaultSelection}-${jammerPower}`

  useEffect(() => {
    const title = pageTitles[location.pathname] ?? 'Console'
    document.title = `\u{1f47b} Ghost Radio | ${title}`
    const meta =
      document.querySelector('meta[name="description"]') ??
      (() => {
        const created = document.createElement('meta')
        created.name = 'description'
        document.head.appendChild(created)
        return created
      })()
    meta.content = `Ghost Radio - ${title} · Application Layer · IoT Architecture Demo`
  }, [location.pathname])

  useEffect(() => {
    console.log(`\
 .-.       .-. 
(   \\ .-. /   )
 \\   (   )   / 
  \\   '-'   /  
   '.___.__.'  
Ghost Radio v2.4 \u2014 GNU Radio 3.10.12.0`)
  }, [])

  const statuses = {
    signalNormal: location.pathname === '/signal-normal' ? 'active' : 'ready',
    scanner: scannerActive ? 'active' : location.pathname === '/scanner' ? 'ready' : 'idle',
    jammer: jammerActive ? 'active' : location.pathname === '/jamming' ? 'ready' : 'idle',
    replay: replayPlaying ? 'active' : location.pathname === '/replay' ? 'ready' : 'idle',
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-primary)] text-[color:var(--text-primary)]">
      <CRTOverlay />
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenDevice={() => setEsp32Open(true)}
      />
      <div className="relative min-h-screen md:pl-72">
        <TopBar
          statuses={statuses}
          jammerActive={jammerActive}
          onToggleSidebar={() => setSidebarOpen((current) => !current)}
        />
        <main className="relative px-4 pb-6 pt-4 md:px-8 md:pb-8 md:pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Outlet
                context={{
                  openEsp32: () => setEsp32Open(true),
                  jammerPower,
                  setJammerPower,
                  scannerActive,
                  setScannerActive,
                  jammerActive,
                  setJammerActive,
                  replayPlaying,
                  setReplayPlaying,
                }}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <ESP32Screen
        key={esp32InstanceKey}
        open={esp32Open}
        onClose={() => setEsp32Open(false)}
        jammerPower={jammerPower}
        onPowerChange={setJammerPower}
        activePage={defaultSelection}
      />
    </div>
  )
}

export default App
