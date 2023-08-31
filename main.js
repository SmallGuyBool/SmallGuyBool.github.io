
var backgroundAudio = new Audio("./audio/forest.mp3");

document.onreadystatechange = async function () {
    if(document.readyState == "complete") {
        document.getElementById("loading").style.display = "none";

        await animatePeople();
        
    }
};

/* Start Person animator */
async function animatePeople() {
    /* Animate all people on screen (yes i know this is INSANELY inefficient but i 
    don't really care at this point lmao) */

    const people = document.getElementsByClassName("person");
    const numPeople = people.length;
    const animFrames = 4;
    while(true) {
        for(let currFrame = 0; currFrame <= animFrames; currFrame++) {
            for(let personIdx = 0; personIdx < numPeople; personIdx++) {
                people[personIdx].style.backgroundPositionX  = (currFrame * 128) + "px";
            }
            await timer(100);
        }
    }
}
/* End Person animator*/

/* Handle document loading events */
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
    titleScreen.style.display = "block";
    titleScreen.style.animationPlayState = "paused"; 
    document.getElementById("loading").style.display = "block";  
}
/*End document loading event handling */

const timer = ms => new Promise(res => setTimeout(res, ms))

/* Handle title screen events */
const startButton = document.getElementById('start-button');
const titleScreen = document.getElementById('title-screen');

startButton.addEventListener('click', async function() {
    document.body.style.overflowY = 'scroll';
    titleScreen.style.animationPlayState = "running";
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
const interactablePeople = Array.from(document.getElementsByClassName("interactable-person"));

const combinedElements = [...interactableBuildings, ...interactablePeople];
combinedElements.forEach(building => {
    building.addEventListener("click", async function(event) {
        // Function to handle building information
        
        // Get info box corresponding to the town clicked on
        const townNum = event.target.id[event.target.id.length - 1];
        
        let isPerson = event.target.id.includes("person");

        const infoBox = document.getElementById("info" + townNum);
        if(isPerson) {
            // Calculate offset to make it next to the person
            const townHeight = document.getElementById("town" + townNum).getBoundingClientRect().top;
            const personHeight = building.getBoundingClientRect().top;
            infoBox.style.top = (personHeight - townHeight) + "px";
        } else {
            infoBox.style.top = "0px";
        }

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
                
                await timer(50);

                
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
var lastPos = 0, currPos = 0;
var scrollIncrements = 4;
var scrollCount = 0;
var imgOffset = 0;
var scrollDir;
document.addEventListener("scroll", (event) => {
    // Check current scroll position
    currPos = window.scrollY;

    // Get scroll position
    scrollDir = (currPos - lastPos)/Math.abs(currPos - lastPos);


    // Pick spritesheet based on direction
    const player = document.getElementById("character");
    if(scrollDir >= 0) {
        // Going down
        player.style.backgroundImage = "url('./images/sprites/cat_sprite_sheet.png')";
    } else {
        // Going up
        player.style.backgroundImage = "url('./images/sprites/cat_sprite_sheet_reverse.png')";

    }

    lastPos = currPos;
    // Offset spritesheet position
    if (scrollCount >= scrollIncrements)
    {
        imgOffset += 128;
        scrollCount = 0;
    } else {
        scrollCount++;
    }
    if(imgOffset == 128 * 4) {imgOffset = 0;}
    
    player.style.backgroundPositionX = imgOffset + "px";
});
/* End Character animator */


/* Random tree generator */
function randomInt(max) {
    return Math.floor(Math.random() * max);
}

const numTrees = 700;
const leftSide = document.getElementById("left-bar");
const rightSide = document.getElementById("right-bar");

const leftOffset = leftSide.getBoundingClientRect().left;
const rightOffset = rightSide.getBoundingClientRect().left;
var side, x, y, plant;
const xVar = 384;
const yVar = 8192;
const objList = ["structure", "env-text", "cave", "person"];

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
    document.getElementById("letter-content").style.zIndex = zOffset + 5;
    const dataBoxes = document.getElementsByClassName("town");
    const numDataBoxes = dataBoxes.length;
    for(let i = 0; i < numDataBoxes; i++) {
        dataBoxes[i].style.zIndex = zOffset + 1;
    }
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
        xButton.innerHTML = "<h1>x</h1>";

        xButton.addEventListener('click', async function() {
            document.body.style.overflowY = 'scroll';
            openLetter.style.animationName = "slideOut";
            await timer(500);
            openLetter.style.display = "none";
        });
        openLetter.appendChild(xButton);

        openLetter.style.backgroundImage = "url('./images/sprites/initial_open_letter.png')";
        openLetter.style.backgroundPositionX = "0px";
        // Add 'open' event listener
        openLetter.addEventListener('click', async function() {
            var bgOffset = 0;
            openLetter.style.backgroundImage = "url('./images/sprites/letter_open.png')";
            
            

            // Play all frames of the opening animation
            for(let j = 0; j < 7; j++) {

                await timer(50);
                bgOffset -= 700;
                openLetter.style.backgroundPositionX = bgOffset + "px";
                
            }
            // Now we can display the text
            xButton.style.display = "block";
            openLetter.querySelector("p").style.display = "block";
        }, {once : true});

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