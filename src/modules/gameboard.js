import { Ship } from "./ship.js"

export class Gameboard {
    constructor() {
        this.board = Array(10)
            .fill()
            .map(() => Array(10).fill(null))
        this.ships = {
            carrier: new Ship("carrier", 5),
            battleship: new Ship("battleship", 4),
            cruiser: new Ship("cruiser", 3),
            submarine: new Ship("submarine", 3),
            destroyer: new Ship("destroyer", 2)
        }
        this.missedAttacks = []
        this.placedShips = 0
        this.shipSunk = null
    }

    placeShip(direction, coordinate, shipName) {
        if (!direction || !coordinate || !shipName ) {
            throw new Error("You need to three parameters: direction, cordinate, ship length.")
        }
        if (!this.ships[shipName]) {
            throw new Error("This ship doesn't exist. Ships: carrier, battleship, cruiser, submarine, destroyer.")
        }

        const ship = this.ships[shipName]

        if (ship.placed) {
            throw new Error("This ship has already been placed.");
        }

        const x = coordinate[0]
        const y = coordinate[1]

        ship.direction = direction;
        ship.startX = x;
        ship.startY = y;

        if (direction === "horizontal") {
            if (x + ship.length > 10) {
                throw new Error("Ship does not fit");
            }
            // check
            for (let i = 0; i < ship.length; i++) {
                if (this.board[y][x + i]) {
                    throw new Error("A ship is already here");
                }
            }
            for (let i = 0; i < ship.length; i++) {
                this.board[y][x + i] = { ship: ship, hit: false }
            }
            ship.placed = true;
            this.placedShips ++
        } else if (direction === "vertical") {
            if (y + ship.length > 10) {
                throw new Error("Ship does not fit");
            }
            // check
            for (let i = 0; i < ship.length; i++) {
                if (this.board[y + i][x]) {
                    throw new Error("A ship is already here");
                }
            }
            for (let i = 0; i < ship.length; i++) {
                this.board[y + i][x] = { ship: ship, hit: false }
            }
            ship.placed = true;
            this.placedShips ++
        } else {
            throw new Error("Direction must be 'vertical' or 'horizontal'");
        }
    }

    receiveAttack(coordinate) {
        const x = coordinate[0]
        const y = coordinate[1]

        const square = this.board[y][x]

        if (this.missedAttacks.some(attack => attack[0] === x && attack[1] === y)) {
            throw new Error("Can't shoot at the same place twice.")
        }

        this.shipSunk = null
        if (square && square.ship) {
            if (square.hit) {
                throw new Error("Can't shoot at the same place twice.")
            }
            square.ship.hit()
            square.hit = true
            if (square.ship.isSunk()) {
                this.shipSunk = square.ship

                if (this.allShipsSunk()) {
                    console.log("Gameover")
                }
            }
        } else {
            this.missedAttacks.push(coordinate)
        }
    }

    allShipsSunk() {
        return Object.values(this.ships)
            .every(ship => ship.isSunk());
    }



    // can place ship boolean

    canPlaceShip(direction, coordinate, shipName) {
        if (!direction || !coordinate || !shipName ) {
            throw new Error("You need to three parameters: direction, cordinate, ship length.")
        }
        if (!this.ships[shipName]) {
            throw new Error("This ship doesn't exist. Ships: carrier, battleship, cruiser, submarine, destroyer.")
        }

        const ship = this.ships[shipName]

        if (ship.placed) {
            throw new Error("This ship has already been placed.");
        }

        const x = coordinate[0]
        const y = coordinate[1]

        if (direction === "horizontal") {
            if (x + ship.length > 10) {
                return false
            }
            for (let i = 0; i < ship.length; i++) {
                if (this.board[y][x + i]) {
                    return false
                }
            }
        } else if (direction === "vertical") {
            if (y + ship.length > 10) {
                return false
            }
            for (let i = 0; i < ship.length; i++) {
                if (this.board[y + i][x]) {
                    return false
                }
            }
        } else {
            throw new Error("Direction must be 'vertical' or 'horizontal'");
        }
        return true
    }

    reset() {
        this.board = Array(10)
            .fill()
            .map(() => Array(10).fill(null))
        
        this.missedAttacks = []
        this.placedShips = 0
        this.shipSunk = null

        Object.values(this.ships).forEach(ship => {
            ship.reset()
        })
    }
}