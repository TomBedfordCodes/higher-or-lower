
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
const nextBtn = document.getElementById("next-btn")
const zeroCardsText = document.getElementById("zerocards-text")


// OTHER GLOBAL VARS
let deckId = ""
let cardToBeat = {}  // To get the card's numerical value for comparison use: values[card.value]
let drawnCard = {}


// CLEAR MEMORY FOR TESTING WITH NEW DECK
// localStorage.clear()


// ON PAGE LOADED
if (localStorage.getItem("deckId")) {
    deckId = localStorage.getItem("deckId")
    gameReady()
}


// BUTTON EVENT LISTENERS
newGameBtn.addEventListener("click", function() {
    // Two-card deck for testing
    // fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?cards=AS,2S")
    fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id
            localStorage.setItem("deckId", deckId)
            gameReady()
        })
})

higherBtn.addEventListener("click", function(){
    onGuess()
        .then(_ => {
            if (card1IsHigherThanCard2(cardToBeat, drawnCard)) {
                instructionsText.textContent = "IT WAS LOWER - DRINKK!!!"
            } else if (card1IsEqualToCard2(drawnCard, cardToBeat)) {
                instructionsText.textContent = "THEY WERE THE SAME - DRINKK!!!"
            } else {
                instructionsText.textContent = "GOOD GUESS, NEXT PLAYER IS UP..."
            }
        postGuess()})
})

lowerBtn.addEventListener("click", function(){
    onGuess()
        .then(_ => {
            if (card1IsHigherThanCard2(drawnCard, cardToBeat)) {
                instructionsText.textContent = "IT WAS HIGHER - DRINKK!!!"
            } else if (card1IsEqualToCard2(drawnCard, cardToBeat)) {
                instructionsText.textContent = "THEY WERE THE SAME - DRINKK!!!"
            } else {
                instructionsText.textContent = "GOOD GUESS, NEXT PLAYER IS UP..."
            }
            postGuess()})
})

nextBtn.addEventListener("click", function() {
    moveRightCardToLeft()
    higherBtn.hidden = false
    lowerBtn.hidden = false
    nextBtn.hidden = true
    instructionsText.textContent = "What will the next card be..."
})

shuffleBtn.addEventListener("click", function() {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
        .then(res => res.json())
        .then(data => {
            clearCards()
            gameReady()
        })
})





// HELPER FUNCTIONS
function gameReady() {
    drawCard()
        .then(_ => {
            moveRightCardToLeft()
            newGameBtn.hidden = true
            higherBtn.hidden = false
            lowerBtn.hidden = false
            shuffleBtn.hidden = false
            nextBtn.hidden = true
            instructionsText.hidden = false
            instructionsText.textContent = "What will the next card be..."
            zeroCardsText.hidden = true
        })
}

function drawCard() {
    return fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/`)
        .then(res => res.json())
        .then(data => {
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
    cardToBeat = drawnCard
    drawnCard = {}
}

function clearCards() {
    cardsContainer.children[0].innerHTML = ""
    cardsContainer.children[1].innerHTML = ""
    cardToBeat = {}
    drawnCard = {}
}

function onGuess() {
    return drawCard()
        .then(_ => {    
            higherBtn.hidden = true
            lowerBtn.hidden = true
            nextBtn.hidden = false
        }) 
}

function postGuess() {
    if (cardsRemainingText.textContent === "Cards remaining: 0") {
        zeroCardsText.hidden = false
        nextBtn.hidden = true
    }
}

function card1IsHigherThanCard2(card1, card2) {
    return values[card1.value] > values[card2.value]
}

function card1IsEqualToCard2(card1, card2) {
    return values[card1.value] === values[card2.value]
}
