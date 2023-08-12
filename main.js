
/* Handle document loading events */
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}
/*End document loading event handling */

/* Handle title screen events */
const startButton = document.getElementById('start-button');
const titleScreen = document.getElementById('title-screen');

startButton.addEventListener('click', () => {
    document.body.style.overflowY = 'scroll';
    titleScreen.style.animationName = 'fade-out';
    titleScreen.style.animationDuration = '1s';
    titleScreen.style.animationFillMode = 'forwards';
    
});

titleScreen.addEventListener('animationend', () => {
    titleScreen.style.display = 'none'; // Hide the element after the animation ends
});
/* End title screen event handling */