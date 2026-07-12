export const INTERIOR_TRANSITION_SOUND = {
  ENTER: "enter",
  EXIT: "exit",
};

const ENTER_DURATION_SECONDS = 1.15;
const EXIT_DURATION_SECONDS = 1.05;
const MASTER_GAIN = 0.28;

let sharedAudioContext = null;

function getAudioContext(AudioContextConstructor = globalThis.AudioContext) {
  if (!AudioContextConstructor) {
    return null;
  }

  if (!sharedAudioContext || sharedAudioContext.state === "closed") {
    sharedAudioContext = new AudioContextConstructor();
  }

  return sharedAudioContext;
}

function createNoiseBuffer(audioContext, durationSeconds) {
  const sampleCount = Math.max(
    1,
    Math.floor(audioContext.sampleRate * durationSeconds)
  );
  const buffer = audioContext.createBuffer(1, sampleCount, audioContext.sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    channelData[sampleIndex] = Math.random() * 2 - 1;
  }

  return buffer;
}

function scheduleWhoosh({
  audioContext,
  destination,
  startTime,
  durationSeconds,
  startFrequency,
  endFrequency,
  peakGain,
}) {
  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = createNoiseBuffer(audioContext, durationSeconds);

  const bandpass = audioContext.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.Q.value = 1.15;
  bandpass.frequency.setValueAtTime(startFrequency, startTime);
  bandpass.frequency.exponentialRampToValueAtTime(
    Math.max(endFrequency, 40),
    startTime + durationSeconds
  );

  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(
    peakGain,
    startTime + durationSeconds * 0.22
  );
  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    startTime + durationSeconds
  );

  noiseSource.connect(bandpass);
  bandpass.connect(gainNode);
  gainNode.connect(destination);
  noiseSource.start(startTime);
  noiseSource.stop(startTime + durationSeconds);
}

function scheduleWingTone({
  audioContext,
  destination,
  startTime,
  durationSeconds,
  startFrequency,
  endFrequency,
  peakGain,
}) {
  const oscillator = audioContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(startFrequency, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    Math.max(endFrequency, 40),
    startTime + durationSeconds
  );

  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(
    peakGain,
    startTime + durationSeconds * 0.18
  );
  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    startTime + durationSeconds
  );

  oscillator.connect(gainNode);
  gainNode.connect(destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + durationSeconds);
}

export function resetInteriorTransitionAudioForTests() {
  sharedAudioContext = null;
}

/**
 * Plays a short airy whoosh for phoenix interior enter/exit.
 * Enter: descending dive into the island area.
 * Exit: ascending soar back into open sky.
 */
export function playInteriorTransitionSound(
  transitionType,
  { AudioContextConstructor = globalThis.AudioContext } = {}
) {
  if (
    transitionType !== INTERIOR_TRANSITION_SOUND.ENTER &&
    transitionType !== INTERIOR_TRANSITION_SOUND.EXIT
  ) {
    return false;
  }

  const audioContext = getAudioContext(AudioContextConstructor);

  if (!audioContext) {
    return false;
  }

  const resumePromise =
    audioContext.state === "suspended" ? audioContext.resume() : Promise.resolve();

  resumePromise.catch(() => {
    // Autoplay / resume can fail until a gesture; callers already run on click.
  });

  const masterGain = audioContext.createGain();
  masterGain.gain.value = MASTER_GAIN;
  masterGain.connect(audioContext.destination);

  const startTime = audioContext.currentTime + 0.02;
  const isEnter = transitionType === INTERIOR_TRANSITION_SOUND.ENTER;
  const durationSeconds = isEnter
    ? ENTER_DURATION_SECONDS
    : EXIT_DURATION_SECONDS;

  scheduleWhoosh({
    audioContext,
    destination: masterGain,
    startTime,
    durationSeconds,
    startFrequency: isEnter ? 1400 : 280,
    endFrequency: isEnter ? 220 : 1600,
    peakGain: isEnter ? 0.9 : 0.85,
  });

  scheduleWingTone({
    audioContext,
    destination: masterGain,
    startTime: startTime + 0.05,
    durationSeconds: durationSeconds * 0.85,
    startFrequency: isEnter ? 520 : 260,
    endFrequency: isEnter ? 180 : 640,
    peakGain: 0.18,
  });

  return true;
}
