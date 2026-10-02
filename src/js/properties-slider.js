const propertiesSlider = document.querySelector('.product-properties');

if (propertiesSlider) {
  const list = propertiesSlider.querySelector('.product-properties__list');
  const prevBtn = propertiesSlider.querySelector('.slider-directions__btn--prev');
  const nextBtn = propertiesSlider.querySelector('.slider-directions__btn--next');
  const dotsList = propertiesSlider.querySelector('.slider-directions__list');

  const PER_PAGE = 3;
  const DURATION = 900;
  const SERVICE = 'product-properties__item--service';
  const mq = window.matchMedia('(max-width: 767.98px)'); // как в миксине tablets

  const realCount = list.children.length;
  const pagesCount = Math.ceil(realCount / PER_PAGE);
  const loop = pagesCount > 1;

  let lastIndex = 1; // колонка, на которой слайдер стоял в покое
  let touching = false;
  let animating = false;
  let rafId = 0;

  /* ---------- вспомогательные функции ---------- */

  const getStep = () => {
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    return list.firstElementChild.offsetWidth + gap;
  };

  const getIndex = () => Math.round(list.scrollLeft / getStep());

  // мгновенный переход без анимации и без «доводки» snap-ом
  const jumpTo = (index) => {
    list.style.scrollSnapType = 'none';
    list.scrollLeft = index * getStep();
    list.style.scrollSnapType = '';
    lastIndex = index;
  };

  /* ---------- анимация прокрутки (900 мс) ---------- */

  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

  const stopAnimation = () => {
    cancelAnimationFrame(rafId);
    animating = false;
    list.style.scrollSnapType = '';
  };

  const animateTo = (target) => {
    stopAnimation();

    const from = list.scrollLeft;
    const distance = target - from;
    if (Math.abs(distance) < 1) return;

    animating = true;
    list.style.scrollSnapType = 'none'; // на время анимации отключаем snap

    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / DURATION, 1);
      list.scrollLeft = from + distance * easeInOutCubic(progress);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        stopAnimation();
        settle(); // приехали на клон — «перепрыгиваем» на настоящую страницу
      }
    };

    rafId = requestAnimationFrame(tick);
  };

  const scrollToIndex = (index) => {
    if (animating) return; // игнорируем клики во время анимации
    const clamped = Math.max(0, Math.min(index, pagesCount + 1));
    animateTo(clamped * getStep());
  };

  /* ---------- служебные элементы ---------- */

  const makeSpacer = () => {
    const li = document.createElement('li');
    li.className = `product-properties__item ${SERVICE}`;
    li.setAttribute('aria-hidden', 'true');
    return li;
  };

  const makeClone = (item) => {
    const clone = item.cloneNode(true);
    clone.classList.add(SERVICE);
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    return clone;
  };

  /* ---------- сборка / разборка клонов ---------- */

  const setup = () => {
    if (!loop || list.querySelector(`.${SERVICE}`)) return;

    // добиваем последнюю страницу пустышками до 3 карточек
    const rest = realCount % PER_PAGE;
    if (rest) {
      for (let i = rest; i < PER_PAGE; i++) list.append(makeSpacer());
    }

    const all = [...list.children];
    list.prepend(...all.slice(-PER_PAGE).map(makeClone));
    list.append(...all.slice(0, PER_PAGE).map(makeClone));

    jumpTo(1);
    updateDots();
  };

  const teardown = () => {
    stopAnimation();
    list.querySelectorAll(`.${SERVICE}`).forEach((el) => el.remove());
    list.scrollLeft = 0;
  };

  const init = () => (mq.matches ? setup() : teardown());

  /* ---------- точки ---------- */

  dotsList.innerHTML = Array.from(
    { length: pagesCount },
    () => `
      <li class="slider-directions__item">
        <div class="outer-circle"><div class="inner-circle"></div></div>
      </li>`,
  ).join('');

  const dots = dotsList.querySelectorAll('.outer-circle');

  const updateDots = () => {
    const active = (getIndex() - 1 + pagesCount) % pagesCount;
    dots.forEach((dot, i) => dot.classList.toggle('outer-circle--active', i === active));
  };

  /* ---------- «перепрыжок» с клона на настоящую страницу ---------- */

  function settle() {
    if (!mq.matches || !loop || touching || animating) return;

    const index = getIndex();
    const exact = Math.abs(list.scrollLeft - index * getStep()) < 2;
    if (!exact) return; // ещё движется

    if (index === 0) jumpTo(pagesCount);
    else if (index === pagesCount + 1) jumpTo(1);
    else lastIndex = index;

    updateDots();
  }

  /* ---------- события ---------- */

  prevBtn.addEventListener('click', () => scrollToIndex(getIndex() - 1));
  nextBtn.addEventListener('click', () => scrollToIndex(getIndex() + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => scrollToIndex(i + 1)));

  let settleTimer;
  const scheduleSettle = () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settle, 120);
  };

  list.addEventListener(
    'scroll',
    () => {
      updateDots();
      if (!('onscrollend' in window)) scheduleSettle(); // фолбэк для старых браузеров
    },
    { passive: true },
  );

  if ('onscrollend' in window) list.addEventListener('scrollend', settle);

  // палец на экране прерывает анимацию
  list.addEventListener(
    'touchstart',
    () => {
      stopAnimation();
      touching = true;
    },
    { passive: true },
  );
  list.addEventListener(
    'touchend',
    () => {
      touching = false;
      scheduleSettle();
    },
    { passive: true },
  );
  list.addEventListener(
    'touchcancel',
    () => {
      touching = false;
      scheduleSettle();
    },
    { passive: true },
  );

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      stopAnimation();
      if (mq.matches && loop) jumpTo(lastIndex);
    }, 100);
  });

  mq.addEventListener('change', init);
  init();
}
