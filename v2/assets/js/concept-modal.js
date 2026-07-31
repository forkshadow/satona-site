(() => {
  const modalDefinitions = [
    {
      dialogSelector: '[data-bip39-dialog]',
      triggerSelector: '[data-bip39-trigger]',
      closeSelector: '[data-bip39-close]'
    },
    {
      dialogSelector: '[data-bits-dialog]',
      triggerSelector: '[data-bits-trigger]',
      closeSelector: '[data-bits-close]'
    }
  ];

  modalDefinitions.forEach(({ dialogSelector, triggerSelector, closeSelector }) => {
    const dialog = document.querySelector(dialogSelector);
    const trigger = document.querySelector(triggerSelector);
    if (!dialog || !trigger) return;

    const closeButton = dialog.querySelector(closeSelector);

    trigger.addEventListener('click', () => dialog.showModal());
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
  });
})();
