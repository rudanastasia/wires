import { initForm } from './form.js';
import { closeCallbackModal, closeOrderModal, openSuccessModal } from './modal.js';

initForm({
  form: document.getElementById('callback-form'),
  sendBtn: document.getElementById('callback-send'),
  status: document.getElementById('callback-status'),
  onSuccess: () => {
    closeCallbackModal();
    openSuccessModal();
  },
});

initForm({
  form: document.getElementById('order-form'),
  sendBtn: document.getElementById('order-send'),
  status: document.getElementById('order-status'),
  onSuccess: () => {
    closeOrderModal();
    openSuccessModal();
  },
});
