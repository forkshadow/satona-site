(() => {
  const form = document.querySelector('[data-bip39-form]');
  if (!form) return;

  const input = form.querySelector('input');
  const result = document.querySelector('[data-bip39-result]');
  const bits = result.querySelector('[data-bit-grid]');
  const error = document.querySelector('[data-bip39-error]');
  const messages = JSON.parse(form.dataset.messages);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const normalized = input.value.trim().toLowerCase();
    error.textContent = '';

    if (/\s/.test(normalized)) {
      error.textContent = messages.multiple;
      result.hidden = true;
      bits.replaceChildren();
      return;
    }

    const found = window.SatonaBip39.lookup(input.value);
    if (found.error || typeof found.bits !== 'string' || found.bits.length !== 11) {
      error.textContent = messages[found.error] || messages.unknown;
      result.hidden = true;
      bits.replaceChildren();
      return;
    }

    input.value = found.word;
    result.querySelector('[data-word-value]').textContent = found.word;
    result.querySelector('[data-index-value]').textContent = found.index;
    result.querySelector('[data-binary-value]').textContent = found.bits;
    bits.replaceChildren(...[...found.bits].map((bit, index) => {
      const node = document.createElement('span');
      node.className = `bit ${bit === '1' ? 'is-punched' : ''}`;
      node.textContent = bit;
      node.setAttribute('aria-label', `${messages.bit} ${index + 1}: ${bit === '1' ? messages.punch : messages.leaveEmpty}`);
      return node;
    }));
    result.hidden = false;
  });
})();
