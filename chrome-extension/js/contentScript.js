const colorPreview = document.createElement('div');
colorPreview.style.position = 'absolute';
colorPreview.style.borderRadius = '50%';
colorPreview.style.width = '30px';
colorPreview.style.height = '30px';
colorPreview.style.zIndex = '9999';
colorPreview.style.pointerEvents = 'none';
colorPreview.style.display = 'none';
document.body.appendChild(colorPreview);

document.body.addEventListener('mousemove', (e) => {
  const color = window.getComputedStyle(e.target).backgroundColor;
  colorPreview.style.backgroundColor = color;
  colorPreview.style.left = `${e.clientX + 15}px`;
  colorPreview.style.top = `${e.clientY + 15}px`;
  colorPreview.style.display = 'block';
});

document.body.addEventListener('click', (e) => {
  const color = window.getComputedStyle(e.target).backgroundColor;
  chrome.runtime.sendMessage(color);
  colorPreview.style.display = 'none';
});
