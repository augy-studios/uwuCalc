// js/registry.js - Central registry of all calculators
// Each entry: { id, name, slug, category, description, engine }

const CALC_REGISTRY = [
    // ============ FINANCIAL ============
    {
        id: 'mortgage',
        name: 'Mortgage Calculator',
        slug: 'mortgage-calculator',
        category: 'Financial',
        description: 'Calculate monthly mortgage payments and total interest.',
        engine: 'financial'
    },
    {
        id: 'loan',
        name: 'Loan Calculator',
        slug: 'loan-calculator',
        category: 'Financial',
        description: 'Calculate loan payments, interest, and amortization.',
        engine: 'financial'
    },
    {
        id: 'auto-loan',
        name: 'Auto Loan Calculator',
        slug: 'auto-loan-calculator',
        category: 'Financial',
        description: 'Estimate your car loan monthly payments.',
        engine: 'financial'
    },
    {
        id: 'interest',
        name: 'Interest Calculator',
        slug: 'interest-calculator',
        category: 'Financial',
        description: 'Calculate simple and compound interest over time.',
        engine: 'financial'
    },
    {
        id: 'payment',
        name: 'Payment Calculator',
        slug: 'payment-calculator',
        category: 'Financial',
        description: 'Find your monthly payment for any loan.',
        engine: 'financial'
    },
    {
        id: 'retirement',
        name: 'Retirement Calculator',
        slug: 'retirement-calculator',
        category: 'Financial',
        description: 'Plan your retirement savings and income.',
        engine: 'financial'
    },
    {
        id: 'amortization',
        name: 'Amortization Calculator',
        slug: 'amortization-calculator',
        category: 'Financial',
        description: 'View full loan amortization schedules.',
        engine: 'financial'
    },
    {
        id: 'investment',
        name: 'Investment Calculator',
        slug: 'investment-calculator',
        category: 'Financial',
        description: 'Project investment growth over time.',
        engine: 'financial'
    },
    {
        id: 'currency',
        name: 'Currency Calculator',
        slug: 'currency-calculator',
        category: 'Financial',
        description: 'Convert between world currencies.',
        engine: 'financial'
    },
    {
        id: 'inflation',
        name: 'Inflation Calculator',
        slug: 'inflation-calculator',
        category: 'Financial',
        description: 'Calculate the effect of inflation on purchasing power.',
        engine: 'financial'
    },
    {
        id: 'finance',
        name: 'Finance Calculator',
        slug: 'finance-calculator',
        category: 'Financial',
        description: 'Solve for any TVM variable: PV, FV, PMT, rate, periods.',
        engine: 'financial'
    },
    {
        id: 'mortgage-payoff',
        name: 'Mortgage Payoff Calculator',
        slug: 'mortgage-payoff-calculator',
        category: 'Financial',
        description: 'See how extra payments shorten your mortgage.',
        engine: 'financial'
    },
    {
        id: 'income-tax',
        name: 'Income Tax Calculator',
        slug: 'income-tax-calculator',
        category: 'Financial',
        description: 'Estimate your federal income tax.',
        engine: 'financial'
    },
    {
        id: 'compound-interest',
        name: 'Compound Interest Calculator',
        slug: 'compound-interest-calculator',
        category: 'Financial',
        description: 'Calculate compound interest with contributions.',
        engine: 'financial'
    },
    {
        id: 'salary',
        name: 'Salary Calculator',
        slug: 'salary-calculator',
        category: 'Financial',
        description: 'Convert salary between hourly, weekly, monthly, and annual.',
        engine: 'financial'
    },
    {
        id: '401k',
        name: '401K Calculator',
        slug: '401k-calculator',
        category: 'Financial',
        description: 'Project your 401(k) balance at retirement.',
        engine: 'financial'
    },
    {
        id: 'interest-rate',
        name: 'Interest Rate Calculator',
        slug: 'interest-rate-calculator',
        category: 'Financial',
        description: 'Find the interest rate of a loan or investment.',
        engine: 'financial'
    },
    {
        id: 'sales-tax',
        name: 'Sales Tax Calculator',
        slug: 'sales-tax-calculator',
        category: 'Financial',
        description: 'Add or remove sales tax from a price.',
        engine: 'financial'
    },
    {
        id: 'house-affordability',
        name: 'House Affordability Calculator',
        slug: 'house-affordability-calculator',
        category: 'Financial',
        description: 'Estimate how much house you can afford.',
        engine: 'financial'
    },
    {
        id: 'savings',
        name: 'Savings Calculator',
        slug: 'savings-calculator',
        category: 'Financial',
        description: 'Project savings growth with regular contributions.',
        engine: 'financial'
    },
    {
        id: 'rent',
        name: 'Rent Calculator',
        slug: 'rent-calculator',
        category: 'Financial',
        description: 'Determine how much rent you can afford.',
        engine: 'financial'
    },
    {
        id: 'marriage-tax',
        name: 'Marriage Tax Calculator',
        slug: 'marriage-tax-calculator',
        category: 'Financial',
        description: 'Compare taxes before and after marriage.',
        engine: 'financial'
    },
    {
        id: 'estate-tax',
        name: 'Estate Tax Calculator',
        slug: 'estate-tax-calculator',
        category: 'Financial',
        description: 'Estimate estate tax liability.',
        engine: 'financial'
    },
    {
        id: 'pension',
        name: 'Pension Calculator',
        slug: 'pension-calculator',
        category: 'Financial',
        description: 'Calculate pension benefits at retirement.',
        engine: 'financial'
    },
    {
        id: 'social-security',
        name: 'Social Security Calculator',
        slug: 'social-security-calculator',
        category: 'Financial',
        description: 'Estimate Social Security retirement benefits.',
        engine: 'financial'
    },
    {
        id: 'annuity',
        name: 'Annuity Calculator',
        slug: 'annuity-calculator',
        category: 'Financial',
        description: 'Calculate annuity present and future values.',
        engine: 'financial'
    },
    {
        id: 'annuity-payout',
        name: 'Annuity Payout Calculator',
        slug: 'annuity-payout-calculator',
        category: 'Financial',
        description: 'Calculate annuity payout amounts over a period.',
        engine: 'financial'
    },
    {
        id: 'credit-card',
        name: 'Credit Card Calculator',
        slug: 'credit-card-calculator',
        category: 'Financial',
        description: 'See how long to pay off your credit card balance.',
        engine: 'financial'
    },
    {
        id: 'credit-card-payoff',
        name: 'Credit Cards Payoff Calculator',
        slug: 'credit-card-payoff-calculator',
        category: 'Financial',
        description: 'Payoff multiple credit cards efficiently.',
        engine: 'financial'
    },
    {
        id: 'debt-payoff',
        name: 'Debt Payoff Calculator',
        slug: 'debt-payoff-calculator',
        category: 'Financial',
        description: 'Plan your debt payoff using avalanche or snowball method.',
        engine: 'financial'
    },
    {
        id: 'debt-consolidation',
        name: 'Debt Consolidation Calculator',
        slug: 'debt-consolidation-calculator',
        category: 'Financial',
        description: 'Compare consolidating multiple debts into one.',
        engine: 'financial'
    },
    {
        id: 'repayment',
        name: 'Repayment Calculator',
        slug: 'repayment-calculator',
        category: 'Financial',
        description: 'Calculate loan repayment schedules.',
        engine: 'financial'
    },
    {
        id: 'student-loan',
        name: 'Student Loan Calculator',
        slug: 'student-loan-calculator',
        category: 'Financial',
        description: 'Estimate student loan monthly payments.',
        engine: 'financial'
    },
    {
        id: 'college-cost',
        name: 'College Cost Calculator',
        slug: 'college-cost-calculator',
        category: 'Financial',
        description: 'Estimate total college costs with inflation.',
        engine: 'financial'
    },
    {
        id: 'simple-interest',
        name: 'Simple Interest Calculator',
        slug: 'simple-interest-calculator',
        category: 'Financial',
        description: 'Calculate simple interest on a principal.',
        engine: 'financial'
    },
    {
        id: 'cd',
        name: 'CD Calculator',
        slug: 'cd-calculator',
        category: 'Financial',
        description: 'Calculate certificate of deposit returns.',
        engine: 'financial'
    },
    {
        id: 'bond',
        name: 'Bond Calculator',
        slug: 'bond-calculator',
        category: 'Financial',
        description: 'Calculate bond price and yield to maturity.',
        engine: 'financial'
    },
    {
        id: 'mutual-fund',
        name: 'Mutual Fund Calculator',
        slug: 'mutual-fund-calculator',
        category: 'Financial',
        description: 'Project mutual fund investment growth.',
        engine: 'financial'
    },
    {
        id: 'roth-ira',
        name: 'Roth IRA Calculator',
        slug: 'roth-ira-calculator',
        category: 'Financial',
        description: 'Project Roth IRA retirement savings.',
        engine: 'financial'
    },
    {
        id: 'ira',
        name: 'IRA Calculator',
        slug: 'ira-calculator',
        category: 'Financial',
        description: 'Project traditional IRA retirement savings.',
        engine: 'financial'
    },
    {
        id: 'rmd',
        name: 'RMD Calculator',
        slug: 'rmd-calculator',
        category: 'Financial',
        description: 'Calculate required minimum distributions.',
        engine: 'financial'
    },
    {
        id: 'vat',
        name: 'VAT Calculator',
        slug: 'vat-calculator',
        category: 'Financial',
        description: 'Add or remove VAT from a price.',
        engine: 'financial'
    },
    {
        id: 'cash-back',
        name: 'Cash Back or Low Interest Calculator',
        slug: 'cash-back-or-low-interest-calculator',
        category: 'Financial',
        description: 'Compare cash-back rebate vs. low interest rate.',
        engine: 'financial'
    },
    {
        id: 'auto-lease',
        name: 'Auto Lease Calculator',
        slug: 'auto-lease-calculator',
        category: 'Financial',
        description: 'Calculate monthly car lease payments.',
        engine: 'financial'
    },
    {
        id: 'depreciation',
        name: 'Depreciation Calculator',
        slug: 'depreciation-calculator',
        category: 'Financial',
        description: 'Calculate asset depreciation schedules.',
        engine: 'financial'
    },
    {
        id: 'average-return',
        name: 'Average Return Calculator',
        slug: 'average-return-calculator',
        category: 'Financial',
        description: 'Calculate average annual return on investment.',
        engine: 'financial'
    },
    {
        id: 'margin',
        name: 'Margin Calculator',
        slug: 'margin-calculator',
        category: 'Financial',
        description: 'Calculate gross profit margin and markup.',
        engine: 'financial'
    },
    {
        id: 'discount',
        name: 'Discount Calculator',
        slug: 'discount-calculator',
        category: 'Financial',
        description: 'Calculate discounted prices and savings.',
        engine: 'financial'
    },
    {
        id: 'business-loan',
        name: 'Business Loan Calculator',
        slug: 'business-loan-calculator',
        category: 'Financial',
        description: 'Calculate business loan payments and interest.',
        engine: 'financial'
    },
    {
        id: 'debt-to-income',
        name: 'Debt-to-Income Ratio Calculator',
        slug: 'debt-to-income-ratio-calculator',
        category: 'Financial',
        description: 'Calculate your debt-to-income ratio.',
        engine: 'financial'
    },
    {
        id: 'real-estate',
        name: 'Real Estate Calculator',
        slug: 'real-estate-calculator',
        category: 'Financial',
        description: 'Analyze real estate investment returns.',
        engine: 'financial'
    },
    {
        id: 'take-home-paycheck',
        name: 'Take-Home-Paycheck Calculator',
        slug: 'take-home-paycheck-calculator',
        category: 'Financial',
        description: 'Estimate your net take-home pay.',
        engine: 'financial'
    },
    {
        id: 'personal-loan',
        name: 'Personal Loan Calculator',
        slug: 'personal-loan-calculator',
        category: 'Financial',
        description: 'Calculate personal loan monthly payments.',
        engine: 'financial'
    },
    {
        id: 'boat-loan',
        name: 'Boat Loan Calculator',
        slug: 'boat-loan-calculator',
        category: 'Financial',
        description: 'Calculate boat loan payments.',
        engine: 'financial'
    },
    {
        id: 'lease',
        name: 'Lease Calculator',
        slug: 'lease-calculator',
        category: 'Financial',
        description: 'Calculate general lease payments.',
        engine: 'financial'
    },
    {
        id: 'refinance',
        name: 'Refinance Calculator',
        slug: 'refinance-calculator',
        category: 'Financial',
        description: 'Determine if refinancing your mortgage saves money.',
        engine: 'financial'
    },
    {
        id: 'budget',
        name: 'Budget Calculator',
        slug: 'budget-calculator',
        category: 'Financial',
        description: 'Track income and expenses for budgeting.',
        engine: 'financial'
    },
    {
        id: 'rental-property',
        name: 'Rental Property Calculator',
        slug: 'rental-property-calculator',
        category: 'Financial',
        description: 'Analyze rental property investment returns.',
        engine: 'financial'
    },
    {
        id: 'irr',
        name: 'IRR Calculator',
        slug: 'irr-calculator',
        category: 'Financial',
        description: 'Calculate internal rate of return on investments.',
        engine: 'financial'
    },
    {
        id: 'roi',
        name: 'ROI Calculator',
        slug: 'roi-calculator',
        category: 'Financial',
        description: 'Calculate return on investment.',
        engine: 'financial'
    },
    {
        id: 'apr',
        name: 'APR Calculator',
        slug: 'apr-calculator',
        category: 'Financial',
        description: 'Calculate annual percentage rate on a loan.',
        engine: 'financial'
    },
    {
        id: 'fha-loan',
        name: 'FHA Loan Calculator',
        slug: 'fha-loan-calculator',
        category: 'Financial',
        description: 'Calculate FHA loan payments and MIP.',
        engine: 'financial'
    },
    {
        id: 'va-mortgage',
        name: 'VA Mortgage Calculator',
        slug: 'va-mortgage-calculator',
        category: 'Financial',
        description: 'Calculate VA loan payments and funding fees.',
        engine: 'financial'
    },
    {
        id: 'home-equity-loan',
        name: 'Home Equity Loan Calculator',
        slug: 'home-equity-loan-calculator',
        category: 'Financial',
        description: 'Calculate home equity loan payments.',
        engine: 'financial'
    },
    {
        id: 'heloc',
        name: 'HELOC Calculator',
        slug: 'heloc-calculator',
        category: 'Financial',
        description: 'Calculate HELOC payment schedules.',
        engine: 'financial'
    },
    {
        id: 'down-payment',
        name: 'Down Payment Calculator',
        slug: 'down-payment-calculator',
        category: 'Financial',
        description: 'Calculate required down payment and savings plan.',
        engine: 'financial'
    },
    {
        id: 'rent-vs-buy',
        name: 'Rent vs. Buy Calculator',
        slug: 'rent-vs-buy-calculator',
        category: 'Financial',
        description: 'Compare renting vs. buying a home.',
        engine: 'financial'
    },
    {
        id: 'payback-period',
        name: 'Payback Period Calculator',
        slug: 'payback-period-calculator',
        category: 'Financial',
        description: 'Calculate investment payback period.',
        engine: 'financial'
    },
    {
        id: 'present-value',
        name: 'Present Value Calculator',
        slug: 'present-value-calculator',
        category: 'Financial',
        description: 'Calculate the present value of future cash flows.',
        engine: 'financial'
    },
    {
        id: 'future-value',
        name: 'Future Value Calculator',
        slug: 'future-value-calculator',
        category: 'Financial',
        description: 'Calculate the future value of an investment.',
        engine: 'financial'
    },
    {
        id: 'commission',
        name: 'Commission Calculator',
        slug: 'commission-calculator',
        category: 'Financial',
        description: 'Calculate sales commission earned.',
        engine: 'financial'
    },
    {
        id: 'mortgage-uk',
        name: 'Mortgage Calculator UK',
        slug: 'mortgage-calculator-uk',
        category: 'Financial',
        description: 'Calculate UK mortgage repayments.',
        engine: 'financial'
    },
    {
        id: 'canadian-mortgage',
        name: 'Canadian Mortgage Calculator',
        slug: 'canadian-mortgage-calculator',
        category: 'Financial',
        description: 'Calculate Canadian mortgage payments.',
        engine: 'financial'
    },
    {
        id: 'mortgage-amortization',
        name: 'Mortgage Amortization Calculator',
        slug: 'mortgage-amortization-calculator',
        category: 'Financial',
        description: 'View full mortgage amortization table.',
        engine: 'financial'
    },
    {
        id: 'percent-off',
        name: 'Percent Off Calculator',
        slug: 'percent-off-calculator',
        category: 'Financial',
        description: 'Calculate sale price after percent discount.',
        engine: 'financial'
    },

    // ============ FITNESS & HEALTH ============
    {
        id: 'bmi',
        name: 'BMI Calculator',
        slug: 'bmi-calculator',
        category: 'Fitness & Health',
        description: 'Calculate your Body Mass Index.',
        engine: 'fitness'
    },
    {
        id: 'calorie',
        name: 'Calorie Calculator',
        slug: 'calorie-calculator',
        category: 'Fitness & Health',
        description: 'Calculate daily calorie needs for your goal.',
        engine: 'fitness'
    },
    {
        id: 'body-fat',
        name: 'Body Fat Calculator',
        slug: 'body-fat-calculator',
        category: 'Fitness & Health',
        description: 'Estimate your body fat percentage.',
        engine: 'fitness'
    },
    {
        id: 'bmr',
        name: 'BMR Calculator',
        slug: 'bmr-calculator',
        category: 'Fitness & Health',
        description: 'Calculate your Basal Metabolic Rate.',
        engine: 'fitness'
    },
    {
        id: 'macro',
        name: 'Macro Calculator',
        slug: 'macro-calculator',
        category: 'Fitness & Health',
        description: 'Calculate daily macronutrient targets.',
        engine: 'fitness'
    },
    {
        id: 'ideal-weight',
        name: 'Ideal Weight Calculator',
        slug: 'ideal-weight-calculator',
        category: 'Fitness & Health',
        description: 'Calculate your ideal body weight range.',
        engine: 'fitness'
    },
    {
        id: 'pregnancy',
        name: 'Pregnancy Calculator',
        slug: 'pregnancy-calculator',
        category: 'Fitness & Health',
        description: 'Calculate pregnancy due date and milestones.',
        engine: 'fitness'
    },
    {
        id: 'pregnancy-weight-gain',
        name: 'Pregnancy Weight Gain Calculator',
        slug: 'pregnancy-weight-gain-calculator',
        category: 'Fitness & Health',
        description: 'Recommended weight gain during pregnancy.',
        engine: 'fitness'
    },
    {
        id: 'pregnancy-conception',
        name: 'Pregnancy Conception Calculator',
        slug: 'pregnancy-conception-calculator',
        category: 'Fitness & Health',
        description: 'Estimate conception date from due date.',
        engine: 'fitness'
    },
    {
        id: 'due-date',
        name: 'Due Date Calculator',
        slug: 'due-date-calculator',
        category: 'Fitness & Health',
        description: 'Calculate your pregnancy due date.',
        engine: 'fitness'
    },
    {
        id: 'pace',
        name: 'Pace Calculator',
        slug: 'pace-calculator',
        category: 'Fitness & Health',
        description: 'Calculate running pace, time, or distance.',
        engine: 'fitness'
    },
    {
        id: 'army-body-fat',
        name: 'Army Body Fat Calculator',
        slug: 'army-body-fat-calculator',
        category: 'Fitness & Health',
        description: 'Calculate Army body fat percentage.',
        engine: 'fitness'
    },
    {
        id: 'carbohydrate',
        name: 'Carbohydrate Calculator',
        slug: 'carbohydrate-calculator',
        category: 'Fitness & Health',
        description: 'Calculate daily carbohydrate intake needs.',
        engine: 'fitness'
    },
    {
        id: 'lean-body-mass',
        name: 'Lean Body Mass Calculator',
        slug: 'lean-body-mass-calculator',
        category: 'Fitness & Health',
        description: 'Estimate your lean body mass.',
        engine: 'fitness'
    },
    {
        id: 'healthy-weight',
        name: 'Healthy Weight Calculator',
        slug: 'healthy-weight-calculator',
        category: 'Fitness & Health',
        description: 'Find your healthy weight range by height.',
        engine: 'fitness'
    },
    {
        id: 'calories-burned',
        name: 'Calories Burned Calculator',
        slug: 'calories-burned-calculator',
        category: 'Fitness & Health',
        description: 'Estimate calories burned during exercise.',
        engine: 'fitness'
    },
    {
        id: 'one-rep-max',
        name: 'One Rep Max Calculator',
        slug: 'one-rep-max-calculator',
        category: 'Fitness & Health',
        description: 'Estimate your one-rep maximum lift.',
        engine: 'fitness'
    },
    {
        id: 'target-heart-rate',
        name: 'Target Heart Rate Calculator',
        slug: 'target-heart-rate-calculator',
        category: 'Fitness & Health',
        description: 'Calculate target heart rate zones.',
        engine: 'fitness'
    },
    {
        id: 'protein',
        name: 'Protein Calculator',
        slug: 'protein-calculator',
        category: 'Fitness & Health',
        description: 'Calculate daily protein intake needs.',
        engine: 'fitness'
    },
    {
        id: 'fat-intake',
        name: 'Fat Intake Calculator',
        slug: 'fat-intake-calculator',
        category: 'Fitness & Health',
        description: 'Calculate healthy daily fat intake.',
        engine: 'fitness'
    },
    {
        id: 'tdee',
        name: 'TDEE Calculator',
        slug: 'tdee-calculator',
        category: 'Fitness & Health',
        description: 'Calculate Total Daily Energy Expenditure.',
        engine: 'fitness'
    },
    {
        id: 'ovulation',
        name: 'Ovulation Calculator',
        slug: 'ovulation-calculator',
        category: 'Fitness & Health',
        description: 'Predict ovulation and fertile window.',
        engine: 'fitness'
    },
    {
        id: 'conception',
        name: 'Conception Calculator',
        slug: 'conception-calculator',
        category: 'Fitness & Health',
        description: 'Estimate possible conception dates.',
        engine: 'fitness'
    },
    {
        id: 'period',
        name: 'Period Calculator',
        slug: 'period-calculator',
        category: 'Fitness & Health',
        description: 'Predict your next menstrual period.',
        engine: 'fitness'
    },
    {
        id: 'gfr',
        name: 'GFR Calculator',
        slug: 'gfr-calculator',
        category: 'Fitness & Health',
        description: 'Estimate glomerular filtration rate.',
        engine: 'fitness'
    },
    {
        id: 'body-type',
        name: 'Body Type Calculator',
        slug: 'body-type-calculator',
        category: 'Fitness & Health',
        description: 'Determine your body type (ectomorph/mesomorph/endomorph).',
        engine: 'fitness'
    },
    {
        id: 'body-surface-area',
        name: 'Body Surface Area Calculator',
        slug: 'body-surface-area-calculator',
        category: 'Fitness & Health',
        description: 'Calculate body surface area.',
        engine: 'fitness'
    },
    {
        id: 'bac',
        name: 'BAC Calculator',
        slug: 'bac-calculator',
        category: 'Fitness & Health',
        description: 'Estimate blood alcohol content.',
        engine: 'fitness'
    },
    {
        id: 'anorexic-bmi',
        name: 'Anorexic BMI Calculator',
        slug: 'anorexic-bmi-calculator',
        category: 'Fitness & Health',
        description: 'Understand underweight BMI classifications.',
        engine: 'fitness'
    },
    {
        id: 'weight-watcher-points',
        name: 'Weight Watcher Points Calculator',
        slug: 'weight-watcher-points-calculator',
        category: 'Fitness & Health',
        description: 'Calculate Weight Watchers points for foods.',
        engine: 'fitness'
    },
    {
        id: 'overweight',
        name: 'Overweight Calculator',
        slug: 'overweight-calculator',
        category: 'Fitness & Health',
        description: 'Check if you are in overweight BMI category.',
        engine: 'fitness'
    },

    // ============ MATH ============
    {
        id: 'scientific',
        name: 'Scientific Calculator',
        slug: 'scientific-calculator',
        category: 'Math',
        description: 'Full-featured scientific calculator.',
        engine: 'math'
    },
    {
        id: 'fraction',
        name: 'Fraction Calculator',
        slug: 'fraction-calculator',
        category: 'Math',
        description: 'Add, subtract, multiply, divide fractions.',
        engine: 'math'
    },
    {
        id: 'percentage',
        name: 'Percentage Calculator',
        slug: 'percentage-calculator',
        category: 'Math',
        description: 'Solve all types of percentage problems.',
        engine: 'math'
    },
    {
        id: 'triangle',
        name: 'Triangle Calculator',
        slug: 'triangle-calculator',
        category: 'Math',
        description: 'Solve triangles given sides and angles.',
        engine: 'math'
    },
    {
        id: 'volume',
        name: 'Volume Calculator',
        slug: 'volume-calculator',
        category: 'Math',
        description: 'Calculate volume of 3D shapes.',
        engine: 'math'
    },
    {
        id: 'standard-deviation',
        name: 'Standard Deviation Calculator',
        slug: 'standard-deviation-calculator',
        category: 'Math',
        description: 'Calculate mean, variance, and standard deviation.',
        engine: 'math'
    },
    {
        id: 'random-number',
        name: 'Random Number Generator',
        slug: 'random-number-generator',
        category: 'Math',
        description: 'Generate random numbers in a range.',
        engine: 'math'
    },
    {
        id: 'number-sequence',
        name: 'Number Sequence Calculator',
        slug: 'number-sequence-calculator',
        category: 'Math',
        description: 'Find terms in arithmetic and geometric sequences.',
        engine: 'math'
    },
    {
        id: 'percent-error',
        name: 'Percent Error Calculator',
        slug: 'percent-error-calculator',
        category: 'Math',
        description: 'Calculate percent error between values.',
        engine: 'math'
    },
    {
        id: 'exponent',
        name: 'Exponent Calculator',
        slug: 'exponent-calculator',
        category: 'Math',
        description: 'Evaluate exponent and power expressions.',
        engine: 'math'
    },
    {
        id: 'binary',
        name: 'Binary Calculator',
        slug: 'binary-calculator',
        category: 'Math',
        description: 'Perform arithmetic in binary.',
        engine: 'math'
    },
    {
        id: 'hex',
        name: 'Hex Calculator',
        slug: 'hex-calculator',
        category: 'Math',
        description: 'Perform arithmetic in hexadecimal.',
        engine: 'math'
    },
    {
        id: 'half-life',
        name: 'Half-Life Calculator',
        slug: 'half-life-calculator',
        category: 'Math',
        description: 'Calculate radioactive decay and half-life.',
        engine: 'math'
    },
    {
        id: 'quadratic',
        name: 'Quadratic Formula Calculator',
        slug: 'quadratic-formula-calculator',
        category: 'Math',
        description: 'Solve quadratic equations using the quadratic formula.',
        engine: 'math'
    },
    {
        id: 'slope',
        name: 'Slope Calculator',
        slug: 'slope-calculator',
        category: 'Math',
        description: 'Calculate slope, intercept, and line equations.',
        engine: 'math'
    },
    {
        id: 'log',
        name: 'Log Calculator',
        slug: 'log-calculator',
        category: 'Math',
        description: 'Calculate logarithms in any base.',
        engine: 'math'
    },
    {
        id: 'area',
        name: 'Area Calculator',
        slug: 'area-calculator',
        category: 'Math',
        description: 'Calculate area of geometric shapes.',
        engine: 'math'
    },
    {
        id: 'sample-size',
        name: 'Sample Size Calculator',
        slug: 'sample-size-calculator',
        category: 'Math',
        description: 'Determine required sample size for studies.',
        engine: 'math'
    },
    {
        id: 'probability',
        name: 'Probability Calculator',
        slug: 'probability-calculator',
        category: 'Math',
        description: 'Calculate probability and odds.',
        engine: 'math'
    },
    {
        id: 'statistics',
        name: 'Statistics Calculator',
        slug: 'statistics-calculator',
        category: 'Math',
        description: 'Full statistical analysis of data sets.',
        engine: 'math'
    },
    {
        id: 'mean-median-mode',
        name: 'Mean, Median, Mode, Range Calculator',
        slug: 'mean-median-mode-range-calculator',
        category: 'Math',
        description: 'Find mean, median, mode, and range of data.',
        engine: 'math'
    },
    {
        id: 'permutation-combination',
        name: 'Permutation and Combination Calculator',
        slug: 'permutation-and-combination-calculator',
        category: 'Math',
        description: 'Calculate permutations and combinations.',
        engine: 'math'
    },
    {
        id: 'z-score',
        name: 'Z-score Calculator',
        slug: 'z-score-calculator',
        category: 'Math',
        description: 'Calculate z-scores and percentiles.',
        engine: 'math'
    },
    {
        id: 'confidence-interval',
        name: 'Confidence Interval Calculator',
        slug: 'confidence-interval-calculator',
        category: 'Math',
        description: 'Calculate confidence intervals for samples.',
        engine: 'math'
    },
    {
        id: 'ratio',
        name: 'Ratio Calculator',
        slug: 'ratio-calculator',
        category: 'Math',
        description: 'Simplify and solve ratio problems.',
        engine: 'math'
    },
    {
        id: 'distance',
        name: 'Distance Calculator',
        slug: 'distance-calculator',
        category: 'Math',
        description: 'Calculate distance between two points.',
        engine: 'math'
    },
    {
        id: 'circle',
        name: 'Circle Calculator',
        slug: 'circle-calculator',
        category: 'Math',
        description: 'Calculate area, circumference, and radius.',
        engine: 'math'
    },
    {
        id: 'surface-area',
        name: 'Surface Area Calculator',
        slug: 'surface-area-calculator',
        category: 'Math',
        description: 'Calculate surface area of 3D shapes.',
        engine: 'math'
    },
    {
        id: 'pythagorean',
        name: 'Pythagorean Theorem Calculator',
        slug: 'pythagorean-theorem-calculator',
        category: 'Math',
        description: 'Solve right triangles with the Pythagorean theorem.',
        engine: 'math'
    },
    {
        id: 'right-triangle',
        name: 'Right Triangle Calculator',
        slug: 'right-triangle-calculator',
        category: 'Math',
        description: 'Solve right triangle sides and angles.',
        engine: 'math'
    },
    {
        id: 'root',
        name: 'Root Calculator',
        slug: 'root-calculator',
        category: 'Math',
        description: 'Calculate square roots and nth roots.',
        engine: 'math'
    },
    {
        id: 'lcm',
        name: 'Least Common Multiple Calculator',
        slug: 'least-common-multiple-calculator',
        category: 'Math',
        description: 'Find the least common multiple of numbers.',
        engine: 'math'
    },
    {
        id: 'gcf',
        name: 'Greatest Common Factor Calculator',
        slug: 'greatest-common-factor-calculator',
        category: 'Math',
        description: 'Find the greatest common factor.',
        engine: 'math'
    },
    {
        id: 'factor',
        name: 'Factor Calculator',
        slug: 'factor-calculator',
        category: 'Math',
        description: 'List all factors of a number.',
        engine: 'math'
    },
    {
        id: 'rounding',
        name: 'Rounding Calculator',
        slug: 'rounding-calculator',
        category: 'Math',
        description: 'Round numbers to any decimal place.',
        engine: 'math'
    },
    {
        id: 'matrix',
        name: 'Matrix Calculator',
        slug: 'matrix-calculator',
        category: 'Math',
        description: 'Perform matrix operations.',
        engine: 'math'
    },
    {
        id: 'scientific-notation',
        name: 'Scientific Notation Calculator',
        slug: 'scientific-notation-calculator',
        category: 'Math',
        description: 'Convert to and from scientific notation.',
        engine: 'math'
    },
    {
        id: 'big-number',
        name: 'Big Number Calculator',
        slug: 'big-number-calculator',
        category: 'Math',
        description: 'Perform arithmetic with very large numbers.',
        engine: 'math'
    },
    {
        id: 'prime-factorization',
        name: 'Prime Factorization Calculator',
        slug: 'prime-factorization-calculator',
        category: 'Math',
        description: 'Find the prime factorization of any number.',
        engine: 'math'
    },
    {
        id: 'common-factor',
        name: 'Common Factor Calculator',
        slug: 'common-factor-calculator',
        category: 'Math',
        description: 'Find common factors of multiple numbers.',
        engine: 'math'
    },
    {
        id: 'basic',
        name: 'Basic Calculator',
        slug: 'basic-calculator',
        category: 'Math',
        description: 'Simple four-function calculator.',
        engine: 'math'
    },
    {
        id: 'long-division',
        name: 'Long Division Calculator',
        slug: 'long-division-calculator',
        category: 'Math',
        description: 'Solve long division with step-by-step work.',
        engine: 'math'
    },
    {
        id: 'average',
        name: 'Average Calculator',
        slug: 'average-calculator',
        category: 'Math',
        description: 'Calculate the average of a list of numbers.',
        engine: 'math'
    },
    {
        id: 'p-value',
        name: 'P-value Calculator',
        slug: 'p-value-calculator',
        category: 'Math',
        description: 'Calculate p-values for hypothesis testing.',
        engine: 'math'
    },

    // ============ OTHER ============
    {
        id: 'age',
        name: 'Age Calculator',
        slug: 'age-calculator',
        category: 'Other',
        description: 'Calculate exact age from date of birth.',
        engine: 'other'
    },
    {
        id: 'date',
        name: 'Date Calculator',
        slug: 'date-calculator',
        category: 'Other',
        description: 'Add or subtract days from a date.',
        engine: 'other'
    },
    {
        id: 'time',
        name: 'Time Calculator',
        slug: 'time-calculator',
        category: 'Other',
        description: 'Add or subtract time values.',
        engine: 'other'
    },
    {
        id: 'hours',
        name: 'Hours Calculator',
        slug: 'hours-calculator',
        category: 'Other',
        description: 'Calculate hours and minutes between times.',
        engine: 'other'
    },
    {
        id: 'gpa',
        name: 'GPA Calculator',
        slug: 'gpa-calculator',
        category: 'Other',
        description: 'Calculate your GPA from course grades.',
        engine: 'other'
    },
    {
        id: 'grade',
        name: 'Grade Calculator',
        slug: 'grade-calculator',
        category: 'Other',
        description: 'Calculate your final grade from scores.',
        engine: 'other'
    },
    {
        id: 'height',
        name: 'Height Calculator',
        slug: 'height-calculator',
        category: 'Other',
        description: 'Predict adult height from parents and age.',
        engine: 'other'
    },
    {
        id: 'concrete',
        name: 'Concrete Calculator',
        slug: 'concrete-calculator',
        category: 'Other',
        description: 'Calculate concrete needed for slabs and pours.',
        engine: 'other'
    },
    {
        id: 'ip-subnet',
        name: 'IP Subnet Calculator',
        slug: 'ip-subnet-calculator',
        category: 'Other',
        description: 'Calculate IP subnet ranges and masks.',
        engine: 'other'
    },
    {
        id: 'bra-size',
        name: 'Bra Size Calculator',
        slug: 'bra-size-calculator',
        category: 'Other',
        description: 'Calculate bra size from measurements.',
        engine: 'other'
    },
    {
        id: 'password',
        name: 'Password Generator',
        slug: 'password-generator',
        category: 'Other',
        description: 'Generate strong random passwords.',
        engine: 'other'
    },
    {
        id: 'dice',
        name: 'Dice Roller',
        slug: 'dice-roller',
        category: 'Other',
        description: 'Roll virtual dice for any number of sides.',
        engine: 'other'
    },
    {
        id: 'conversion',
        name: 'Conversion Calculator',
        slug: 'conversion-calculator',
        category: 'Other',
        description: 'Convert between hundreds of units.',
        engine: 'other'
    },
    {
        id: 'fuel-cost',
        name: 'Fuel Cost Calculator',
        slug: 'fuel-cost-calculator',
        category: 'Other',
        description: 'Estimate fuel cost for a road trip.',
        engine: 'other'
    },
    {
        id: 'voltage-drop',
        name: 'Voltage Drop Calculator',
        slug: 'voltage-drop-calculator',
        category: 'Other',
        description: 'Calculate electrical voltage drop in wires.',
        engine: 'other'
    },
    {
        id: 'btu',
        name: 'BTU Calculator',
        slug: 'btu-calculator',
        category: 'Other',
        description: 'Calculate BTU needed to heat or cool a room.',
        engine: 'other'
    },
    {
        id: 'square-footage',
        name: 'Square Footage Calculator',
        slug: 'square-footage-calculator',
        category: 'Other',
        description: 'Calculate area in square feet.',
        engine: 'other'
    },
    {
        id: 'time-card',
        name: 'Time Card Calculator',
        slug: 'time-card-calculator',
        category: 'Other',
        description: 'Calculate hours worked and payroll.',
        engine: 'other'
    },
    {
        id: 'time-zone',
        name: 'Time Zone Calculator',
        slug: 'time-zone-calculator',
        category: 'Other',
        description: 'Convert times between world time zones.',
        engine: 'other'
    },
    {
        id: 'love',
        name: 'Love Calculator',
        slug: 'love-calculator',
        category: 'Other',
        description: 'Calculate compatibility percentage for fun.',
        engine: 'other'
    },
    {
        id: 'gdp',
        name: 'GDP Calculator',
        slug: 'gdp-calculator',
        category: 'Other',
        description: 'Calculate GDP using expenditure approach.',
        engine: 'other'
    },
    {
        id: 'gas-mileage',
        name: 'Gas Mileage Calculator',
        slug: 'gas-mileage-calculator',
        category: 'Other',
        description: 'Calculate vehicle gas mileage (MPG).',
        engine: 'other'
    },
    {
        id: 'horsepower',
        name: 'Horsepower Calculator',
        slug: 'horsepower-calculator',
        category: 'Other',
        description: 'Calculate mechanical horsepower from torque and RPM.',
        engine: 'other'
    },
    {
        id: 'engine-horsepower',
        name: 'Engine Horsepower Calculator',
        slug: 'engine-horsepower-calculator',
        category: 'Other',
        description: 'Estimate engine horsepower from engine tests.',
        engine: 'other'
    },
    {
        id: 'stair',
        name: 'Stair Calculator',
        slug: 'stair-calculator',
        category: 'Other',
        description: 'Calculate stair dimensions and tread depth.',
        engine: 'other'
    },
    {
        id: 'resistor',
        name: 'Resistor Calculator',
        slug: 'resistor-calculator',
        category: 'Other',
        description: 'Decode resistor colour bands.',
        engine: 'other'
    },
    {
        id: 'ohms-law',
        name: 'Ohms Law Calculator',
        slug: 'ohms-law-calculator',
        category: 'Other',
        description: 'Calculate voltage, current, resistance, power.',
        engine: 'other'
    },
    {
        id: 'electricity',
        name: 'Electricity Calculator',
        slug: 'electricity-calculator',
        category: 'Other',
        description: 'Calculate electricity consumption and cost.',
        engine: 'other'
    },
    {
        id: 'shoe-size',
        name: 'Shoe Size Conversion',
        slug: 'shoe-size-conversion',
        category: 'Other',
        description: 'Convert shoe sizes between US, UK, and EU.',
        engine: 'other'
    },
    {
        id: 'tip',
        name: 'Tip Calculator',
        slug: 'tip-calculator',
        category: 'Other',
        description: 'Calculate tip amount and split bills.',
        engine: 'other'
    },
    {
        id: 'mileage',
        name: 'Mileage Calculator',
        slug: 'mileage-calculator',
        category: 'Other',
        description: 'Calculate mileage and fuel efficiency.',
        engine: 'other'
    },
    {
        id: 'density',
        name: 'Density Calculator',
        slug: 'density-calculator',
        category: 'Other',
        description: 'Calculate density, mass, or volume.',
        engine: 'other'
    },
    {
        id: 'mass',
        name: 'Mass Calculator',
        slug: 'mass-calculator',
        category: 'Other',
        description: 'Calculate mass from density and volume.',
        engine: 'other'
    },
    {
        id: 'weight-calc',
        name: 'Weight Calculator',
        slug: 'weight-calculator',
        category: 'Other',
        description: 'Convert weight between units.',
        engine: 'other'
    },
    {
        id: 'speed',
        name: 'Speed Calculator',
        slug: 'speed-calculator',
        category: 'Other',
        description: 'Calculate speed, distance, or time.',
        engine: 'other'
    },
    {
        id: 'molarity',
        name: 'Molarity Calculator',
        slug: 'molarity-calculator',
        category: 'Other',
        description: 'Calculate solution molarity and dilutions.',
        engine: 'other'
    },
    {
        id: 'molecular-weight',
        name: 'Molecular Weight Calculator',
        slug: 'molecular-weight-calculator',
        category: 'Other',
        description: 'Calculate molecular weight of compounds.',
        engine: 'other'
    },
    {
        id: 'roman-numeral',
        name: 'Roman Numeral Converter',
        slug: 'roman-numeral-converter',
        category: 'Other',
        description: 'Convert between Roman numerals and Arabic numbers.',
        engine: 'other'
    },
    {
        id: 'golf-handicap',
        name: 'Golf Handicap Calculator',
        slug: 'golf-handicap-calculator',
        category: 'Other',
        description: 'Calculate your golf handicap index.',
        engine: 'other'
    },
    {
        id: 'sleep',
        name: 'Sleep Calculator',
        slug: 'sleep-calculator',
        category: 'Other',
        description: 'Find the best sleep and wake times.',
        engine: 'other'
    },
    {
        id: 'tire-size',
        name: 'Tire Size Calculator',
        slug: 'tire-size-calculator',
        category: 'Other',
        description: 'Compare tire dimensions and speedometer impact.',
        engine: 'other'
    },
    {
        id: 'roofing',
        name: 'Roofing Calculator',
        slug: 'roofing-calculator',
        category: 'Other',
        description: 'Calculate roofing materials for a project.',
        engine: 'other'
    },
    {
        id: 'tile',
        name: 'Tile Calculator',
        slug: 'tile-calculator',
        category: 'Other',
        description: 'Calculate tiles needed for a floor or wall.',
        engine: 'other'
    },
    {
        id: 'mulch',
        name: 'Mulch Calculator',
        slug: 'mulch-calculator',
        category: 'Other',
        description: 'Calculate mulch needed for a garden area.',
        engine: 'other'
    },
    {
        id: 'gravel',
        name: 'Gravel Calculator',
        slug: 'gravel-calculator',
        category: 'Other',
        description: 'Calculate gravel needed for a project.',
        engine: 'other'
    },
    {
        id: 'wind-chill',
        name: 'Wind Chill Calculator',
        slug: 'wind-chill-calculator',
        category: 'Other',
        description: 'Calculate feels-like temperature with wind.',
        engine: 'other'
    },
    {
        id: 'heat-index',
        name: 'Heat Index Calculator',
        slug: 'heat-index-calculator',
        category: 'Other',
        description: 'Calculate apparent temperature with humidity.',
        engine: 'other'
    },
    {
        id: 'dew-point',
        name: 'Dew Point Calculator',
        slug: 'dew-point-calculator',
        category: 'Other',
        description: 'Calculate dew point from temperature and humidity.',
        engine: 'other'
    },
    {
        id: 'bandwidth',
        name: 'Bandwidth Calculator',
        slug: 'bandwidth-calculator',
        category: 'Other',
        description: 'Calculate data transfer times and bandwidth.',
        engine: 'other'
    },
    {
        id: 'base64',
        name: 'Base64 Encode / Decode',
        slug: 'base64-encode-decode',
        category: 'Other',
        description: 'Encode or decode Base64 strings.',
        engine: 'other'
    },
    {
        id: 'url-encode',
        name: 'URL Encode / Decode',
        slug: 'url-encode-decode',
        category: 'Other',
        description: 'URL-encode or decode strings.',
        engine: 'other'
    },
    {
        id: 'time-duration',
        name: 'Time Duration Calculator',
        slug: 'time-duration-calculator',
        category: 'Other',
        description: 'Calculate the duration between two times.',
        engine: 'other'
    },
    {
        id: 'day-counter',
        name: 'Day Counter',
        slug: 'day-counter',
        category: 'Other',
        description: 'Count days between two dates.',
        engine: 'other'
    },
    {
        id: 'day-of-week',
        name: 'Day of the Week Calculator',
        slug: 'day-of-the-week-calculator',
        category: 'Other',
        description: 'Find the day of the week for any date.',
        engine: 'other'
    },
];

// Build lookup maps
const CALC_BY_SLUG = {};
const CALC_BY_ID = {};
CALC_REGISTRY.forEach(c => {
    CALC_BY_SLUG[c.slug] = c;
    CALC_BY_ID[c.id] = c;
});

const CATEGORIES = ['Financial', 'Fitness & Health', 'Math', 'Other'];

function getCalcsByCategory(cat) {
    return CALC_REGISTRY.filter(c => c.category === cat);
}

function searchCalcs(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return CALC_REGISTRY.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    ).slice(0, 10);
}

if (typeof module !== 'undefined') module.exports = {
    CALC_REGISTRY,
    CALC_BY_SLUG,
    CALC_BY_ID,
    CATEGORIES,
    getCalcsByCategory,
    searchCalcs
};