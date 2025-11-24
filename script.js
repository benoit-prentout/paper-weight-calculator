// Standard sizes in millimeters
const sizes = {
    a4: { w: 210, h: 297 },
    a3: { w: 297, h: 420 },
    a5: { w: 148, h: 210 },
    business_card: { w: 85, h: 55 }
};

// Get DOM elements
const formatSelect = document.getElementById('format');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const gsmInput = document.getElementById('gsm');
const quantityInput = document.getElementById('quantity');
const resultDisplay = document.getElementById('result');

// Function to calculate weight
function calculateWeight() {
    const width = parseFloat(widthInput.value) || 0;
    const height = parseFloat(heightInput.value) || 0;
    const gsm = parseFloat(gsmInput.value) || 0;
    const qty = parseFloat(quantityInput.value) || 0;

    // Formula: (Width_mm * Height_mm * GSM * Qty) / 1,000,000 = Grams
    // Then divide by 1000 to get Kilograms
    const weightInGrams = (width * height * gsm * qty) / 1000000;
    const weightInKg = weightInGrams / 1000;

    // Display result (if < 1kg show grams, otherwise kg)
    if (weightInKg < 1) {
        resultDisplay.textContent = weightInGrams.toFixed(1) + " g";
    } else {
        resultDisplay.textContent = weightInKg.toFixed(2) + " kg";
    }
}

// Event Listener: Change dimensions when dropdown changes
formatSelect.addEventListener('change', (e) => {
    const selected = e.target.value;
    if (sizes[selected]) {
        widthInput.value = sizes[selected].w;
        heightInput.value = sizes[selected].h;
    }
    calculateWeight();
});

// Event Listeners: Recalculate whenever a number changes
[widthInput, heightInput, gsmInput, quantityInput].forEach(input => {
    input.addEventListener('input', () => {
        // If user types manually, set dropdown to 'custom'
        if (input === widthInput || input === heightInput) {
            formatSelect.value = 'custom';
        }
        calculateWeight();
    });
});

// Initial calculation on load
calculateWeight();
