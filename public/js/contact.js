/**
 * Contact form handler using EmailJS (client-side email delivery, no backend mail server required).
 *
 * Setup:
 * 1. Create a free account at https://www.emailjs.com
 * 2. Add your Public Key, Service ID, and Template ID below (or wire them from
 *    server-rendered values / a small /config endpoint if you prefer not to hardcode them).
 * 3. Template variables expected: name, company, email, phone, subject, message
 */
(function () {
  const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";
  const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID";
  const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";

  if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY") {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("contact-submit-btn");
  const submitLabel = document.getElementById("submit-label");
  const submitSpinner = document.getElementById("submit-spinner");
  const successScreen = document.getElementById("contact-success");
  const formWrap = document.getElementById("contact-form-wrap");
  const toast = document.getElementById("toast");

  function showToast(message, isError) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.toggle("bg-red-600", !!isError);
    toast.classList.toggle("bg-navy", !isError);
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.add("hidden");
      toast.classList.remove("show");
    }, 4000);
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("opacity-70", isLoading);
    submitLabel.textContent = isLoading ? "Sending..." : "Send Message";
    submitSpinner.classList.toggle("hidden", !isLoading);
  }

  function validate() {
    let valid = true;
    form.querySelectorAll("[required]").forEach((field) => {
      const errorEl = field.closest("div")?.querySelector(".error-msg");
      const isEmpty = field.type === "checkbox" ? !field.checked : !field.value.trim();
      const isBadEmail = field.type === "email" && field.value && !/^\S+@\S+\.\S+$/.test(field.value);

      if (isEmpty || isBadEmail) {
        valid = false;
        field.classList.add("border-red-500");
        errorEl?.classList.remove("hidden");
      } else {
        field.classList.remove("border-red-500");
        errorEl?.classList.add("hidden");
      }
    });
    return valid;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast("Please fill in all required fields correctly.", true);
      return;
    }

    setLoading(true);

    const params = {
      name: form.name.value,
      company: form.company.value,
      email: form.email.value,
      phone: form.phone.value,
      subject: form.subject.value,
      message: form.message.value
    };

    try {
      if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY") {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
      } else {
        // EmailJS not configured yet — simulate success in dev so the UI flow can be tested.
        await new Promise((resolve) => setTimeout(resolve, 900));
        console.warn("EmailJS is not configured. Add your keys in public/js/contact.js.");
      }

      formWrap.classList.add("hidden");
      successScreen.classList.remove("hidden");
      showToast("Message sent successfully!");
      form.reset();
    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Please try again or email us directly.", true);
    } finally {
      setLoading(false);
    }
  });
})();
