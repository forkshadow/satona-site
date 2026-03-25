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

    const front = document.getElementById("plateFront");
    const back = document.getElementById("plateBack");

    try {
        const response = await fetch("assets/images/seedrectobip39.ai.svg");
        const svgText = await response.text();

        // 🔥 inject SVG dans les deux zones
        front.innerHTML = svgText;
        back.innerHTML = svgText;

        // 🔥 force responsive
        const svgs = document.querySelectorAll("#plateFront svg, #plateBack svg");

        svgs.forEach(svg => {
            svg.style.width = "100%";
            svg.style.height = "auto";
        });

        svgLoaded = true;

    } catch (error) {
        front.innerHTML = "Unable to load SVG.";
        back.innerHTML = "Unable to load SVG.";
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
        const input = document.getElementById("word" + i);
        const word = input.value.trim().toLowerCase();

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

    // 🔥 scroll vers les plaques
    document.querySelector(".plates-section").scrollIntoView({
        behavior: "smooth"
    });
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

    // ⚠️ IMPORTANT : querySelectorAll pour gérer les 2 SVG (front + back)
    for (let i = 0; i < 11; i++) {

        const bit = binary[i];

        const elements = document.querySelectorAll(
            `[id="w${wordIndex}-b${i + 1}"]`
        );

        elements.forEach(element => {

            if (bit === "1") {
                element.setAttribute("fill", "white");
                element.style.fill = "white";
            } else {
                element.setAttribute("fill", "black");
                element.style.fill = "black";
            }

        });
    }
}

/* ========================= */
/* CLEAR */
/* ========================= */

function clearWordBits(wordIndex) {

    for (let i = 1; i <= 11; i++) {

        const elements = document.querySelectorAll(
            `[id="w${wordIndex}-b${i}"]`
        );

        elements.forEach(el => {
            el.setAttribute("fill", "black");
            el.style.fill = "black";
        });
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
