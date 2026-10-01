import { closeMobileMenu } from './mobile-menu.js';

//
//Модальное окно обратного звонка
//
const callbackBtns = document.querySelectorAll('.callback');
const callbackModal = document.querySelector('.modal-feedback');
const callbackClose = document.querySelector('.modal-feedback__close');

const successModal = document.querySelector('.modal-success');
const successClose = document.querySelector('.modal-success__close');

//открытие окна формы
const openCallbackModal = () => {
  closeMobileMenu();
  callbackModal.classList.add('is-open');
  document.body.classList.add('no-scroll');
};

//закрытие окна формы
export const closeCallbackModal = () => {
  callbackModal.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
};

callbackBtns.forEach((btn) => {
  btn.addEventListener('click', openCallbackModal);
});

callbackClose.addEventListener('click', closeCallbackModal);

//закрыть форму кликом на фон
callbackModal.addEventListener('click', (e) => {
  if (e.target === callbackModal) {
    closeCallbackModal();
  }
});

//открыть окно успешной отправки
export const openSuccessModal = () => {
  successModal.classList.add('is-open');
  document.body.classList.add('no-scroll');
};

//закрыть окно успешной отправки
const closeSuccessModal = () => {
  successModal.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
};

successClose.addEventListener('click', closeSuccessModal);

successModal.addEventListener('click', (e) => {
  if (e.target === successModal) {
    closeSuccessModal();
  }
});

//
// Модальное окно формы заказа
//
const orderModal = document.querySelector('.modal-order');
const orderClose = document.querySelector('.modal-order__close');
const orderBtns = document.querySelectorAll('.order');

const openOrderModal = () => {
  orderModal.classList.add('is-open');
  document.body.classList.add('no-scroll');
};

export const closeOrderModal = () => {
  orderModal.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
};

orderBtns.forEach((btn) => btn.addEventListener('click', openOrderModal));
orderClose.addEventListener('click', closeOrderModal);

orderModal.addEventListener('click', (e) => {
  if (e.target === orderModal) closeOrderModal();
});
