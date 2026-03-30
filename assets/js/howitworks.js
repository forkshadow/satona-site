let svgLoaded = false;
let pointsMap = {}; // 🔥 cache des éléments SVG

document.addEventListener("DOMContentLoaded", async () => {
    moveSvgContainerToTop();
    await loadSvg();

    document.getElementById("previewBtn").addEventListener("click", previewWords);
    document.getElementById("resetBtn").addEventListener("click", resetPreview);
});

function moveSvgContainerToTop() {
    const platesSection = document.querySelector(".plates-section");
    const platesRow = document.querySelector(".plates");
    const svgContainer = document.getElementById("svgContainer");

    if (!platesSection || !platesRow || !svgContainer) return;

    platesSection.insertBefore(svgContainer, platesRow);
}

async function loadSvg() {
    const container = document.getElementById("svgContainer");

    try {
        const response = await fetch("/assets/images/seedrectobip39.ai.svg");
        const svgText = await response.text();
        container.innerHTML = svgText;

        buildPointsMap(); // 🔥 important

        console.log("Points loaded:", Object.keys(pointsMap).length); // debug

        svgLoaded = true;
    } catch (error) {
        container.innerHTML = "Unable to load SVG.";
        console.error(error);
    }
}

/* ========================= */
/* BUILD MAP (CORRIGÉ) */
/* ========================= */

function buildPointsMap() {
    const svg = document.getElementById("svgContainer");

    if (!svg) return;

    pointsMap = {}; // reset

    // 🔥 IMPORTANT : on ne prend QUE les vraies formes
    const elements = svg.querySelectorAll("path[id^='w'], rect[id^='w']");

    elements.forEach(el => {
        // évite les doublons / écrasements
        if (!pointsMap[el.id]) {
            pointsMap[el.id] = el;
        }
    });
}

/* ========================= */
/* RESET */
/* ========================= */

function resetPreview() {
    clearAllWords();
    setMessage("");
}

/* ========================= */
/* PREVIEW */
/* ========================= */

function previewWords() {
    if (!svgLoaded) {
        setMessage("SVG not loaded yet.");
        return;
    }

    if (typeof bip39List === "undefined") {
        setMessage("bip39-list.js not loaded.");
        return;
    }

    clearAllWords();

    let errors = [];

    for (let i = 1; i <= 24; i++) {
        const word = document.getElementById("word" + i).value.trim().toLowerCase();

        if (!word) continue;

        const binary = getBinaryForWord(word);

        if (!binary) {
            errors.push("Word " + i + " not found");
            continue;
        }

        applyBinaryToWord(i, binary);
    }

    if (errors.length > 0) {
        setMessage(errors.join(" | "));
    } else {
        setMessage("");
    }

    const svgContainer = document.getElementById("svgContainer");
    if (svgContainer) {
        svgContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

/* ========================= */
/* BIP39 */
/* ========================= */

function getBinaryForWord(word) {
    if (typeof bip39List !== "undefined" && bip39List[word] !== undefined) {
        return String(bip39List[word]).padStart(11, "0");
    }
    return null;
}

/* ========================= */
/* APPLY BITS */
/* ========================= */

function applyBinaryToWord(wordIndex, binary) {
    for (let i = 0; i < 11; i++) {
        const bit = binary[i];
        const element = pointsMap[`w${wordIndex}-b${i + 1}`];

        if (!element) continue;

        if (bit === "1") {
            element.setAttribute("fill", "white");
            element.style.fill = "white";
        } else {
            element.setAttribute("fill", "black");
            element.style.fill = "black";
        }
    }
}

/* ========================= */
/* CLEAR */
/* ========================= */

function clearWordBits(wordIndex) {
    for (let i = 1; i <= 11; i++) {
        const element = pointsMap[`w${wordIndex}-b${i}`];

        if (!element) continue;

        element.setAttribute("fill", "black");
        element.style.fill = "black";
    }
}

function clearAllWords() {
    for (let w = 1; w <= 24; w++) {
        clearWordBits(w);
    }
}

/* ========================= */
/* MESSAGE */
/* ========================= */

function setMessage(text) {
    document.getElementById("message").textContent = text;
}
