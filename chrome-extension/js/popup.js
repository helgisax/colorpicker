document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.executeScript({
      code: 'document.body.style.cursor="crosshair";'
  });

  chrome.tabs.executeScript({
      file: 'js/contentScript.js'
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
  const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
  return result ? "#" +
      (1 << 24 | +result[1] << 16 | +result[2] << 8 | +result[3]).toString(16).slice(1).toUpperCase() : rgb;
}

const rgbToHsl = (rgb) => {
  const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
  if (!result) return rgb;
  let r = result[1] / 255;
  let g = result[2] / 255;
  let b = result[3] / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min) {
      h = s = 0;
  } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  return `hsl(${(h * 360).toFixed(0)}, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%)`;
}
