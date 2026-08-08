(() => {
  const lookup = (value) => /\s/.test(String(value).trim()) ? { error: 'unknown' } : window.SatonaBip39.lookup(value);
  document.querySelectorAll('[data-guide-converter]').forEach((form) => {
    const output = form.querySelector('[data-converter-output]');
    const render = () => { const found = lookup(form.elements.word.value); output.textContent = found.error ? form.dataset.unknown : found.bits; output.classList.toggle('is-error', Boolean(found.error)); };
    form.addEventListener('submit', (event) => { event.preventDefault(); render(); });
    form.elements.word.addEventListener('input', () => { if (!form.elements.word.value) { output.textContent = '───────────'; output.classList.remove('is-error'); } });
  });
  document.querySelectorAll('[data-marking-tool]').forEach((root) => {
    const form = root.querySelector('[data-marking-form]');
    const target = root.querySelector('[data-marking-svg]');
    const message = root.querySelector('[data-marking-message]');
    let points = {};
    fetch(root.dataset.svg).then((response) => { if (!response.ok) throw new Error(); return response.text(); }).then((markup) => {
      target.innerHTML = markup;
      target.querySelectorAll("[id^='w']").forEach((point) => { if (/^w(?:[1-9]|1\d|2[0-4])-b(?:[1-9]|1[01])$/.test(point.id)) points[point.id] = point; });
      window.SatonaPlate.resetPoints(points);
    }).catch(() => { message.textContent = root.dataset.loadError; message.classList.add('is-error'); });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const position = Number(form.elements.position.value); const found = lookup(form.elements.word.value);
      if (!Number.isInteger(position) || position < 1 || position > 24 || found.error) { message.textContent = form.dataset.unknown; message.classList.add('is-error'); return; }
      if (Object.keys(points).length !== 264) { message.textContent = root.dataset.loadError; message.classList.add('is-error'); return; }
      window.SatonaPlate.applySingleRow(points, position, found.bits); message.textContent = `${position} · ${found.word} · ${found.bits}`; message.classList.remove('is-error');
    });
    root.querySelector('[data-reset-marking]').addEventListener('click', () => { window.SatonaPlate.resetPoints(points); form.reset(); message.textContent = root.dataset.reset; message.classList.remove('is-error'); });
  });
})();
