# Salifort Motors - Employee Retention Analysis

![Salifort Motors Banner](images/image_1.png)

## 📊 Project Overview

Welcome to the **Salifort Motors Employee Retention Analysis** project! This repository hosts a comprehensive data science case study aimed at understanding why employees leave and how to improve retention at Salifort Motors.

The project combines rigorous data analysis with a modern, interactive web showcase to present findings, predictive models, and actionable business recommendations.

**[View the Live Showcase](http://127.0.0.1:8001)** (Local Dev Server)

---

## 🎯 Project Goal

Salifort Motors faced a challenge: **high employee turnover**. Losing talented staff impacts morale, productivity, and the bottom line.

Our mission was to become "data detectives":
1.  **Analyze** employee data to uncover hidden patterns.
2.  **Build** predictive models to identify at-risk employees.
3.  **Recommend** data-driven strategies to improve workplace happiness and retention.

---

## 🚀 Key Features of the Web Showcase

This project isn't just about numbers; it's about communicating them effectively. The web interface features:

*   **📱 Fully Responsive Design**: Optimized for mobile, tablet, and desktop with a fluid layout.
*   **🌗 Dark/Light Mode**: A robust theming system that respects user preference and toggles seamlessly.
*   **✨ Interactive Visualizations**: Zoomable charts with tooltips and detailed captions.
*   **♿ Accessible**: Built with semantic HTML, ARIA labels, skip links, and keyboard navigation support.
*   **⚡ High Performance**: Optimized assets and smooth animations using `requestAnimationFrame`.
*   **📈 Predictive Modeling Insight**: A deep dive into how XGBoost and Random Forest models were used.

---

## 🛠️ Technologies Used

### Web Interface
*   **HTML5**: Semantic structure.
*   **CSS3**: Custom properties (variables), Flexbox/Grid, Media Queries, Animations.
*   **JavaScript (ES6+)**: DOM manipulation, Event handling, Theme logic, Chart.js integration.
*   **Libraries**:
    *   [Chart.js](https://www.chartjs.org/): For dynamic data visualization.
    *   [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/): For scroll animations.
    *   [Prism.js](https://prismjs.com/): For syntax highlighting in code blocks.
    *   [Font Awesome](https://fontawesome.com/): For iconography.

### Data Analysis (Python)
*   **Pandas & NumPy**: Data manipulation and cleaning.
*   **Matplotlib & Seaborn**: Exploratory Data Analysis (EDA) and static plotting.
*   **Scikit-Learn**: Model building (Logistic Regression, Random Forest).
*   **XGBoost**: Advanced gradient boosting for high-accuracy predictions.

---

## 📂 Project Structure

```
Salifort-Motors-Project/
├── css/
│   └── style.css       # Main stylesheet (variables, layout, components)
├── js/
│   └── script.js       # Logic for theme, scroll, charts, and interactions
├── images/             # Static assets and analysis charts
├── index.html          # Main entry point
└── README.md           # Project documentation
```

---

## 🏁 Getting Started

To view the project locally:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/tzolkowski96/Salifort-Motors-Project.git
    cd Salifort-Motors-Project
    ```

2.  **Start a local server**:
    You can use Python's built-in HTTP server:
    ```bash
    python3 -m http.server 8000
    ```

3.  **Open in Browser**:
    Navigate to `http://localhost:8000` to view the site.

---

## 🔍 Key Findings

Our analysis of 15,000 employee records revealed critical insights:

1.  **The "Happiness Gap"**: Low satisfaction is the #1 predictor of turnover.
2.  **The 3-Year Itch**: Employees are most likely to leave between their 3rd and 5th year.
3.  **Burnout Risk**: High project counts (6-7) and excessive monthly hours (>200) drive people away.
4.  **Salary Matters**: Low salary bands see significantly higher turnover rates.
5.  **Promotion Power**: Employees promoted in the last 5 years almost *never* leave.

**Champion Model**: The **XGBoost** model achieved **98% accuracy** and **90% recall**, making it a highly effective early warning system.

---

## 👥 Credits & Acknowledgments

*   **Author**: Tobin Zolkowski
*   **Context**: Google Advanced Data Analytics Capstone Project
*   **Data Source**: Provided by Google/Coursera (Simulated dataset)

---

## 📄 License

&copy; 2025 Tobin Zolkowski. All rights reserved.
This project is for educational and portfolio purposes.
