import { getStorage, setStorage } from './storage.js';
import { $ } from './ui.js';

export function initOptions() {
  const voiceSpeedInput = document.getElementById('speech-voice-speed');
  if (voiceSpeedInput) {
    const voiceSpeed = getStorage('speech-voice-speed', 1);
    voiceSpeedInput.value = voiceSpeed;

    voiceSpeedInput.addEventListener('change', e => {
      setStorage('speech-voice-speed', e.target.value);
    });
  } else {
    console.warn('Element #speech-voice-speed not found');
  }
}

export function setPhrase(change) {
  const texts = getStorage('texts', {});
  const phrases = texts.phrases || [];
  let currentPhrase = getStorage('current-phrase', 0);
  currentPhrase = Math.max(0, Math.min(phrases.length - 1, currentPhrase + change));
  $('#phrase').innerText = phrases[currentPhrase];
  setStorage('current-phrase', currentPhrase);
}

export function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = getVoiceOption();
  utterance.rate = getStorage('speech-voice-speed', 1);
  window.speechSynthesis.speak(utterance);
}

function getVoiceOption() {
  const voices = speechSynthesis.getVoices();
  return voices.find(voice => voice.lang.includes('en')) || voices[0];
}
