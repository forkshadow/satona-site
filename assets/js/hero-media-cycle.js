(() => {
  const IMAGE_DURATION = 5000;
  const FADE_DURATION = 1600;
  const VISIBILITY_THRESHOLD = 0.25;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('[data-home-media-cycle]').forEach((container) => {
    const video = container.querySelector('video');
    let timer;
    let visible = false;
    let state = 'image';
    let cycleId = 0;
    let canPlayHandler;
    let playingHandler;

    if (!video) return;

    // Chrome evaluates autoplay against the live properties, not only attributes.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const clearTimer = () => {
      window.clearTimeout(timer);
      timer = undefined;
    };

    const removePendingListeners = () => {
      if (canPlayHandler) video.removeEventListener('canplay', canPlayHandler);
      if (playingHandler) video.removeEventListener('playing', playingHandler);
      canPlayHandler = undefined;
      playingHandler = undefined;
    };

    const animateImage = () => {
      container.classList.add('is-resetting');
      container.classList.remove('is-video-visible', 'is-image-animating');
      void container.offsetWidth;
      container.classList.remove('is-resetting');
      if (!reduceMotion.matches) container.classList.add('is-image-animating');
    };

    const scheduleVideo = (id) => {
      clearTimer();
      timer = window.setTimeout(() => prepareVideo(id), IMAGE_DURATION);
    };

    const showPlayingVideo = (id) => {
      if (id !== cycleId || !visible || state !== 'preparingVideo') return;
      if (video.paused) return;
      removePendingListeners();
      state = 'video';
      container.classList.add('is-video-visible');
    };

    const startVideo = (id) => {
      if (id !== cycleId || !visible || state !== 'preparingVideo') return;

      playingHandler = () => showPlayingVideo(id);
      video.addEventListener('playing', playingHandler, { once: true });
      video.currentTime = 0;
      const playPromise = video.play();

      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => showPlayingVideo(id))
          .catch((error) => {
            if (id !== cycleId) return;
            removePendingListeners();
            state = 'image';
            console.warn('Homepage autoplay blocked:', error);
            scheduleVideo(id);
          });
      }
    };

    function prepareVideo(id) {
      if (id !== cycleId || !visible || reduceMotion.matches || state !== 'image') return;
      state = 'preparingVideo';

      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        startVideo(id);
      } else {
        canPlayHandler = () => {
          canPlayHandler = undefined;
          startVideo(id);
        };
        video.addEventListener('canplay', canPlayHandler, { once: true });
        video.load();
      }
    }

    const reset = (startAgain) => {
      cycleId += 1;
      clearTimer();
      removePendingListeners();
      video.pause();
      video.currentTime = 0;
      state = 'image';
      animateImage();
      if (startAgain && !reduceMotion.matches) scheduleVideo(cycleId);
    };

    video.addEventListener('ended', () => {
      if (!visible || reduceMotion.matches || state !== 'video') return;
      const id = cycleId;
      state = 'returningToImage';
      container.classList.remove('is-video-visible');
      clearTimer();
      timer = window.setTimeout(() => {
        if (id !== cycleId || !visible || state !== 'returningToImage') return;
        state = 'image';
        animateImage();
        scheduleVideo(id);
      }, FADE_DURATION);
    });

    const observer = new IntersectionObserver(([entry]) => {
      const isVisible = entry.isIntersecting && entry.intersectionRatio >= VISIBILITY_THRESHOLD;
      if (isVisible === visible) return;
      visible = isVisible;
      reset(visible);
    }, { threshold: [0, VISIBILITY_THRESHOLD] });

    observer.observe(container);
    reduceMotion.addEventListener('change', () => reset(visible));
    reset(false);
  });
})();
