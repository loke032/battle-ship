import { updateStatus } from "./logic.js";
import { Ship } from "./ship.js";
import { switchDirectionDom } from "./dom.js";

export let direction = "horizontal"

export let shipSelected = "carrier"

const shipElements = document.querySelectorAll(".setup > div")

shipElements.forEach(ship => {
    ship.draggable = true

    ship.addEventListener("dragstart", () => {
        document.querySelector(".selected")?.classList.remove("selected");
        shipSelected = ship.dataset.ship
        ship.classList.add("selected");
        updateShipMessage()
    })

    ship.addEventListener("click", () => {
        document.querySelector(".selected")?.classList.remove("selected");

        shipSelected = ship.dataset.ship;

        ship.classList.add("selected");

        updateShipMessage();
    });

    ship.addEventListener("dragstart", () => {
        ship.style.opacity = "0";
    });
    ship.addEventListener("dragend", () => {
        ship.style.opacity = "1";
        document.querySelectorAll(".preview, .preview-invalid")
            .forEach(square => {
                square.classList.remove("preview", "preview-invalid");
            });
    });
})

document.querySelector(".carrier").classList.add("selected");

export function resetPreview() {
    shipElements.forEach(ship => {
        ship.classList.remove("hidden")
    })
    document.querySelector(".selected")?.classList.remove("selected");
    shipSelected = "carrier"
    document.querySelector(".carrier").classList.add("selected");
    if (direction === "vertical") {
        switchDirectionDom()
    }
}

export function hideAllShips() {
    shipElements.forEach( ship => {
        ship.classList.add("hidden")
    })
}

export function switchDirection() {
    if (direction === "vertical") {
        direction = "horizontal"
    } else if(direction === "horizontal") {
        direction = "vertical"
    }
    console.log(direction)
}

function updateShipMessage() {
    updateStatus(
        `${shipSelected[0].toUpperCase()}${shipSelected.slice(1)} selected`,
        `Drag the ${shipSelected} onto your board.`
    );
}