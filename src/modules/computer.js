import { player, checkWinner, switchPlayerTurn, stopGame } from "./logic.js"
import { renderBoard } from "./dom.js";

let computerGamemode = "hunt"
let computerLastHit = null
let computerFirstHit = null
let computerDirection = null
let computerDirectionStep = 1
let targetQueue = []
let computerDirectionWay = "+"

function alreadyShot(x, y) {

    return (
        player.gameboard.missedAttacks.some(
            attack => attack[0] === x && attack[1] === y
        )
        ||
        (player.gameboard.board[y][x] &&
        player.gameboard.board[y][x].hit)
    );
}

export function computerMove() {
    if (stopGame) {
        return;
    }

    let x;
    let y;

    // HUNT MODE
    if (computerGamemode === "hunt") {

        do {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
        } while (alreadyShot(x, y));

    }

    // TARGET MODE
    else if (computerGamemode === "target") {

        do {
            const target = targetQueue.shift();

            if (!target) {
                computerGamemode = "hunt"
                computerFirstHit = null
                computerLastHit = null
                computerDirection = null
                computerDirectionWay = "+"
                targetQueue = []
                return computerMove();
            }

            x = target[0];
            y = target[1];
            computerDirectionWay = target[2]
        } while(alreadyShot(x, y))

    }
    // DIRECTION MODE
    else if (computerGamemode === "direction") {
        // continue in the same direction
        x = computerLastHit[0];
        y = computerLastHit[1];

        if (computerDirection === "horizontal") {
            x = computerDirectionWay === "+" ? x + computerDirectionStep :  x - computerDirectionStep
        } else {
            y = computerDirectionWay === "+" ? y + computerDirectionStep :  y - computerDirectionStep
        }

        if (
            x < 0 ||
            x > 9 ||
            y < 0 ||
            y > 9 ||
            alreadyShot(x, y)
        ) {
            x = computerFirstHit[0]
            y = computerFirstHit[1]

            if (computerDirection === "horizontal") {
                x -= computerDirectionStep;
            } else {
                y -= computerDirectionStep;
            }

            computerDirectionWay = "-"
            
            if (
                x < 0 ||
                x > 9 ||
                y < 0 ||
                y > 9 ||
                alreadyShot(x, y)
            ) {
                console.log("test")
                computerGamemode = "hunt"
                computerFirstHit = null
                computerLastHit = null
                computerDirection = null
                computerDirectionWay = "+"
                targetQueue = []
                return computerMove();
            }
        }
    }

    const square = player.gameboard.board[y][x];

    player.gameboard.receiveAttack([x, y]);

    // HIT
    if (square) {

        if (!computerLastHit) {
            // first hit
            computerFirstHit = [x, y];
            computerLastHit = [x, y];

            targetQueue = [
                [x + 1, y, "+"],
                [x - 1, y, "-"],
                [x, y + 1, "+"],
                [x, y - 1, "-"]
            ].filter(pos =>
                pos[0] >= 0 &&
                pos[0] <= 9 &&
                pos[1] >= 0 &&
                pos[1] <= 9
            );


            computerGamemode = "target";
        } else {
            computerLastHit = [x, y];

            // second hit = we know a direction

            if (computerDirection === null) {
                if (x === computerFirstHit[0]) {
                    computerDirection = "vertical";
                } else {
                    computerDirection = "horizontal";
                }

                computerGamemode = "direction";
            }
        }
    }

    // SHIP SUNK
    if (player.gameboard.shipSunk) {

        computerGamemode = "hunt";

        computerLastHit = null;

        computerFirstHit = null

        computerDirection = null;

        computerDirectionWay = "+"

        targetQueue = [];
    }

    renderBoard(player.gameboard, "your");
    checkWinner();
    switchPlayerTurn();
}