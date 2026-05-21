'use strict';

/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add('visible');
        revealObserver.unobserve(target);
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
});


document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Sticky Nav ── */
const nav = document.getElementById('nav');

if ('IntersectionObserver' in window) {
    const navTrigger = document.createElement('span');
    navTrigger.setAttribute('aria-hidden', 'true');
    navTrigger.style.cssText = 'position:absolute;top:72px;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.prepend(navTrigger);

    const navObserver = new IntersectionObserver(([entry]) => {
        nav.classList.toggle('scrolled', !entry.isIntersecting);
    });

    navObserver.observe(navTrigger);
} else {
    let ticking = false;
    let isScrolled = false;

    const updateNav = () => {
        const nextScrolled = window.scrollY > 72;
        if (nextScrolled !== isScrolled) {
            nav.classList.toggle('scrolled', nextScrolled);
            isScrolled = nextScrolled;
        }
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateNav);
    }, { passive: true });

    updateNav();
}

/* ── Mobile Nav Toggle ── */
const navToggle   = document.getElementById('navToggle');
const navMobile   = document.getElementById('navMobile');

navToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    navMobile.setAttribute('aria-hidden', !isOpen);
});

// Close on any mobile link click
navMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        navMobile.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navMobile.setAttribute('aria-hidden', 'true');
    });
});

// Close on outside click
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
        navMobile.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navMobile.setAttribute('aria-hidden', 'true');
    }
});

/* ── FAQ Accordion ── */
document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
        const item   = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-a');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('open');
            i.querySelector('.faq-a').classList.remove('open');
            i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        });

        // Toggle clicked
        if (!isOpen) {
            item.classList.add('open');
            answer.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

/* ── Smooth Scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const id     = link.getAttribute('href');
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();

        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ── Fruit Platter scale-in ── */
const platter = document.querySelector('.whyus-platter');
if (platter) {
    const platterObs = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        platter.classList.add('platter-visible');
        platterObs.unobserve(platter);
    }, { threshold: 0.3 });
    platterObs.observe(platter);
}

/* ── Fruit Character Parade ── */
const fruitParade = document.getElementById('fruitParade');
if (fruitParade) {
    const fpObserver = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        fruitParade.classList.add('parade-go');
        fpObserver.unobserve(fruitParade);

        // After entry animation finishes → switch to float
        const chars = fruitParade.querySelectorAll('.fp-char');
        const delays = [950, 1090, 1230, 1390]; // pineapple, pear, tomato, combo
        chars.forEach((el, i) => {
            setTimeout(() => el.classList.add('fp-float'), delays[i]);
        });
    }, { threshold: 0.5 });
    fpObserver.observe(fruitParade);
}

/* ── Step arrows — progressive reveal ── */
const stepArrows = document.querySelectorAll('.step-arrow');
const arrowObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
            target.classList.add('visible');
            arrowObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

stepArrows.forEach(el => arrowObserver.observe(el));

/* ── Line float: hide when footer in view ── */
const lineFloat = document.querySelector('.line-float');
const footer    = document.querySelector('.footer');

if (lineFloat && footer) {
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(({ isIntersecting }) => {
            lineFloat.style.opacity      = isIntersecting ? '0' : '1';
            lineFloat.style.pointerEvents = isIntersecting ? 'none' : 'auto';
        });
    }, { threshold: 0.1 });

    footerObserver.observe(footer);
}

/* ── GA4 conversion events ── */
document.querySelectorAll('a[href*="lin.ee"]').forEach(link => {
    link.addEventListener('click', () => {
        if (typeof gtag === 'function') {
            gtag('event', 'line_click', { event_category: 'conversion' });
        }
    });
});

document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        if (typeof gtag === 'function') {
            gtag('event', 'phone_click', { event_category: 'conversion' });
        }
    });
});
