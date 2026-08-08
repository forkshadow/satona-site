(() => {
  const initializeAssemblyModal = () => {
    const dialog = document.querySelector('[data-assembly-dialog]');
    const trigger = document.querySelector('[data-assembly-trigger]');
    if (!dialog || !trigger || typeof dialog.showModal !== 'function') return;

    let returnFocus = trigger;

    const openDialog = () => {
      returnFocus = document.activeElement;
      document.body.classList.add('assembly-dialog-open');
      dialog.showModal();
    };

    const closeDialog = () => {
      if (dialog.open) dialog.close();
    };

    trigger.addEventListener('click', openDialog);
    dialog.querySelectorAll('[data-assembly-close]').forEach(button => {
      button.addEventListener('click', closeDialog);
    });
    dialog.addEventListener('click', event => {
      const bounds = dialog.getBoundingClientRect();
      const isBackdrop = event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom;
      if (isBackdrop) closeDialog();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('assembly-dialog-open');
      if (returnFocus instanceof HTMLElement) returnFocus.focus();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAssemblyModal, { once: true });
  } else {
    initializeAssemblyModal();
  }
})();
