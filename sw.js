const CACHE_NAME = 'uwucalc-v14';
const STATIC_ASSETS = [
  '/',
  '/css/global.css',
  '/js/theme.js',
  '/js/script.js',
  '/js/search.js',
  '/js/history.js',
  '/js/favourites.js',
  '/manifest.json',
  '/UWC-main.png',
  '/UWC-192.png',
  '/UWC-512.png',
  // Calculator pages
  '/mortgage',
  '/loan',
  '/auto-loan',
  '/interest',
  '/payment',
  '/retirement',
  '/amortization',
  '/investment',
  '/currency',
  '/inflation',
  '/finance',
  '/mortgage-payoff',
  '/income-tax',
  '/compound-interest',
  '/salary',
  '/401k',
  '/interest-rate',
  '/sales-tax',
  '/house-affordability',
  '/savings',
  '/rent',
  '/marriage-tax',
  '/estate-tax',
  '/pension',
  '/social-security',
  '/annuity',
  '/annuity-payout',
  '/credit-card',
  '/credit-card-payoff',
  '/debt-payoff',
  '/debt-consolidation',
  '/repayment',
  '/student-loan',
  '/college-cost',
  '/simple-interest',
  '/cd',
  '/bond',
  '/mutual-fund',
  '/roth-ira',
  '/ira',
  '/rmd',
  '/vat',
  '/cash-back',
  '/auto-lease',
  '/depreciation',
  '/average-return',
  '/margin',
  '/discount',
  '/business-loan',
  '/debt-to-income',
  '/real-estate',
  '/take-home-paycheck',
  '/personal-loan',
  '/boat-loan',
  '/lease',
  '/refinance',
  '/budget',
  '/rental-property',
  '/irr',
  '/roi',
  '/apr',
  '/fha-loan',
  '/va-mortgage',
  '/home-equity-loan',
  '/heloc',
  '/down-payment',
  '/rent-vs-buy',
  '/payback-period',
  '/present-value',
  '/future-value',
  '/commission',
  '/mortgage-uk',
  '/canadian-mortgage',
  '/mortgage-amortization',
  '/percent-off',
  '/bmi',
  '/calorie',
  '/body-fat',
  '/bmr',
  '/macro',
  '/ideal-weight',
  '/pregnancy',
  '/pregnancy-weight-gain',
  '/pregnancy-conception',
  '/due-date',
  '/pace',
  '/army-body-fat',
  '/carbohydrate',
  '/lean-body-mass',
  '/healthy-weight',
  '/calories-burned',
  '/one-rep-max',
  '/target-heart-rate',
  '/protein',
  '/fat-intake',
  '/tdee',
  '/ovulation',
  '/conception',
  '/period',
  '/gfr',
  '/body-type',
  '/body-surface-area',
  '/bac',
  '/anorexic-bmi',
  '/weight-watcher-points',
  '/overweight',
  '/scientific',
  '/fraction',
  '/percentage',
  '/triangle',
  '/volume',
  '/standard-deviation',
  '/random-number',
  '/number-sequence',
  '/percent-error',
  '/exponent',
  '/binary',
  '/hex',
  '/half-life',
  '/quadratic',
  '/slope',
  '/log',
  '/area',
  '/sample-size',
  '/probability',
  '/statistics',
  '/mean-median-mode',
  '/permutation-combination',
  '/z-score',
  '/confidence-interval',
  '/ratio',
  '/distance',
  '/circle',
  '/surface-area',
  '/pythagorean',
  '/right-triangle',
  '/root',
  '/lcm',
  '/gcf',
  '/factor',
  '/rounding',
  '/matrix',
  '/scientific-notation',
  '/big-number',
  '/prime-factorization',
  '/common-factor',
  '/basic',
  '/long-division',
  '/average',
  '/p-value',
  '/age',
  '/date',
  '/time',
  '/hours',
  '/gpa',
  '/grade',
  '/height',
  '/concrete',
  '/ip-subnet',
  '/bra-size',
  '/password',
  '/dice',
  '/conversion',
  '/fuel-cost',
  '/voltage-drop',
  '/btu',
  '/square-footage',
  '/time-card',
  '/time-zone',
  '/love',
  '/gdp',
  '/gas-mileage',
  '/horsepower',
  '/engine-horsepower',
  '/stair',
  '/resistor',
  '/ohms-law',
  '/electricity',
  '/shoe-size',
  '/tip',
  '/mileage',
  '/density',
  '/mass',
  '/weight-calc',
  '/speed',
  '/molarity',
  '/molecular-weight',
  '/roman-numeral',
  '/golf-handicap',
  '/sleep',
  '/tire-size',
  '/roofing',
  '/tile',
  '/mulch',
  '/gravel',
  '/wind-chill',
  '/heat-index',
  '/dew-point',
  '/bandwidth',
  '/base64',
  '/url-encode',
  '/time-duration',
  '/day-counter',
  '/day-of-week',
  // Singapore
  '/sg-income-tax',
  '/cpf',
  '/srs',
  '/gst',
  '/sg-take-home-pay',
  '/hdb-loan',
  '/cpf-life',
  '/bsd',
  '/ippt'
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