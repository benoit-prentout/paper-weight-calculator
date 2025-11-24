# 📄 Paper Weight & Volume Calculator

A lightweight, open-source tool for printers, graphic designers, and logistics managers. Calculate the total weight of a print job and estimate the stack height instantly.

**[👉 Live Demo](https://benoit-prentout.github.io/paper-weight-calculator/)**

## ✨ Features

* **⚡️ Instant Calculation:** No page reloads. Results update as you type.
* **📚 Brochure & Book Mode:** Specifically calculates weight for stitched brochures using the formula: `(Pages / 2)`.
* **📦 Stack Height Estimator:** Estimates the vertical height of your paper stack ("Will it fit on the pallet?").
* **📐 Standard & Custom Formats:**
    * Pre-sets: A3, A4, A5, A6, Business Cards.
    * Custom width/height input.
* **🌍 Bilingual:** Complete interface translation between **English** and **French**.
* **🌗 Dark/Light Mode:** Automatically detects system preference, with a manual toggle.
* **📱 Responsive:** Works perfectly on mobile, tablets, and desktops.
* **🚀 SEO Optimized:** Meta tags included for better search engine indexing.

## 🧮 How it Works ( The Math)

This tool uses standard industry formulas to ensure accuracy.

### 1. Sheet Weight
For standard flyers, posters, or single sheets:
$$\text{Weight (kg)} = \frac{\text{Width (m)} \times \text{Height (m)} \times \text{GSM} \times \text{Qty}}{1000}$$

### 2. Brochure / Book Weight
For stapled brochures or stitched books, we convert pages to physical sheets:
$$\text{Weight (kg)} = \frac{\text{Width (m)} \times \text{Height (m)} \times \text{GSM} \times (\frac{\text{Pages}}{2}) \times \text{Qty}}{1000}$$

### 3. Stack Height (Volume)
We estimate the bulk based on standard paper thickness (approx. 1 sheet = GSM in microns):
$$\text{Height (cm)} = \frac{\text{GSM} \times \text{Total Sheets}}{10000}$$

## 🛠 Installation & Usage

This project uses **Vanilla HTML, CSS, and JavaScript**. No build tools (npm, webpack, etc.) are required.

### Run Locally
1.  Clone the repository:
    ```bash
    git clone [https://github.com/benoit-prentout/paper-weight-calculator.git](https://github.com/benoit-prentout/paper-weight-calculator.git)
    ```
2.  Open `index.html` in your web browser.

### Hosting
This project is designed to be hosted on **GitHub Pages**.
1.  Go to your repository Settings.
2.  Click on **Pages**.
3.  Select `main` branch as the source.
4.  Your site will be live at `https://yourusername.github.io/paper-weight-calculator/`.

## 🤝 Contributing

Contributions are welcome! If you want to add more paper formats (US Letter, Legal) or refine the thickness calculation logic:

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👤 Author

**Benoît Prentout**

* GitHub: [@benoit-prentout](https://github.com/benoit-prentout)

---

*If you found this tool useful, give it a ⭐️ on GitHub!*
