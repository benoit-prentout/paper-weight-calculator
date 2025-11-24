// --- ICONS (SVG Paths) ---
const ICON_MOON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
const ICON_SUN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

// --- DATA ---
const sizes = {
    a3: { w: 297, h: 420 },
    a4: { w: 210, h: 297 },
    a5: { w: 148, h: 210 },
    a6: { w: 105, h: 148 },
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
        formula_brochure: "Formula: Width x Height x GSM x (Pages / 2) x Qty",
        footer_open: "Open source project hosted on GitHub.",
        footer_by: "Created by",
        seo_title: "About this tool",
        seo_text: "This free tool helps printers, graphic designers, and logistics managers calculate the total weight of a paper order. It supports standard formats (A4, A3, A5, A6), paper weight (GSM), and quantity. It also estimates the stack height (bulk) for shipping and the weight of stitched brochures or books."
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
        formula_brochure: "Formule : Largeur x Hauteur x Grammage x (Pages / 2) x Qté",
        footer_open: "Projet open source hébergé sur GitHub.",
        footer_by: "Créé par",
        seo_title: "À propos de ce calculateur",
        seo_text: "Cet outil gratuit permet aux imprimeurs, graphistes et logisticiens de calculer le poids total d'une commande de papier. Il prend en compte le format (A4, A3, A5, A6), le grammage (g/m²) et la quantité. Il permet également d'estimer la hauteur de la pile de papier (utile pour les cartons) et le poids de brochures agrafées ou dos carré collé."
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

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    // Render SVG
    themeBtn.innerHTML = isDarkMode ? ICON_SUN : ICON_MOON;
}

function updateLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    // Toggle button text shows the OTHER language
    langBtn.textContent = currentLang === 'en' ? 'FR' : 'EN';
    updateFormulaText();
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'fr' : 'en';
    updateLanguage();
    calculate();
}

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

function calculate() {
    const width_m = (parseFloat(inputs[0].value) || 0) / 1000;
    const height_m = (parseFloat(inputs[1].value) || 0) / 1000;
    const gsm = parseFloat(inputs[2].value) || 0;
    const pages = parseFloat(inputs[3].value) || 0;
    const quantity = parseFloat(inputs[4].value) || 0;

    let totalPhysicalSheets = 0;
    let totalWeightGrams = 0;

    if (currentMode === 'brochure') {
        // Brochure formula: Area * GSM * (Pages/2) * Qty
        const sheetsPerCopy = pages / 2;
        totalWeightGrams = (width_m * height_m * gsm * sheetsPerCopy * quantity);
        totalPhysicalSheets = sheetsPerCopy * quantity;
    } else {
        // Sheet formula
        totalWeightGrams = (width_m * height_m * gsm * quantity);
        totalPhysicalSheets = quantity;
    }

    // Weight Display
    const weightInKg = totalWeightGrams / 1000;
    if (weightInKg < 1) {
        resultWeight.textContent = totalWeightGrams.toFixed(1) + " g";
    } else {
        resultWeight.textContent = weightInKg.toFixed(2) + " kg";
    }

    // Height Display (Estimation: 1 sheet ~ GSM microns)
    const thickness_cm = ((gsm * totalPhysicalSheets) / 1000) / 10;
    resultHeight.textContent = thickness_cm.toFixed(1) + " cm";
}

// --- EVENT LISTENERS ---
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
} else {
    themeBtn.innerHTML = ICON_MOON;
}
updateLanguage();
updateMode();
