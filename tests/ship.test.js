import { test, expect } from "@jest/globals";
import { Ship } from "../src/modules/ship.js";


/*----Example:
test("adds 2 + 3", () => {
    expect(add(2,3)).toBe(5);
});
*/

test("ship has a length", () => {
    const ship = new Ship(3)

    expect(ship.length).toBe(3)
})


