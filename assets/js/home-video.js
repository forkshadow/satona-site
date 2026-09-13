(() => {
  const visibilityThreshold = 0.4;

  document.querySelectorAll('[data-home-video]').forEach((container) => {
    const video = container.querySelector('video');
    const playButton = container.querySelector('[data-home-video-play]');
    let playPending = false;
    let hasStarted = false;

    if (!video || !playButton) return;

    // These live properties are required by Safari and Chromium autoplay checks.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const observer = new IntersectionObserver(([entry]) => {
      if (
        hasStarted ||
        playPending ||
        !entry.isIntersecting ||
        entry.intersectionRatio < visibilityThreshold
      ) return;

      startPlayback();
    }, { threshold: [0, visibilityThreshold] });

    const confirmPlayback = () => {
      hasStarted = true;
      playPending = false;
      playButton.hidden = true;
      observer.disconnect();
    };

    const startPlayback = async () => {
      if (hasStarted || playPending) return;
      playPending = true;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      try {
        await video.play();
        confirmPlayback();
      } catch (error) {
        playPending = false;
        playButton.hidden = false;
        console.warn('Homepage video autoplay failed:', error);
      }
    };

    video.addEventListener('playing', confirmPlayback, { once: true });
    playButton.addEventListener('click', startPlayback);
    observer.observe(container);
  });
})();
