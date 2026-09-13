(() => {
  const header = document.querySelector('.site-header');
  const button = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (!button || !menu) return;

  const pageLanguage = document.documentElement.lang || 'en';
  const closeLabels = {de:'Menü schließen',en:'Close menu',es:'Cerrar menú',fr:'Fermer le menu',it:'Chiudi menu'};
  const closeLabel = closeLabels[pageLanguage] || closeLabels.en;
  const openLabel = button.getAttribute('aria-label') || 'Menu';
  const focusableSelector = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';
  let scrollPosition = 0;

  const backdrop = document.createElement('button');
  backdrop.className = 'mobile-menu-backdrop';
  backdrop.type = 'button';
  backdrop.tabIndex = -1;
  backdrop.setAttribute('aria-label', closeLabel);
  backdrop.setAttribute('aria-hidden', 'true');
  menu.before(backdrop);

  const drawerHeader = document.createElement('div');
  drawerHeader.className = 'mobile-menu__header';
  const brand = header?.querySelector('.brand')?.cloneNode(true);
  const shop = header?.querySelector('.mobile-shop-link')?.cloneNode(true);
  const closeButton = document.createElement('button');
  closeButton.className = 'mobile-menu__close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', closeLabel);
  closeButton.innerHTML = '<span aria-hidden="true">×</span>';
  if (brand) drawerHeader.append(brand);
  if (shop) drawerHeader.append(shop);
  drawerHeader.append(closeButton);
  menu.prepend(drawerHeader);

  const primaryNavigation = menu.querySelector('nav:not(.language-menu)');
  if (primaryNavigation && !primaryNavigation.querySelector('.nav-academy')) {
    const academy = document.createElement('a');
    academy.className = 'nav-academy';
    academy.href = pageLanguage === 'en' ? '/academy/' : `/${pageLanguage}/academy/`;
    academy.textContent = 'SATONA ACADEMY';
    primaryNavigation.append(academy);
  }

  menu.setAttribute('role', 'dialog');
  menu.setAttribute('aria-modal', 'true');
  menu.setAttribute('aria-hidden', 'true');

  const setPageInert = (inert) => {
    document.querySelectorAll('body > :not([data-mobile-menu]):not(.mobile-menu-backdrop)').forEach((element) => {
      if (element !== header) element.inert = inert;
    });
  };

  const open = () => {
    scrollPosition = window.scrollY;
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', closeLabel);
    menu.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
    menu.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.body.classList.add('menu-open');
    document.body.style.setProperty('--menu-scroll-position', `-${scrollPosition}px`);
    setPageInert(true);
    closeButton.focus();
  };

  const close = ({restoreFocus = true} = {}) => {
    if (button.getAttribute('aria-expanded') !== 'true') return;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', openLabel);
    menu.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    menu.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    document.body.style.removeProperty('--menu-scroll-position');
    setPageInert(false);
    window.scrollTo(0, scrollPosition);
    if (restoreFocus) button.focus();
  };

  button.addEventListener('click', () => button.getAttribute('aria-expanded') === 'true' ? close() : open());
  closeButton.addEventListener('click', () => close());
  backdrop.addEventListener('click', () => close());
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) close({restoreFocus:false});
  });
  document.addEventListener('keydown', (event) => {
    if (button.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...menu.querySelectorAll(focusableSelector)].filter((element) => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 900px)').matches) close({restoreFocus:false});
  });
  window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', scrollY > 8), {passive:true});
})();
