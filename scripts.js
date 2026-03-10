/* Ryqen — Neon Grid Scripts */
document.addEventListener('DOMContentLoaded', () => {
    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal, .reveal-left');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(el => io.observe(el));

    // Navbar scroll
    const nav = document.getElementById('navbar');
    if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));

    // Mobile menu
    const burger = document.getElementById('burger');
    const mobile = document.getElementById('mobileMenu');
    const close = document.getElementById('closeMenu');
    if (burger && mobile) {
        burger.addEventListener('click', () => mobile.classList.add('open'));
        close?.addEventListener('click', () => mobile.classList.remove('open'));
        mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobile.classList.remove('open')));
    }

    // Counter animation
    document.querySelectorAll('.counter').forEach(el => {
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const io2 = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    let current = 0;
                    const duration = 1500;
                    const step = target / (duration / 16);
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) { current = target; clearInterval(timer); }
                        el.textContent = prefix + Math.round(current) + suffix;
                    }, 16);
                    io2.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });
        io2.observe(el);
    });

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });

    // Smooth anchor scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu if open
                mobile?.classList.remove('open');
            }
        });
    });

    // Remove Spline Logo from Shadow DOM completely (no flashing)
    const splineViewer = document.getElementById('spline-viewer-element');
    if (splineViewer) {
        const injectShadowStyles = () => {
            if (splineViewer.shadowRoot) {
                // Manually remove if present
                const logo = splineViewer.shadowRoot.querySelector('#logo');
                if (logo) logo.remove();

                // Inject internal style to destroy any future renders
                if (!splineViewer.shadowRoot.querySelector('#hide-spline-logo')) {
                    const style = document.createElement('style');
                    style.id = 'hide-spline-logo';
                    style.textContent = `
                        #logo, a[href*="spline.design"] {
                            display: none !important;
                            opacity: 0 !important;
                            visibility: hidden !important;
                            pointer-events: none !important;
                            width: 0 !important;
                            height: 0 !important;
                            position: absolute !important;
                            top: -9999px !important;
                        }
                    `;
                    splineViewer.shadowRoot.appendChild(style);
                }
            }
        };

        const observer = new MutationObserver(injectShadowStyles);
        observer.observe(splineViewer, { childList: true, subtree: true });

        // Run repeatedly during startup to catch it the millisecond it spawns
        const intervalId = setInterval(injectShadowStyles, 100);
        setTimeout(() => clearInterval(intervalId), 5000);
    }
    // ── Marquee: clone items to fill viewport, then animate ──
    const marqueeTrack = document.getElementById('marquee-track');
    if (marqueeTrack) {
        const originalHTML = marqueeTrack.innerHTML;
        const viewportWidth = window.innerWidth;

        // Clone until we have at least 3x the viewport width
        let safety = 0;
        while (marqueeTrack.scrollWidth < viewportWidth * 3 && safety < 20) {
            marqueeTrack.innerHTML += originalHTML;
            safety++;
        }

        // The original content width is 1 "set", compute how many sets we have
        // We want to scroll exactly the width of ONE set (originalHTML)
        // Create a temp element to measure
        const temp = document.createElement('div');
        temp.style.cssText = 'display:flex;align-items:center;width:max-content;position:absolute;visibility:hidden;';
        temp.innerHTML = originalHTML;
        document.body.appendChild(temp);
        const oneSetWidth = temp.scrollWidth;
        document.body.removeChild(temp);

        // Set the offset to scroll exactly one set width in pixels
        marqueeTrack.style.setProperty('--marquee-offset', `-${oneSetWidth}px`);
        marqueeTrack.style.animation = 'marquee 25s linear infinite';
    }

});

// ── Portfolio Modal Logic ──
function openPortfolioModal(url) {
    const modal = document.getElementById('portfolio-modal');
    const iframe = document.getElementById('portfolio-iframe');
    const loader = document.getElementById('portfolio-modal-loader');

    if (!modal || !iframe) return;

    // Set URL and show loader
    loader.style.display = 'flex';
    iframe.style.opacity = '0';

    // Load iframe
    iframe.onload = () => {
        loader.style.display = 'none';
        iframe.style.opacity = '1';
    };
    iframe.src = url;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function openPortfolioNewTab() {
    const iframe = document.getElementById('portfolio-iframe');
    if (iframe && iframe.src) {
        window.open(iframe.src, '_blank');
        closePortfolioModal();
    }
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolio-modal');
    const iframe = document.getElementById('portfolio-iframe');

    if (!modal || !iframe) return;

    // Hide modal
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Clear iframe src after transition to stop media playing
    setTimeout(() => {
        iframe.src = '';
    }, 400);
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('portfolio-modal');
        if (modal && modal.classList.contains('active')) {
            closePortfolioModal();
        }
    }
});
