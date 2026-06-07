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
const NAV_SCROLL_OFFSET = 72;

const scrollToAnchor = (hash, behavior = 'smooth') => {
    if (!hash || hash === '#') return false;
    const target = document.querySelector(hash);
    if (!target) return false;
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_SCROLL_OFFSET;
    window.scrollTo({ top, behavior });
    return true;
};

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (!scrollToAnchor(id, 'smooth')) return;
        e.preventDefault();
        history.pushState(null, '', id);
    });
});

const scrollToInitialHash = () => {
    if (!window.location.hash) return;
    scrollToAnchor(window.location.hash, 'auto');
};

window.addEventListener('hashchange', () => {
    scrollToAnchor(window.location.hash, 'smooth');
});

window.addEventListener('load', scrollToInitialHash);

/* ── Quote Calculator ── */
const calculator = document.getElementById('calculator');
if (calculator) {
    const BOX_PRICES = { small: 75, medium: 105, large: 155 };
    const PICKUP_LABEL = '來店取貨（長春路146號）';
    let lastDeliveryAddress = '';
    let lastBagQty = '1';

    const els = {
        size: () => document.querySelector('input[name="boxSize"]:checked'),
        qty: document.getElementById('boxQty'),
        payment: () => document.querySelector('input[name="paymentMethod"]:checked'),
        needsBag: () => document.querySelector('input[name="needsBag"]:checked'),
        bagQtyField: document.getElementById('bagQtyField'),
        bagQty: document.getElementById('bagQty'),
        name: document.getElementById('customerName'),
        pickupDate: document.getElementById('pickupDate'),
        pickupTime: document.getElementById('pickupTime'),
        delivery: () => document.querySelector('input[name="deliveryMethod"]:checked'),
        address: document.getElementById('customerAddress'),
        phone: document.getElementById('customerPhone'),
        receipt: () => document.querySelector('input[name="receiptNeeded"]:checked'),
        receiptIdField: document.getElementById('receiptIdField'),
        receiptId: document.getElementById('receiptId'),
        base: document.getElementById('summaryBase'),
        discount: document.getElementById('summaryDiscount'),
        bag: document.getElementById('summaryBag'),
        total: document.getElementById('summaryTotal'),
        preview: document.getElementById('linePreview'),
        copyBtn: document.getElementById('copyQuoteBtn'),
        copyFeedback: document.getElementById('copyFeedback')
    };

    const formatCurrency = value => `$${value.toLocaleString('zh-TW')}`;
    const sizeLabel = value => ({ small: '小', medium: '中', large: '大' }[value] || '小');
    const paymentLabel = value => ({ cash: '現金', transfer: '匯款' }[value] || '現金');
    const deliveryLabel = value => ({ pickup: '來店取貨', delivery: '外送' }[value] || '來店取貨');
    const minPickupDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        return d.toISOString().split('T')[0];
    };
    const buildPickupSlot = () => {
        const date = (els.pickupDate.value || '').trim();
        const time = (els.pickupTime.value || '').trim();
        if (!date && !time) return '';
        if (date && time) return `${date} ${time}`;
        return date || time;
    };

    const syncDeliveryAddress = () => {
        const delivery = els.delivery().value;
        if (delivery === 'pickup') {
            if ((els.address.value || '').trim() && els.address.value !== PICKUP_LABEL) {
                lastDeliveryAddress = els.address.value;
            }
            els.address.value = PICKUP_LABEL;
            els.address.readOnly = true;
        } else {
            els.address.readOnly = false;
            if (els.address.value === PICKUP_LABEL) {
                els.address.value = lastDeliveryAddress;
            }
        }
    };

    const syncBagField = () => {
        const wantsBag = els.needsBag().value === 'yes';
        if (!wantsBag) {
            lastBagQty = els.bagQty.value || lastBagQty;
        }
        els.bagQty.disabled = !wantsBag;
        els.bagQtyField.style.opacity = wantsBag ? '1' : '.55';
        if (wantsBag && !els.bagQty.value) els.bagQty.value = lastBagQty;
    };

    const syncReceiptField = () => {
        const needsReceipt = els.receipt().value === 'yes';
        els.receiptId.disabled = !needsReceipt;
        els.receiptIdField.style.opacity = needsReceipt ? '1' : '.55';
        if (!needsReceipt) els.receiptId.value = '';
    };

    const buildMessage = totals => {
        const size = sizeLabel(els.size().value);
        const qty = Math.max(1, Math.floor(Number(els.qty.value) || 1));
        const wantsBag = els.needsBag().value === 'yes';
        const bagQty = Math.max(1, Math.floor(Number(els.bagQty.value) || 1));
        const delivery = els.delivery().value;
        const address = (els.address.value || '').trim() || (delivery === 'pickup' ? PICKUP_LABEL : '');

        return [
            `姓名：${(els.name.value || '').trim()}`,
            `品項：會議水果盒（${size}）x ${qty}`,
            `購買塑膠袋：${wantsBag ? `是，${bagQty} 個` : '否'}`,
            `取餐時段：${buildPickupSlot()}`,
            `取貨方式：${deliveryLabel(delivery)}`,
            `地址：${address}`,
            `電話：${(els.phone.value || '').trim()}`,
            `收據：${els.receipt().value === 'yes' ? '是' : '否'}`,
            ...(els.receipt().value === 'yes' && (els.receiptId.value || '').trim() ? [`統編：${(els.receiptId.value || '').trim()}`] : []),
            `付款方式：${paymentLabel(els.payment().value)}`,
            `原價小計：${formatCurrency(totals.baseSubtotal)}`,
            `付款折扣：-${formatCurrency(totals.discount)}`,
            `塑膠袋：${formatCurrency(totals.bagSubtotal)}`,
            `預估總計：${formatCurrency(totals.total)}`
        ].join('\n');
    };

    const validateBeforeCopy = () => {
        const missing = [];
        if (!(els.name.value || '').trim()) missing.push('姓名');
        if (!(els.pickupDate.value || '').trim()) missing.push('取餐日期');
        if (!(els.pickupTime.value || '').trim()) missing.push('取餐時段');
        if (!(els.phone.value || '').trim()) missing.push('電話');
        if (els.delivery().value === 'delivery' && !(els.address.value || '').trim()) missing.push('地址');
        if (els.needsBag().value === 'yes' && !(els.bagQty.value || '').trim()) missing.push('塑膠袋數量');
        return missing;
    };

    const initializePickupDate = () => {
        const minDate = minPickupDate();
        els.pickupDate.min = minDate;
        if (!els.pickupDate.value || els.pickupDate.value < minDate) {
            els.pickupDate.value = minDate;
        }
    };

    const PICKER_WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
    const TIME_SLOTS = (() => {
        const slots = [];
        for (let hour = 8; hour <= 20; hour += 1) {
            slots.push(`${String(hour).padStart(2, '0')}:00`);
            if (hour < 20) slots.push(`${String(hour).padStart(2, '0')}:30`);
        }
        return slots;
    })();

    let openPickerWrap = null;

    const formatDateLabel = iso => {
        if (!iso) return '請選擇日期';
        const date = new Date(`${iso}T12:00:00`);
        if (Number.isNaN(date.getTime())) return '請選擇日期';
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（週${PICKER_WEEKDAYS[date.getDay()]}）`;
    };

    const formatTimeLabel = hhmm => {
        if (!hhmm) return '請選擇時段';
        return hhmm.replace(':', '：');
    };

    const closeAllPickers = () => {
        document.querySelectorAll('.picker-wrap').forEach(wrap => {
            wrap.classList.remove('is-open');
            wrap.querySelector('.picker-trigger')?.setAttribute('aria-expanded', 'false');

            const pickerId = wrap.dataset.picker;
            const backdrop = wrap.querySelector('.picker-backdrop')
                || document.querySelector(`.picker-backdrop[data-picker-wrap="${pickerId}"]`);
            const popup = wrap.querySelector('.picker-popup')
                || document.querySelector(`.picker-popup[data-picker-wrap="${pickerId}"]`);

            backdrop?.setAttribute('hidden', '');
            popup?.setAttribute('hidden', '');
            backdrop?.classList.remove('is-portal');
            popup?.classList.remove('is-portal');

            if (backdrop && backdrop.parentElement !== wrap) wrap.appendChild(backdrop);
            if (popup && popup.parentElement !== wrap) wrap.appendChild(popup);
        });
        document.body.classList.remove('picker-open');
        openPickerWrap = null;
    };

    const mountPickerPortal = wrap => {
        if (!window.matchMedia('(max-width: 768px)').matches) return;

        const backdrop = wrap.querySelector('.picker-backdrop');
        const popup = wrap.querySelector('.picker-popup');
        if (!backdrop || !popup) return;

        backdrop.dataset.pickerWrap = wrap.dataset.picker;
        popup.dataset.pickerWrap = wrap.dataset.picker;
        backdrop.classList.add('is-portal');
        popup.classList.add('is-portal');
        document.body.appendChild(backdrop);
        document.body.appendChild(popup);
    };

    const getPickerLayers = wrap => {
        const pickerId = wrap.dataset.picker;
        return {
            backdrop: document.querySelector(`.picker-backdrop[data-picker-wrap="${pickerId}"]`)
                || wrap.querySelector('.picker-backdrop'),
            popup: document.querySelector(`.picker-popup[data-picker-wrap="${pickerId}"]`)
                || wrap.querySelector('.picker-popup')
        };
    };

    const openPicker = wrap => {
        closeAllPickers();
        wrap.classList.add('is-open');
        wrap.querySelector('.picker-trigger')?.setAttribute('aria-expanded', 'true');
        mountPickerPortal(wrap);

        const { backdrop, popup } = getPickerLayers(wrap);
        backdrop?.removeAttribute('hidden');
        popup?.removeAttribute('hidden');
        document.body.classList.add('picker-open');
        openPickerWrap = wrap;
    };

    const syncPickerDisplays = () => {
        const dateDisplay = document.getElementById('pickupDateDisplay');
        const timeDisplay = document.getElementById('pickupTimeDisplay');
        if (dateDisplay) {
            dateDisplay.textContent = formatDateLabel(els.pickupDate.value);
            dateDisplay.classList.toggle('is-placeholder', !els.pickupDate.value);
        }
        if (timeDisplay) {
            timeDisplay.textContent = formatTimeLabel(els.pickupTime.value);
            timeDisplay.classList.toggle('is-placeholder', !els.pickupTime.value);
        }
    };

    const initDateTimePickers = () => {
        const dateWrap = document.querySelector('[data-picker="date"]');
        const timeWrap = document.querySelector('[data-picker="time"]');
        const dateGrid = document.getElementById('pickupDateGrid');
        const dateTitle = document.getElementById('pickupDateTitle');
        const timeGrid = document.getElementById('pickupTimeGrid');
        if (!dateWrap || !timeWrap || !dateGrid || !dateTitle || !timeGrid) return;

        let viewDate = els.pickupDate.value
            ? new Date(`${els.pickupDate.value}T12:00:00`)
            : new Date(`${minPickupDate()}T12:00:00`);

        const renderDateGrid = () => {
            const year = viewDate.getFullYear();
            const month = viewDate.getMonth();
            const minIso = minPickupDate();
            const todayIso = new Date().toISOString().split('T')[0];

            dateTitle.textContent = `${year}年${month + 1}月`;
            dateGrid.replaceChildren();

            for (let i = 0; i < new Date(year, month, 1).getDay(); i += 1) {
                const spacer = document.createElement('span');
                spacer.className = 'picker-day-spacer';
                spacer.setAttribute('aria-hidden', 'true');
                dateGrid.appendChild(spacer);
            }

            const daysInMonth = new Date(year, month + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day += 1) {
                const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'picker-day';
                btn.textContent = String(day);
                btn.dataset.date = iso;

                if (iso < minIso) btn.disabled = true;
                if (iso === todayIso) btn.classList.add('is-today');
                if (iso === els.pickupDate.value) btn.classList.add('is-selected');

                btn.addEventListener('click', () => {
                    els.pickupDate.value = iso;
                    els.pickupDate.dispatchEvent(new Event('change', { bubbles: true }));
                    closeAllPickers();
                });
                dateGrid.appendChild(btn);
            }
        };

        const renderTimeGrid = () => {
            timeGrid.replaceChildren();
            TIME_SLOTS.forEach(slot => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'picker-time-slot';
                btn.textContent = formatTimeLabel(slot);
                btn.dataset.time = slot;
                if (slot === els.pickupTime.value) btn.classList.add('is-selected');
                btn.addEventListener('click', () => {
                    els.pickupTime.value = slot;
                    els.pickupTime.dispatchEvent(new Event('change', { bubbles: true }));
                    closeAllPickers();
                });
                timeGrid.appendChild(btn);
            });
        };

        dateWrap.querySelector('[data-action="prev-month"]')?.addEventListener('click', event => {
            event.stopPropagation();
            viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
            renderDateGrid();
        });

        dateWrap.querySelector('[data-action="next-month"]')?.addEventListener('click', event => {
            event.stopPropagation();
            viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
            renderDateGrid();
        });

        dateWrap.querySelector('.picker-trigger')?.addEventListener('click', event => {
            event.stopPropagation();
            if (dateWrap.classList.contains('is-open')) {
                closeAllPickers();
                return;
            }
            if (els.pickupDate.value) {
                viewDate = new Date(`${els.pickupDate.value}T12:00:00`);
            }
            renderDateGrid();
            openPicker(dateWrap);
        });

        timeWrap.querySelector('.picker-trigger')?.addEventListener('click', event => {
            event.stopPropagation();
            if (timeWrap.classList.contains('is-open')) {
                closeAllPickers();
                return;
            }
            renderTimeGrid();
            openPicker(timeWrap);
        });

        document.querySelectorAll('.picker-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', closeAllPickers);
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeAllPickers();
        });

        document.addEventListener('click', event => {
            if (!openPickerWrap) return;
            if (openPickerWrap.contains(event.target)) return;

            const { popup } = getPickerLayers(openPickerWrap);
            if (popup?.contains(event.target)) return;

            closeAllPickers();
        });

        window.matchMedia('(max-width: 768px)').addEventListener('change', closeAllPickers);
    };

    const setCopyFeedback = (message, type = '') => {
        els.copyFeedback.textContent = message;
        els.copyFeedback.classList.remove('is-error', 'is-success');
        if (type) els.copyFeedback.classList.add(type);
        els.copyFeedback.hidden = !message;
        els.copyFeedback.setAttribute('role', type === 'is-error' ? 'alert' : 'status');
    };

    const clearCopyFeedbackIfError = () => {
        if (els.copyFeedback.classList.contains('is-error')) {
            setCopyFeedback('', '');
        }
    };

    const renderCalculator = () => {
        clearCopyFeedbackIfError();
        initializePickupDate();
        syncDeliveryAddress();
        syncBagField();
        syncReceiptField();

        const size = els.size().value;
        const qty = Math.max(1, Math.floor(Number(els.qty.value) || 1));
        const wantsBag = els.needsBag().value === 'yes';
        const bagQty = wantsBag ? Math.max(1, Math.floor(Number(els.bagQty.value) || 1)) : 0;
        const unitPrice = BOX_PRICES[size];
        const baseSubtotal = unitPrice * qty;
        const discount = qty * 5;
        const bagSubtotal = bagQty * 1;
        const total = Math.max(0, baseSubtotal - discount + bagSubtotal);

        els.base.textContent = formatCurrency(baseSubtotal);
        els.discount.textContent = `-${formatCurrency(discount)}`;
        els.bag.textContent = formatCurrency(bagSubtotal);
        els.total.textContent = formatCurrency(total);

        els.preview.value = buildMessage({ baseSubtotal, discount, bagSubtotal, total });
        syncPickerDisplays();
    };

    calculator.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', renderCalculator);
        el.addEventListener('change', renderCalculator);
    });

    const LINE_URL = 'https://lin.ee/xCwVELfD';

    const copyToClipboardSync = text => {
        if (!text) return false;

        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.cssText = [
            'position:fixed',
            'top:0',
            'left:0',
            'width:2em',
            'height:2em',
            'padding:0',
            'border:none',
            'outline:none',
            'box-shadow:none',
            'background:transparent',
            'opacity:0',
            'pointer-events:none'
        ].join(';');
        document.body.appendChild(textarea);

        textarea.focus({ preventScroll: true });
        textarea.select();
        textarea.setSelectionRange(0, text.length);

        if (/ipad|iphone|ipod/i.test(navigator.userAgent)) {
            const range = document.createRange();
            range.selectNodeContents(textarea);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
            textarea.setSelectionRange(0, text.length);
        }

        let copied = false;
        try {
            copied = document.execCommand('copy');
        } catch {
            copied = false;
        }

        document.body.removeChild(textarea);
        return copied;
    };

    const openLineChannel = () => {
        const link = document.createElement('a');
        link.href = LINE_URL;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    els.copyBtn.addEventListener('click', () => {
        const missing = validateBeforeCopy();
        if (missing.length) {
            setCopyFeedback(`請先填寫：${missing.join('、')}`, 'is-error');
            return;
        }

        const text = els.preview.value;
        const copied = copyToClipboardSync(text);
        let feedbackTimer = 3200;

        const showCopySuccess = () => {
            setCopyFeedback('已複製，正在開啟 Line', 'is-success');
            if (typeof gtag === 'function') {
                gtag('event', 'quote_copy', { event_category: 'conversion' });
            }
        };

        const showCopyFailure = () => {
            setCopyFeedback('無法自動複製，請手動複製下方詢價內容後貼到 Line', 'is-error');
            els.preview.focus();
            els.preview.select();
            feedbackTimer = 5000;
        };

        const finishCopyFlow = didCopy => {
            openLineChannel();
            if (didCopy) showCopySuccess();
            else showCopyFailure();
            window.setTimeout(() => setCopyFeedback('', ''), feedbackTimer);
        };

        if (copied) {
            finishCopyFlow(true);
            return;
        }

        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => finishCopyFlow(true))
                .catch(() => finishCopyFlow(false));
            return;
        }

        finishCopyFlow(false);
    });

    initDateTimePickers();
    renderCalculator();
}

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
