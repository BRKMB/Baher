(() => {
  try {
    if (window.localStorage.getItem("cns-lang") === "en") {
      document.documentElement.lang = "en";
      document.documentElement.dataset.lang = "en";
    }
  } catch {
    /* ignore blocked storage */
  }
})();
