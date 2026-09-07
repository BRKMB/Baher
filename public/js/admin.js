(() => {
  const warsawYmd = (value) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(value);

  const shiftYmd = (ymd, days) => {
    const [year, month, day] = ymd.split("-").map(Number);
    const shifted = new Date(Date.UTC(year, month - 1, day + days));
    return shifted.toISOString().slice(0, 10);
  };

  const lang = () => (window.CNS?.getLang ? window.CNS.getLang() : "pl");

  const countLabel = (n, currentLang) => {
    if (currentLang === "en") {
      return n === 1 ? "1 enquiry in total" : `${n} enquiries in total`;
    }
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (n === 1) return "1 zapytanie łącznie";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} zapytania łącznie`;
    return `${n} zapytań łącznie`;
  };

  const dayLabel = (ymd, currentLang) => {
    if (!ymd) return currentLang === "en" ? "No date" : "Bez daty";
    const today = warsawYmd(new Date());
    if (ymd === today) return currentLang === "en" ? "Today" : "Dzisiaj";
    if (ymd === shiftYmd(today, -1)) return currentLang === "en" ? "Yesterday" : "Wczoraj";
    const [year, month, day] = ymd.split("-").map(Number);
    const noon = new Date(Date.UTC(year, month - 1, day, 12));
    const label = new Intl.DateTimeFormat(currentLang === "en" ? "en-GB" : "pl-PL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(noon);
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  const applyAdminLang = () => {
    const current = lang();
    document.querySelectorAll("[data-admin-count]").forEach((node) => {
      const n = Number(node.getAttribute("data-admin-count") || "0");
      node.textContent = countLabel(Number.isFinite(n) ? n : 0, current);
    });
    document.querySelectorAll(".admin-day[data-ymd]").forEach((node) => {
      node.textContent = dayLabel(node.getAttribute("data-ymd") || "", current);
    });
    document.querySelectorAll("[data-delete-form]").forEach((form) => {
      const name = form.getAttribute("data-name") || (current === "en" ? "this person" : "tę osobę");
      const button = form.querySelector(".admin-delete-btn");
      if (button) {
        button.setAttribute(
          "aria-label",
          current === "en" ? `Delete enquiry from ${name}` : `Usuń zapytanie od ${name}`,
        );
      }
    });
  };

  const bindDeletes = () => {
    document.querySelectorAll("[data-delete-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        const current = lang();
        const name = form.getAttribute("data-name") || (current === "en" ? "this person" : "tę osobę");
        const message =
          current === "en"
            ? `Delete the enquiry from ${name}? This cannot be undone.`
            : `Usunąć zapytanie od ${name}? Tej operacji nie da się cofnąć.`;
        if (!window.confirm(message)) event.preventDefault();
      });
    });
  };

  const start = () => {
    bindDeletes();
    applyAdminLang();
  };

  document.addEventListener("cns:langchange", applyAdminLang);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
