export function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage(key, defaultValue = null) {
  return JSON.parse(localStorage.getItem(key)) || defaultValue;
}
