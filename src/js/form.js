const FORMSPREE_URL = 'https://formspree.io/f/xojgoeee';
const ERROR_CLASS = 'form__input--error';

// ---------- Валидаторы (ключ = атрибут name поля) ----------

const validators = {
  name: (value) => {
    const v = value.trim();
    if (!v) return 'Введите имя';
    if (v.length < 2) return 'Имя слишком короткое';
    if (!/^[а-яёa-z]+(?:\s+[а-яёa-z]+)*$/i.test(v)) return 'Имя должно содержать только буквы';
    return '';
  },
  phone: (value) => {
    const v = value.trim();
    if (!v) return 'Введите номер телефона';
    if (!/^[\d\s()+-]+$/.test(v)) return 'Допустимы только цифры, пробелы, +, -, ( )';
    const digits = v.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) return 'Введите корректный номер телефона';
    return '';
  },
  'product[]': (values) => (values.length ? '' : 'Выберите хотя бы одно средство'),
};

// ---------- Инициализация формы ----------

export const initForm = ({ form, sendBtn, status, onSuccess }) => {
  if (!form) return;

  // Описание полей, которые реально есть в этой форме
  const fields = Object.keys(validators)
    .map((name) => {
      const elements = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
      if (!elements.length) return null;

      const first = elements[0];
      const isGroup = first.type === 'checkbox';
      const box = isGroup ? first.closest('fieldset') : first; // сюда вешаем класс ошибки

      return {
        name,
        elements,
        box,
        focusEl: first,
        errorEl: document.getElementById(`${box.id}-error`),
        getValue: () =>
          isGroup ? elements.filter((el) => el.checked).map((el) => el.value) : first.value,
      };
    })
    .filter(Boolean);

  const setError = (field, message) => {
    field.errorEl.textContent = message;
    field.box.classList.toggle(ERROR_CLASS, Boolean(message));
    field.box.setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  const checkField = (field) => {
    const message = validators[field.name](field.getValue());
    setError(field, message);
    return !message;
  };

  const setStatus = (message, isError = false) => {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('form__status--error', isError);
  };

  // Сброс ошибок при вводе, проверка при уходе с поля
  fields.forEach((field) => {
    field.elements.forEach((el) => {
      el.addEventListener('input', () => setError(field, ''));
      el.addEventListener('change', () => setError(field, ''));
    });

    // blur только у одиночных полей: у чекбоксов он срабатывает на каждом
    if (field.elements.length === 1) {
      field.elements[0].addEventListener('blur', () => checkField(field));
    }
  });

  // ---------- Отправка ----------

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('');

    const results = fields.map(checkField);
    if (results.includes(false)) {
      fields[results.indexOf(false)].focusEl.focus();
      return;
    }

    // Чекбоксы продуктов склеиваем в одну строку
    const data = new FormData(form);
    const products = fields.find((f) => f.name === 'product[]');
    if (products) {
      data.delete('product[]');
      data.append('product', products.getValue().join(', '));
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'Отправка...';

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        form.reset();
        if (onSuccess) onSuccess();
      } else {
        const json = await response.json().catch(() => ({}));
        const message = json.errors
          ? json.errors.map((err) => err.message).join(', ')
          : 'Не удалось отправить форму. Попробуйте ещё раз.';
        setStatus(message, true);
      }
    } catch {
      setStatus('Ошибка сети. Проверьте соединение и попробуйте снова.', true);
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Отправить';
    }
  });
};
