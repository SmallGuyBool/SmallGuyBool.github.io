
var backgroundAudio = new Audio("./audio/forest.mp3");


/* Handle document loading events */
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}
/*End document loading event handling */

const timer = ms => new Promise(res => setTimeout(res, ms))

/* Handle title screen events */
const startButton = document.getElementById('start-button');
const titleScreen = document.getElementById('title-screen');

startButton.addEventListener('click', async function() {
    document.body.style.overflowY = 'scroll';
    titleScreen.style.animationName = 'fade-out';
    titleScreen.style.animationDuration = '1s';
    titleScreen.style.animationFillMode = 'forwards';
    
    // Play start audio
    var audio = new Audio("./audio/Opening_chord.mp3");
    audio.play();
    await timer(5000);
    backgroundAudio.play();
    backgroundAudio.loop = true;
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
    document.getElementById("arrow").style.display = "none";
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
        var typingAudio = new Audio("./audio/Type_sound_2.mp3");

        var y, scrollPos;
        const windowHeight = window.innerHeight;
        const arrow = document.getElementById("arrow");
        arrow.innerHTML = "^";
        // Animate typing effect
        if(infoBox.querySelector("p").innerHTML == "") {
            for(let i = 0; i < info.length; i++) {


                // Check if the dialogue box is offscreen
                y = infoBox.getBoundingClientRect().top;
                scrollPos = window.scrollY / windowHeight;
                
                
                if(y >= scrollPos + windowHeight) {
                    // Bottom of screen
                    arrow.style.top = "calc(100vh - 128px - 10px)";
                    arrow.style.transform = "scaleY(-1)";
                    arrow.style.display = "block";
                } else if (y < scrollPos - windowHeight / 4) {
                    // Top of screen
                    arrow.style.top = "10px";
                    arrow.style.transform= "scaleY(1)";
                    arrow.style.display = "block";
                }  else {
                    arrow.style.display = "none";
                }
                

                // If the loop has been externally cancelled, clear and start again
                if(infoBox.querySelector("p").innerHTML.length != i) {
                    infoBox.querySelector("p").innerHTML = "";
                    i = 0;
                    break;
                }
                
                await timer(70);

                
                letter = info[i];
                if(letter != " "){typingAudio.play();}
                
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
        arrow.style.display = "none";
    });
});
/* End building interaction */

/* Character animator */
var lastPos, currPos = 0;
var scrollIncrements = 4;
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


/* Random tree generator */
function randomInt(max) {
    return Math.floor(Math.random() * max);
}

const numTrees = 400;
const leftSide = document.getElementById("left-bar");
const rightSide = document.getElementById("right-bar");

const leftOffset = leftSide.getBoundingClientRect().left;
const rightOffset = rightSide.getBoundingClientRect().left;
var side, x, y, plant;
const xVar = 384;
const yVar = 8192 / 2;
const objList = ["structure", "env-text", "cave"];

const natureName = ['bush', 'flowers', 'tree', 'grass'];

for (let j = 0; j < numTrees; j++) {
    plant = natureName[randomInt(4)];

    side = randomInt(2);
    if (side == 0) {
        // Create tree on the left side
        
        let overlapping = true;
        while (overlapping) {
            x = randomInt(xVar + 1);
            y = randomInt(yVar + 1);

            overlapping = objList.some(object => {
                const objects = document.getElementsByClassName(object);
                for (let i = 0; i < objects.length; i++) {
                    const boundingBox = objects[i].getBoundingClientRect();
                    const horizontalOverlap = x + leftOffset >= boundingBox.left - 128 && x + leftOffset <= boundingBox.right;
                    const verticalOverlap = y >= boundingBox.top - 256 && y <= boundingBox.bottom;
                    if (horizontalOverlap && verticalOverlap) {
                        return true;
                    }
                }
                return false;
            });
        }

        // Create tree element
        const newTree = document.createElement("div");
        newTree.classList.add(plant);
        newTree.style.top = y + "px";
        newTree.style.left = x + "px";
        
        // Insert into DOM
        leftSide.appendChild(newTree);

    } else {
        // Create tree on the right side

        let overlapping = true;
        while (overlapping) {
            x = randomInt(xVar + 1);
            y = randomInt(yVar + 1);

            overlapping = objList.some(object => {
                const objects = document.getElementsByClassName(object);
                for (let i = 0; i < objects.length; i++) {
                    const boundingBox = objects[i].getBoundingClientRect();
                    const horizontalOverlap = x + rightOffset >= boundingBox.left - 128 && x + rightOffset <= boundingBox.right;
                    const verticalOverlap = y >= boundingBox.top - 256 && y <= boundingBox.bottom;
                    if (horizontalOverlap && verticalOverlap) {
                        return true;
                    }
                }
                return false;
            });
        }

        // Create tree element
        const newTree = document.createElement("div");
        newTree.classList.add(plant);
        newTree.style.top = y + "px";
        newTree.style.left = x + "px";
        
        // Insert into DOM
        pathEdge = rightSide.querySelector("path-edge");
        rightSide.insertBefore(newTree, pathEdge);
    }
}
var body = document.body,
    html = document.documentElement;

var docHeight = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
layerZIndex(docHeight, 1000);

/* End random tree gen   */

/* Handle plant overlapping fix */
function layerZIndex(pageSize, numIncrements) {

    const natureName = ['tree'];
    var zOffset = 5;
    const incHeight = pageSize / numIncrements;
    // Iterate through all increments in the page
    for (let i = 0; i < pageSize; i += incHeight) {

        // Iterate through all plant types
        natureName.forEach(plantName => {
            const plants = document.getElementsByClassName(plantName);
            // Iterate through all plants of the given type
            for(let j = 0; j < plants.length; j++) {

                const plantOffset = plants[j].getBoundingClientRect().top;
                if(i <= plantOffset && plantOffset <= i + incHeight) {
                    plants[j].style.zIndex = zOffset;
                }
            }
        });

        zOffset++;
    }
    document.getElementById("title-screen").style.zIndex = zOffset + 1;
    document.getElementById("letter-content").style.zIndex = zOffset + 1;
}
/* End overlapping handling */


/* Handle textbox content changes */
function changeText(text, townNum) {

    document.getElementById("data" + townNum).innerText = text;
}
/* End textbox content changes */


/* Handle interaction with letters */
const letters = document.getElementsByClassName("letter");
const openLetter = document.getElementById("letter-content");
const numLetters = letters.length;
// Iterate through all letters
for(let i = 0; i < numLetters; i++) {
    // Add onclick event to every letter on the ground
    letters[i].addEventListener('click', function() {
        document.body.style.overflowY = 'hidden';

        // Add X button to letter
        const xButton = document.createElement("div");
        xButton.classList.add("letter-close-btn");
        xButton.addEventListener('click', async function() {
            document.body.style.overflowY = 'scroll';
            openLetter.style.animationName = "slideOut";
            await timer(500);
            openLetter.style.display = "none";
        });
        openLetter.appendChild(xButton);

        // Animate letter opening
        openLetter.style.display = "block";
        openLetter.style.animationName = "slideIn";
        openLetter.style.animationDuration = "0.5s";
        openLetter.style.animationFillMode = "forwards";
    });
}

function setLetterContent(content) {
    openLetter.innerHTML = content;
}
/* End letter interacting handling */