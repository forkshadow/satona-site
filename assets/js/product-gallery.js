(() => {
  const carousel = document.querySelector('[data-product-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('[data-carousel-track]');
  const viewport = carousel.querySelector('[data-carousel-viewport]');
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const originals = [...track.querySelectorAll('[data-carousel-slide]')];
  const slideCount = originals.length;
  const autoplayDelay = 2000;
  let index = 2;
  let autoplay = null;
  let paused = false;

  const cloneSlide = (slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;
    return clone;
  };

  track.prepend(...originals.slice(-2).map(cloneSlide));
  track.append(...originals.slice(0, 2).map(cloneSlide));

  const moveTo = (nextIndex, animate = true) => {
    track.style.transition = animate ? 'transform 600ms ease' : 'none';
    index = nextIndex;
    track.style.transform = `translateX(-${index * 50}%)`;
  };

  const stopAutoplay = () => {
    paused = true;
    window.clearInterval(autoplay);
  };

  const startAutoplay = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || paused) return;
    autoplay = window.setInterval(() => moveTo(index + 1), autoplayDelay);
  };

  moveTo(index, false);
  requestAnimationFrame(() => { track.style.transition = 'transform 600ms ease'; });
  startAutoplay();

  track.addEventListener('transitionend', () => {
    if (index >= slideCount + 2) moveTo(2, false);
    if (index < 2) moveTo(slideCount + 1, false);
  });

  const browse = (direction) => {
    stopAutoplay();
    moveTo(index + direction);
  };

  previous.addEventListener('click', () => browse(-1));
  next.addEventListener('click', () => browse(1));
  carousel.addEventListener('pointerdown', stopAutoplay, { once: true });
  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); browse(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); browse(1); }
  });

  const dialog = document.createElement('dialog');
  dialog.className = 'product-lightbox';
  dialog.setAttribute('aria-label', 'Enlarged product image');
  dialog.innerHTML = '<button class="product-lightbox__close" type="button" aria-label="Close enlarged image">Close</button><button class="product-lightbox__previous" type="button" aria-label="Previous image">Previous</button><img class="product-lightbox__image" alt=""><button class="product-lightbox__next" type="button" aria-label="Next image">Next</button>';
  document.body.append(dialog);

  const lightboxImage = dialog.querySelector('.product-lightbox__image');
  let lightboxIndex = 0;
  const openLightbox = (source) => {
    lightboxIndex = originals.indexOf(source);
    lightboxImage.src = source.querySelector('img').src;
    lightboxImage.alt = source.querySelector('img').alt;
    dialog.showModal();
    dialog.querySelector('.product-lightbox__close').focus();
  };
  const showLightboxImage = (direction) => {
    lightboxIndex = (lightboxIndex + direction + slideCount) % slideCount;
    const image = originals[lightboxIndex].querySelector('img');
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
  };

  track.addEventListener('click', (event) => {
    const slide = event.target.closest('[data-carousel-slide]');
    if (!slide) return;
    stopAutoplay();
    const source = originals.find((original) => original.querySelector('img').src === slide.querySelector('img').src);
    openLightbox(source);
  });
  dialog.querySelector('.product-lightbox__close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.product-lightbox__previous').addEventListener('click', () => showLightboxImage(-1));
  dialog.querySelector('.product-lightbox__next').addEventListener('click', () => showLightboxImage(1));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showLightboxImage(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showLightboxImage(1); }
  });
})();
