(() => {
  const IMAGE_DURATION = 5000;
  const FADE_DURATION = 1600;
  const visibilityThreshold = 0.4;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('[data-home-media-cycle]').forEach((container) => {
    const video = container.querySelector('video');
    let timer;
    let hasStarted = false;
    let cycleId = 0;
    let loadedDataHandler;
    let playingHandler;

    if (!video) return;

    // Chrome evaluates autoplay against the live properties, not only attributes.
    // Set every required property before any call to play().
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const clearTimer = () => {
      window.clearTimeout(timer);
      timer = undefined;
    };

    const removePendingListeners = () => {
      if (loadedDataHandler) video.removeEventListener('loadeddata', loadedDataHandler);
      if (playingHandler) video.removeEventListener('playing', playingHandler);
      loadedDataHandler = undefined;
      playingHandler = undefined;
    };

    const showImage = (immediate = false) => {
      if (immediate) container.classList.add('is-resetting');
      container.classList.remove('is-image-animating');
      container.classList.remove('is-video-visible');
      if (immediate) {
        // Force the reset state to render before transitions are enabled again.
        void container.offsetWidth;
        container.classList.remove('is-resetting');
      }
    };

    const scheduleVideo = () => {
      const id = cycleId;
      clearTimer();
      if (!reduceMotion.matches) container.classList.add('is-image-animating');
      timer = window.setTimeout(() => prepareVideo(id), IMAGE_DURATION);
    };

    const revealPlayingVideo = (id) => {
      if (id !== cycleId || video.paused) return;
      removePendingListeners();
      container.classList.add('is-video-visible');
    };

    const attemptPlay = async (id) => {
      if (id !== cycleId) return;

      removePendingListeners();
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.currentTime = 0;

      // The promise normally confirms playback in Chrome. The playing listener
      // also covers engines that resolve play() just before frames start advancing.
      playingHandler = () => revealPlayingVideo(id);
      video.addEventListener('playing', playingHandler, { once: true });

      try {
        await video.play();
        revealPlayingVideo(id);
      } catch (error) {
        if (id !== cycleId) return;
        removePendingListeners();
        console.warn('Homepage video autoplay failed:', error);
        // Never hide the product image when autoplay is unavailable.
        showImage();
        scheduleVideo();
      }
    };

    function prepareVideo(id) {
      if (id !== cycleId) return;

      // loadeddata may already have fired in Chrome, so inspect readyState first.
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        attemptPlay(id);
        return;
      }

      loadedDataHandler = () => {
        loadedDataHandler = undefined;
        attemptPlay(id);
      };
      video.addEventListener('loadeddata', loadedDataHandler, { once: true });
    }

    video.addEventListener('ended', () => {
      if (!hasStarted) return;
      showImage();
      timer = window.setTimeout(scheduleVideo, FADE_DURATION);
    });

    const reset = (startAgain) => {
      cycleId += 1;
      clearTimer();
      removePendingListeners();
      video.pause();
      video.currentTime = 0;
      showImage(true);
      if (startAgain) scheduleVideo();
    };

    const startCycle = () => scheduleVideo();

    const observer = new IntersectionObserver(([entry]) => {
      const isVisible = entry.isIntersecting && entry.intersectionRatio >= visibilityThreshold;
      if (hasStarted || !isVisible) return;
      hasStarted = true;
      observer.unobserve(container);
      startCycle();
    }, { threshold: [0, visibilityThreshold] });

    observer.observe(container);
    reduceMotion.addEventListener('change', () => reset(hasStarted));
    reset(false);
  });
})();
