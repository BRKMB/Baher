(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const track = (name, detail = {}) => {
    document.dispatchEvent(new CustomEvent("cns:track", { detail: { name, ...detail } }));
  };

  // Cookieless, first-party measurement: no identifiers are stored or sent.
  const sendEvent = (name, detail = {}) => {
    const body = JSON.stringify({
      name,
      path: window.location.pathname,
      referrer: document.referrer ? new URL(document.referrer).host : "",
      ...detail,
    });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/event", new Blob([body], { type: "application/json" }));
        return;
      }
      void fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    } catch {
      /* measurement must never break the page */
    }
  };

  document.addEventListener("cns:track", (event) => {
    sendEvent(event.detail?.name || "click", { href: event.detail?.href || "" });
  });

  const creditAlive = () => {
    const wrap = document.querySelector(".footer-credit");
    const link = wrap?.querySelector('a[href="https://brkmb.com/"]');
    const text = (wrap?.textContent || "").replace(/\s+/g, " ");
    return Boolean(wrap && link && text.includes("Made with") && text.includes("Baher Magally"));
  };
  const creditLock = () => {
    try {
      document.documentElement.replaceChildren();
      document.documentElement.style.cssText = "background:#111;min-height:100%";
    } catch {
      /* already unusable */
    }
  };
  const creditWatch = () => {
    if (!creditAlive()) creditLock();
  };
  creditWatch();
  new MutationObserver(creditWatch).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
  });

  sendEvent("pageview");

  document.querySelectorAll("[data-track]").forEach((element) => {
    element.addEventListener("click", () => {
      track(element.getAttribute("data-track") || "click", {
        href: element.getAttribute("href") || "",
      });
    });
  });

  if (document.querySelector(".mobile-cta")) {
    document.body.classList.add("has-mobile-cta");
  }

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

  const bindMethod = (key, buildHref) => {
    const nodes = document.querySelectorAll(`[data-contact="${key}"]`);
    if (!nodes.length) return false;

    const value = typeof config[key] === "string" ? config[key].trim() : "";
    if (!value) {
      nodes.forEach((node) => node.setAttribute("hidden", ""));
      return false;
    }

    nodes.forEach((node) => {
      const link = node.querySelector("a");
      if (link && buildHref) {
        link.href = buildHref(value);
        if (/^https?:/i.test(link.href)) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        if (!link.dataset.keepLabel) {
          link.textContent = value;
        }
      }
      const text = node.querySelector("[data-contact-value]");
      if (text) text.textContent = value;
      node.removeAttribute("hidden");
    });
    return true;
  };

  const phoneHref = (value) => {
    const digits = value.replace(/[^\d+]/g, "");
    if (digits.startsWith("+")) return `tel:${digits}`;
    if (/^\d{9}$/.test(digits)) return `tel:+48${digits}`;
    return `tel:${digits}`;
  };

  const contactFlags = [
    bindMethod("owner", null),
    bindMethod("phone", phoneHref),
    bindMethod("email", (value) => `mailto:${value}`),
    bindMethod("whatsapp", (value) => `https://wa.me/${value.replace(/\D/g, "")}`),
    bindMethod("instagram", (value) => value),
    bindMethod("facebook", (value) => value),
    bindMethod("address", null),
    bindMethod("serviceArea", null),
  ];

  const hasAnyContact = contactFlags.some(Boolean);

  if (methods && !hasAnyContact) {
    methods.setAttribute("hidden", "");
  }

  document.querySelectorAll("[data-contact-empty]").forEach((node) => {
    node.hidden = hasAnyContact;
  });

  document.querySelectorAll("[data-footer-contact]").forEach((node) => {
    node.hidden = !hasAnyContact;
  });

  if (config.address || config.phone || config.email || config.owner) {
    const business = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Clean & Speak",
      url: window.location.origin,
    };
    if (config.owner) business.founder = { "@type": "Person", name: config.owner };
    if (config.phone) {
      const digits = String(config.phone).replace(/[^\d+]/g, "");
      business.telephone = digits.startsWith("+") ? digits : /^\d{9}$/.test(digits) ? `+48${digits}` : config.phone;
    }
    if (config.email) business.email = config.email;
    if (config.address) business.address = { "@type": "PostalAddress", streetAddress: config.address };
    if (config.serviceArea) business.areaServed = config.serviceArea;
    const profiles = [config.instagram, config.facebook].filter((value) => typeof value === "string" && value.trim());
    if (profiles.length) business.sameAs = profiles;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(business);
    document.head.appendChild(script);
  }

  const cookieKey = "cns-cookie-ok";
  const cookieBar = document.querySelector("[data-cookie-bar]");
  const showCookieBar = () => {
    if (!cookieBar) return;
    cookieBar.hidden = false;
    cookieBar.classList.add("is-visible");
    document.body.classList.add("has-cookie-notice");
  };
  const hideCookieBar = () => {
    if (!cookieBar) return;
    cookieBar.hidden = true;
    cookieBar.classList.remove("is-visible");
    document.body.classList.remove("has-cookie-notice");
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

  const t = () => window.CNS?.translate || ((value) => value);

  const clearFieldError = (field) => {
    field.removeAttribute("aria-invalid");
    const wrapper = field.closest(".field, .check");
    wrapper?.classList.remove("is-invalid");
    wrapper?.querySelector("[data-field-error]")?.remove();
  };

  const setFieldError = (field, message) => {
    const wrapper = field.closest(".field, .check");
    if (!wrapper) return;
    clearFieldError(field);
    field.setAttribute("aria-invalid", "true");
    wrapper.classList.add("is-invalid");

    const errorId = `${field.id || field.name}-error`;
    const note = document.createElement("p");
    note.className = "field-error";
    note.id = errorId;
    note.dataset.fieldError = "";
    note.textContent = t()(message);
    wrapper.append(note);
    field.setAttribute("aria-describedby", errorId);
  };

  const validate = () => {
    const problems = [];
    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const phone = form.querySelector("#phone");
    const consent = form.querySelector("#consent");

    [name, email, phone, consent].forEach((field) => field && clearFieldError(field));

    if (name && name.value.trim().length < 2) {
      problems.push([name, "Podaj imię i nazwisko albo imię."]);
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email.value.trim())) {
      problems.push([email, "Podaj poprawny adres e-mail."]);
    }
    if (phone && phone.value.trim() && !/^[+0-9()/\s-]{6,24}$/u.test(phone.value.trim())) {
      problems.push([phone, "Podaj poprawny numer telefonu albo zostaw to pole puste."]);
    }
    if (consent && !consent.checked) {
      problems.push([consent, "Aby wysłać zapytanie, potwierdź zgodę na kontakt."]);
    }

    problems.forEach(([field, message]) => setFieldError(field, message));
    if (problems.length) {
      problems[0][0].focus();
    }
    return problems.length === 0;
  };

  form.querySelectorAll("#name, #email, #phone, #consent").forEach((field) => {
    field.addEventListener("input", () => clearFieldError(field));
    field.addEventListener("change", () => clearFieldError(field));
  });

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

    const translate = t();

    if (!validate()) {
      setStatus(translate("Popraw zaznaczone pola i wyślij ponownie."), "error");
      return;
    }

    submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    const originalLabel = submit.textContent;
    submit.textContent = translate("Wysyłanie…");
    setStatus(translate("Wysyłamy Twoje zapytanie."), "pending");

    try {
      const response = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(translate(result.message || "Nie udało się wysłać zapytania."));
      }
      setStatus(translate(result.message), "success");
      form.reset();
      setService(service);
      track("form_submit", { service });
      submit.textContent = translate("Wysłano");
      form.removeAttribute("aria-busy");
      window.location.assign(`/dziekujemy/?usluga=${encodeURIComponent(service)}`);
    } catch (error) {
      setStatus(
        translate(error instanceof Error ? error.message : "Nie udało się wysłać zapytania."),
        "error",
      );
      submit.disabled = false;
      submit.textContent = originalLabel;
      form.removeAttribute("aria-busy");
    }
  });
})();
