(() => {
  const IMAGE_DURATION = 3000;
  const FADE_DURATION = 1000;
  const visibilityThreshold = 0.4;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('[data-home-media-cycle]').forEach((container) => {
    const video = container.querySelector('video');
    let timer;
    let visible = false;
    let waitingForVideo = false;

    if (!video) return;

    // Set both media properties before any playback attempt. The markup mirrors
    // these settings, but Chrome's autoplay policy evaluates the live element.
    video.muted = true;
    video.defaultMuted = true;

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

    const stopWaitingForVideo = () => {
      if (!waitingForVideo) return;
      video.removeEventListener('loadeddata', playVideo);
      video.removeEventListener('canplay', playVideo);
      waitingForVideo = false;
    };

    const waitForVideo = () => {
      if (waitingForVideo) return;
      waitingForVideo = true;
      video.addEventListener('loadeddata', playVideo);
      video.addEventListener('canplay', playVideo);
    };

    const playVideo = () => {
      if (!visible || reduceMotion.matches) return;

      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        waitForVideo();
        return;
      }

      stopWaitingForVideo();
      video.currentTime = 0;
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (!visible) {
            video.pause();
            return;
          }
          container.classList.add('is-video-visible');
        }).catch((error) => {
          console.warn('Homepage media autoplay blocked:', error);
          // Keep the product image visible when playback is not available.
          scheduleVideo();
        });
      } else if (visible) {
        container.classList.add('is-video-visible');
      }
    };

    video.addEventListener('ended', () => {
      if (!visible || reduceMotion.matches) return;
      showImage();
      timer = window.setTimeout(scheduleVideo, FADE_DURATION);
    });

    const reset = (startAgain) => {
      clearTimer();
      stopWaitingForVideo();
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
