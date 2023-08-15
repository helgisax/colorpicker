document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.executeScript({
      code: 'document.body.style.cursor="crosshair";'
  });

  chrome.tabs.executeScript({
      code: (${fetchColorFromPage})();
  });
});

const fetchColorFromPage = () => {
  document.body.addEventListener('click', (e) => {
      const color = window.getComputedStyle(e.target).backgroundColor;
      chrome.runtime.sendMessage(color);
      document.body.style.cursor = '';
  }, { once: true });
}

chrome.runtime.onMessage.addListener(color => {
  const hexCode = document.getElementById('hexCode');
  const cssCode = document.getElementById('cssCode');
  const hslCode = document.getElementById('hslCode');
  const selectedColor = document.getElementById('selectedColor');
  
  hexCode.value = rgbToHex(color);
  cssCode.value = color;
  hslCode.value = rgbToHsl(color);
  selectedColor.style.backgroundColor = color;
});

const rgbToHex = (rgb) => {
  return "#000000";
}

const rgbToHsl = (rgb) => {
  return "hsl(0, 0%, 0%)"; 
}