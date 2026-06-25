// js/favourites.js - Favourite calculators using localStorage
(function () {
    const KEY = 'uwucalc_favourites';

    function getFavourites() {
        try {
            return JSON.parse(localStorage.getItem(KEY) || '[]');
        } catch {
            return [];
        }
    }

    function isFavourite(calcId) {
        return getFavourites().includes(calcId);
    }

    function toggleFavourite(calcId) {
        const favs = getFavourites();
        const idx = favs.indexOf(calcId);
        if (idx === -1) {
            favs.push(calcId);
            localStorage.setItem(KEY, JSON.stringify(favs));
            showToast('Added to favourites');
            return true;
        } else {
            favs.splice(idx, 1);
            localStorage.setItem(KEY, JSON.stringify(favs));
            showToast('Removed from favourites');
            return false;
        }
    }

    function updateFavButtons(calcId) {
        const isFav = isFavourite(calcId);
        document.querySelectorAll('.fav-btn, .calc-card-fav[data-calc-id="' + calcId + '"], .sidebar-fav-star[data-calc-id="' + calcId + '"]').forEach(btn => {
            btn.classList.toggle('starred', isFav);
            if (btn.classList.contains('fav-btn')) {
                const textEl = btn.querySelector('.fav-btn-text');
                if (textEl) textEl.textContent = isFav ? 'Unfavourite' : 'Favourite';
            }
        });
    }

    function initFavButtons(calcId) {
        document.querySelectorAll('.fav-btn').forEach(btn => {
            updateFavButtons(calcId);
            btn.addEventListener('click', () => {
                toggleFavourite(calcId);
                updateFavButtons(calcId);
            });
        });

        // Card-level fav buttons (skip if already bound by home.js)
        document.querySelectorAll('.calc-card-fav').forEach(btn => {
            const id = btn.dataset.calcId;
            if (!id || btn.dataset.bound) return;
            btn.classList.toggle('starred', isFavourite(id));
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavourite(id);
                btn.classList.toggle('starred', isFavourite(id));
            });
        });

        // Sidebar fav stars
        document.querySelectorAll('.sidebar-fav-star').forEach(btn => {
            const id = btn.dataset.calcId;
            if (!id) return;
            btn.classList.toggle('starred', isFavourite(id));
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavourite(id);
                btn.classList.toggle('starred', isFavourite(id));
            });
        });
    }

    window.uwuFavourites = {
        get: getFavourites,
        is: isFavourite,
        toggle: toggleFavourite,
        init: initFavButtons,
        update: updateFavButtons
    };
})();