(() => {
  document.querySelectorAll("[data-delete-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      const name = form.getAttribute("data-name") || "tę osobę";
      const confirmed = window.confirm(`Usunąć zapytanie od ${name}? Tej operacji nie da się cofnąć.`);
      if (!confirmed) event.preventDefault();
    });
  });
})();
