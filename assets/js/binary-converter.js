(() => {
  const initialize = () => {
    const tool = document.querySelector('[data-binary-converter]');
    if (!tool) return;

    const positionInput = tool.querySelector('[data-position-input]');
    const binaryOutput = tool.querySelector('[data-binary-output]');
    const binaryInput = tool.querySelector('[data-binary-input]');
    const positionOutput = tool.querySelector('[data-position-output]');
    const message = tool.querySelector('[data-converter-message]');
    const invalidPosition = tool.dataset.invalidPosition;
    const invalidBinary = tool.dataset.invalidBinary;

    const showMessage = (text = '') => {
      message.textContent = text;
      message.classList.toggle('is-error', Boolean(text));
    };
    const positionToBinary = () => {
      const raw = positionInput.value.trim();
      if (!/^\d+$/.test(raw) || Number(raw) > 2047) {
        binaryOutput.value = '';
        showMessage(invalidPosition);
        return;
      }
      binaryOutput.value = Number(raw).toString(2).padStart(11, '0');
      showMessage();
    };
    const binaryToPosition = () => {
      const raw = binaryInput.value.trim();
      if (!/^[01]{11}$/.test(raw)) {
        positionOutput.value = '';
        showMessage(invalidBinary);
        return;
      }
      positionOutput.value = String(parseInt(raw, 2));
      showMessage();
    };

    positionInput.addEventListener('input', positionToBinary);
    binaryInput.addEventListener('input', binaryToPosition);
    positionToBinary();
    binaryToPosition();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
