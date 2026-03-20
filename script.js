document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  if (!form || !status) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    status.textContent = "Envoi en cours...";
    status.className = "form-status";

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Envoi...";
    }

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        form.reset();
        status.textContent = "✅ Votre demande a bien été envoyée. Je vous répondrai dès que possible.";
        status.className = "form-status success";
      } else {
        let errorMessage = "Une erreur est survenue. Merci de réessayer ou de me contacter directement par téléphone ou par email.";

        try {
          const data = await response.json();
          if (data && Array.isArray(data.errors) && data.errors.length > 0 && data.errors[0].message) {
            errorMessage = data.errors[0].message;
          }
        } catch {
          // Ignore JSON parse errors and keep the default message.
        }

        status.textContent = `❌ ${errorMessage}`;
        status.className = "form-status error";
      }
    } catch {
      status.textContent = "❌ Impossible d’envoyer la demande pour le moment. Vérifiez votre connexion ou contactez-moi directement.";
      status.className = "form-status error";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Envoyer la demande";
      }
    }
  });
});
