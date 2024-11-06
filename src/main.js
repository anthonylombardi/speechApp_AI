import { initOptions, setPhrase, speakText } from './voiceUtils.js';
import { setStorage, getStorage } from './storage.js';
import { showElement, hideElement, $ } from './ui.js';

window.addEventListener('load', function () {
  if (!('speechSynthesis' in window && 'webkitSpeechRecognition' in window)) {
    console.warn('Browser does not support Web Speech API');
    return;
  }

  // START button click handler to prevent page reload
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
    })
    .catch(error => {
      console.error('Error loading texts or homophones:', error);
      $('#loading').textContent = 'Failed to load resources.';
    });
}

// Request access to microphone
function requestMicrophoneAccess() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      console.log('Microphone access granted');
      $('#microphone').style.display = 'none'; // Hide microphone prompt
      initializeSpeechRecognition(stream);
    })
    .catch(err => {
      console.error('Microphone access denied:', err);
      $('#microphone').textContent = 'Microphone access required to proceed';
      $('#microphone').classList.remove('hidden'); // Show error message if access denied
    });
}

// Initialize Speech Recognition
function initializeSpeechRecognition(stream) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const startRecordBtn = document.getElementById('button-record');
  const stopRecordBtn = document.getElementById('button-stop-record');
  const transcriptDisplay = document.getElementById('transcript');
  const statusDisplay = document.getElementById('status');

  startRecordBtn.addEventListener('click', () => {
    recognition.start();
    statusDisplay.textContent = 'Listening...';
    startRecordBtn.disabled = true;
    stopRecordBtn.disabled = false;
    console.log('Speech recognition started');
  });

  stopRecordBtn.addEventListener('click', () => {
    recognition.stop();
    statusDisplay.textContent = 'Stopped';
    startRecordBtn.disabled = false;
    stopRecordBtn.disabled = true;
    console.log('Speech recognition stopped');
  });

  recognition.addEventListener('result', (event) => {
    const transcript = event.results[0][0].transcript;
    transcriptDisplay.textContent += transcript + '\n';
    console.log('Transcript:', transcript);
  });

  recognition.addEventListener('speechend', () => {
    recognition.stop();
    statusDisplay.textContent = 'Speech ended';
    startRecordBtn.disabled = false;
    stopRecordBtn.disabled = true;
    console.log('Speech has ended');
  });

  recognition.addEventListener('error', (event) => {
    statusDisplay.textContent = `Error: ${event.error}`;
    console.error('Speech recognition error:', event.error);
    startRecordBtn.disabled = false;
    stopRecordBtn.disabled = true;
  });
}