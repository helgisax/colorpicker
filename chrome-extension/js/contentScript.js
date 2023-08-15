document.body.addEventListener('click', (e) => {
  const color = window.getComputedStyle(e.target).backgroundColor;
  chrome.runtime.sendMessage(color);
  document.body.style.cursor = '';
}, { once: true });