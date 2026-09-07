(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const track = (name, detail = {}) => {
    document.dispatchEvent(new CustomEvent("cns:track", { detail: { name, ...detail } }));
  };

  document.querySelectorAll("[data-track]").forEach((element) => {
    element.addEventListener("click", () => {
      track(element.getAttribute("data-track") || "click", {
        href: element.getAttribute("href") || "",
      });
    });
  });

  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-nav-mobile]");
  const firstMobileLink = mobileNav?.querySelector("a");

  const closeNav = () => {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
    document.body.classList.remove("is-locked");
  };

  const openNav = () => {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "true");
    mobileNav.classList.add("is-open");
    document.body.classList.add("is-locked");
    firstMobileLink?.focus();
  };

  toggle?.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) closeNav();
    else openNav();
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  document.addEventListener("click", (event) => {
    if (!header?.contains(event.target)) closeNav();
  });

  if (!reducedMotion.matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
  } else {
    document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
  }

  document.querySelectorAll("[data-accordion]").forEach((item) => {
    const button = item.querySelector("button");
    const panel = item.querySelector(".faq-panel");
    if (!button || !panel) return;

    const panelId = panel.id || `faq-${crypto.randomUUID()}`;
    panel.id = panelId;
    button.setAttribute("aria-controls", panelId);
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
      const open = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", open ? "false" : "true");
      button.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });

  const config = window.CLEAN_AND_SPEAK || {};
  const methods = document.querySelector("[data-contact-methods]");

  const bindMethod = (key, selector, buildHref) => {
    const node = document.querySelector(selector);
    const value = typeof config[key] === "string" ? config[key].trim() : "";
    if (!node || !value) {
      node?.setAttribute("hidden", "");
      return false;
    }
    const link = node.querySelector("a");
    if (link) {
      link.href = buildHref(value);
      if (!link.dataset.keepLabel) {
        link.textContent = value;
      }
    }
    node.removeAttribute("hidden");
    return true;
  };

  const hasPhone = bindMethod("phone", "[data-contact='phone']", (value) => `tel:${value.replace(/\s+/g, "")}`);
  const hasEmail = bindMethod("email", "[data-contact='email']", (value) => `mailto:${value}`);
  const hasWhatsapp = bindMethod(
    "whatsapp",
    "[data-contact='whatsapp']",
    (value) => `https://wa.me/${value.replace(/\D/g, "")}`,
  );
  const hasInstagram = bindMethod("instagram", "[data-contact='instagram']", (value) => value);
  const hasFacebook = bindMethod("facebook", "[data-contact='facebook']", (value) => value);

  const areaNodes = document.querySelectorAll("[data-service-area]");
  if (config.serviceArea) {
    areaNodes.forEach((node) => {
      node.textContent = config.serviceArea;
      node.removeAttribute("hidden");
    });
  } else {
    areaNodes.forEach((node) => node.setAttribute("hidden", ""));
  }

  if (methods && !hasPhone && !hasEmail && !hasWhatsapp && !hasInstagram && !hasFacebook) {
    methods.setAttribute("hidden", "");
  }

  const cookieKey = "cns-cookie-ok";
  const cookieBar = document.querySelector("[data-cookie-bar]");
  const showCookieBar = () => {
    if (!cookieBar) return;
    cookieBar.hidden = false;
    cookieBar.classList.add("is-visible");
  };
  const hideCookieBar = () => {
    if (!cookieBar) return;
    cookieBar.hidden = true;
    cookieBar.classList.remove("is-visible");
  };
  if (cookieBar && !window.localStorage.getItem(cookieKey)) {
    showCookieBar();
  }
  cookieBar?.querySelector("[data-cookie-accept]")?.addEventListener("click", () => {
    window.localStorage.setItem(cookieKey, "1");
    hideCookieBar();
  });

  const form = document.querySelector("[data-inquiry-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const submit = form.querySelector("[type='submit']");
  const cleaningFields = form.querySelector("[data-fields='sprzatanie']");
  const englishFields = form.querySelector("[data-fields='angielski']");
  const params = new URLSearchParams(window.location.search);
  const preset = params.get("usluga");

  const setService = (service) => {
    const radio = form.querySelector(`input[name="service"][value="${service}"]`);
    if (radio) radio.checked = true;
    cleaningFields.hidden = service !== "sprzatanie";
    englishFields.hidden = service !== "angielski";
    cleaningFields.querySelectorAll("input, select, textarea").forEach((field) => {
      field.disabled = service !== "sprzatanie";
    });
    englishFields.querySelectorAll("input, select, textarea").forEach((field) => {
      field.disabled = service !== "angielski";
    });
  };

  if (preset === "sprzatanie" || preset === "angielski") {
    setService(preset);
  } else {
    setService("sprzatanie");
  }

  form.querySelectorAll('input[name="service"]').forEach((input) => {
    input.addEventListener("change", () => setService(input.value));
  });

  const setStatus = (message, kind = "") => {
    if (!status) return;
    status.textContent = message;
    status.className = `form-status${kind ? ` is-${kind}` : ""}`;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const service = String(data.get("service") || "");
    const payload = {
      service,
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      message: String(data.get("message") || ""),
      company: String(data.get("company") || ""),
      consent: data.get("consent") === "on",
    };

    if (service === "sprzatanie") {
      payload.propertyType = String(data.get("propertyType") || "");
      payload.sizeApprox = String(data.get("sizeApprox") || "");
      payload.cleaningType = String(data.get("cleaningType") || "");
      payload.frequency = String(data.get("frequency") || "");
      payload.preferredDate = String(data.get("preferredDate") || "");
      payload.location = String(data.get("location") || "");
      payload.extras = String(data.get("extras") || "");
    }

    if (service === "angielski") {
      payload.studentLevel = String(data.get("studentLevel") || "");
      payload.format = String(data.get("format") || "");
      payload.lessonMode = String(data.get("lessonMode") || "");
      payload.goal = String(data.get("goal") || "");
      payload.preferredDays = String(data.get("preferredDays") || "");
      payload.preferredTime = String(data.get("preferredTime") || "");
    }

    const t = window.CNS?.translate || ((value) => value);

    if (!payload.consent) {
      setStatus(t("Aby wysłać zapytanie, potwierdź zgodę na kontakt."), "error");
      return;
    }

    submit.disabled = true;
    const originalLabel = submit.textContent;
    submit.textContent = t("Wysyłanie…");
    setStatus(t("Wysyłamy Twoje zapytanie."));

    try {
      const response = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(t(result.message || "Nie udało się wysłać zapytania."));
      }
      setStatus(t(result.message), "success");
      form.reset();
      setService(service);
      track("form_submit", { service });
      submit.textContent = t("Wysłano");
    } catch (error) {
      setStatus(
        t(error instanceof Error ? error.message : "Nie udało się wysłać zapytania."),
        "error",
      );
      submit.disabled = false;
      submit.textContent = originalLabel;
    }
  });
})();
