const { ipcRenderer } = require('electron');
// // All of the Node.js APIs are available in the preload process.
// // It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const textAreaSource = document.querySelector('[aria-label="Source text"]');
  ipcRenderer.on('translate', (event, word) => {
    textAreaSource.value = word
    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
  });
  textAreaSource.dispatchEvent(inputEvent);
  });
  
  textAreaSource.addEventListener('keyup', (e) => {
    ipcRenderer.send('input', e.target.value)
  });
});
