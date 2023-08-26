
/* Handle document loading events */
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}
/*End document loading event handling */

const timer = ms => new Promise(res => setTimeout(res, ms))

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

/* Add onclick info hiding */
function closeInfo(name) {
    // Remove text and hide
    const infoBox = document.getElementById(name);
    infoBox.querySelector("p").innerHTML = "";
    infoBox.style.display = "none";
}
/* End onclick info hiding */


/* Add onclick handling to interactable buildings */
const interactableBuildings = Array.from(document.getElementsByClassName("interactable"));

interactableBuildings.forEach(building => {
    building.addEventListener("click", async function(event) {
        // Function to handle building information
        
        // Get info box corresponding to the town clicked on
        const townNum = event.target.id[event.target.id.length - 1];
        
        const infoBox = document.getElementById("info" + townNum);
        const info = document.getElementById("data" + townNum).innerText;
    
        // Check box isn't already open
        if(infoBox.style.display == "block") {
            closeInfo(infoBox.id);
            return;
        }

        infoBox.style.display = "block";

        // Animate fade in
        infoBox.style.animationName = "fadeIn";
        infoBox.style.animationDuration = "0.5s";
        infoBox.style.animationFillMode = "forwards";
        var letter;
        var newline = String.fromCharCode(13, 10);
        var pause = false;
        // Animate typing effect
        if(infoBox.querySelector("p").innerHTML == "") {
            for(let i = 0; i < info.length; i++) {

                // If the loop has been externally cancelled, clear and start again
                if(infoBox.querySelector("p").innerHTML.length < 2 && i >= 2) {
                    infoBox.querySelector("p").innerHTML = "";
                    i = 0;
                }
                
                await timer(80);
                letter = info[i];
                if(letter == ".") {
                    pause = true;
                }
                infoBox.querySelector("p").innerHTML += letter;
                if(pause) {
                    await timer(250);
                    pause = false;
                }
            }
        }
    });
});
/* End building interaction */

/* Character animator */
var lastPos, currPos = 0;
var scrollIncrements = 2;
var scrollCount = 0;
var imgOffset = 0;
document.addEventListener("scroll", (event) => {
    // Check current scroll position
    currPos = window.scrollY;

    // Offset spritesheet position
    if (scrollCount >= scrollIncrements)
    {
        imgOffset += 128;
        scrollCount = 0;
    } else {
        scrollCount++;
    }
    if(imgOffset == 128 * 4) {imgOffset = 0;}
    const player = document.getElementById("character");
    player.style.backgroundPositionX = imgOffset + "px";
});
/* End Character animator */