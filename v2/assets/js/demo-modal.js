(() => {
  const dialog = document.querySelector('[data-demo-dialog]');
  const trigger = document.querySelector('[data-demo-trigger]');
  if (!dialog || !trigger) return;

  const closeButton = dialog.querySelector('[data-demo-close]');
  const video = dialog.querySelector('video');
  const message = dialog.querySelector('[data-demo-message]');

  const resetVideo = () => {
    video.pause();
    video.currentTime = 0;
  };

  trigger.addEventListener('click', () => dialog.showModal());
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', resetVideo);
  video.addEventListener('error', () => {
    resetVideo();
    video.hidden = true;
    message.hidden = false;
  });
})();
