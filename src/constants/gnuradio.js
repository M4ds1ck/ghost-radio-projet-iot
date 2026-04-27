export const GNURADIO = {
  signalNormal: {
    samp_rate: 32000,
    signal_freq: 1000,
    amplitude: 1,
    fft_size: 1024,
    fft_window: 'WIN_BLACKMAN_hARRIS',
    y_min: -140,
    y_max: 10,
    update_time: 0.1,
    trace_color: 'blue',
  },
  sniffer: {
    samp_rate: 480000,
    input_file: 'final-version.wav',
    repeat: true,
    nbfm_audio_rate: 48000,
    nbfm_quad_rate: 480000,
    nbfm_tau: 75e-6,
    nbfm_max_dev: 5000,
    nbfm_fh: -1.0,
    output_file: 'captured_target.raw',
    output_size_bytes: 62481664,
    output_append: false,
    bytes_per_sample: 8, // complex64: 2 × 32-bit float (I + Q channels)
  },
  jamming: {
    samp_rate: 480000,
    input_file: 'final-version.wav',
    nbfm_tx_audio_rate: 48000,
    nbfm_tx_quad_rate: 480000,
    nbfm_tx_tau: 75e-6,
    nbfm_tx_max_dev: 5000,
    nbfm_tx_fh: -1.0,
    noise_type: 'GR_GAUSSIAN',
    noise_seed: 0,
    jammer_power_min: 0,
    jammer_power_max: 2,
    jammer_power_step: 0.2,
    jammer_power_default: 0,
    nbfm_rx_audio_rate: 48000,
    nbfm_rx_quad_rate: 480000,
    nbfm_rx_tau: 75e-6,
    nbfm_rx_max_dev: 5000,
    multiply_const: 0.2,
    audio_sink_rate: 48000,
  },
  replay: {
    samp_rate: 480000,
    input_file: 'captured_target.raw',
    input_size_bytes: 62481664,
    repeat: true,
    offset: 0,
    length: 0,
    nbfm_audio_rate: 48000,
    nbfm_quad_rate: 480000,
    nbfm_tau: 75e-6,
    nbfm_max_dev: 5000,
    multiply_const: 0.5,
    audio_sink_rate: 48000,
  },
}

export function getCaptureDurationSeconds() {
  return GNURADIO.sniffer.output_size_bytes /
    (GNURADIO.sniffer.samp_rate * GNURADIO.sniffer.bytes_per_sample)
}

export function formatMicroseconds(value) {
  return `${Math.round(value * 1e6)}\u00b5s`
}

export function formatHertz(value) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatBytes(bytes) {
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)} KB`
  return `${bytes} B`
}
