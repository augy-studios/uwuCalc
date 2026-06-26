# uwuCalc

A collection of **213 calculators** built as a fast, offline-capable Progressive Web App. Covers finance, fitness, math, everyday utilities, and region-specific calculators for the US and Singapore.

## Features

- **213 calculators** across 6 categories, all running client-side with no server round-trips
- **Progressive Web App** — install to your home screen and use offline
- **Favourites** — star any calculator to pin it for quick access (persisted in localStorage)
- **Calculation history** — each calculator keeps a timestamped log of past calculations
- **Search** — instant fuzzy search across all calculators
- **7 colour themes** — Classic (Minty Green), Rosy Pink, Soft Lavender, Pale Yellow, Lilac Blush, Sky Aqua, and Pure White
- **Responsive** — works on desktop, tablet, and mobile
- **Basic / Scientific calculator** on the home page, always accessible

## Quick start

Visit the home page and either:

1. Use the **Basic / Scientific calculator** directly on the landing page
2. Browse the **Discover Calculators** grid — filter by category using the pills
3. **Search** by name or description using the search bar
4. Navigate the **sidebar** — categories are collapsed by default and auto-expand when you're on a calculator in that category

Every calculator page is available at `/{id}` (e.g. `/mortgage`, `/bmi`, `/cpf`).

## Calculator categories

### Financial (63 calculators)

Loans, mortgages, investments, retirement planning, tax, and more.

| Calculator | URL |
| --- | --- |
| Mortgage | [`/mortgage`](/mortgage) |
| Loan | [`/loan`](/loan) |
| Compound Interest | [`/compound-interest`](/compound-interest) |
| Investment | [`/investment`](/investment) |
| Retirement | [`/retirement`](/retirement) |
| Salary | [`/salary`](/salary) |
| ROI | [`/roi`](/roi) |
| Budget | [`/budget`](/budget) |
| Discount | [`/discount`](/discount) |
| Currency | [`/currency`](/currency) |

...and 53 more including Auto Loan, Amortization, Credit Card, Debt Payoff, Refinance, Bond, CD, Margin, Commission, and others.

### Fitness & Health (30 calculators)

Body metrics, nutrition, exercise, and reproductive health.

| Calculator | URL |
| --- | --- |
| BMI | [`/bmi`](/bmi) |
| Calorie | [`/calorie`](/calorie) |
| Body Fat | [`/body-fat`](/body-fat) |
| BMR | [`/bmr`](/bmr) |
| TDEE | [`/tdee`](/tdee) |
| Macro | [`/macro`](/macro) |
| Ideal Weight | [`/ideal-weight`](/ideal-weight) |
| Pregnancy | [`/pregnancy`](/pregnancy) |
| Pace | [`/pace`](/pace) |
| One Rep Max | [`/one-rep-max`](/one-rep-max) |

...and 20 more including Protein, Ovulation, BAC, Body Type, GFR, Calories Burned, and others.

### Math (44 calculators)

Arithmetic, algebra, geometry, statistics, and number theory.

| Calculator | URL |
| --- | --- |
| Scientific | [`/scientific`](/scientific) |
| Fraction | [`/fraction`](/fraction) |
| Percentage | [`/percentage`](/percentage) |
| Triangle | [`/triangle`](/triangle) |
| Standard Deviation | [`/standard-deviation`](/standard-deviation) |
| Probability | [`/probability`](/probability) |
| Quadratic Formula | [`/quadratic`](/quadratic) |
| Matrix | [`/matrix`](/matrix) |
| Statistics | [`/statistics`](/statistics) |
| Prime Factorization | [`/prime-factorization`](/prime-factorization) |

...and 34 more including Slope, Log, Area, Volume, Circle, Pythagorean Theorem, Z-score, Confidence Interval, and others.

### Other (54 calculators)

Date/time, construction, electrical, automotive, chemistry, weather, developer tools, and more.

| Calculator | URL |
| --- | --- |
| Age | [`/age`](/age) |
| Date | [`/date`](/date) |
| Tip | [`/tip`](/tip) |
| GPA | [`/gpa`](/gpa) |
| Conversion | [`/conversion`](/conversion) |
| Password Generator | [`/password`](/password) |
| IP Subnet | [`/ip-subnet`](/ip-subnet) |
| Ohm's Law | [`/ohms-law`](/ohms-law) |
| Dice Roller | [`/dice`](/dice) |
| Sleep | [`/sleep`](/sleep) |

...and 44 more including Time Zone, Fuel Cost, Stair, Roofing, Tile, Molecular Weight, Roman Numeral, and others.

### US-Centric (13 calculators)

Calculators specific to US federal tax law, government programs, and military standards.

| Calculator | URL |
| --- | --- |
| Income Tax | [`/income-tax`](/income-tax) |
| 401K | [`/401k`](/401k) |
| Roth IRA | [`/roth-ira`](/roth-ira) |
| IRA | [`/ira`](/ira) |
| RMD | [`/rmd`](/rmd) |
| Sales Tax | [`/sales-tax`](/sales-tax) |
| Social Security | [`/social-security`](/social-security) |
| Take-Home Paycheck | [`/take-home-paycheck`](/take-home-paycheck) |
| FHA Loan | [`/fha-loan`](/fha-loan) |
| VA Mortgage | [`/va-mortgage`](/va-mortgage) |
| Marriage Tax | [`/marriage-tax`](/marriage-tax) |
| Estate Tax | [`/estate-tax`](/estate-tax) |
| Army Body Fat | [`/army-body-fat`](/army-body-fat) |

### Singapore (9 calculators)

Calculators specific to Singapore's tax system, CPF, housing, and national service.

| Calculator | URL |
| --- | --- |
| SG Income Tax | [`/sg-income-tax`](/sg-income-tax) |
| CPF | [`/cpf`](/cpf) |
| SRS | [`/srs`](/srs) |
| GST | [`/gst`](/gst) |
| SG Take-Home Pay | [`/sg-take-home-pay`](/sg-take-home-pay) |
| HDB Loan | [`/hdb-loan`](/hdb-loan) |
| CPF Life | [`/cpf-life`](/cpf-life) |
| BSD / ABSD | [`/bsd`](/bsd) |
| IPPT | [`/ippt`](/ippt) |

## Project structure

```text
uwuCalc/
  index.html              Home page (basic/scientific calc + discover grid)
  calc-template.html      Template for all calculator pages
  vercel.json             Vercel deployment config (rewrites /:slug to API)
  sw.js                   Service worker for offline caching
  manifest.json           PWA manifest
  css/
    global.css            All styles, themes, and responsive layout
  js/
    registry.js           Central registry of all 213 calculators
    home.js               Sidebar builder + discover grid + category pills
    calc-page.js          Calculator page renderer + engine dispatcher
    search.js             Instant search across all calculators
    favourites.js         Star/unstar calculators (localStorage)
    history.js            Per-calculator history log (localStorage)
    theme.js              7-theme colour switcher
    script.js             Shared utilities, sidebar toggle, SW registration
    basic-calculator.js   Basic/scientific calculator widget
  engines/
    financial.js          63 financial calculators
    fitness.js            30 fitness & health calculators
    math.js               44 math calculators
    other.js              54 other/utility calculators
    usa.js                13 US-centric calculators
    sg.js                 9 Singapore-centric calculators
  api/
    calc/[slug].js        Vercel serverless function (renders calc-template)
```

## Development

The app runs on [Vercel](https://vercel.com) with a single serverless function that renders calculator pages from the template. All calculator logic runs client-side in the browser.

To run locally:

```bash
npm i -g vercel
vercel dev
```

Or serve statically with any HTTP server — calculators will work on any server that can rewrite `/:slug` to the API route.

## Themes

Open the settings gear icon in the top-right corner to switch between 7 colour themes:

| Theme | Preview colour |
| --- | --- |
| Classic | Minty Green |
| Rosy Pink | Soft pink |
| Soft Lavender | Light purple |
| Pale Yellow | Warm yellow |
| Lilac Blush | Pink-purple |
| Sky Aqua | Light blue |
| Pure White | Clean white |

## License

Made by [Augy Studios](https://github.com/augy-studios).
