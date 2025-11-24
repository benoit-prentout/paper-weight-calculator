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
        formula_sheet: "Formule : Largeur x Hauteur x Grammage x Qté",
        formula_brochure: "Formule : Largeur x Hauteur x Grammage x (Pages / 2) x Qté"
    }
};

// --- DOM ELEMENTS ---
const themeBtn = document.getElementById('theme-btn');
const langBtn = document.getElementById('lang-btn');
const modeRadios = document.querySelectorAll('input[name="mode"]');
const pagesGroup = document.getElementById('pages-group');
const formatSelect = document.getElementById('format');
const inputs = [
    document.getElementById('width'),
    document.getElementById('height'),
    document.getElementById('gsm'),
    document.getElementById('pages'),
    document.getElementById('quantity')
];
const resultWeight = document.getElementById('result-weight');
const resultHeight = document.getElementById('result-height');
const formulaDisplay = document.getElementById('formula-display');

// --- STATE ---
let currentLang = 'en';
let currentMode = 'sheet';
let isDarkMode = false;

// --- FUNCTIONS ---

// 1. Theme Switcher
function toggleTheme() {
    isDarkMode = !isDarkMode;
    // Set attribute on HTML tag for CSS to detect
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    // Change Icon: If Dark mode is active, show Sun (to switch back), else Moon
    themeBtn.textContent = isDarkMode ? '☀️' : '🌙';
}

// 2. Language Switcher
function updateLanguage() {
    // Translate Text
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    // Update Flag Button: Show the flag of the OTHER language (the destination)
    langBtn.textContent = currentLang === 'en' ? '🇫🇷' : '🇬🇧';
    
    updateFormulaText();
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'fr' : 'en';
    updateLanguage();
    calculate(); // Recalculate to update potential units text if any
}

// 3. Mode Switcher
function updateMode() {
    modeRadios.forEach(radio => {
        if (radio.checked) currentMode = radio.value;
    });

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

// 4. Calculation Logic
function calculate() {
    const width_m = (parseFloat(inputs[0].value) || 0) / 1000;
    const height_m = (parseFloat(inputs[1].value) || 0) / 1000;
    const gsm = parseFloat(inputs[2].value) || 0;
    const pages = parseFloat(inputs[3].value) || 0;
    const quantity = parseFloat(inputs[4].value) || 0;

    let totalPhysicalSheets = 0;
    let totalWeightGrams = 0;

    if (currentMode === 'brochure') {
        const sheetsPerCopy = pages / 2;
        totalWeightGrams = (width_m * height_m * gsm * sheetsPerCopy * quantity);
        totalPhysicalSheets = sheetsPerCopy * quantity;
    } else {
        totalWeightGrams = (width_m * height_m * gsm * quantity);
        totalPhysicalSheets = quantity;
    }

    // Weight
    const weightInKg = totalWeightGrams / 1000;
    if (weightInKg < 1) {
        resultWeight.textContent = totalWeightGrams.toFixed(1) + " g";
    } else {
        resultWeight.textContent = weightInKg.toFixed(2) + " kg";
    }

    // Height (Stack)
    const thickness_cm = ((gsm * totalPhysicalSheets) / 1000) / 10;
    resultHeight.textContent = thickness_cm.toFixed(1) + " cm";
}

// --- EVENTS ---
themeBtn.addEventListener('click', toggleTheme);
langBtn.addEventListener('click', toggleLanguage);
modeRadios.forEach(r => r.addEventListener('change', updateMode));
formatSelect.addEventListener('change', (e) => {
    if (sizes[e.target.value]) {
        inputs[0].value = sizes[e.target.value].w;
        inputs[1].value = sizes[e.target.value].h;
        calculate();
    }
});
inputs.forEach(i => i.addEventListener('input', () => {
    if (i === inputs[0] || i === inputs[1]) formatSelect.value = 'custom';
    calculate();
}));

// --- INIT ---
// Check system preference for dark mode
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    toggleTheme(); 
}
updateLanguage();
updateMode();
