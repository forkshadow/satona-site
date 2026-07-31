(() => {
  const dialog = document.querySelector('[data-bip39-dialog]');
  const trigger = document.querySelector('[data-bip39-trigger]');
  if (!dialog || !trigger) return;

  const closeButton = dialog.querySelector('[data-bip39-close]');

  trigger.addEventListener('click', () => dialog.showModal());
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
})();
