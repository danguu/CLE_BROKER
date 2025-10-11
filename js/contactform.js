(() => {
  const API_BASE_URL = window.APP_CONFIG?.apiBaseUrl?.replace(/\/$/, '') || '';

  function buildPayload(form) {
    const formData = new FormData(form);
    const payload = {};
    const keys = Array.from(new Set(formData.keys()));

    keys.forEach((key) => {
      const values = formData.getAll(key);
      payload[key] = values.length > 1 ? values : values[0];
    });

    return payload;
  }

  function updateMessage(container, message) {
    if (!container) {
      return;
    }

    container.textContent = message;
    container.hidden = !message;
  }

  async function submitForm(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const endpoint = form.dataset.endpoint;

    if (!endpoint) {
      return;
    }

    const successMessage =
      form.dataset.successMessage || 'Gracias por escribirnos. Pronto nos pondremos en contacto.';
    const errorMessage =
      form.dataset.errorMessage || 'No pudimos enviar tu solicitud. Intenta nuevamente en unos minutos.';

    const successContainer = form.querySelector('.form-message-success');
    const errorContainer = form.querySelector('.form-message-error');

    updateMessage(successContainer, '');
    updateMessage(errorContainer, '');

    const payload = buildPayload(form);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: form.dataset.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = body?.error || errorMessage;
        throw new Error(message);
      }

      form.reset();
      updateMessage(successContainer, body?.message || successMessage);
    } catch (error) {
      updateMessage(errorContainer, error.message || errorMessage);
    }
  }

  function init() {
    const forms = document.querySelectorAll('form[data-endpoint]');
    forms.forEach((form) => {
      form.addEventListener('submit', submitForm);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
