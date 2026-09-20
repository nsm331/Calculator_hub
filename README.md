# CalculatorHub (Modern Django Calculation Platform)

CalculatorHub is a high-performance web platform built with **Django** and **Pure Vanilla JavaScript**, featuring **15 active calculators** across 4 key domains: Financial, Fitness & Health, Math, and Utility Tools.

Each calculator is backed by dynamic database models with in-depth (~400–500 word) educational articles, formal **KaTeX LaTeX** mathematical formulas, complete institutional dark/light theme support, and instantaneous **client-side only** calculations (zero page reload, zero latency).

---

## 🚀 Active Calculators (15 Tools Live)

### 1. Financial Calculators
- **Loan Calculator**: Monthly payments, total interest burden, and full loan amortization schedule.
- **Mortgage Calculator**: PITI payment breakdown, property taxes, home insurance, and HOA fees.
- **Auto Loan Calculator**: Vehicle financing, trade-in equity allowance, sales tax, and dealer fees.
- **Compound Interest Calculator**: Exponential portfolio growth, periodic contributions, APY, and annual schedule.

### 2. Fitness & Health Calculators
- **BMI Calculator**: Body Mass Index, WHO health categories, and healthy weight targets.
- **Calorie Needs Calculator**: TDEE calculation, Mifflin-St Jeor BMR, and caloric deficit/surplus targets.
- **Body Fat Percentage Calculator**: U.S. Navy tape measure method, lean mass vs. fat mass, and ACE categories.
- **Basal Metabolic Rate (BMR) Calculator**: Multi-formula metabolic baselines (Mifflin-St Jeor, Harris-Benedict, Katch-McArdle) and activity multiplier analysis.

### 3. Math Calculators
- **Percentage Calculator**: Three core percentage formulas, percentage increase/decrease, and discounts.
- **Scientific Calculator**: LCD digital screen, trigonometric (DEG/RAD), powers, roots, factorials, and memory registers.
- **Fraction Calculator**: Arithmetic operations ($+$, $-$, $\times$, $\div$) with Euclidean $\gcd$ simplification and step-by-step proofs.
- **Binary & Hexadecimal Converter**: Multi-base live converter (Dec, Bin, Hex, Oct, ASCII), 16/32-bit interactive LED matrix, and Two's Complement.

### 4. Other Calculators
- **Age Calculator**: Exact chronological age (years, months, days, hours), next birthday countdown, and zodiac info.
- **Date Difference Calculator**: Calendar days, weeks, exact Gregorian differences, and business days (excluding weekends).
- **Time & Duration Calculator**: Duration between timestamps, add/subtract sexagesimal hours/mins/secs, and decimal payroll hours.

---

## 🛠️ Architecture & Tech Stack

- **Backend**: Python 3.12+ & Django 5.2
- **Database**: SQLite (or PostgreSQL in production) with dynamic `Calculator` models for customizable SEO metadata and KaTeX HTML articles.
- **Frontend**: Semantic HTML5, Modular CSS Design System (Custom Dark/Light Theme Switcher with localStorage persistence), and 100% Vanilla JavaScript.
- **Mathematical Typography**: KaTeX for fast, server-rendered and browser-rendered LaTeX math expressions.
- **SEO & Search Engines**: Dynamic XML Sitemap (`/sitemap.xml`), auto-generated `robots.txt`, breadcrumbs, and live autocomplete search.
- **Monetization Ready**: Dedicated Google AdSense responsive placeholders (`#ad-top-banner`, `#ad-sidebar`, `#ad-bottom-content`).

---

## ⚡ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/nsm331/Calculator_hub.git
cd Calculator_hub
```

### 2. Set up virtual environment
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run database migrations & seed calculators
```bash
python manage.py migrate
python manage.py seed_calculators
```

### 5. Run the automated test suite
```bash
python manage.py test
```

### 6. Start the local development server
```bash
python manage.py runserver
```
Visit `http://127.0.0.1:8000/` in your browser.

---

## 🧪 Automated Testing

All views, SEO meta tags, KaTeX assets, modular script isolation, dynamic model retrieval, and sitemap generation are covered by automated unit tests:
```bash
python manage.py test
# Ran 20 tests in 0.35s - OK
```

---

## 📄 License
MIT License. Free for educational and commercial use.
