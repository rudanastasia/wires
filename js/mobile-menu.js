//
//  Открываем/закрываем мобильное меню
//
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.modal-mobile-menu');
const closeMenu = document.querySelector('.modal-mobile-menu__close');

const openMobileMenu = () => {
  mobileMenu.style.display = 'flex';
};

export const closeMobileMenu = () => {
  mobileMenu.style.display = 'none';
};

hamburger.addEventListener('click', openMobileMenu);
closeMenu.addEventListener('click', closeMobileMenu);

//
//Меню второго уровня на мобилках
//
const mobileDropdown = document.querySelector('.menu__item--dropdown-mobile');
const subMenu = document.querySelector('.menu__submenu--mobile');

mobileDropdown.addEventListener('click', () => {
  mobileDropdown.classList.toggle('active');
  subMenu.classList.toggle('active');
});
