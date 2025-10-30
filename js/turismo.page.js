(() => {
  function initTourismQuoteForm() {
    const form = document.getElementById("tourismQuoteForm");
    if (!form) {
      return;
    }

    const nameField = form.querySelector("input[name='name']");
    const emailField = form.querySelector("input[name='email']");
    const phoneField = form.querySelector("input[name='phone']");
    const destinationField = form.querySelector("input[name='destination']");
    const detailsField = form.querySelector("textarea[name='details']");
    const messageField = form.querySelector("textarea[name='message']");

    const updateMessageField = () => {
      if (!messageField) {
        return;
      }

      const details = [
        "Nueva solicitud de turismo KayrosGo:",
        `Nombre: ${nameField?.value || "---"}`,
        `Email: ${emailField?.value || "---"}`,
        `WhatsApp: ${phoneField?.value || "---"}`,
        `Destino deseado: ${destinationField?.value || "---"}`,
      ];

      const extraDetails = detailsField?.value?.trim();
      if (extraDetails) {
        details.push("Detalles adicionales:", extraDetails);
      }

      messageField.value = details.join("\n");
    };

    const updateMessageWithDelay = () => {
      window.requestAnimationFrame(updateMessageField);
    };

    form.addEventListener("input", updateMessageWithDelay);
    form.addEventListener("change", updateMessageWithDelay);
    form.addEventListener(
      "submit",
      () => {
        updateMessageField();
      },
      true,
    );
    form.addEventListener("reset", () => {
      window.requestAnimationFrame(() => {
        if (destinationField) {
          destinationField.value = "";
        }
        updateMessageField();
      });
    });

    updateMessageField();

    const programButtons = document.querySelectorAll("[data-program-destination]");
    programButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const destination = button.getAttribute("data-program-destination") || "";
        if (destinationField) {
          destinationField.value = destination;
          destinationField.dispatchEvent(new Event("input", { bubbles: true }));
        }
        updateMessageField();
        form.scrollIntoView({ behavior: "smooth", block: "start" });
        if (destinationField) {
          destinationField.focus({ preventScroll: true });
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTourismQuoteForm();
  });
})();
