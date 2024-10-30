export function $(selector) {
  return document.querySelector(selector);
}

export function showElement(selector) {
  const element = $(selector);
  if (element) {
    element.classList.remove('hidden');
  } else {
    console.warn(`Element with selector "${selector}" not found`);
  }
}

export function hideElement(selector) {
  const element = $(selector);
  if (element) {
    element.classList.add('hidden');
  } else {
    console.warn(`Element with selector "${selector}" not found`);
  }
}
