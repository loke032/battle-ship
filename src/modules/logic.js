import { Player } from "./player.js";
import { name1, name2, renderBoard } from "./dom.js";
import { direction, resetPreview } from "./placement.js";

export const player = new Player()
export const player2 = new Player()
export const computer = new Player()

export let gameTurn = player
export let stopGame = true

export let gameMode = "computer"

export let currentPlayer
export let currentOpponent

export let currentSetup = player

export function changeSetup() {
    currentSetup = currentSetup === player ? player2 : player;

    renderBoard(currentSetup.gameboard, "your");
    resetPreview();

    document.querySelector(".gameboard1-h2").textContent = currentSetup === player ? `${name1}'s Fleet` : `${name2}'s Fleet`
}

export function changeGameMode(mode) {
    gameMode = mode

    if (gameMode === "computer") {
        currentOpponent = computer
        currentPlayer = player
    } else {
        currentPlayer = player
        currentOpponent = player2
    }
}

export function switchCurrentPlayer() {
    [currentPlayer, currentOpponent] = [currentOpponent, currentPlayer];
    renderBoard(currentPlayer.gameboard, "your")
    renderBoard(currentOpponent.gameboard, "enemy")
}

export function startGame() {
    renderBoard(player.gameboard, "your");


    // computer ship placement
    placeRandomShip("carrier", computer.gameboard);
    placeRandomShip("battleship", computer.gameboard);
    placeRandomShip("cruiser", computer.gameboard);
    placeRandomShip("submarine", computer.gameboard);
    placeRandomShip("destroyer", computer.gameboard);

    document.querySelector(".gameboard2").classList.add("hidden")
    document.querySelector(".gameboard2").style.display = "none";
    document.querySelector(".gameboard2-h2").style.display = "none"

    updateStatus(
        "Place your ships",
        "Drag a ship onto the board to begin."
    );
}

export function placeRandomShip(shipName, gameboard) {
    let placed = false

    while (!placed) {
        const x = Math.floor(Math.random() * 10)
        const y = Math.floor(Math.random() * 10)
        const direction = Math.random() < 0.5 ? "horizontal" : "vertical"

        try {
            gameboard.placeShip(direction, [x, y], shipName)
            placed = true
        } catch (error) {

        }
    }
}

export function checkWinner() {
    const winner = document.querySelector(".status-title")
    const message = document.querySelector(".status-message")
    if (currentOpponent.gameboard.allShipsSunk()) {
        stopGame = true
        if (gameMode === "local") {
            winner.textContent = currentPlayer === player ? `${name1} wins!` : `${name2} wins!`
            message.textContent = currentPlayer === player ? `${name1} destroyed the enemy fleet.` : `${name2} destroyed the enemy fleet.`
        } else {
            winner.textContent = "Victory!"
            message.textContent = "You destroyed the enemy fleet."
        }
        document.querySelector(".start-battle").textContent = "Reset Game"
        document.querySelector(".start-battle").style.display = ""
    } else if (currentPlayer.gameboard.allShipsSunk()) {
        stopGame = true
        winner.textContent = "Loss!"
        message.textContent = "The enemy destroyed your fleet."

        document.querySelector(".start-battle").textContent = "Reset Game"
        document.querySelector(".start-battle").style.display = ""
    }
}

export function switchPlayerTurn() {
    if (gameTurn === player) {
        gameTurn = computer
    } else if (gameTurn === computer) {
        gameTurn = player
    }
}

export function updateStatus(title, message) {
    document.querySelector(".status-title").textContent = title;
    document.querySelector(".status-message").textContent = message;
}

export function resetGame() {
    gameTurn = player
    stopGame = true

    gameMode = "computer"

    currentPlayer
    currentOpponent

    currentSetup = player

    player.gameboard.reset()
    computer.gameboard.reset()
    player2.gameboard.reset()

    // computer ship placement
    placeRandomShip("carrier", computer.gameboard);
    placeRandomShip("battleship", computer.gameboard);
    placeRandomShip("cruiser", computer.gameboard);
    placeRandomShip("submarine", computer.gameboard);
    placeRandomShip("destroyer", computer.gameboard);

    document.querySelector(".setup").classList.remove("hidden");
    document.querySelector(".setup").style.display = "";
    document.querySelector(".setup-h2").style.display = "";

    document.querySelector(".gameboard2").classList.add("hidden");
    document.querySelector(".gameboard2").style.display = "none";
    document.querySelector(".gameboard2-h2").style.display = "none";

    document.querySelector(".start-battle").style.display = "";
    document.querySelector(".start-battle").textContent = "Start Battle";

    document.querySelector(".gameboard1-h2").textContent = "Your Fleet"
    document.querySelector(".gameboard2-h2").textContent = "Enemy Fleet"

    resetPreview()
    document.querySelectorAll(".preview, .preview-invalid")
        .forEach(square => {
            square.classList.remove("preview", "preview-invalid")
        })

    renderBoard(player.gameboard, "your")

    updateStatus(
        "Place your ships",
        "Drag a ship onto the board to begin."
    );

    document.querySelector(".menu").style.display = ""
    document.querySelector(".menu-overlay").style.display = ""
}

export function beginBattle() {
    stopGame = false;

    document.querySelector(".setup").classList.add("hidden")
    document.querySelector(".setup").style.display = "none";
    document.querySelector(".setup-h2").style.display = "none"
    document.querySelector(".gameboard2").classList.remove("hidden")
    document.querySelector(".gameboard2").style.display = "grid";
    document.querySelector(".gameboard2-h2").style.display = ""
    document.querySelector(".start-battle").style.display = "none"

    if (gameMode === "computer") {
        renderBoard(computer.gameboard, "enemy");
    } else {
        renderBoard(player2.gameboard, "enemy")
    }
    updateStatus(
        "Battle started",
        "Fire at the enemy board."
    );
}




