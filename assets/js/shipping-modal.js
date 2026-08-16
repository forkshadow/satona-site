(() => {
  const triggers = [...document.querySelectorAll('[data-shipping-trigger]')];
  if (!triggers.length || typeof HTMLDialogElement === 'undefined') return;

  const copy = {
    en: {
      title: 'Where should we deliver your SATONA kit?',
      subtitle: 'Choose your delivery area before continuing to secure payment.',
      close: 'Close delivery selection',
      france: 'FRANCE', free: 'Free shipping', kit: 'SATONA kit', price: '€49.90',
      franceAction: 'Order in France', europe: 'EUROPE', shipping: 'Shipping', shippingPrice: '€12.90',
      europeAction: 'Order in Europe', note: 'Your delivery country and address will be confirmed during secure Stripe checkout.'
    },
    fr: {
      title: 'Où souhaitez-vous être livré ?',
      subtitle: 'Choisissez votre zone de livraison avant de poursuivre vers le paiement sécurisé.',
      close: 'Fermer le choix de livraison',
      france: 'FRANCE', free: 'Livraison offerte', kit: 'Kit SATONA', price: '49,90 €',
      franceAction: 'Commander en France', europe: 'EUROPE', shipping: 'Livraison', shippingPrice: '12,90 €',
      europeAction: 'Commander en Europe', note: 'Votre pays et votre adresse de livraison seront confirmés lors du paiement sécurisé Stripe.'
    },
    de: {
      title: 'Wohin soll Ihr SATONA-Kit geliefert werden?',
      subtitle: 'Wählen Sie Ihre Lieferregion, bevor Sie zur sicheren Zahlung weitergehen.',
      close: 'Lieferauswahl schließen',
      france: 'FRANKREICH', free: 'Kostenloser Versand', kit: 'SATONA-Kit', price: '49,90 €',
      franceAction: 'In Frankreich bestellen', europe: 'EUROPA', shipping: 'Versand', shippingPrice: '12,90 €',
      europeAction: 'In Europa bestellen', note: 'Lieferland und Lieferadresse werden beim sicheren Stripe-Checkout bestätigt.'
    },
    it: {
      title: 'Dove desideri ricevere il tuo kit SATONA?',
      subtitle: 'Scegli la zona di consegna prima di procedere al pagamento sicuro.',
      close: 'Chiudi la selezione della consegna',
      france: 'FRANCIA', free: 'Spedizione gratuita', kit: 'Kit SATONA', price: '49,90 €',
      franceAction: 'Ordina in Francia', europe: 'EUROPA', shipping: 'Spedizione', shippingPrice: '12,90 €',
      europeAction: 'Ordina in Europa', note: 'Il paese e l’indirizzo di consegna saranno confermati durante il pagamento sicuro con Stripe.'
    },
    es: {
      title: '¿Dónde quieres recibir tu kit SATONA?',
      subtitle: 'Elige la zona de entrega antes de continuar con el pago seguro.',
      close: 'Cerrar la selección de entrega',
      france: 'FRANCIA', free: 'Envío gratuito', kit: 'Kit SATONA', price: '49,90 €',
      franceAction: 'Comprar en Francia', europe: 'EUROPA', shipping: 'Envío', shippingPrice: '12,90 €',
      europeAction: 'Comprar en Europa', note: 'El país y la dirección de entrega se confirmarán durante el pago seguro con Stripe.'
    }
  };
  const language = document.documentElement.lang.split('-')[0];
  const text = copy[language] || copy.en;
  const dialog = document.createElement('dialog');
  dialog.id = 'shipping-selection';
  dialog.className = 'shipping-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'shipping-dialog-title');
  dialog.innerHTML = `
    <div class="shipping-dialog__inner">
      <button class="shipping-dialog__close" type="button" data-shipping-close aria-label="${text.close}">×</button>
      <header class="shipping-dialog__header">
        <h2 id="shipping-dialog-title">${text.title}</h2>
        <p>${text.subtitle}</p>
      </header>
      <div class="shipping-dialog__options">
        <article class="shipping-option">
          <h3>${text.france}</h3><p class="shipping-option__badge">${text.free}</p>
          <dl><div><dt>${text.kit}</dt><dd>${text.price}</dd></div><div aria-hidden="true"><dt>&nbsp;</dt><dd>&nbsp;</dd></div></dl>
          <a class="button button--gold" href="https://buy.stripe.com/5kQaEX87h0m063F4dL0oM01">${text.franceAction}</a>
        </article>
        <article class="shipping-option">
          <h3>${text.europe}</h3><p class="shipping-option__badge">${text.shippingPrice} ${text.shipping}</p>
          <dl><div><dt>${text.kit}</dt><dd>${text.price}</dd></div><div><dt>${text.shipping}</dt><dd>${text.shippingPrice}</dd></div></dl>
          <a class="button button--gold" href="https://buy.stripe.com/fZuaEX5Z9b0EbnZaC90oM02">${text.europeAction}</a>
        </article>
      </div>
      <p class="shipping-dialog__note">${text.note}</p>
    </div>`;
  document.body.append(dialog);

  let opener = null;
  triggers.forEach(trigger => trigger.addEventListener('click', event => {
    event.preventDefault();
    opener = trigger;
    document.body.classList.add('shipping-dialog-open');
    dialog.showModal();
    dialog.querySelector('[data-shipping-close]').focus();
  }));
  dialog.querySelector('[data-shipping-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('shipping-dialog-open');
    if (opener) opener.focus();
  });
})();
