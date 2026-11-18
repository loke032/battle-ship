import { computer, player, switchPlayerTurn, stopGame, beginBattle, placeRandomShip, updateStatus, resetGame, changeGameMode, gameMode, currentSetup, changeSetup, player2, currentOpponent, currentPlayer, switchCurrentPlayer, checkWinner } from "./logic.js";
import { switchDirection, direction, shipSelected, resetPreview, hideAllShips } from "./placement.js"
import { computerMove } from "./computer.js";

import userImage from "../icons/user.png"
import botImage from "../icons/robot.png"


const board1 = document.querySelector(".gameboard1");
const board2 = document.querySelector(".gameboard2");

let canShoot = true

export let name1 = ""
export let name2 = ""

document.querySelector(".vs-computer").addEventListener("click", ()=>{
    changeGameMode("computer")
    document.querySelector(".menu").style.display = "none"
    document.querySelector(".menu-overlay").style.display = "none"
})
document.querySelector(".vs-player").addEventListener("click", ()=>{
    document.querySelector(".menu-overlay").style.display = "none"
    changeGameMode("local")

    document.querySelector(".name-overlay").style.display = "flex"
})

document.querySelector(".name-form").addEventListener("submit", (e)=>{
    e.preventDefault()

    name1 = document.querySelector(".name1").value 
    name2 = document.querySelector(".name2").value 

    name1 = name1.charAt(0).toUpperCase() + name1.slice(1)
    name2 = name2.charAt(0).toUpperCase() + name2.slice(1)

    document.querySelector(".gameboard1-h2").textContent = `${name1}'s Fleet`

    document.querySelector(".name-overlay").style.display = "none"
})


export function renderBoard(gameboard, boardType) {

    const boardElement = boardType === "your" ? board1 : board2;
    boardElement.innerHTML = "";

    const board = gameboard.board;

    if (gameMode === "local") {
        if (stopGame) {
            document.querySelector(".gameboard1-h2").textContent = currentSetup === player ? `${name1}'s Fleet` : `${name2}'s Fleet`
        } else {
            document.querySelector(".gameboard1-h2").textContent = currentPlayer === player ? `${name1}'s Fleet` : `${name2}'s Fleet`
            document.querySelector(".gameboard2-h2").textContent = currentOpponent === player ? `${name1}'s Fleet` : `${name2}'s Fleet`
        }
    }

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {

            const square = document.createElement("div");
            square.classList.add("square");

            square.dataset.x = x;
            square.dataset.y = y;


            const node = board[y][x];

            if (node) {
                if (node.hit) {
                    const ship = node.ship
                    if (ship.isSunk()) {                       
                        square.classList.add("sunk");

                        if (ship.direction === "horizontal") {

                            if (x === ship.startX) {
                                square.classList.add("left-end");
                            }

                            if (x === ship.startX + ship.length - 1) {
                                square.classList.add("right-end");
                            }

                        } else {

                            if (y === ship.startY) {
                                square.classList.add("top-end");
                            }

                            if (y === ship.startY + ship.length - 1) {
                                square.classList.add("bottom-end");
                            }

                        }
                    } else {
                        square.classList.add("hit")
                    }
                } else if (boardType === "your") {
                    square.classList.add("ship")
                }
            }

            if (
                gameboard.missedAttacks.some(
                    attack => attack[0] === x && attack[1] === y
                )
            ) {
                square.classList.add("miss")
            }

            boardElement.appendChild(square);




            /*---Event listerners---*/

            if (boardType === "enemy") {
                square.addEventListener("click", () => {
                    if (stopGame) {
                        return;
                    }
                    if (gameMode === "local") {
                        if (!canShoot) {
                            return
                        }
                    }
                    try {
                        currentOpponent.gameboard.receiveAttack([
                            Number(square.dataset.x),
                            Number(square.dataset.y)
                        ]);
                        if (gameMode === "local") {
                            canShoot = false
                        }
                        const hit = currentOpponent.gameboard.board[square.dataset.y][square.dataset.x] !== null
                        const shipWasSunk = currentOpponent.gameboard.shipSunk;

                        renderBoard(currentOpponent.gameboard, "enemy");

                        

                        if (gameMode === "computer") {
                            updateStatus(
                                "Enemy Turn",
                                "Waiting for the computer..."
                            );
                            

                            switchPlayerTurn();

                            setTimeout(() => {
                                computerMove();

                                //info

                                if (!stopGame) {
                                    if (shipWasSunk !== null) {
                                        updateStatus(
                                            "Your Turn",
                                            `You sank the enemy ${shipWasSunk.name}!`
                                        );
                                    } else {
                                        updateStatus(
                                            "Your Turn",
                                            "Fire at the enemy board."
                                        );
                                    }
                                }
                            }, 250);
                        } else {
                            if (!stopGame) {
                                if (shipWasSunk !== null) {
                                    updateStatus(
                                        "Hit!",
                                        `You sank the enemy ${shipWasSunk.name}!`
                                    );
                                } else if(hit) {
                                    updateStatus(
                                        "Hit!",
                                        ""
                                    )
                                } else {
                                    updateStatus(
                                        "Miss",
                                        ""
                                    );
                                }
                            }

                            setTimeout (() => {
                                canShoot = true
                                if (currentOpponent.gameboard.allShipsSunk()) {
                                    checkWinner()
                                } else {
                                    pass()
                                }
                            }, 1000)
                        }
                    } catch(error) {

                    }
                });
            }
            if (boardType === "your") {
                


                // drag and drop

                square.addEventListener("dragover", (e)=>{
                    e.preventDefault()

                    previewShip(x, y)
                })

                square.addEventListener("drop", ()=>{
                    document.querySelectorAll(".preview, .preview-invalid")
                    .forEach(square => {
                        square.classList.remove("preview", "preview-invalid");
                    });

                    
                    try {
                        gameboard.placeShip(
                            direction,
                            [Number(square.dataset.x), Number(square.dataset.y)],
                            shipSelected
                        )

                        renderBoard(currentSetup.gameboard, "your")

                        updateStatus(
                            "Place your ships",
                            "Drag all the ships onto the board."
                        )
                        allShipsPlaced()

                        const ship = document.querySelector(`.${shipSelected}`)
                        
                        ship.classList.add("hidden")
                    } catch(error) {

                    }
                })
            }

            // display preview while hovering
            function previewShip(x, y) {
                try {
                    document.querySelectorAll(".preview, .preview-invalid")
                        .forEach(square => {
                            square.classList.remove("preview", "preview-invalid")
                        })

                    const length = player.gameboard.ships[shipSelected].length

                    let previewX = null
                    let previewY = null

                    const canPlaceShip = gameboard.canPlaceShip(direction, [x, y], shipSelected)

                    for (let i=0; i<length;i++) {
                        if (direction === "horizontal") {
                            previewX = x + i
                            previewY = y
                        } else if (direction === "vertical") {
                            previewX = x
                            previewY = y + i
                        }
                        const square = document.querySelector(
                            `.gameboard1 .square[data-x="${previewX}"][data-y="${previewY}"]`
                        );

                        if (!square) continue;

                        if (canPlaceShip) {
                            square.classList.add("preview")
                        } else if (!canPlaceShip) {
                            square.classList.add("preview-invalid")
                        }
                    }
                } catch(error) {

                }
            }

            // remove preview when not hovering over the board

            const boardPreview = document.querySelector(".gameboard1");

            boardPreview.addEventListener("dragend", () => {
                document.querySelectorAll(".preview, .preview-invalid")
                    .forEach(square => {
                        square.classList.remove("preview", "preview-invalid");
                    });
            });
        }
    }
}


const startBattleButton = document.querySelector(".start-battle")

startBattleButton.addEventListener("click", ()=>{
    if (gameMode === "computer") {
        if (player.gameboard.allShipsSunk() || computer.gameboard.allShipsSunk()) {
            resetGame()
        } else {
            if (player.gameboard.placedShips === 5) {
                beginBattle()
                document.querySelector(".status-message").classList.remove("arrow")
            }
        }
    } else {
        if (currentPlayer.gameboard.allShipsSunk() || currentOpponent.gameboard.allShipsSunk()) {
            resetGame()
        } else if (currentSetup.gameboard.placedShips === 5) {
            pass()
            document.querySelector(".status-message").classList.remove("arrow")
        }
    }
})


const randomShipsButton = document.querySelector(".random-ships")

randomShipsButton.addEventListener("click", ()=>{
    currentSetup.gameboard.reset()
    placeRandomShip("carrier", currentSetup.gameboard);
    placeRandomShip("battleship", currentSetup.gameboard);
    placeRandomShip("cruiser", currentSetup.gameboard);
    placeRandomShip("submarine", currentSetup.gameboard);
    placeRandomShip("destroyer", currentSetup.gameboard);
    renderBoard(currentSetup.gameboard, "your")
    hideAllShips()
    allShipsPlaced()
})

const resetButton = document.querySelector(".reset")

resetButton.addEventListener("click", ()=>{
    currentSetup.gameboard.reset()
    renderBoard(currentSetup.gameboard, "your")
    resetPreview()
    updateStatus(
        "Place your ships",
        "Drag a ship onto the board to begin."
    )
    document.querySelector(".status-message").classList.remove("arrow")
})

const directionButton = document.querySelector(".direction")

export function switchDirectionDom() {

    if (directionButton.textContent === "Vertical") {
        directionButton.textContent = "Horizontal"
    } else if(directionButton.textContent === "Horizontal") {
        directionButton.textContent = "Vertical"
    }

    switchDirection()
}

directionButton.addEventListener("click", ()=>{
    switchDirectionDom()
})

export function allShipsPlaced() {
    if (currentSetup.gameboard.placedShips === 5) {
        updateStatus(
            "Start Battle",
            "↓"
        )
        document.querySelector(".status-message").classList.add("arrow")
    }
}


export function pass() {
    document.querySelector(".pass-overlay").style.display = "flex"
}
export function removePass() {
    document.querySelector(".pass-overlay").style.display = "none"
}


document.querySelector(".passed").addEventListener("click", ()=>{

        if (stopGame) {
            if (currentSetup === player2) {
                beginBattle()
            }
            changeSetup()
        } else {
            switchCurrentPlayer()
        }
        
        if (currentSetup === player2) {
            updateStatus(
                "Place your ships",
                "Drag a ship onto the board to begin."
            )
        } else if (stopGame === false) {
            updateStatus(
                "Fire!",
                "Fire at the enemy board."
            )
        } else {
            updateStatus(
                "",
                ""
            )
        }
        removePass()            
    })




const userIcon = document.querySelectorAll(".user-icon")
userIcon.forEach(user => {
    user.src = userImage
})

const botIcon = document.querySelectorAll(".bot-icon")
botIcon.forEach(bot => {
    bot.src = botImage
})