(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sections = Array.from(document.querySelectorAll('[data-workflow-scroll]'));

  sections.forEach((section) => {
    const frame = section.querySelector('[data-workflow-frame]');
    const image = section.querySelector('[data-workflow-image]');
    let maxDistance = 0;
    let stickyTop = 0;
    let frameHeight = 0;
    let ticking = false;

    const updateImagePosition = () => {
      ticking = false;
      if (!section.classList.contains('is-scroll-active')) return;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const progress = Math.min(1, Math.max(0, (window.scrollY - (sectionTop - stickyTop)) / maxDistance));
      image.style.transform = `translate3d(0, ${-maxDistance * progress}px, 0)`;
    };

    const requestPositionUpdate = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateImagePosition);
      }
    };

    const recalculate = () => {
      section.classList.remove('is-scroll-active');
      section.style.height = '';
      image.style.transform = 'translate3d(0, 0, 0)';

      if (reducedMotion.matches || !image.complete || !image.naturalWidth) return;

      frameHeight = frame.clientHeight;
      const displayedImageHeight = image.getBoundingClientRect().width * image.naturalHeight / image.naturalWidth;
      maxDistance = Math.max(0, displayedImageHeight - frameHeight);
      stickyTop = parseFloat(window.getComputedStyle(frame).top) || 0;

      if (!maxDistance) return;

      section.style.height = `${frameHeight + maxDistance}px`;
      section.classList.add('is-scroll-active');
      requestPositionUpdate();
    };

    image.addEventListener('load', recalculate);
    window.addEventListener('resize', recalculate);
    window.addEventListener('orientationchange', recalculate);
    reducedMotion.addEventListener('change', recalculate);
    window.addEventListener('scroll', requestPositionUpdate, { passive: true });

    recalculate();
  });
})();
