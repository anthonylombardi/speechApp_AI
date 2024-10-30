import { getStorage, setStorage } from './storage.js';
import { $ } from './ui.js';

export function initOptions() {
  const voices = window.speechSynthesis.getVoices();
  const voiceSpeed = getStorage('speech-voice-speed', 1);
  $('#speech-voice-speed').value = voiceSpeed;

  // Set event listeners for option changes
  $('#speech-voice-speed').addEventListener('change', e => {
    setStorage('speech-voice-speed', e.target.value);
  });
}

export function setPhrase(change) {
  const phrases = getStorage('texts').phrases;
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
  return voices.find(voice => voice.lang.includes('en'));
}
