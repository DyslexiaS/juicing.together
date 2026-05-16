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

/* ── Hero Mascots — trigger on page load ── */
const heroMascots = document.querySelectorAll('.m-hero');
heroMascots.forEach((el) => {
    // after a short delay let CSS animation+float layer kick in
    const delay = parseFloat(
        el.style.animationDelay ||
        getComputedStyle(el).animationDelay || '0'
    );
    setTimeout(() => {
        el.classList.add('mascot-visible');
        // switch to float after bounce completes
        setTimeout(() => el.classList.add('mascot-float'), 900);
    }, 0); // CSS delays handle stagger
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Sticky Nav ── */
const nav = document.getElementById('nav');
let lastScrollY = 0;

const updateNav = () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 72);
    lastScrollY = scrollY;
};

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

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

        const navH = parseInt(
            getComputedStyle(document.documentElement)
                .getPropertyValue('--nav-h-sm')
        ) || 56;

        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

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
