function generateColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  const saturation = 65 + (hash % 20);
  const lightness = 85 + (hash % 10);

  return {
    background: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    text: `hsl(${hue}, ${saturation}%, 25%)`,
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const badges = document.querySelectorAll(".category-badge");

  badges.forEach((badge) => {
    var label = badge.dataset.label;
    var color = generateColorFromString(label);
    badge.innerHTML = label;
    badge.style.background = color.background;
    badge.style.color = color.text;
  });
});
