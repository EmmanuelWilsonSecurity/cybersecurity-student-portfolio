// Client-side contact form validation. This demonstration does not send data to a server.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const fields = ["name", "email", "phone", "message"];
  const feedback = document.getElementById("contact-feedback");

  function showError(field, text) {
    const input = document.getElementById(field);
    const wrapper = input.closest(".field");
    wrapper.classList.toggle("invalid", Boolean(text));
    document.getElementById(`${field}-error`).textContent = text;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const values = Object.fromEntries(fields.map(id => [id, document.getElementById(id).value.trim()]));
    let valid = true;

    fields.forEach(id => {
      if (!values[id]) {
        showError(id, "This field is required.");
        valid = false;
      } else {
        showError(id, "");
      }
    });

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (values.email && !emailPattern.test(values.email)) {
      showError("email", "Enter a valid email address.");
      valid = false;
    }
    if (values.phone && !/^\d+$/.test(values.phone)) {
      showError("phone", "Phone number must contain digits only.");
      valid = false;
    }

    if (valid) {
      feedback.textContent = "All fields passed validation. This demonstration form does not send or store your message.";
      feedback.style.color = "#137c57";
      form.reset();
    } else {
      feedback.textContent = "Please correct the highlighted fields and try again.";
      feedback.style.color = "#bd4141";
    }
  });

  fields.forEach(id => {
    document.getElementById(id).addEventListener("input", () => {
      if (document.getElementById(id).value.trim()) showError(id, "");
    });
  });
});
