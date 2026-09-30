import { closeCallbackModal, openSuccessModal } from './modal-feedback.js';

const callbackForm = document.getElementById('callback-form');
const sendCallbackForm = document.getElementById('callback-send');
const nameInput = document.getElementById('customer-name');
const phoneInput = document.getElementById('customer-phone');
const statusEl = document.getElementById('callback-status');

const FORMSPREE_URL = 'https://formspree.io/f/xojgoeee';
const ERROR_CLASS = 'form__input--error';

// ---------- Валидация ----------

const validateName = (value) => {
  const v = value.trim();
  if (!v) return 'Введите имя';
  if (v.length < 2) return 'Имя слишком короткое';
  if (!/^[а-яёa-z]+(?:\s+[а-яёa-z]+)*$/i.test(v)) return 'Имя должно содержать только буквы';
  return '';
};

const validatePhone = (value) => {
  const v = value.trim();
  if (!v) return 'Введите номер телефона';
  if (!/^[\d\s()+-]+$/.test(v)) return 'Допустимы только цифры, пробелы, +, -, ( )';
  const digits = v.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return 'Введите корректный номер телефона';
  return '';
};

const setError = (input, message) => {
  const errorEl = document.getElementById(`${input.id}-error`);
  errorEl.textContent = message;
  input.classList.toggle(ERROR_CLASS, Boolean(message));
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
};

const checkField = (input, validator) => {
  const message = validator(input.value);
  setError(input, message);
  return !message;
};

nameInput.addEventListener('input', () => setError(nameInput, ''));
phoneInput.addEventListener('input', () => setError(phoneInput, ''));

nameInput.addEventListener('blur', () => checkField(nameInput, validateName));
phoneInput.addEventListener('blur', () => checkField(phoneInput, validatePhone));

// ---------- Отправка ----------

const setStatus = (message, isError = false) => {
  statusEl.textContent = message;
  statusEl.classList.toggle('form__status--error', isError);
};

callbackForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  setStatus('');

  const nameOk = checkField(nameInput, validateName);
  const phoneOk = checkField(phoneInput, validatePhone);

  if (!nameOk || !phoneOk) {
    (nameOk ? phoneInput : nameInput).focus();
    return;
  }

  sendCallbackForm.disabled = true;
  sendCallbackForm.textContent = 'Отправка...';

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      body: new FormData(callbackForm),
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      callbackForm.reset();

      closeCallbackModal();
      openSuccessModal();
    } else {
      const data = await response.json().catch(() => ({}));
      const message = data.errors
        ? data.errors.map((err) => err.message).join(', ')
        : 'Не удалось отправить форму. Попробуйте ещё раз.';
      setStatus(message, true);
    }
  } catch {
    setStatus('Ошибка сети. Проверьте соединение и попробуйте снова.', true);
  } finally {
    sendCallbackForm.disabled = false;
    sendCallbackForm.textContent = 'Отправить';
  }
});
