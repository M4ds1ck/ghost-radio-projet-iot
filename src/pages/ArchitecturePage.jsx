import { useState } from 'react'
import { IOT_LAYERS } from '../constants/hardware'

export default function ArchitecturePage() {
  const [activeLayer, setActiveLayer] = useState('application')
  const selectedLayer =
    IOT_LAYERS.find((layer) => layer.key === activeLayer) ?? IOT_LAYERS[IOT_LAYERS.length - 1]

  return (
    <section className="space-y-4">
      <section className="panel dense-panel p-4">
        <div className="section-label">Architecture IoT - 4 couches</div>
        <div className="mt-2 text-sm text-slate-400">
          La couche Application recoit les donnees de l ESP32 via WiFi et HTTP REST sur 192.168.4.1, stocke les metadonnees en SQLite et visualise les captures IQ restees sur SPIFFS.
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="panel dense-panel p-4">
          <div className="section-label">Flux vertical</div>
          <div className="mt-4 space-y-3">
            {IOT_LAYERS.map((layer, index) => {
              const isActive = selectedLayer.key === layer.key
              return (
                <div key={layer.key}>
                  <button
                    type="button"
                    onClick={() => setActiveLayer(layer.key)}
                    className={`w-full border px-4 py-4 text-left transition ${
                      isActive
                        ? 'border-[var(--accent-green)] bg-[rgba(0,255,136,0.05)]'
                        : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Couche {index + 1}
                        </div>
                        <div className="mt-1 text-sm uppercase tracking-[0.16em] text-slate-100">
                          {layer.title}
                        </div>
                        <div className="mt-2 text-sm text-slate-400">{layer.summary}</div>
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                        {layer.protocol}
                      </div>
                    </div>
                    {isActive && (
                      <div className="mt-4 border-t border-white/10 pt-4 text-sm text-slate-300">
                        {layer.description}
                      </div>
                    )}
                  </button>
                  {index < IOT_LAYERS.length - 1 && (
                    <div className="flex justify-center py-1 text-slate-600">|</div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="panel dense-panel p-4">
            <div className="section-label">Details de la couche</div>
            <div className="mt-4 border border-white/10 bg-white/[0.02] p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                {selectedLayer.title}
              </div>
              <div className="mt-2 text-sm text-slate-300">{selectedLayer.description}</div>
              <div className="mt-4 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                Composants / services
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {selectedLayer.components.map((component) => (
                  <li key={component} className="border border-white/10 bg-[#0c1118] px-3 py-2">
                    {component}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="panel dense-panel p-4">
            <div className="section-label">Flux de donnees</div>
            <div className="mono-block mt-4 whitespace-pre-wrap text-sm text-slate-300">
{`Walkie-talkie (446 MHz)
  -> Antenne SMA
  -> CC1101
  -> SPI / GPIO
  -> ESP32
  -> WiFi 192.168.4.1
  -> HTTP REST
  -> Dashboard React`}
            </div>
          </section>
        </aside>
      </div>
    </section>
  )
}
