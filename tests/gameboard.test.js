import { test, expect } from "@jest/globals";
import { Gameboard } from "../src/modules/gameboard.js";
import { Ship } from "../src/modules/ship.js";


/*----Example:
test("adds 2 + 3", () => {
    expect(add(2,3)).toBe(5);
});
*/

test("receiveAttack marks the square as hit", () => {
    const gameboard = new Gameboard();

    gameboard.placeShip("vertical", [5, 5], "carrier");
    gameboard.receiveAttack([5, 5]);

    expect(gameboard.board[5][5].hit).toBe(true);
});

test("receiveAttack calls hit on the ship", () => {
    const gameboard = new Gameboard();

    gameboard.placeShip("vertical", [5, 5], "carrier");
    gameboard.receiveAttack([5, 5]);

    expect(gameboard.ships.carrier.hits).toBe(1);
});

test("Missed shoot saves the square", ()=>{
    const gameboard = new Gameboard()

    gameboard.placeShip("vertical", [5, 5], "carrier")
    gameboard.receiveAttack([1, 2])

    expect(gameboard.missedAttacks).toEqual([[1, 2]])
})

