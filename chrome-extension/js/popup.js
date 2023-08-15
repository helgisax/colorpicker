document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.executeScript({
      code: 'document.body.style.cursor="crosshair";'
  });

  chrome.tabs.executeScript({
      code: `(${fetchColorFromPage.toString()})();`
  });
  
  displayRecentColors();
});

const fetchColorFromPage = () => {
  document.body.addEventListener('click', (e) => {
      const color = window.getComputedStyle(e.target).backgroundColor;
      chrome.runtime.sendMessage(color);
      document.body.style.cursor = '';
  }, { once: true });
}

const storeColor = (color) => {

  let colors = JSON.parse(localStorage.getItem('recentColors') || '[]');
  colors.unshift(color);
  if (colors.length > 11) {
      colors.pop();
  }
  localStorage.setItem('recentColors', JSON.stringify(colors));

  const recentColorsSection = document.getElementById('recentColors');
  recentColorsSection.innerHTML = '';

  colors.forEach(storedColor => {
      const colorDiv = document.createElement('div');
      colorDiv.classList.add('color-circle'); 
      colorDiv.style.backgroundColor = storedColor;
      recentColorsSection.appendChild(colorDiv);
  });
}

const displayRecentColors = () => {
  const recentColorsSection = document.getElementById('recentColors');
  const colors = JSON.parse(localStorage.getItem('recentColors') || '[]');

  recentColorsSection.innerHTML = '';

  colors.forEach((color) => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'color-circle';
      colorDiv.style.backgroundColor = color;
      colorDiv.title = color;
      recentColorsSection.appendChild(colorDiv);
  });
}

chrome.runtime.onMessage.addListener(color => {
  const hexCodeUpper = document.getElementById('hexCodeUpper');
  const hexCodeLower = document.getElementById('hexCodeLower');
  const cssCode = document.getElementById('cssCode');
  const hslCode = document.getElementById('hslCode');
  const selectedColor = document.getElementById('selectedColor');

  const { r, g, b } = extractRGB(color);
  const hexValue = rgbToHex(color);

  hexCodeUpper.value = hexValue ? hexValue.toUpperCase() : '';
  hexCodeLower.value = hexValue ? hexValue.toLowerCase() : '';
  cssCode.value = color;
  hslCode.value = r && g && b ? rgbToHsl(r, g, b) : '';
  selectedColor.style.backgroundColor = color;

  storeColor(color);
});

const rgbToHex = (rgb) => {
  const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
  return result ? `#${parseInt(result[1]).toString(16).padStart(2, '0')}${parseInt(result[2]).toString(16).padStart(2, '0')}${parseInt(result[3]).toString(16).padStart(2, '0')}`.toUpperCase() : null;
}

const rgbToHsl = (r, g, b) => {
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min) {
      h = s = 0; // achromatic
  } else {
      const delta = max - min;
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      switch (max) {
          case r: h = (g - b) / delta + (g < b ? 6 : 0); break;
          case g: h = (b - r) / delta + 2; break;
          case b: h = (r - g) / delta + 4; break;
      }
      h /= 6;
  }

  return `hsl(${(h * 360).toFixed(0)}, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%)`;
}

const extractRGB = (rgbString) => {
  const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgbString);
  if (result) {
      return {
          r: parseInt(result[1]),
          g: parseInt(result[2]),
          b: parseInt(result[3])
      };
  }
  return null;
}

const clearRecentColors = () => {
  const recentColorsContainer = document.getElementById('recentColors');
  recentColorsContainer.innerHTML = '';
  localStorage.removeItem('recentColors');
}

document.getElementById('clear').addEventListener('click', clearRecentColors);

