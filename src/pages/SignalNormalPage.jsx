import { useNavigate } from 'react-router-dom'
import FlowGraph from '../components/FlowGraph/FlowGraph'
import FFTChart from '../components/FFTChart/FFTChart'
import { GNURADIO, formatHertz } from '../constants/gnuradio'
import useCountUp from '../hooks/useCountUp'

export default function SignalNormalPage() {
  const navigate = useNavigate()
  const sampleRate = useCountUp(GNURADIO.signalNormal.samp_rate)
  const signalFrequency = useCountUp(GNURADIO.signalNormal.signal_freq)
  const fftSize = useCountUp(GNURADIO.signalNormal.fft_size)

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-sm border border-[rgba(255,214,10,0.35)] bg-[rgba(255,214,10,0.08)] px-3 py-2 text-[color:var(--accent-yellow)] shadow-[0_0_18px_rgba(255,214,10,0.16)]">
          REF
        </div>
        <div>
          <div className="text-2xl uppercase tracking-[0.18em] text-[color:var(--accent-yellow)]">
            Signal Normal - Reference Spectrum
          </div>
          <div className="mt-1 text-sm text-slate-400">
            Baseline clean signal from signal_normal.py
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="panel p-5 text-sm text-slate-300">
          <div className="section-heading">Signal Source</div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Type</span>
              <span>Sine Wave (GR_SIN_WAVE)</span>
            </div>
            <div className="flex justify-between">
              <span>Frequency</span>
              <span>{signalFrequency.toLocaleString('en-US')} Hz</span>
            </div>
            <div className="flex justify-between">
              <span>Amplitude</span>
              <span>1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Sample Rate</span>
              <span>{sampleRate.toLocaleString('en-US')} Hz</span>
            </div>
            <div className="flex justify-between">
              <span>Phase</span>
              <span>0 deg</span>
            </div>
            <div className="flex justify-between">
              <span>Output</span>
              <span>Complex IQ</span>
            </div>
          </div>

          <div className="section-heading mt-6">Throttle</div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Sample Rate</span>
              <span>{formatHertz(GNURADIO.signalNormal.samp_rate)} sps</span>
            </div>
            <div className="flex justify-between">
              <span>Limit</span>
              <span>Auto</span>
            </div>
          </div>

          <div className="section-heading mt-6">FFT Frequency Sink</div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>FFT Size</span>
              <span>{fftSize.toLocaleString('en-US')} bins</span>
            </div>
            <div className="flex justify-between">
              <span>Window Function</span>
              <span>Blackman-Harris</span>
            </div>
            <div className="flex justify-between">
              <span>Center Frequency</span>
              <span>0 Hz</span>
            </div>
            <div className="flex justify-between">
              <span>Bandwidth</span>
              <span>{formatHertz(GNURADIO.signalNormal.samp_rate)} Hz</span>
            </div>
            <div className="flex justify-between">
              <span>Y-axis</span>
              <span>-140 dB to +10 dB</span>
            </div>
            <div className="flex justify-between">
              <span>Y-label</span>
              <span>Relative Gain (dB)</span>
            </div>
            <div className="flex justify-between">
              <span>Update Time</span>
              <span>{GNURADIO.signalNormal.update_time * 1000} ms</span>
            </div>
            <div className="flex justify-between">
              <span>Autoscale</span>
              <span>OFF</span>
            </div>
            <div className="flex justify-between">
              <span>Grid</span>
              <span>OFF</span>
            </div>
            <div className="flex justify-between">
              <span>FFT Average</span>
              <span>1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Trace Color</span>
              <span>Blue</span>
            </div>
          </div>

          <div className="section-heading mt-6">Block Chain</div>
          <div className="mt-3 rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/75 p-3 text-xs uppercase tracking-[0.14em] text-slate-300">
            analog_sig_source_x_0 -&gt; blocks_throttle2_0 -&gt; qtgui_freq_sink_x_0
          </div>
        </section>

        <section className="panel p-5">
          <div className="section-heading">Reference FFT</div>
          <div className="mt-4 rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/75 p-4">
            <FFTChart mode="normal" height={450} />
          </div>
        </section>
      </div>

      <section className="panel p-5">
        <div className="section-heading">Flowgraph Topology</div>
        <div className="mt-4">
          <FlowGraph module="signal_normal" />
        </div>
      </section>

      <section className="rounded-sm border border-[rgba(255,214,10,0.35)] bg-[rgba(255,214,10,0.08)] p-5 text-sm text-slate-100 shadow-[0_0_18px_rgba(255,214,10,0.12)]">
        This is the reference signal before any attack. A 1 kHz complex sine wave
        at 32 kSps produces a single sharp FFT peak at +1 kHz. Compare this baseline
        with the Jamming page to observe SNR degradation as Gaussian noise is injected.
        <button
          type="button"
          onClick={() => navigate('/jamming')}
          className="ml-3 rounded-sm border border-[rgba(255,214,10,0.35)] bg-[rgba(255,214,10,0.08)] px-3 py-1 text-[11px] uppercase tracking-[0.15em] transition hover:bg-[rgba(255,214,10,0.16)]"
        >
          → Go to Jamming
        </button>
      </section>
    </section>
  )
}
