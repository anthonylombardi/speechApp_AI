import { initOptions, setPhrase, speakText } from './voiceUtils.js';
import { setStorage, getStorage } from './storage.js';
import { showElement, hideElement, $ } from './ui.js';

window.addEventListener('load', function () {
  if (!('speechSynthesis' in window && 'webkitSpeechRecognition' in window)) {
    console.warn('Browser does not support Web Speech API');
    return;
  }

  // Prevent page reload on START button click
  $('#button-start').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default behavior
    console.log('START button clicked'); // Confirm button click
    showElement('#page-main'); // Show main content
    hideElement('#page-start'); // Hide start screen
    requestMicrophoneAccess(); // Request microphone access
  });

  // Initialize options
  initOptions();

  // Set event listeners for phrase navigation buttons
  $('#page-main #button-prev-phrase').addEventListener('click', () => setPhrase(-1));
  $('#page-main #button-next-phrase').addEventListener('click', () => setPhrase(1));

  // Load texts and homophones data
  fetchTextsAndHomophones();
});

// Fetch texts and homophones, store them, and initialize options
function fetchTextsAndHomophones() {
  Promise.all(['A2_11.txt', 'homophones.txt'].map(file => fetch(file).then(res => res.text())))
    .then(([texts, homophones]) => {
      setStorage('texts', parseTexts(texts)); // Parse and store texts
      setStorage('homophones', parseHomophones(homophones)); // Parse and store homophones
      initOptions(); // Reinitialize options after loading data
      $('#loading').remove(); // Remove loading indicator
    });
}

// Request access to microphone
function requestMicrophoneAccess() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      console.log('Microphone access granted');
      $('#microphone').style.display = 'none'; // Hide microphone prompt
    })
    .catch(err => {
      console.error('Microphone access denied:', err);
      $('#microphone').textContent = 'Microphone access required to proceed';
      $('#microphone').classList.remove('hidden'); // Show error message if access denied
    });
}
