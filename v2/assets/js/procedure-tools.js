(() => {
  const converter = document.querySelector('[data-procedure-converter]');
  const dialog = document.querySelector('[data-marking-dialog]');
  if (!converter || !dialog || !window.SatonaBip39 || !window.SatonaPlate) return;

  const convertWord = (value) => {
    if (/\s/.test(String(value).trim())) return { error: 'unknown' };
    return window.SatonaBip39.lookup(value);
  };
  const showLookup = (form, output) => {
    const found = convertWord(new FormData(form).get('word'));
    output.classList.toggle('is-error', Boolean(found.error));
    output.textContent = found.error ? form.dataset.unknown : found.bits;
    return found;
  };

  const converterOutput = converter.querySelector('[data-converter-output]');
  converter.addEventListener('submit', (event) => {
    event.preventDefault();
    showLookup(converter, converterOutput);
  });
  converter.elements.word.addEventListener('input', () => {
    const value = converter.elements.word.value;
    if (!value) {
      converterOutput.textContent = '───────────';
      converterOutput.classList.remove('is-error');
    } else if (!/\s/.test(value.trim())) showLookup(converter, converterOutput);
    else {
      converterOutput.textContent = converter.dataset.unknown;
      converterOutput.classList.add('is-error');
    }
  });

  const openButton = document.querySelector('[data-marking-open]');
  const closeButton = dialog.querySelector('[data-marking-close]');
  const form = dialog.querySelector('[data-marking-form]');
  const message = dialog.querySelector('[data-marking-message]');
  const svgTarget = dialog.querySelector('[data-marking-svg]');
  let points = {};
  let returnFocus = null;

  fetch(dialog.dataset.svg)
    .then((response) => {
      if (!response.ok) throw new Error('SVG unavailable');
      return response.text();
    })
    .then((markup) => {
      svgTarget.innerHTML = markup;
      svgTarget.querySelectorAll("[id^='w']").forEach((point) => {
        if (/^w(?:[1-9]|1\d|2[0-4])-b(?:[1-9]|1[01])$/.test(point.id)) points[point.id] = point;
      });
      window.SatonaPlate.resetPoints(points);
    })
    .catch(() => { message.textContent = dialog.dataset.loadError; });

  openButton.addEventListener('click', () => {
    returnFocus = document.activeElement;
    dialog.showModal();
    document.body.classList.add('marking-dialog-open');
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('marking-dialog-open');
    if (returnFocus) returnFocus.focus();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const position = Number(form.elements.position.value);
    const found = convertWord(form.elements.word.value);
    if (!Number.isInteger(position) || position < 1 || position > 24 || found.error) {
      message.textContent = form.dataset.unknown;
      message.classList.add('is-error');
      return;
    }
    if (Object.keys(points).length !== 264) {
      message.textContent = dialog.dataset.loadError;
      message.classList.add('is-error');
      return;
    }
    window.SatonaPlate.applySingleRow(points, position, found.bits);
    message.textContent = `${position} · ${found.word} · ${found.bits}`;
    message.classList.remove('is-error');
  });
})();
