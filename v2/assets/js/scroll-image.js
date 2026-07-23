(() => {
  const components = document.querySelectorAll('[data-scroll-image]');
  if (!components.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let framePending = false;

  const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

  const updateComponent = (section) => {
    const frame = section.querySelector('[data-scroll-image-frame]');
    const image = section.querySelector('[data-scroll-image-content]');
    if (!frame || !image || reducedMotion.matches || !image.naturalWidth) return;

    const frameHeight = frame.clientHeight;
    const imageHeight = image.offsetHeight;
    const maxOffset = Math.max(0, imageHeight - frameHeight);
    const stickyTop = parseFloat(window.getComputedStyle(frame.parentElement).top) || 0;
    const scrollDistance = Math.max(1, Math.ceil(maxOffset + stickyTop));
    const sectionHeight = Math.ceil(frameHeight + scrollDistance);

    section.style.setProperty('--scroll-image-section-height', `${sectionHeight}px`);
    section.classList.add('is-scroll-image-ready');

    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const scrollRange = Math.max(1, section.offsetHeight - frame.offsetHeight);
    const scrollStart = sectionTop - stickyTop;
    const progress = clamp((window.scrollY - scrollStart) / scrollRange, 0, 1);
    image.style.transform = `translateY(${-maxOffset * progress}px)`;
  };

  const update = () => {
    framePending = false;
    components.forEach(updateComponent);
  };

  const requestUpdate = () => {
    if (!framePending) {
      framePending = true;
      window.requestAnimationFrame(update);
    }
  };

  const resetComponent = (section) => {
    const image = section.querySelector('[data-scroll-image-content]');
    section.classList.remove('is-scroll-image-ready');
    section.style.removeProperty('--scroll-image-section-height');
    if (image) image.style.removeProperty('transform');
  };

  const handleMotionPreference = () => {
    if (reducedMotion.matches) {
      components.forEach(resetComponent);
      return;
    }
    requestUpdate();
  };

  components.forEach((section) => {
    const image = section.querySelector('[data-scroll-image-content]');
    if (!image) return;
    if (image.complete) requestUpdate();
    else image.addEventListener('load', requestUpdate, { once: true });
  });

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('orientationchange', requestUpdate);
  reducedMotion.addEventListener('change', handleMotionPreference);
  handleMotionPreference();
})();
