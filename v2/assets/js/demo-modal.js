(() => {
  const dialog = document.querySelector('[data-demo-dialog]');
  const triggers = document.querySelectorAll('[data-demo-trigger]');
  if (!dialog || !triggers.length || typeof dialog.showModal !== 'function') return;

  const closeButton = dialog.querySelector('[data-demo-close]');
  const video = dialog.querySelector('video');
  if (!closeButton || !video) return;

  let returnFocus = null;

  const resetVideo = () => {
    video.pause();
    video.currentTime = 0;
  };

  const openDialog = event => {
    returnFocus = event.currentTarget;
    document.body.classList.add('demo-dialog-open');
    dialog.showModal();
    closeButton.focus();
  };

  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  triggers.forEach(trigger => trigger.addEventListener('click', openDialog));
  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener('close', () => {
    resetVideo();
    document.body.classList.remove('demo-dialog-open');
    if (returnFocus instanceof HTMLElement) returnFocus.focus();
  });
})();
