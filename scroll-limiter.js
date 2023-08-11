// Get the content container
const content = document.querySelector('.content');

let lastTimestamp = null;
let animationFrameId = null;
let isScrolling = false;

// Limit the scroll speed to a specific value (e.g., 100 pixels per frame)
function limitScrollSpeed(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
  }

  const deltaTime = timestamp - lastTimestamp;
  const maxScrollSpeed = 5; // Adjust this value as needed

  if (!isScrolling) {
    content.style.overflow = 'hidden';
    isScrolling = true;
  }

  if (deltaTime > 16) { // Update every 16ms (roughly 60 FPS)
    content.scrollTop += maxScrollSpeed * (deltaTime / 16);
    lastTimestamp = timestamp;
  }

  animationFrameId = requestAnimationFrame(limitScrollSpeed);
}

// Listen for scroll events and call the scrolling function
content.addEventListener('scroll', () => {
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(limitScrollSpeed);
  }
});

// Stop limiting the scroll speed when the user stops scrolling
window.addEventListener('scroll', () => {
  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  lastTimestamp = null;
  isScrolling = false;
  content.style.overflow = 'auto';
});
