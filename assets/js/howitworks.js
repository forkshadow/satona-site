let svgLoaded = false;

document.addEventListener("DOMContentLoaded", async () => {
    await loadSvg();

    document.getElementById("previewBtn").addEventListener("click", previewWords);
    document.getElementById("resetBtn").addEventListener("click", resetPreview);
});

async function loadSvg() {
    const container = document.getElementById("svgContainer");

    try {
        const response = await fetch("assets/images/seedrectobip39.ai.svg");
        const svgText = await response.text();
        container.innerHTML = svgText;
        svgLoaded = true;
    } catch (error) {
        container.innerHTML = "Unable to load SVG.";
        console.error(error);
    }
}

function resetPreview() {
    clearWordBits(1);
    setMessage("");
}

function previewWords() {
    if (!svgLoaded) {
        setMessage("SVG not loaded yet.");
        return;
    }

    if (typeof bip39List === "undefined") {
        setMessage("bip39-list.js not loaded.");
        return;
    }

    clearWordBits(1);

    const word1 = document.getElementById("word1").value.trim().toLowerCase();

    if (!word1) {
        setMessage("Enter at least word 1.");
        return;
    }

    const binary = getBinaryForWord(word1);

    if (!binary) {
        setMessage("Word 1 not found in BIP39 list.");
        return;
    }

    applyBinaryToWord(1, binary);
    setMessage("");
}

function getBinaryForWord(word) {
    if (typeof bip39List !== "undefined" && bip39List[word] !== undefined) {
        return String(bip39List[word]).padStart(11, "0");
    }

    return null;
}

function applyBinaryToWord(wordIndex, binary) {
    for (let i = 0; i < 11; i++) {
        const bit = binary[i];
        const element = document.getElementById(`w${wordIndex}-b${i + 1}`);

        if (!element) {
            continue;
        }

        if (bit === "1") {
            element.setAttribute("fill", "white");
            element.style.fill = "white";
        }
    }
}

function clearWordBits(wordIndex) {
    for (let i = 1; i <= 11; i++) {
        const element = document.getElementById(`w${wordIndex}-b${i}`);
        if (!element) {
            continue;
        }

        element.setAttribute("fill", "black");
        element.style.fill = "black";
    }
}

function setMessage(text) {
    document.getElementById("message").textContent = text;
}
