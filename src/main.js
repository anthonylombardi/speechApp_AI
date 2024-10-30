import { initOptions, setPhrase, speakText } from './voiceUtils.js';
import { setStorage, getStorage } from './storage.js';
import { showElement, hideElement, $(selector) } from './ui.js';

window.addEventListener('load', function () {
  if (!('speechSynthesis' in window && 'webkitSpeechRecognition' in window)) return;

  $('#button-start').addEventListener('click', () => {
    showElement('#page-main');
    hideElement('#page-start');
  });

  initOptions();

  $('#page-main #button-prev-phrase').addEventListener('click', () => setPhrase(-1));
  $('#page-main #button-next-phrase').addEventListener('click', () => setPhrase(1));
  
  // Load texts and set up other components
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
