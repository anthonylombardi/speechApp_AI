export function $(selector) {
  return document.querySelector(selector);
}

export function showElement(selector) {
  $(selector).classList.remove('hidden');
}

export function hideElement(selector) {
  $(selector).classList.add('hidden');
}

export function showElement(selector) {
  const element = $(selector);
  if (element) {
      element.classList.remove('hidden');
  } else {
      console.warn(`Element with selector "${selector}" not found`);
  }
}

