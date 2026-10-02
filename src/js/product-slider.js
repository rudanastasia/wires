const slider = document.querySelector('.product-slider');

if (slider) {
  const list = slider.querySelector('.product-slider__list');
  const prevBtn = slider.querySelector('.slider-directions__btn--prev');
  const nextBtn = slider.querySelector('.slider-directions__btn--next');
  const dotsList = slider.querySelector('.slider-directions__list');

  const mq = window.matchMedia('(max-width: 767.98px)');
  const DURATION = 900;
  const CLONE = 'product-slider__item--clone';

  const items = [...list.children];
  items.forEach((item, i) => item.classList.toggle('product-slider__item--alt', i % 2 === 1));

  let perView = 1;
  let pages = 1;
  let index = 0;
  let busy = false;
  let dots = [];

  const getStep = () => {
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    return list.firstElementChild.offsetWidth + gap;
  };

  const makeClone = (item) => {
    const clone = item.cloneNode(true);
    clone.classList.add(CLONE);
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    return clone;
  };

  const makeSpacer = () => {
    const li = document.createElement('li');
    li.className = `product-slider__item product-slider__item--empty ${CLONE}`;
    li.setAttribute('aria-hidden', 'true');
    return li;
  };

  const render = (animate) => {
    list.style.transition = animate ? `transform ${DURATION}ms ease` : 'none';
    list.style.transform = `translateX(${-index * perView * getStep()}px)`;

    const active = (index - 1 + pages) % pages;
    dots.forEach((dot, i) => dot.classList.toggle('outer-circle--active', i === active));
  };

  const goTo = (page) => {
    if (busy || pages < 2) return;
    busy = true;
    index = page;
    render(true);
  };

  const finish = () => {
    if (index === 0) index = pages;
    else if (index === pages + 1) index = 1;
    render(false);
    busy = false;
  };

  const build = () => {
    list.querySelectorAll(`.${CLONE}`).forEach((el) => el.remove());

    perView = mq.matches ? 1 : 2;
    pages = Math.ceil(items.length / perView);
    busy = false;

    list.append(...Array.from({ length: pages * perView - items.length }, makeSpacer));

    if (pages > 1) {
      const all = [...list.children];
      list.prepend(...all.slice(-perView).map(makeClone));
      list.append(...all.slice(0, perView).map(makeClone));
    }

    dotsList.innerHTML = Array.from(
      { length: pages },
      () => `
        <li class="slider-directions__item">
          <div class="outer-circle"><div class="inner-circle"></div></div>
        </li>`,
    ).join('');

    dots = [...dotsList.querySelectorAll('.outer-circle')];
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i + 1)));

    index = pages > 1 ? 1 : 0;
    render(false);
  };

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  list.addEventListener('transitionend', (e) => {
    if (e.target === list && e.propertyName === 'transform') finish();
  });

  // свайп
  let startX = 0;
  list.addEventListener(
    'touchstart',
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true },
  );
  list.addEventListener(
    'touchend',
    (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
    },
    { passive: true },
  );

  mq.addEventListener('change', build);
  window.addEventListener('resize', () => render(false));

  build();
}
