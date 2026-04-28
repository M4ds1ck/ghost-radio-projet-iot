import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import Sidebar from './components/Layout/Sidebar'
import TopBar from './components/Layout/TopBar'
import { formatModeLabel } from './constants/hardware'
import useSystemState from './hooks/useSystemState'
import ArchitecturePage from './pages/ArchitecturePage'
import Dashboard from './pages/Dashboard'
import JammingPage from './pages/JammingPage'
import ReplayPage from './pages/ReplayPage'
import ScannerPage from './pages/ScannerPage'
import SignalNormalPage from './pages/SignalNormalPage'
import TopologyPage from './pages/TopologyPage'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/scanner': 'Scanner',
  '/jamming': 'Jamming',
  '/replay': 'Replay',
  '/signal-normal': 'Signal Normal',
  '/topology': 'Topologie Hardware',
  '/architecture': 'Architecture IoT',
}

const PAGE_TRANSITION = {
  initial: { opacity: 0, x: 18 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/jamming" element={<JammingPage />} />
          <Route path="/replay" element={<ReplayPage />} />
          <Route path="/signal-normal" element={<SignalNormalPage />} />
          <Route path="/topology" element={<TopologyPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function Shell() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { systemState, api } = useSystemState()
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Dashboard'

  useEffect(() => {
    document.title = `Ghost Radio | ${pageTitle}`
    const meta =
      document.querySelector('meta[name="description"]') ??
      (() => {
        const created = document.createElement('meta')
        created.name = 'description'
        document.head.appendChild(created)
        return created
      })()

    meta.content =
      'Dashboard React de la couche Application pour ESP32, CC1101, REST 192.168.4.1, SQLite et SPIFFS.'
  }, [pageTitle])

  useEffect(() => {
    console.log(`Ghost Radio Application Layer
ESP32 + CC1101 + REST API @ 192.168.4.1
Mode actif: ${formatModeLabel(systemState.mode)}`)
  }, [systemState.mode])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[color:var(--text-primary)]">
      <Sidebar
        currentMode={systemState.mode}
        connected={systemState.connected}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen md:pl-[272px]">
        <TopBar
          pageTitle={pageTitle}
          systemState={systemState}
          onToggleSidebar={() => setSidebarOpen((current) => !current)}
        />

        <main className="px-4 py-4 md:px-6 md:py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={PAGE_TRANSITION}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <Outlet context={{ systemState, api }} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default App
