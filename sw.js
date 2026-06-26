const CACHE_NAME = 'uwucalc-v6';
const STATIC_ASSETS = [
  '/',
  '/css/global.css',
  '/js/theme.js',
  '/js/script.js',
  '/js/search.js',
  '/js/history.js',
  '/js/favourites.js',
  '/manifest.json',
  // Calculator pages
  '/calc/mortgage-calculator',
  '/calc/loan-calculator',
  '/calc/auto-loan-calculator',
  '/calc/interest-calculator',
  '/calc/payment-calculator',
  '/calc/retirement-calculator',
  '/calc/amortization-calculator',
  '/calc/investment-calculator',
  '/calc/currency-calculator',
  '/calc/inflation-calculator',
  '/calc/finance-calculator',
  '/calc/mortgage-payoff-calculator',
  '/calc/income-tax-calculator',
  '/calc/compound-interest-calculator',
  '/calc/salary-calculator',
  '/calc/401k-calculator',
  '/calc/interest-rate-calculator',
  '/calc/sales-tax-calculator',
  '/calc/house-affordability-calculator',
  '/calc/savings-calculator',
  '/calc/rent-calculator',
  '/calc/marriage-tax-calculator',
  '/calc/estate-tax-calculator',
  '/calc/pension-calculator',
  '/calc/social-security-calculator',
  '/calc/annuity-calculator',
  '/calc/annuity-payout-calculator',
  '/calc/credit-card-calculator',
  '/calc/credit-card-payoff-calculator',
  '/calc/debt-payoff-calculator',
  '/calc/debt-consolidation-calculator',
  '/calc/repayment-calculator',
  '/calc/student-loan-calculator',
  '/calc/college-cost-calculator',
  '/calc/simple-interest-calculator',
  '/calc/cd-calculator',
  '/calc/bond-calculator',
  '/calc/mutual-fund-calculator',
  '/calc/roth-ira-calculator',
  '/calc/ira-calculator',
  '/calc/rmd-calculator',
  '/calc/vat-calculator',
  '/calc/cash-back-or-low-interest-calculator',
  '/calc/auto-lease-calculator',
  '/calc/depreciation-calculator',
  '/calc/average-return-calculator',
  '/calc/margin-calculator',
  '/calc/discount-calculator',
  '/calc/business-loan-calculator',
  '/calc/debt-to-income-ratio-calculator',
  '/calc/real-estate-calculator',
  '/calc/take-home-paycheck-calculator',
  '/calc/personal-loan-calculator',
  '/calc/boat-loan-calculator',
  '/calc/lease-calculator',
  '/calc/refinance-calculator',
  '/calc/budget-calculator',
  '/calc/rental-property-calculator',
  '/calc/irr-calculator',
  '/calc/roi-calculator',
  '/calc/apr-calculator',
  '/calc/fha-loan-calculator',
  '/calc/va-mortgage-calculator',
  '/calc/home-equity-loan-calculator',
  '/calc/heloc-calculator',
  '/calc/down-payment-calculator',
  '/calc/rent-vs-buy-calculator',
  '/calc/payback-period-calculator',
  '/calc/present-value-calculator',
  '/calc/future-value-calculator',
  '/calc/commission-calculator',
  '/calc/mortgage-calculator-uk',
  '/calc/canadian-mortgage-calculator',
  '/calc/mortgage-amortization-calculator',
  '/calc/percent-off-calculator',
  '/calc/bmi-calculator',
  '/calc/calorie-calculator',
  '/calc/body-fat-calculator',
  '/calc/bmr-calculator',
  '/calc/macro-calculator',
  '/calc/ideal-weight-calculator',
  '/calc/pregnancy-calculator',
  '/calc/pregnancy-weight-gain-calculator',
  '/calc/pregnancy-conception-calculator',
  '/calc/due-date-calculator',
  '/calc/pace-calculator',
  '/calc/army-body-fat-calculator',
  '/calc/carbohydrate-calculator',
  '/calc/lean-body-mass-calculator',
  '/calc/healthy-weight-calculator',
  '/calc/calories-burned-calculator',
  '/calc/one-rep-max-calculator',
  '/calc/target-heart-rate-calculator',
  '/calc/protein-calculator',
  '/calc/fat-intake-calculator',
  '/calc/tdee-calculator',
  '/calc/ovulation-calculator',
  '/calc/conception-calculator',
  '/calc/period-calculator',
  '/calc/gfr-calculator',
  '/calc/body-type-calculator',
  '/calc/body-surface-area-calculator',
  '/calc/bac-calculator',
  '/calc/anorexic-bmi-calculator',
  '/calc/weight-watcher-points-calculator',
  '/calc/overweight-calculator',
  '/calc/scientific-calculator',
  '/calc/fraction-calculator',
  '/calc/percentage-calculator',
  '/calc/triangle-calculator',
  '/calc/volume-calculator',
  '/calc/standard-deviation-calculator',
  '/calc/random-number-generator',
  '/calc/number-sequence-calculator',
  '/calc/percent-error-calculator',
  '/calc/exponent-calculator',
  '/calc/binary-calculator',
  '/calc/hex-calculator',
  '/calc/half-life-calculator',
  '/calc/quadratic-formula-calculator',
  '/calc/slope-calculator',
  '/calc/log-calculator',
  '/calc/area-calculator',
  '/calc/sample-size-calculator',
  '/calc/probability-calculator',
  '/calc/statistics-calculator',
  '/calc/mean-median-mode-range-calculator',
  '/calc/permutation-and-combination-calculator',
  '/calc/z-score-calculator',
  '/calc/confidence-interval-calculator',
  '/calc/ratio-calculator',
  '/calc/distance-calculator',
  '/calc/circle-calculator',
  '/calc/surface-area-calculator',
  '/calc/pythagorean-theorem-calculator',
  '/calc/right-triangle-calculator',
  '/calc/root-calculator',
  '/calc/least-common-multiple-calculator',
  '/calc/greatest-common-factor-calculator',
  '/calc/factor-calculator',
  '/calc/rounding-calculator',
  '/calc/matrix-calculator',
  '/calc/scientific-notation-calculator',
  '/calc/big-number-calculator',
  '/calc/prime-factorization-calculator',
  '/calc/common-factor-calculator',
  '/calc/basic-calculator',
  '/calc/long-division-calculator',
  '/calc/average-calculator',
  '/calc/p-value-calculator',
  '/calc/age-calculator',
  '/calc/date-calculator',
  '/calc/time-calculator',
  '/calc/hours-calculator',
  '/calc/gpa-calculator',
  '/calc/grade-calculator',
  '/calc/height-calculator',
  '/calc/concrete-calculator',
  '/calc/ip-subnet-calculator',
  '/calc/bra-size-calculator',
  '/calc/password-generator',
  '/calc/dice-roller',
  '/calc/conversion-calculator',
  '/calc/fuel-cost-calculator',
  '/calc/voltage-drop-calculator',
  '/calc/btu-calculator',
  '/calc/square-footage-calculator',
  '/calc/time-card-calculator',
  '/calc/time-zone-calculator',
  '/calc/love-calculator',
  '/calc/gdp-calculator',
  '/calc/gas-mileage-calculator',
  '/calc/horsepower-calculator',
  '/calc/engine-horsepower-calculator',
  '/calc/stair-calculator',
  '/calc/resistor-calculator',
  '/calc/ohms-law-calculator',
  '/calc/electricity-calculator',
  '/calc/shoe-size-conversion',
  '/calc/tip-calculator',
  '/calc/mileage-calculator',
  '/calc/density-calculator',
  '/calc/mass-calculator',
  '/calc/weight-calculator',
  '/calc/speed-calculator',
  '/calc/molarity-calculator',
  '/calc/molecular-weight-calculator',
  '/calc/roman-numeral-converter',
  '/calc/golf-handicap-calculator',
  '/calc/sleep-calculator',
  '/calc/tire-size-calculator',
  '/calc/roofing-calculator',
  '/calc/tile-calculator',
  '/calc/mulch-calculator',
  '/calc/gravel-calculator',
  '/calc/wind-chill-calculator',
  '/calc/heat-index-calculator',
  '/calc/dew-point-calculator',
  '/calc/bandwidth-calculator',
  '/calc/base64-encode-decode',
  '/calc/url-encode-decode',
  '/calc/time-duration-calculator',
  '/calc/day-counter',
  '/calc/day-of-the-week-calculator',
  // Singapore
  '/calc/sg-income-tax-calculator',
  '/calc/cpf-calculator',
  '/calc/srs-calculator',
  '/calc/gst-calculator',
  '/calc/sg-take-home-pay-calculator',
  '/calc/hdb-loan-calculator',
  '/calc/cpf-life-calculator',
  '/calc/bsd-calculator',
  '/calc/ippt-calculator'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {
          cache: 'reload'
        })))
        .catch(() => {
          // If bulk cache fails, cache them individually, ignoring failures
          return Promise.allSettled(
            STATIC_ASSETS.map(url =>
              cache.add(new Request(url, {
                cache: 'reload'
              })).catch(() => {})
            )
          );
        });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
        .filter((name) => name !== CACHE_NAME)
        .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET and chrome-extension requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request.clone())
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
            return networkResponse;
          }
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/');
          }
        });
    })
  );
});