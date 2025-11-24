// --- CONFIGURATION & DATA ---

const sizes = {
    a4: { w: 210, h: 297 },
    a3: { w: 297, h: 420 },
    a5: { w: 148, h: 210 },
    business_card: { w: 85, h: 55 }
};

const translations = {
    en: {
        title: "📄 Paper Weight Calculator",
        subtitle: "Calculate weight and stack height for sheets or brochures.",
        mode_sheet: "Standard Sheet",
        mode_brochure: "Brochure / Book",
        label_format: "Format",
        opt_custom: "Custom Size",
        opt_card: "Business Card (85 x 55 mm)",
        label_width: "Width",
        label_height: "Height",
        label_gsm: "Weight",
        label_pages: "Pages (Total)",
        label_quantity: "Quantity (Copies)",
        res_weight: "Total Weight:",
        res_height: "Stack Height:",
        btn_lang: "Français",
        formula_sheet: "Formula: Width x Height x GSM x Qty",
        formula_brochure: "Formula: Width x Height x GSM x (Pages / 2) x Qty"
    },
    fr: {
        title: "📄 Calculateur Poids Papier",
        subtitle: "Calculez le poids et la hauteur de pile pour feuilles ou brochures.",
        mode_sheet: "Feuille Standard",
        mode_brochure: "Brochure / Livre",
        label_format: "Format",
        opt_custom: "Format Personnalisé",
        opt_card: "Carte de visite (85 x 55 mm)",
        label_width: "Largeur",
        label_height: "Hauteur",
        label_gsm: "Grammage",
        label_pages: "Nombre de Pages",
        label_quantity: "Quantité (Exemplaires)",
        res_weight: "Poids Total :",
        res_height: "Hauteur Pile :",
        btn_lang: "English",
        formula_sheet: "Formule : Largeur x Hauteur x Grammage x Qté",
        formula_brochure: "Formule : Largeur x Hauteur x Grammage x (Pages / 2) x Qté"
    }
};

// --- DOM ELEMENTS ---

const langBtn = document.getElementById('lang-btn');
const modeRadios = document.querySelectorAll('input[name="mode"]');
const pagesGroup = document.getElementById('pages-group');
const formatSelect = document.getElementById('format');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const gsmInput = document.getElementById('gsm');
const pagesInput = document.getElementById('pages');
const quantityInput = document.getElementById('quantity');
const resultWeight = document.getElementById('result-weight');
const resultHeight = document.getElementById('result-height');
const formulaDisplay = document.getElementById('formula-display');

// State variables
let currentLang = 'en';
let currentMode = 'sheet'; // 'sheet' or 'brochure'

// --- FUNCTIONS ---

// 1. Language Switcher
function updateLanguage() {
    // Update all text elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    
    // Update button text
    langBtn.textContent = translations[currentLang].btn_lang;
    
    // Update Formula Text
    updateFormulaText();
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'fr' : 'en';
    updateLanguage();
}

// 2. Mode Switcher (Sheet vs Brochure)
function updateMode() {
    // Get selected mode
    modeRadios.forEach(radio => {
        if (radio.checked) currentMode = radio.value;
    });

    // Show/Hide Pages Input
    if (currentMode === 'brochure') {
        pagesGroup.classList.remove('hidden');
    } else {
        pagesGroup.classList.add('hidden');
    }

    updateFormulaText();
    calculate();
}

function updateFormulaText() {
    if (currentMode === 'brochure') {
        formulaDisplay.textContent = translations[currentLang].formula_brochure;
    } else {
        formulaDisplay.textContent = translations[currentLang].formula_sheet;
    }
}

// 3. Main Calculation Logic
function calculate() {
    const width_mm = parseFloat(widthInput.value) || 0;
    const height_mm = parseFloat(heightInput.value) || 0;
    const gsm = parseFloat(gsmInput.value) || 0;
    const quantity = parseFloat(quantityInput.value) || 0;
    const pages = parseFloat(pagesInput.value) || 0;

    // Convert dimensions to meters
    const width_m = width_mm / 1000;
    const height_m = height_mm / 1000;

    // Determine Physical Sheet Count
    // If Brochure: (Pages / 2) * Copies
    // If Sheet: 1 * Copies
    let totalPhysicalSheets = 0;
    let totalWeightGrams = 0;

    if (currentMode === 'brochure') {
        // Brochure Formula: Area * GSM * (Pages/2) * Qty
        const sheetsPerCopy = pages / 2;
        totalWeightGrams = (width_m * height_m * gsm * sheetsPerCopy * quantity);
        totalPhysicalSheets = sheetsPerCopy * quantity;
    } else {
        // Sheet Formula: Area * GSM * Qty
        totalWeightGrams = (width_m * height_m * gsm * quantity);
        totalPhysicalSheets = quantity;
    }

    // --- WEIGHT RESULT ---
    // Convert to KG
    const weightInKg = totalWeightGrams / 1000;
    
    if (weightInKg < 1) {
        resultWeight.textContent = totalWeightGrams.toFixed(1) + " g";
    } else {
        resultWeight.textContent = weightInKg.toFixed(2) + " kg";
    }

    // --- HEIGHT RESULT ("Will it fit?") ---
    // Estimation: Standard paper thickness in microns is approx equal to GSM (bulk 1.0)
    // Formula: (GSM * TotalPhysicalSheets) / 1000 = Total Thickness in mm
    // Divide by 10 to get CM
    const thickness_mm = (gsm * totalPhysicalSheets) / 1000;
    const thickness_cm = thickness_mm / 10;

    resultHeight.textContent = thickness_cm.toFixed(1) + " cm";
}

// --- EVENT LISTENERS ---

// Language Toggle
langBtn.addEventListener('click', toggleLanguage);

// Mode Toggle
modeRadios.forEach(radio => radio.addEventListener('change', updateMode));

// Format Dropdown
formatSelect.addEventListener('change', (e) => {
    const selected = e.target.value;
    if (sizes[selected]) {
        widthInput.value = sizes[selected].w;
        heightInput.value = sizes[selected].h;
    }
    calculate();
});

// Inputs
[widthInput, heightInput, gsmInput, pagesInput, quantityInput].forEach(input => {
    input.addEventListener('input', () => {
        if (input === widthInput || input === heightInput) {
            formatSelect.value = 'custom';
        }
        calculate();
    });
});

// --- INITIALIZE ---
updateLanguage();
updateMode(); // This also triggers calculate()
