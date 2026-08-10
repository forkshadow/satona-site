(() => {
  const initializeConceptModals = () => {
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
      },
      {
        dialogSelector: '[data-schema-dialog]',
        triggerSelector: '[data-schema-trigger]',
        closeSelector: '[data-schema-close]'
      }
    ];

    modalDefinitions.forEach(({ dialogSelector, triggerSelector, closeSelector }) => {
      const dialog = document.querySelector(dialogSelector);
      const trigger = document.querySelector(triggerSelector);
      const closeButton = dialog?.querySelector(closeSelector);
      if (!dialog || !trigger || !closeButton) return;

      trigger.addEventListener('click', () => dialog.showModal());
      closeButton.addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeConceptModals, { once: true });
  } else {
    initializeConceptModals();
  }
})();
