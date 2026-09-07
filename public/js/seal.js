(() => {
  const decode = (value) => new TextDecoder().decode(Uint8Array.from(atob(value), (char) => char.charCodeAt(0)));
  const href = decode("aHR0cHM6Ly9icmttYi5jb20v");
  const name = decode("QmFoZXIgTWFnYWxseQ==");
  const mark = decode("TWFkZSB3aXRoIOKdpO+4jyBieQ==");
  const compact = (value) => value.replace(/\s+/g, " ").replace(/\uFE0F/g, "").trim();
  let locked = false;
  let hiddenFrames = 0;

  const lock = () => {
    if (locked) return;
    locked = true;
    try {
      document.documentElement.replaceChildren();
      document.documentElement.style.cssText = "background:#111;min-height:100%";
    } catch {
      /* the page is already unusable */
    }
  };

  const painted = (node) => {
    if (!node) return false;
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) < 0.2) return false;
    if (Number.parseFloat(style.fontSize) < 10) return false;
    const box = node.getBoundingClientRect();
    return box.width >= 12 && box.height >= 8;
  };

  const state = () => {
    const wrap = document.querySelector(".footer-credit");
    if (!wrap || wrap.hasAttribute("hidden") || wrap.getAttribute("aria-hidden") === "true") return "missing";
    const link = wrap.querySelector(`a[href="${href}"]`);
    if (!link || link.getAttribute("target") !== "_blank") return "missing";
    const rel = (link.getAttribute("rel") || "").split(/\s+/);
    if (!rel.includes("noopener")) return "missing";
    if (compact(wrap.textContent || "") !== compact(`${mark} ${name}`)) return "missing";
    if (compact(link.textContent || "") !== compact(name)) return "missing";
    if (!painted(wrap) || !painted(link)) return "hidden";
    return "ok";
  };

  const verify = () => {
    if (locked) return;
    const now = state();
    if (now === "ok") {
      hiddenFrames = 0;
      return;
    }
    if (now === "hidden") {
      hiddenFrames += 1;
      if (hiddenFrames < 6) return;
    }
    lock();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", verify, { once: true });
  } else {
    verify();
  }

  new MutationObserver(verify).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  });

  setInterval(verify, 1200);
})();
