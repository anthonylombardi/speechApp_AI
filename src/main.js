import { initOptions, setPhrase, speakText } from './voiceUtils.js';
import { setStorage, getStorage } from './storage.js';
import { showElement, hideElement, $ } from './ui.js';

window.addEventListener('load', function () {
  if (!('speechSynthesis' in window && 'webkitSpeechRecognition' in window)) {
    console.warn('Browser does not support Web Speech API');
    return;
  }

  $('#button-start').addEventListener('click', () => {
    showElement('#page-main');
    hideElement('#page-start');
    requestMicrophoneAccess(); // Call this after the START button is clicked
  });

  initOptions();

  $('#page-main #button-prev-phrase').addEventListener('click', () => setPhrase(-1));
  $('#page-main #button-next-phrase').addEventListener('click', () => setPhrase(1));

  fetchTextsAndHomophones();
});

function fetchTextsAndHomophones() {
  Promise.all(['A2_11.txt', 'homophones.txt'].map(file => fetch(file).then(res => res.text())))
    .then(([texts, homophones]) => {
      setStorage('texts', parseTexts(texts));
      setStorage('homophones', parseHomophones(homophones));
      initOptions();
      $('#loading').remove();
    });
}

function requestMicrophoneAccess() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      console.log('Microphone access granted');
      $('#microphone').style.display = 'none'; // Hide the microphone access prompt
    })
    .catch(err => {
      console.error('Microphone access denied:', err);
      $('#microphone').textContent = 'Microphone access required to proceed';
      $('#microphone').classList.remove('hidden'); // Ensure it is visible if access is denied
    });
}
