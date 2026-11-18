
class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length
        this.hits = 0
        this.sunk = false
        this.placed = false
    }

    hit() {
        this.hits += 1
    }

    isSunk() {
        if (this.hits >= this.length) {
            return true
        }
        return false
    }

    reset() {
        this.hits = 0
        this.sunk = false
        this.placed = false
    }
}

export { Ship };