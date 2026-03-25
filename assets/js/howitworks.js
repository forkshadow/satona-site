let svgLoaded = false;

document.addEventListener("DOMContentLoaded", async () => {
    await loadSvg();

    document.getElementById("previewBtn").addEventListener("click", previewWords);
    document.getElementById("resetBtn").addEventListener("click", resetPreview);
});

/* ========================= */
/* LOAD SVG */
/* ========================= */

async function loadSvg() {

    const container = document.getElementById("plateFull");

    try {
        const response = await fetch("assets/images/seedrectobip39.ai.svg");
        const svgText = await response.text();

        container.innerHTML = svgText;

        const svg = container.querySelector("svg");
        svg.style.width = "100%";
        svg.style.height = "auto";

        svgLoaded = true;

    } catch (error) {
        container.innerHTML = "Unable to load SVG.";
        console.error(error);
    }
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

    document.querySelector(".plates-section").scrollIntoView({
        behavior: "smooth"
    });
}

/* ========================= */
/* BIP39 */
/* ========================= */

function getBinaryForWord(word) {
    if (bip39List[word] !== undefined) {
        return String(bip39List[word]).padStart(11, "0");
    }
    return null;
}

/* ========================= */
/* APPLY */
/* ========================= */

function applyBinaryToWord(wordIndex, binary) {

    for (let i = 0; i < 11; i++) {

        const bit = binary[i];

        const element = document.getElementById(`w${wordIndex}-b${i + 1}`);

        if (!element) continue;

        element.setAttribute("fill", bit === "1" ? "white" : "black");
    }
}

/* ========================= */
/* CLEAR */
/* ========================= */

function clearAllWords() {

    for (let w = 1; w <= 24; w++) {

        for (let i = 1; i <= 11; i++) {

            const el = document.getElementById(`w${w}-b${i}`);
            if (!el) continue;

            el.setAttribute("fill", "black");
        }
    }
}

/* ========================= */
/* MESSAGE */
/* ========================= */

function setMessage(text) {
    document.getElementById("message").textContent = text;
}
