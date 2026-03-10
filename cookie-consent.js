/* ═══════════════════════════ COOKIE CONSENT ═══════════════════════════ */
(function () {
    // Check if consent was already given
    const consent = localStorage.getItem('ryqen_cookie_consent');

    if (consent === 'accepted') {
        loadAnalytics();
        return;
    }

    if (consent === 'rejected') {
        return; // Don't show banner, don't load analytics
    }

    // Show banner after a short delay
    window.addEventListener('DOMContentLoaded', function () {
        setTimeout(showBanner, 800);
    });

    function showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('visible');
        }
    }

    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('visible');
            setTimeout(function () {
                banner.style.display = 'none';
            }, 400);
        }
    }

    // Global handlers
    window.acceptCookies = function () {
        localStorage.setItem('ryqen_cookie_consent', 'accepted');
        loadAnalytics();
        hideBanner();
    };

    window.rejectCookies = function () {
        localStorage.setItem('ryqen_cookie_consent', 'rejected');
        hideBanner();
    };

    function loadAnalytics() {
        // Google Analytics - replace GA_MEASUREMENT_ID with your actual ID
        var gaId = 'G-XXXXXXXXXX';
        if (gaId === 'G-XXXXXXXXXX') return; // Don't load if no real ID set

        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
        document.head.appendChild(script);

        script.onload = function () {
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', gaId, { anonymize_ip: true });
        };
    }
})();
