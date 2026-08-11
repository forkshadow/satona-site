(() => {
  const MEASUREMENT_ID = 'G-QLDNGMDCXC';
  const STORAGE_KEY = 'satona-analytics-consent';
  const language = ['fr', 'de'].includes(document.documentElement.lang.split('-')[0])
    ? document.documentElement.lang.split('-')[0]
    : 'en';
  const copy = {
    en: {
      title: 'Audience measurement',
      text: 'We use Google Analytics to measure SATONA traffic and improve the website. You can accept or refuse this measurement.',
      accept: 'Accept',
      decline: 'Decline'
    },
    fr: {
      title: 'Mesure d’audience',
      text: 'Nous utilisons Google Analytics pour mesurer de façon anonyme la fréquentation de SATONA et améliorer le site. Vous pouvez accepter ou refuser cette mesure.',
      accept: 'Accepter',
      decline: 'Refuser'
    },
    de: {
      title: 'Reichweitenmessung',
      text: 'Wir verwenden Google Analytics, um die Nutzung von SATONA zu messen und die Website zu verbessern. Sie können dieser Messung zustimmen oder sie ablehnen.',
      accept: 'Akzeptieren',
      decline: 'Ablehnen'
    }
  };

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  let analyticsGranted = false;
  let analyticsLoaded = false;

  const readConsent = () => {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return value === 'granted' || value === 'denied' ? value : null;
    } catch (error) {
      return null;
    }
  };

  const loadAnalytics = () => {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.append(script);
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID);
  };

  const grantAnalytics = () => {
    analyticsGranted = true;
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    loadAnalytics();
  };

  const saveConsent = (value) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      // The choice still applies to the current page if storage is unavailable.
    }
    if (value === 'granted') grantAnalytics();
    else {
      analyticsGranted = false;
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
    document.querySelector('[data-analytics-consent]')?.remove();
  };

  const showBanner = () => {
    const text = copy[language];
    const banner = document.createElement('aside');
    banner.className = 'analytics-consent';
    banner.dataset.analyticsConsent = '';
    banner.setAttribute('aria-labelledby', 'analytics-consent-title');
    banner.innerHTML = `
      <div class="analytics-consent__copy">
        <h2 id="analytics-consent-title">${text.title}</h2>
        <p>${text.text}</p>
      </div>
      <div class="analytics-consent__actions">
        <button class="analytics-consent__accept" type="button" data-analytics-accept>${text.accept}</button>
        <button class="analytics-consent__decline" type="button" data-analytics-decline>${text.decline}</button>
      </div>`;
    banner.querySelector('[data-analytics-accept]').addEventListener('click', () => saveConsent('granted'));
    banner.querySelector('[data-analytics-decline]').addEventListener('click', () => saveConsent('denied'));
    document.body.append(banner);
  };

  const track = (eventName, parameters = {}) => {
    if (!analyticsGranted) return;
    window.gtag('event', eventName, {
      language,
      page_path: window.location.pathname,
      ...parameters
    });
  };

  document.addEventListener('click', (event) => {
    const target = event.target.closest('a, button');
    if (!target) return;
    const checkoutZone = target.dataset.checkoutZone;
    if (checkoutZone === 'france' || checkoutZone === 'europe') {
      const checkoutEvent = checkoutZone === 'france' ? 'checkout_france' : 'checkout_europe';
      track(checkoutEvent, { checkout_zone: checkoutZone });
    } else if (target.matches('[data-shipping-trigger]')) {
      track('buy_satona_click');
    } else if (target.matches('[data-binary-trigger]')) {
      track('binary_explanation_open');
    } else if (target.matches('[data-demo-trigger]')) {
      track('demo_open');
    } else if (target.matches('a[href*="bip39binary.pdf"]')) {
      track('bip39_pdf_download');
    }
  });

  const consent = readConsent();
  if (consent === 'granted') grantAnalytics();
  else if (!consent) showBanner();
})();
