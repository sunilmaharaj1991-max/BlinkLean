/**
 * Blinklean External Analytics & Event Tracking
 * Integrates with GA4 to track user interactions without affecting performance.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Check if gtag is loaded
    const isGtagLoaded = () => typeof gtag === 'function';

    // Event 1: WhatsApp Button Click
    const whatsappElements = document.querySelectorAll('.whatsapp-float-btn, a[href*="wa.me"], .footer-contact-info a[href*="wa.me"]');
    whatsappElements.forEach(el => {
        el.addEventListener('click', function () {
            if (isGtagLoaded()) {
                gtag('event', 'whatsapp_contact_click', {
                    'event_category': 'Engagement',
                    'event_label': 'WhatsApp Floating Button',
                    'transport_type': 'beacon'
                });
            }
        });
    });

    // Event 2: Service Card Click (Interest)
    const serviceElements = document.querySelectorAll('.service-card, .category-card-p, .service-item, .category-card, .btn-primary:not(.whatsapp-float-btn)');
    serviceElements.forEach(el => {
        el.addEventListener('click', function () {
            if (isGtagLoaded()) {
                const serviceName = this.innerText ? this.innerText.trim().split('\n')[0] : 'Generic Service';
                gtag('event', 'service_interest_click', {
                    'event_category': 'Engagement',
                    'event_label': serviceName,
                    'transport_type': 'beacon'
                });
            }
        });
    });

    // Event 3: App Promotion Button Click
    const appElements = document.querySelectorAll('.app-button, .btn-store, .app-btn-premium, a[href*="play.google.com"], a[href*="apps.apple.com"]');
    appElements.forEach(el => {
        el.addEventListener('click', function () {
            if (isGtagLoaded()) {
                const platform = this.href.includes('play.google.com') ? 'Android' : 'iOS';
                gtag('event', 'app_interest_click', {
                    'event_category': 'Acquisition',
                    'event_label': platform,
                    'transport_type': 'beacon'
                });
            }
        });
    });

    // Track scroll depth (Simple implementation for 50% and 90%)
    let scrolled50 = false;
    let scrolled90 = false;
    window.addEventListener('scroll', function () {
        if (!isGtagLoaded()) return;

        const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;

        if (scrollPercent > 0.5 && !scrolled50) {
            gtag('event', 'scroll_depth', { 'percent': '50%' });
            scrolled50 = true;
        }
        if (scrollPercent > 0.9 && !scrolled90) {
            gtag('event', 'scroll_depth', { 'percent': '90%' });
            scrolled90 = true;
        }
    });
});
