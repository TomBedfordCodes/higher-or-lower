
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


// OTHER GLOBAL VARS
let deckId = ""
let cardToBeat = {}  // To get the card's numerical value for comparison: values[card.value]
let drawnCard = {}



// ON PAGE LOADED
// localStorage.clear()
if (localStorage.getItem("deckId")) {
    deckId = localStorage.getItem("deckId")
    console.log(deckId)
    newGameBtn.hidden = true
    higherBtn.hidden = false
    lowerBtn.hidden = false
    shuffleBtn.hidden = false
}



// BUTTON EVENT LISTENERS
newGameBtn.addEventListener("click", function() {
    fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id
            localStorage.setItem("deckId", deckId)
            console.log(deckId)
            newGameBtn.hidden = true
            higherBtn.hidden = false
            lowerBtn.hidden = false
            shuffleBtn.hidden = false
        })
})

higherBtn.addEventListener("click", function(){
    drawnCard = drawCard()
})

lowerBtn.addEventListener("click", function(){
    drawnCard = drawCard()
})

function drawCard() {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/`)
        .then(res => res.json())
        .then(data => {
            console.log(data.remaining)  // CHANGE CONSOLE.LOG TO AN ELEMENT SHOWING CARDS REMAINING
            return data.cards[0]
        })
}

shuffleBtn.addEventListener("click", function() {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
        .then(res => res.json())
        .then(data => console.log(data))
})






