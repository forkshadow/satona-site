(() => {
  'use strict';

  const MEASUREMENT_ID = 'G-QLDNGMDCXC';
  const STORAGE_KEY = 'satona.analytics-consent.v1';
  const CHOICES = new Set(['accepted', 'declined']);
  const copy = {
    en: {
      message: 'We use Google Analytics to anonymously measure site usage and improve the experience.',
      accept: 'Accept', decline: 'Decline', preferences: 'Cookie preferences', label: 'Analytics preferences'
    },
    fr: {
      message: "Nous utilisons Google Analytics pour mesurer anonymement l'utilisation du site et améliorer l'expérience.",
      accept: 'Accepter', decline: 'Refuser', preferences: 'Préférences cookies', label: 'Préférences Analytics'
    },
    de: {
      message: 'Wir verwenden Google Analytics, um die Nutzung der Website anonym zu messen und das Erlebnis zu verbessern.',
      accept: 'Akzeptieren', decline: 'Ablehnen', preferences: 'Cookie-Einstellungen', label: 'Analytics-Einstellungen'
    }
  };

  const language = document.documentElement.lang.toLowerCase().split('-')[0];
  const text = copy[language] || copy.en;
  let banner;
  let analyticsLoaded = false;
  let analyticsAllowed = false;
  let pageViewTracked = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  const readChoice = () => {
    try {
      const choice = localStorage.getItem(STORAGE_KEY);
      return CHOICES.has(choice) ? choice : null;
    } catch {
      return null;
    }
  };

  const saveChoice = choice => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // The choice still applies to this page when storage is unavailable.
    }
  };

  const sendEvent = (name, parameters) => {
    if (!analyticsAllowed || typeof window.gtag !== 'function') return;
    try {
      window.gtag('event', name, parameters);
    } catch {
      // Analytics blockers must never affect navigation or downloads.
    }
  };

  const trackCurrentPage = () => {
    if (pageViewTracked) return;
    const path = window.location.pathname.replace(/\/+$/, '');
    let eventName;
    if (path.endsWith('/howitworks.html')) eventName = 'instructions_view';
    if (path.endsWith('/security.html')) eventName = 'security_view';
    if (!eventName) return;
    pageViewTracked = true;
    sendEvent(eventName, {page_location: window.location.href});
  };

  const trackClicks = () => {
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link) return;

      let url;
      try {
        url = new URL(link.href, window.location.href);
      } catch {
        return;
      }

      const parameters = {
        page_location: window.location.href,
        link_url: url.href
      };
      const linkText = link.textContent.trim().replace(/\s+/g, ' ').slice(0, 100);
      if (linkText) parameters.link_text = linkText;

      if (/(^|\.)amazon\.[a-z.]+$/i.test(url.hostname) || /(^|\.)amzn\.to$/i.test(url.hostname)) {
        sendEvent('amazon_click', parameters);
      }
      if (/\/bip39\.html$/i.test(url.pathname)) {
        sendEvent('bip39_tool_open', parameters);
      }
      if (/\/bip39binary\.pdf$/i.test(url.pathname)) {
        sendEvent('bip39_list_download', parameters);
      }
    });
  };

  const loadAnalytics = () => {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    analyticsAllowed = true;
    window.gtag('consent', 'update', {analytics_storage: 'granted'});
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    script.dataset.satonaAnalytics = '';
    document.head.append(script);
    trackCurrentPage();
  };

  const hideBanner = () => {
    if (banner) banner.hidden = true;
  };

  const applyChoice = choice => {
    saveChoice(choice);
    if (choice === 'accepted') {
      loadAnalytics();
    } else {
      analyticsAllowed = false;
      window.gtag('consent', 'update', {analytics_storage: 'denied'});
    }
    hideBanner();
  };

  const createBanner = () => {
    banner = document.createElement('section');
    banner.className = 'analytics-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-label', text.label);
    banner.innerHTML = `
      <div class="analytics-consent__inner">
        <p>${text.message}</p>
        <div class="analytics-consent__actions">
          <button type="button" data-analytics-choice="accepted">${text.accept}</button>
          <button type="button" data-analytics-choice="declined">${text.decline}</button>
        </div>
      </div>`;
    banner.addEventListener('click', event => {
      const button = event.target.closest('[data-analytics-choice]');
      if (button) applyChoice(button.dataset.analyticsChoice);
    });
    document.body.append(banner);
  };

  const createPreferencesButton = () => {
    const footer = document.querySelector('.footer-inner');
    if (!footer) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'analytics-preferences';
    button.textContent = text.preferences;
    button.addEventListener('click', () => {
      banner.hidden = false;
      banner.querySelector('button').focus();
    });
    footer.append(button);
  };

  const initialise = () => {
    trackClicks();
    createBanner();
    createPreferencesButton();
    const choice = readChoice();
    if (choice === 'accepted') loadAnalytics();
    if (choice) hideBanner();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, {once: true});
  } else {
    initialise();
  }
})();
