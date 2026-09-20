/**
 * CalculatorHub - Global Scripts
 * Pure Vanilla JavaScript (Theme Switcher & Live Search)
 */

// 1. Instant Theme Initialization (Preventing Flash of Unstyled Theme)
(function initTheme() {
    const savedTheme = localStorage.getItem('calculatorhub_theme') || 
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
    // 2. Dark Mode / Light Mode Toggle Button
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('calculatorhub_theme', newTheme);
            themeToggleBtn.setAttribute('aria-label', `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} mode`);
        });
    }

    // 3. Mobile Navigation Menu Toggle
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    // 4. Calculator Search with Live Autocomplete Filter
    const searchInput = document.getElementById('calculator-search');
    const searchResults = document.getElementById('search-results-dropdown');
    const clearBtn = document.getElementById('search-clear-btn');

    if (searchInput && searchResults) {
        // Complete database of calculators searchable on CalculatorHub
        const calculatorsCatalog = [
            { title: 'Loan Calculator', category: 'Financial', url: '/financial-calculators/loan-calculator/' },
            { title: 'BMI Calculator', category: 'Fitness & Health', url: '/fitness-and-health-calculators/bmi-calculator/' },
            { title: 'Percentage Calculator', category: 'Math', url: '/math-calculators/percentage-calculator/' },
            { title: 'Mortgage Calculator', category: 'Financial', url: '/financial-calculators/mortgage-calculator/' },
            { title: 'Auto Loan Calculator', category: 'Financial', url: '/financial-calculators/auto-loan-calculator/' },
            { title: 'Compound Interest Calculator', category: 'Financial', url: '/financial-calculators/compound-interest-calculator/' },
            { title: 'Amortization Calculator', category: 'Financial', url: '/financial-calculators/amortization-calculator/' },
            { title: 'Refinance Calculator', category: 'Financial', url: '/financial-calculators/refinance-calculator/' },
            { title: 'Retirement Calculator', category: 'Financial', url: '/financial-calculators/retirement-calculator/' },
            { title: 'Investment Calculator', category: 'Financial', url: '/financial-calculators/investment-calculator/' },
            { title: 'Inflation Calculator', category: 'Financial', url: '/financial-calculators/inflation-calculator/' },
            { title: 'Calorie Needs Calculator', category: 'Fitness & Health', url: '/fitness-and-health-calculators/calorie-calculator/' },
            { title: 'Body Fat Calculator', category: 'Fitness & Health', url: '/fitness-and-health-calculators/body-fat-calculator/' },
            { title: 'BMR Calculator', category: 'Fitness & Health', url: '/fitness-and-health-calculators/bmr-calculator/' },
            { title: 'Ideal Body Weight Calculator', category: 'Fitness & Health', url: '/fitness-and-health-calculators/ideal-weight-calculator/' },
            { title: 'Running Pace Calculator', category: 'Fitness & Health', url: '/fitness-and-health-calculators/running-pace-calculator/' },
            { title: 'Target Heart Rate Zones', category: 'Fitness & Health', url: '/fitness-and-health-calculators/target-heart-rate-calculator/' },
            { title: 'Pregnancy Due Date Calculator', category: 'Fitness & Health', url: '/fitness-and-health-calculators/pregnancy-calculator/' },
            { title: 'Ovulation & Fertility Calculator', category: 'Fitness & Health', url: '/fitness-and-health-calculators/ovulation-calculator/' },
            { title: 'Scientific Calculator', category: 'Math', url: '/math-calculators/scientific-calculator/' },
            { title: 'Fraction Calculator', category: 'Math', url: '/math-calculators/fraction-calculator/' },
            { title: 'Binary & Hex Converter', category: 'Math', url: '/math-calculators/binary-hex-converter/' },
            { title: 'Decimal to Fraction Converter', category: 'Math', url: '/math-calculators/decimal-to-fraction-calculator/' },
            { title: '2D Function Graphing Tool', category: 'Math', url: '/math-calculators/graphing-calculator/' },
            { title: 'Matrix Operations Calculator', category: 'Math', url: '/math-calculators/matrix-calculator/' },
            { title: 'Random Number Generator', category: 'Math', url: '/math-calculators/random-number-generator/' },
            { title: 'Standard Deviation & Variance Calculator', category: 'Math', url: '/math-calculators/standard-deviation-calculator/' },
            { title: 'Age Calculator', category: 'Other', url: '/other-calculators/age-calculator/' },
            { title: 'Date Difference Calculator', category: 'Other', url: '/other-calculators/date-difference-calculator/' },
            { title: 'Time & Duration Calculator', category: 'Other', url: '/other-calculators/time-duration-calculator/' },
            { title: 'Work Hours & Timesheet Calculator', category: 'Other', url: '/other-calculators/work-hours-calculator/' },
            { title: 'College GPA Calculator', category: 'Other', url: '/other-calculators/gpa-calculator/' },
            { title: 'Final Grade Needed Calculator', category: 'Other', url: '/other-calculators/final-grade-calculator/' },
            { title: 'IPv4 Subnet Mask Calculator', category: 'Other', url: '/other-calculators/subnet-calculator/' },
            { title: 'Speed, Distance & Time Calculator', category: 'Other', url: '/other-calculators/speed-distance-time-calculator/' },
        ];

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();

            if (clearBtn) {
                clearBtn.style.display = query.length > 0 ? 'block' : 'none';
            }

            if (query.length === 0) {
                searchResults.style.display = 'none';
                searchResults.innerHTML = '';
                return;
            }

            const matches = calculatorsCatalog.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.category.toLowerCase().includes(query)
            );

            if (matches.length === 0) {
                searchResults.innerHTML = '<div style="padding: 12px 16px; font-size: 13px; color: var(--color-text-muted);">No matching calculators found.</div>';
                searchResults.style.display = 'block';
                return;
            }

            searchResults.innerHTML = matches.map(item => `
                <a href="${item.url}" class="search-item">
                    <span class="search-item-title">${item.title}</span>
                    <span class="search-item-cat">${item.category}</span>
                </a>
            `).join('');

            searchResults.style.display = 'block';
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                searchResults.style.display = 'none';
                clearBtn.style.display = 'none';
                searchInput.focus();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
});
