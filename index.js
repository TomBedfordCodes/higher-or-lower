
// PLAN
// Save the deck of cards in localStorage. Shuffle discard pile when only one left or on page refresh.
// Have 'higher' or 'lower' buttons; save previous value and compare drawn card.
// Display 'Drink!' or 'Correct! Next player' etc.


// CONVERT CARD API VALUES TO COMPARABLE VALUES
const values = {
    "ACE": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "JACK": 11,
    "QUEEN": 12,
    "KING": 13,
}


// DOM ELEMENTS
const newGameBtn = document.getElementById("newgame-btn")
const higherBtn = document.getElementById("higher-btn")
const lowerBtn = document.getElementById("lower-btn")
const shuffleBtn = document.getElementById("shuffle-btn")
const cardsContainer = document.getElementById("cards-container")
const cardsRemainingText = document.getElementById("cards-remaining")
const instructionsText = document.getElementById("instructions-text")


// OTHER GLOBAL VARS
let deckId = ""
let cardToBeat = {}  // To get the card's numerical value for comparison: values[card.value]
let drawnCard = {}


// ON PAGE LOADED
// localStorage.clear()
if (localStorage.getItem("deckId")) {
    deckId = localStorage.getItem("deckId")
    gameReady()
}


// BUTTON EVENT LISTENERS
newGameBtn.addEventListener("click", function() {
    fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id
            localStorage.setItem("deckId", deckId)
            gameReady()
        })
})



// FINISH LOGIC FOR THESE TWO BTNS
// MIGHT BE CLEARER WHAT'S HAPPENING WITH A NEXT BTN, COMPARISON CARD MOVED TO THE LEFT
higherBtn.addEventListener("click", function(){
    drawCard()
    instructionsText.textContent = "DRINK!"
})

lowerBtn.addEventListener("click", function(){

    drawCard()
})



shuffleBtn.addEventListener("click", function() {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
        .then(res => res.json())
        .then(data => {
            clearCards()
            drawCard()
        })
        
})





// HELPER FUNCTIONS

function gameReady() {
    newGameBtn.hidden = true
    higherBtn.hidden = false
    lowerBtn.hidden = false
    shuffleBtn.hidden = false
    drawCard()
}

function drawCard() {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/`)
        .then(res => res.json())
        .then(data => {
            moveRightCardToLeft()
            cardsRemainingText.hidden = false
            cardsRemainingText.textContent = `Cards remaining: ${data.remaining}`
            drawnCard = data.cards[0]
            displayCard(1, data.cards[0])
        })
}   

function displayCard(position, card) {
    // 'position' can be either 0 (left) or 1 (right)
    cardsContainer.children[position].innerHTML = `
        <img class="card-img" src="${card.image}">
    `
}

function moveRightCardToLeft() {
    cardsContainer.children[0].innerHTML = cardsContainer.children[1].innerHTML
    cardsContainer.children[1].innerHTML = ""
}

function clearCards() {
    cardsContainer.children[0].innerHTML = ""
    cardsContainer.children[1].innerHTML = ""
}



