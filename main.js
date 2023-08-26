
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
        

        // Animate typing effect
        for(let i = 0; i < info.length; i++) {
            await timer(100);
            infoBox.querySelector("p").innerHTML += info[i];
        }
        
    });
});
/* End building interaction */