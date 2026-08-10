(() => {
  const IMAGE_DURATION = 3000;
  const FADE_DURATION = 1000;
  const visibilityThreshold = 0.4;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('[data-home-media-cycle]').forEach((container) => {
    const video = container.querySelector('video');
    let timer;
    let visible = false;

    if (!video) return;

    const clearTimer = () => {
      window.clearTimeout(timer);
      timer = undefined;
    };

    const showImage = (immediate = false) => {
      if (immediate) container.classList.add('is-resetting');
      container.classList.remove('is-video-visible');
      if (immediate) {
        // Force the reset state to render before transitions are enabled again.
        void container.offsetWidth;
        container.classList.remove('is-resetting');
      }
    };

    const scheduleVideo = () => {
      clearTimer();
      timer = window.setTimeout(playVideo, IMAGE_DURATION);
    };

    const playVideo = async () => {
      if (!visible || reduceMotion.matches) return;

      video.currentTime = 0;
      try {
        await video.play();
      } catch (_error) {
        // Keep the product image visible when playback is not available.
        scheduleVideo();
        return;
      }

      if (!visible) {
        video.pause();
        return;
      }
      container.classList.add('is-video-visible');
    };

    video.addEventListener('ended', () => {
      if (!visible || reduceMotion.matches) return;
      showImage();
      timer = window.setTimeout(scheduleVideo, FADE_DURATION);
    });

    const reset = (startAgain) => {
      clearTimer();
      video.pause();
      video.currentTime = 0;
      showImage(true);
      if (startAgain && !reduceMotion.matches) scheduleVideo();
    };

    const observer = new IntersectionObserver(([entry]) => {
      const isVisible = entry.isIntersecting && entry.intersectionRatio >= visibilityThreshold;
      if (isVisible === visible) return;
      visible = isVisible;
      reset(visible);
    }, { threshold: [0, visibilityThreshold] });

    observer.observe(container);
    reduceMotion.addEventListener('change', () => reset(visible));
    reset(false);
  });
})();
