export function $(selector) {
  return document.querySelector(selector);
}

export function showElement(selector) {
  $(selector).classList.remove('hidden');
}

export function hideElement(selector) {
  $(selector).classList.add('hidden');
}
