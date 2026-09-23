// js/update-bar.js - Service worker registration and the "new version is ready"
// bar. A new worker never activates on its own: it installs, waits, and is only
// promoted when somebody presses Reload. See update-bar-spec.md.
(function () {
    const SW_URL = '/sw.js';

    const COPY = {
        label: 'Update',
        ready: 'A new version of uwuCalc is ready.',
        reload: 'Reload',
        later: 'Not now'
    };

    let registration = null;
    let waitingWorker = null;
    let reloading = false;
    // For this page view only. Never stored: "Not now" means not now.
    let dismissed = false;
    let resizeObserver = null;

    // The header and sidebar are position: fixed, so they read the bar's height
    // from this variable to sit below it rather than on top of it.
    function setNoticeHeight(px) {
        document.documentElement.style.setProperty('--update-notice-height', px + 'px');
    }

    function trackHeight(bar) {
        if (typeof ResizeObserver === 'undefined') {
            setNoticeHeight(bar.offsetHeight);
            return;
        }
        resizeObserver = new ResizeObserver(() => setNoticeHeight(bar.offsetHeight));
        resizeObserver.observe(bar);
    }

    function removeBar(bar) {
        if (bar.classList.contains('leaving')) return;
        bar.classList.add('leaving');
        bar.addEventListener('animationend', () => {
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }
            bar.remove();
            setNoticeHeight(0);
        }, { once: true });
    }

    function render() {
        const existing = document.querySelector('.update-notice');

        if (!waitingWorker || dismissed) {
            if (existing) removeBar(existing);
            return;
        }
        if (existing) return;

        const bar = document.createElement('div');
        bar.className = 'update-notice';
        bar.setAttribute('role', 'status');
        bar.setAttribute('aria-label', COPY.label);
        bar.innerHTML = `
      <div class="update-notice-inner">
        <p>${COPY.ready}</p>
        <button type="button" class="btn-primary" data-sw-update>${COPY.reload}</button>
        <button type="button" class="btn-secondary" data-sw-later>${COPY.later}</button>
      </div>
    `;

        bar.querySelector('[data-sw-update]').addEventListener('click', () => {
            // The only place anything asks for skipWaiting. The reload happens on
            // controllerchange, not here.
            if (waitingWorker) waitingWorker.postMessage('skip-waiting');
        });

        bar.querySelector('[data-sw-later]').addEventListener('click', () => {
            dismissed = true;
            render();
        });

        document.body.prepend(bar);
        trackHeight(bar);
    }

    function watchForUpdate() {
        if (!registration) return;

        // A worker already waiting when the page opened. This is the ordinary case
        // on the second page view after a deploy.
        if (registration.waiting && navigator.serviceWorker.controller) {
            waitingWorker = registration.waiting;
            render();
        }

        registration.addEventListener('updatefound', () => {
            const installing = registration.installing;
            if (!installing) return;

            installing.addEventListener('statechange', () => {
                // `installed` with a controller present means an update. With no
                // controller it is a first install, with nothing to prompt about.
                if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                    waitingWorker = registration.waiting || installing;
                    render();
                }
            });
        });
    }

    function registerWorker() {
        if (!('serviceWorker' in navigator)) return;

        navigator.serviceWorker
            .register(SW_URL)
            .then((reg) => {
                registration = reg;
                watchForUpdate();
            })
            .catch((cause) => {
                // A refused registration is not a reason to break the page.
                console.warn('service worker registration failed:', cause);
            });

        // The swap, once somebody has accepted it. Reloading here rather than in
        // the click handler means the reload is served by the new worker. The
        // flag stops a second controllerchange from starting a reload loop.
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (reloading) return;
            reloading = true;
            window.location.reload();
        });
    }

    // On load, not immediately: installing fetches everything the worker
    // precaches, and competing with the page's own assets slows a first visit.
    if (document.readyState === 'complete') registerWorker();
    else window.addEventListener('load', registerWorker, { once: true });
})();
