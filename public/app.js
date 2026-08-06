const launchClock = document.querySelector(".countdown");

if (launchClock) {
  const launchTime = new Date(launchClock.dataset.launchDate).getTime();
  const unitElements = {
    days: launchClock.querySelector('[data-unit="days"]'),
    hours: launchClock.querySelector('[data-unit="hours"]'),
    minutes: launchClock.querySelector('[data-unit="minutes"]'),
    seconds: launchClock.querySelector('[data-unit="seconds"]'),
  };
  let lastAnnouncedMinute = -1;

  const updateCountdown = () => {
    const remaining = Math.max(0, launchTime - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86_400);
    const hours = Math.floor((totalSeconds % 86_400) / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;

    unitElements.days.textContent = String(days).padStart(3, "0");
    unitElements.hours.textContent = String(hours).padStart(2, "0");
    unitElements.minutes.textContent = String(minutes).padStart(2, "0");
    unitElements.seconds.textContent = String(seconds).padStart(2, "0");

    const totalMinutes = Math.floor(totalSeconds / 60);
    if (totalMinutes !== lastAnnouncedMinute) {
      launchClock.setAttribute(
        "aria-label",
        `${days} days, ${hours} hours, and ${minutes} minutes until launch`,
      );
      lastAnnouncedMinute = totalMinutes;
    }
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1_000);
}

const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".site-menu");
const menuClose = document.querySelector(".menu-close");

if (menuToggle && siteMenu && menuClose) {
  const setMenuOpen = (open) => {
    siteMenu.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    document.body.style.overflow = open ? "hidden" : "";

    if (open) {
      menuClose.focus();
    } else if (document.activeElement === menuClose) {
      menuToggle.focus();
    }
  };

  menuToggle.addEventListener("click", () => {
    setMenuOpen(!siteMenu.classList.contains("is-open"));
  });
  menuClose.addEventListener("click", () => setMenuOpen(false));
  siteMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && siteMenu.classList.contains("is-open")) {
      setMenuOpen(false);
    }
  });
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const lightningBolts = [...document.querySelectorAll(".lightning")];
let lightningTimer;

const randomBetween = (minimum, maximum) => {
  const values = new Uint32Array(1);
  window.crypto.getRandomValues(values);
  return minimum + (values[0] / 0xffffffff) * (maximum - minimum);
};

const scheduleLightning = (minimumDelay = 12_000) => {
  window.clearTimeout(lightningTimer);
  if (reducedMotion.matches || lightningBolts.length === 0) return;

  lightningTimer = window.setTimeout(() => {
    const boltIndex = Math.floor(randomBetween(0, lightningBolts.length));
    const bolt = lightningBolts[boltIndex];
    bolt.classList.remove("is-flashing");
    void bolt.offsetWidth;
    bolt.classList.add("is-flashing");
    window.setTimeout(() => bolt.classList.remove("is-flashing"), 1_200);
    scheduleLightning();
  }, randomBetween(minimumDelay, 21_000));
};

reducedMotion.addEventListener("change", () => scheduleLightning());
scheduleLightning(5_000);

const notifyForm = document.querySelector(".notify-form");
const formStatus = document.querySelector(".form-status");

if (notifyForm && formStatus) {
  notifyForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailInput = notifyForm.elements.email;
    const companyInput = notifyForm.elements.company;
    const submitButton = notifyForm.querySelector('button[type="submit"]');
    const buttonLabel = submitButton.querySelector("span");

    formStatus.className = "form-status";
    if (!emailInput.checkValidity()) {
      formStatus.textContent = "Please enter a valid email address.";
      formStatus.classList.add("is-error");
      emailInput.focus();
      return;
    }

    submitButton.disabled = true;
    buttonLabel.textContent = "Sending";
    formStatus.textContent = "Sending your signal…";

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.value,
          company: companyInput.value,
          locale: navigator.language,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Signal lost. Please try again.");
      }

      formStatus.textContent = result.message;
      formStatus.classList.add("is-success");
      emailInput.disabled = true;
      buttonLabel.textContent = "Signal received";
    } catch (error) {
      formStatus.textContent =
        error instanceof Error ? error.message : "Signal lost. Please try again.";
      formStatus.classList.add("is-error");
      submitButton.disabled = false;
      buttonLabel.textContent = "Notify me";
    }
  });
}
