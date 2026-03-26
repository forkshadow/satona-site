let svgLoaded = false;
let pointsMap = {};
let loadingInProgress = false;

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

/* ========================= */
/* LOAD SVG SÉCURISÉ */
/* ========================= */

async function loadSvg(retries = 2) {
    if (loadingInProgress) return;
    loadingInProgress = true;

    const container = document.getElementById("svgContainer");

    try {
        const response = await fetch("assets/images/seedrectobip39.ai.svg", {
            cache: "no-store"
        });

        const svgText = await response.text();

        // 🔥 vérification critique
        if (!svgText.includes("w1-b1")) {
            throw new Error("SVG incomplete");
        }

        container.innerHTML = svgText;

        buildPointsMap();

        // 🔥 validation réelle DOM
        if (Object.keys(pointsMap).length < 200) {
            throw new Error("SVG missing elements");
        }

        svgLoaded = true;
        loadingInProgress = false;

        console.log("✅ SVG loaded OK");

    } catch (error) {
        console.warn("⚠️ SVG load failed:", error);

        if (retries > 0) {
            loadingInProgress = false;
            console.log("🔄 retry SVG...");
            await loadSvg(retries - 1);
        } else {
            container.innerHTML = "Network issue. Please refresh.";
            loadingInProgress = false;
        }
    }
}

/* ========================= */
/* BUILD MAP */
/* ========================= */

function buildPointsMap() {
    pointsMap = {};

    const svg = document.getElementById("svgContainer");
    if (!svg) return;

    const elements = svg.querySelectorAll("[id^='w']");

    elements.forEach(el => {
        pointsMap[el.id] = el;
    });

    console.log("🔎 mapped:", Object.keys(pointsMap).length);
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

async function previewWords() {

    // 🔥 bloque si SVG pas prêt
    if (!svgLoaded || Object.keys(pointsMap).length < 200) {
        setMessage("Loading SVG...");
        await loadSvg();
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
