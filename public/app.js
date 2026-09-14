(() => {
  const I18N = {
    ar: {
      kicker: "لتسلا · موجة الطريق",
      lead: "تنقّل اجتماعي بروح Waze، مصمم لشاشة السيارة، مع جزيرة أغاني بستايل تسلا وربط Spotify.",
      start: "ابدأ القيادة",
      demo: "تجربة بدون GPS",
      note: "افتح الموقع من متصفح تسلا، اسمح بالموقع، واحفظه في الإشارات. التطبيق مستقل وغير تابع لـ Waze أو Tesla أو Spotify.",
      search: "إلى أين؟",
      searchPh: "ابحث عن مكان",
      go: "اذهب",
      close: "إغلاق",
      home: "المنزل",
      work: "العمل",
      pickRoute: "اختر المسار",
      cancel: "إلغاء",
      report: "تبليغ",
      reportTitle: "تبليغ على الطريق",
      police: "شرطة",
      accident: "حادث",
      hazard: "خطر",
      traffic: "ازدحام",
      camera: "كاميرا",
      closure: "إغلاق",
      musicIdle: "Spotify",
      musicHint: "اربط الحساب للتحكم من الشاشة",
      songPh: "ابحث عن أغنية",
      play: "تشغيل",
      connectSpotify: "ربط Spotify",
      spotifyNote: "التشغيل داخل المتصفح يحتاج Spotify Premium ودعم DRM. في تسلا الأفضل التحكم في تطبيق Spotify الأصلي عبر Connect.",
      settings: "إعدادات",
      language: "اللغة",
      units: "الوحدات",
      recenter: "موقعي",
      voice: "الصوت",
      night: "ليلي",
      follow: "اتجاه السير",
      satellite: "قمر صناعي",
      policeAhead: "شرطة أمامك",
      policeSound: "صوت تنبيه الشرطة",
      limit: "حد",
      locating: "جاري تحديد موقعك…",
      gpsDenied: "الموقع مرفوض. استخدم وضع التجربة أو اسمح بالموقع من المتصفح.",
      noResults: "لا توجد نتائج",
      reported: "تم إرسال التبليغ",
      noRoute: "تعذر حساب المسار",
      startNav: "انطلق",
      fastest: "الأسرع",
      shortest: "الأقصر",
      alt: "بديل",
      then: "ثم",
      connectHint: "أضف Redirect URI التالي في لوحة Spotify Developer",
      playingOn: "التشغيل على",
      noDevice: "افتح Spotify في السيارة أو الهاتف ثم اضغط تشغيل",
      teslaDevice: "تسلا",
    },
    en: {
      kicker: "Tesla · road wave",
      lead: "Waze-style social navigation built for the Tesla screen, with a Tesla-like now-playing island and Spotify.",
      start: "Start driving",
      demo: "Try without GPS",
      note: "Open this in the Tesla browser, allow location, and bookmark it. Independent — not affiliated with Waze, Tesla, or Spotify.",
      search: "Where to?",
      searchPh: "Search for a place",
      go: "Go",
      close: "Close",
      home: "Home",
      work: "Work",
      pickRoute: "Choose a route",
      cancel: "Cancel",
      report: "Report",
      reportTitle: "Report on the road",
      police: "Police",
      accident: "Accident",
      hazard: "Hazard",
      traffic: "Traffic",
      camera: "Camera",
      closure: "Closure",
      musicIdle: "Spotify",
      musicHint: "Connect to control music from the screen",
      songPh: "Search for a song",
      play: "Play",
      connectSpotify: "Connect Spotify",
      spotifyNote: "In-browser playback needs Spotify Premium and DRM. In a Tesla, controlling the native Spotify app via Connect is more reliable.",
      settings: "Settings",
      language: "Language",
      units: "Units",
      recenter: "Recenter",
      voice: "Voice",
      night: "Night",
      follow: "Follow heading",
      satellite: "Satellite",
      policeAhead: "POLICE AHEAD",
      policeSound: "Police alert sound",
      limit: "LIM",
      locating: "Finding your location…",
      gpsDenied: "Location blocked. Use demo mode or allow GPS in the browser.",
      noResults: "No results",
      reported: "Report sent",
      noRoute: "Could not build a route",
      startNav: "Go",
      fastest: "Fastest",
      shortest: "Shortest",
      alt: "Alt",
      then: "Then",
      connectHint: "Add this Redirect URI in the Spotify Developer dashboard",
      playingOn: "Playing on",
      noDevice: "Open Spotify in the car or phone, then press play",
      teslaDevice: "Tesla",
    },
  };

  const ALERT_ICON = {
    police: "🚓",
    accident: "💥",
    hazard: "⚠️",
    traffic: "🚗",
    camera: "📷",
    closure: "⛔",
  };

  const MANEUVER = {
    ar: {
      depart: "انطلق",
      arrive: "وصلت",
      turn: "انعطف",
      "new name": "استمر",
      merge: "ادمج",
      onramp: "ادخل المنحدر",
      offramp: "اخرج",
      fork: "خذ المخرج",
      "end of road": "في نهاية الطريق",
      continue: "استمر",
      roundabout: "الدوار",
      "exit roundabout": "اخرج من الدوار",
      notification: "تنبيه",
    },
    en: {
      depart: "Depart",
      arrive: "Arrive",
      turn: "Turn",
      "new name": "Continue",
      merge: "Merge",
      onramp: "Take the ramp",
      offramp: "Take the exit",
      fork: "Keep",
      "end of road": "At the end of the road",
      continue: "Continue",
      roundabout: "Roundabout",
      "exit roundabout": "Exit the roundabout",
      notification: "Notice",
    },
  };

  const state = {
    lang: localStorage.getItem("mawja_lang") || "ar",
    units: localStorage.getItem("mawja_units") || "km",
    night: localStorage.getItem("mawja_night") !== "0",
    satellite: localStorage.getItem("mawja_satellite") === "1",
    voice: localStorage.getItem("mawja_voice") !== "0",
    policeSound: localStorage.getItem("mawja_police_sound") === "1",
    follow: true,
    demo: false,
    started: false,
    config: { defaultCenter: { lat: 30.0444, lon: 31.2357 }, spotifyClientId: "" },
    position: null,
    heading: 0,
    speedMs: 0,
    lastFix: null,
    destination: null,
    routes: [],
    activeRoute: null,
    stepIndex: 0,
    map: null,
    carMarker: null,
    previewMarker: null,
    routeLine: null,
    altLines: [],
    alertMarkers: [],
    liveAlerts: [],
    tiles: null,
    lastSpoken: "",
    lastAlertFetch: 0,
    lastLimitFetch: 0,
    seenPolice: {},
    policeWarmup: 0,
    player: null,
    tokens: null,
    spotifyDeviceId: null,
    playback: null,
  };

  const els = {
    splash: document.getElementById("splash"),
    hud: document.getElementById("hud"),
    banner: document.getElementById("banner"),
    bannerIcon: document.getElementById("banner-icon"),
    bannerDistance: document.getElementById("banner-distance"),
    bannerText: document.getElementById("banner-text"),
    bannerThen: document.getElementById("banner-then"),
    eta: document.getElementById("eta"),
    etaTime: document.getElementById("eta-time"),
    etaMeta: document.getElementById("eta-meta"),
    etaArrival: document.getElementById("eta-arrival"),
    speedValue: document.getElementById("speed-value"),
    speedUnit: document.getElementById("speed-unit"),
    speedLimit: document.getElementById("speed-limit"),
    speedLimitValue: document.getElementById("speed-limit-value"),
    searchSheet: document.getElementById("search-sheet"),
    searchInput: document.getElementById("search-input"),
    searchResults: document.getElementById("search-results"),
    routeSheet: document.getElementById("route-sheet"),
    routeChoices: document.getElementById("route-choices"),
    reportSheet: document.getElementById("report-sheet"),
    musicSheet: document.getElementById("music-sheet"),
    settingsSheet: document.getElementById("settings-sheet"),
    toast: document.getElementById("toast"),
    musicTitle: document.getElementById("music-title"),
    musicArtist: document.getElementById("music-artist"),
    musicArt: document.getElementById("music-art"),
    musicPlayIcon: document.getElementById("music-play-icon"),
    nowTitle: document.getElementById("now-title"),
    nowArtist: document.getElementById("now-artist"),
    nowArt: document.getElementById("now-art"),
    progressBar: document.getElementById("progress-bar"),
    trackResults: document.getElementById("track-results"),
    deviceList: document.getElementById("device-list"),
    spotifyClientId: document.getElementById("spotify-client-id"),
    redirectHint: document.getElementById("redirect-hint"),
    langSelect: document.getElementById("lang-select"),
    unitSelect: document.getElementById("unit-select"),
    alertCounts: document.getElementById("alert-counts"),
    policeAlert: document.getElementById("police-alert"),
    policeSound: document.getElementById("police-sound"),
    recenter: document.getElementById("btn-recenter"),
  };

  const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;

  function applyI18n() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      node.setAttribute("placeholder", t(node.getAttribute("data-i18n-placeholder")));
    });
    document.querySelectorAll("[data-i18n-title]").forEach((node) => {
      node.setAttribute("title", t(node.getAttribute("data-i18n-title")));
    });
    els.langSelect.value = state.lang;
    els.unitSelect.value = state.units;
    els.speedUnit.textContent = state.units === "mi" ? "mph" : "km/h";
    document.body.classList.toggle("day", !state.night);
    els.redirectHint.textContent = `${t("connectHint")}: ${redirectUri()}`;
    els.policeSound.checked = state.policeSound;
  }

  function toast(message) {
    els.toast.hidden = false;
    els.toast.textContent = message;
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => {
      els.toast.hidden = true;
    }, 2800);
  }

  function redirectUri() {
    return `${window.location.origin}/callback`;
  }

  function spotifyClientId() {
    return (
      (els.spotifyClientId.value || "").trim() ||
      localStorage.getItem("mawja_spotify_client_id") ||
      state.config.spotifyClientId ||
      ""
    );
  }

  function carSvg() {
    return `<svg class="car-icon" viewBox="0 0 40 64"><path d="M20 2c6 0 10 4 11 10l4 20c1 6-2 14-7 18l-8 10-8-10c-5-4-8-12-7-18l4-20C10 6 14 2 20 2z" fill="#ff8a3d" stroke="#fff" stroke-width="3"/><circle cx="20" cy="24" r="5" fill="#102030"/></svg>`;
  }

  function tileUrl() {
    if (state.satellite) {
      return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    }
    return state.night
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
      : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";
  }

  function initMap() {
    const center = [state.config.defaultCenter.lat, state.config.defaultCenter.lon];
    state.map = L.map("map", {
      zoomControl: false,
      attributionControl: true,
      fadeAnimation: false,
      markerZoomAnimation: false,
      preferCanvas: true,
    }).setView(center, 13);

    state.tiles = L.tileLayer(tileUrl(), {
      maxZoom: 19,
      attribution: "&copy; Esri",
    }).addTo(state.map);

    const icon = L.divIcon({ className: "", html: carSvg(), iconSize: [34, 52], iconAnchor: [17, 26] });
    state.carMarker = L.marker(center, { icon, zIndexOffset: 600 }).addTo(state.map);
    state.map.on("dragstart", () => {
      state.follow = false;
      els.recenter.hidden = false;
    });
    bindLongPress();
  }

  function bindLongPress() {
    let timer = 0;
    let startPoint = null;
    const begin = (event) => {
      startPoint = event.latlng;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!startPoint) return;
        void requestRoute({ lat: startPoint.lat, lon: startPoint.lng, name: t("search") });
      }, 550);
    };
    const cancel = (event) => {
      if (!startPoint) {
        window.clearTimeout(timer);
        return;
      }
      if (event && event.latlng && state.map.distance(startPoint, event.latlng) > 14) {
        window.clearTimeout(timer);
        startPoint = null;
      }
    };
    const end = () => {
      window.clearTimeout(timer);
      startPoint = null;
    };
    state.map.on("mousedown", begin);
    state.map.on("touchstart", begin);
    state.map.on("mouseup", end);
    state.map.on("touchend", end);
    state.map.on("mousemove", cancel);
    state.map.on("touchmove", cancel);
  }

  function bearing(from, to) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;
    const dLon = toRad(to[1] - from[1]);
    const lat1 = toRad(from[0]);
    const lat2 = toRad(to[0]);
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  }

  function haversine(a, b) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(b[0] - a[0]);
    const dLon = toRad(b[1] - a[1]);
    const s =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 6371000 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }

  function setTiles() {
    if (!state.tiles) return;
    state.tiles.setUrl(tileUrl());
    document.body.classList.toggle("day", !state.night);
  }

  function kmh(ms) {
    const km = (ms || 0) * 3.6;
    return state.units === "mi" ? km * 0.621371 : km;
  }

  function formatDistance(meters) {
    if (state.units === "mi") {
      const miles = meters / 1609.34;
      return miles < 0.2 ? `${Math.round(meters * 3.28084)} ft` : `${miles.toFixed(1)} mi`;
    }
    return meters < 1000 ? `${Math.round(meters)} م` : `${(meters / 1000).toFixed(1)} كم`;
  }

  function formatDuration(seconds) {
    const min = Math.max(1, Math.round(seconds / 60));
    if (min < 60) return state.lang === "ar" ? `${min} د` : `${min} min`;
    const hours = Math.floor(min / 60);
    const rest = min % 60;
    return state.lang === "ar" ? `${hours} س ${rest} د` : `${hours} h ${rest} m`;
  }

  function maneuverText(step) {
    const dict = MANEUVER[state.lang] || MANEUVER.en;
    const type = dict[step.type] || dict.turn;
    const side =
      step.modifier && step.modifier.includes("left")
        ? state.lang === "ar"
          ? "يسارًا"
          : "left"
        : step.modifier && step.modifier.includes("right")
          ? state.lang === "ar"
            ? "يمينًا"
            : "right"
          : "";
    const road = step.name ? (state.lang === "ar" ? `على ${step.name}` : `onto ${step.name}`) : "";
    return [type, side, road].filter(Boolean).join(" ");
  }

  function speak(text) {
    if (!state.voice || !text || text === state.lastSpoken || !window.speechSynthesis) return;
    state.lastSpoken = text;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = state.lang === "ar" ? "ar-EG" : "en-US";
    utter.rate = 1.05;
    window.speechSynthesis.speak(utter);
  }

  function updateCarMarker(latlng, heading) {
    if (!state.carMarker) return;
    state.carMarker.setLatLng(latlng);
    const el = state.carMarker.getElement();
    if (el) {
      const inner = el.querySelector("svg");
      if (inner) inner.style.transform = `rotate(${heading || 0}deg)`;
    }
    if (state.follow) {
      state.map.setView(latlng, Math.max(state.map.getZoom(), 16), { animate: false });
    }
  }

  function remainingRouteMetrics(route, position) {
    if (!route || !route.geometry || route.geometry.length < 2) {
      return { distance: route ? route.distance : 0, duration: route ? route.duration : 0 };
    }
    let nearest = 0;
    let best = Infinity;
    for (let i = 0; i < route.geometry.length; i += 1) {
      const point = route.geometry[i];
      const d = state.map.distance(position, point);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    let distance = 0;
    for (let i = nearest; i < route.geometry.length - 1; i += 1) {
      distance += state.map.distance(route.geometry[i], route.geometry[i + 1]);
    }
    const ratio = route.distance ? distance / route.distance : 1;
    return { distance, duration: route.duration * ratio, off: best };
  }

  function setActiveRoute(route) {
    state.activeRoute = route;
    state.stepIndex = 0;
    if (state.routeLine) state.map.removeLayer(state.routeLine);
    state.altLines.forEach((line) => state.map.removeLayer(line));
    state.altLines = [];
    state.routeLine = L.polyline(route.geometry, {
      color: "#3ddcff",
      weight: 9,
      opacity: 0.95,
      lineJoin: "round",
    }).addTo(state.map);
    state.map.fitBounds(state.routeLine.getBounds(), { padding: [60, 60] });
    els.eta.hidden = false;
    els.banner.hidden = false;
    document.getElementById("search-open").hidden = true;
    updateNavUi();
    speak(maneuverText(route.steps[0] || { type: "depart" }));
  }

  function updateNavUi() {
    const route = state.activeRoute;
    if (!route || !state.position) return;
    const metrics = remainingRouteMetrics(route, state.position);
    if (metrics.off > 120 && !state.demo) {
      void requestRoute(state.destination, true);
      return;
    }

    while (
      state.stepIndex < route.steps.length - 1 &&
      state.map.distance(state.position, [route.steps[state.stepIndex].lat, route.steps[state.stepIndex].lon]) < 35
    ) {
      state.stepIndex += 1;
      speak(maneuverText(route.steps[state.stepIndex]));
    }

    const step = route.steps[state.stepIndex] || route.steps[route.steps.length - 1];
    const next = route.steps[state.stepIndex + 1];
    const stepDistance =
      step && state.position ? state.map.distance(state.position, [step.lat, step.lon]) : step ? step.distance : 0;
    els.bannerDistance.textContent = formatDistance(stepDistance);
    els.bannerText.textContent = maneuverText(step || { type: "continue" });
    els.bannerThen.textContent = next ? `${t("then")} ${maneuverText(next)}` : "";
    els.bannerIcon.textContent = (step && step.modifier && step.modifier.includes("left") ? "↰" : "↱");
    els.etaTime.textContent = formatDuration(metrics.duration);
    els.etaMeta.textContent = formatDistance(metrics.distance);
    const arrival = new Date(Date.now() + metrics.duration * 1000);
    els.etaArrival.textContent = arrival.toLocaleTimeString(state.lang === "ar" ? "ar-EG" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    if (metrics.distance < 25) {
      speak(state.lang === "ar" ? "وصلت" : "You have arrived");
      stopNav();
    }
  }

  function stopNav() {
    state.activeRoute = null;
    state.destination = null;
    if (state.routeLine) {
      state.map.removeLayer(state.routeLine);
      state.routeLine = null;
    }
    els.eta.hidden = true;
    els.banner.hidden = true;
    document.getElementById("search-open").hidden = false;
  }

  async function requestRoute(dest, silent) {
    if (!state.position || !dest) return;
    const from = `${state.position[0]},${state.position[1]}`;
    const to = `${dest.lat},${dest.lon}`;
    let payload;
    try {
      const response = await fetch(`/api/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      payload = await response.json();
    } catch {
      if (!silent) toast(t("noRoute"));
      return;
    }
    if (!payload.ok || !payload.routes || !payload.routes.length) {
      if (!silent) toast(t("noRoute"));
      return;
    }
    state.routes = payload.routes;
    state.destination = dest;
    if (silent || payload.routes.length === 1) {
      setActiveRoute(payload.routes[0]);
      return;
    }
    els.routeChoices.innerHTML = "";
    payload.routes.forEach((route, index) => {
      const labels = [t("fastest"), t("shortest"), t("alt")];
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${labels[index] || t("alt")} · ${formatDuration(route.duration)} · ${formatDistance(route.distance)}`;
      button.addEventListener("click", () => {
        setActiveRoute(route);
        els.routeSheet.hidden = true;
      });
      els.routeChoices.appendChild(button);
    });
    els.routeSheet.hidden = false;
  }

  async function searchPlaces(query) {
    const response = await fetch(
      `/api/geocode?lang=${state.lang}&q=${encodeURIComponent(query)}${
        state.position ? `&lat=${state.position[0]}&lon=${state.position[1]}` : ""
      }`,
    );
    const payload = await response.json();
    els.searchResults.innerHTML = "";
    if (!payload.ok || !payload.results.length) {
      els.searchResults.textContent = t("noResults");
      return;
    }
    payload.results.forEach((place) => {
      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = `<strong>${place.name}</strong><div>${place.label}</div>`;
      button.addEventListener("click", () => {
        els.searchSheet.hidden = true;
        void requestRoute({ lat: place.lat, lon: place.lon, name: place.name });
      });
      els.searchResults.appendChild(button);
    });
  }

  async function refreshAlerts() {
    if (!state.map || Date.now() - state.lastAlertFetch < 15000) return;
    state.lastAlertFetch = Date.now();
    const bounds = state.map.getBounds();
    const qs = `minLat=${bounds.getSouth()}&minLon=${bounds.getWest()}&maxLat=${bounds.getNorth()}&maxLon=${bounds.getEast()}`;
    const response = await fetch(`/api/alerts?${qs}`);
    const payload = await response.json();
    if (!payload.ok) return;
    state.alertMarkers.forEach((marker) => state.map.removeLayer(marker));
    state.liveAlerts = payload.alerts;
    state.alertMarkers = payload.alerts.map((alert) => {
      const marker = L.marker([alert.lat, alert.lon], {
        icon: L.divIcon({
          className: "",
          html: `<div class="alert-pin ${alert.type}">${ALERT_ICON[alert.type] || "•"}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        }),
      }).addTo(state.map);
      return marker;
    });
    renderAlertCounts(payload.alerts);
    checkPoliceAhead(payload.alerts);
  }

  function renderAlertCounts(alerts) {
    const counts = { police: 0, accident: 0, hazard: 0, closure: 0 };
    alerts.forEach((alert) => {
      if (counts[alert.type] != null) counts[alert.type] += 1;
    });
    const parts = [];
    if (counts.police) parts.push(`<span>🚓 ${counts.police}</span>`);
    if (counts.accident) parts.push(`<span>💥 ${counts.accident}</span>`);
    if (counts.hazard) parts.push(`<span>⚠️ ${counts.hazard}</span>`);
    if (counts.closure) parts.push(`<span>⛔ ${counts.closure}</span>`);
    els.alertCounts.innerHTML = parts.join("");
    els.alertCounts.hidden = parts.length === 0;
  }

  function checkPoliceAhead(alerts) {
    if (!state.position || !state.policeWarmup) {
      state.policeWarmup = Date.now();
    }
    if (Date.now() - state.policeWarmup < 10000) {
      alerts
        .filter((alert) => alert.type === "police")
        .forEach((alert) => {
          state.seenPolice[alert.id] = true;
        });
      return;
    }
    const nearby = alerts.find((alert) => {
      if (alert.type !== "police" || state.seenPolice[alert.id]) return false;
      const distance = haversine(state.position, [alert.lat, alert.lon]);
      if (distance > 800) return false;
      const angle = Math.abs(
        ((bearing(state.position, [alert.lat, alert.lon]) - state.heading + 540) % 360) - 180,
      );
      return angle <= 90;
    });
    if (!nearby) return;
    state.seenPolice[nearby.id] = true;
    els.policeAlert.hidden = false;
    if (state.policeSound) speak(t("policeAhead"));
    window.setTimeout(() => {
      els.policeAlert.hidden = true;
    }, 5000);
  }

  async function refreshSpeedLimit() {
    if (!state.position || Date.now() - state.lastLimitFetch < 12000) return;
    state.lastLimitFetch = Date.now();
    const response = await fetch(`/api/speed-limit?lat=${state.position[0]}&lon=${state.position[1]}`);
    const payload = await response.json();
    const limit = payload.ok && payload.result && payload.result.limit;
    if (limit) {
      els.speedLimit.hidden = false;
      els.speedLimitValue.textContent = String(limit);
    }
  }

  function onPosition(lat, lon, heading, speed) {
    const next = [lat, lon];
    if (state.lastFix && (!Number.isFinite(heading) || heading == null)) {
      const moved = haversine(state.lastFix, next);
      if (moved > 3) heading = bearing(state.lastFix, next);
    }
    state.lastFix = next;
    state.position = next;
    state.heading = heading || state.heading;
    state.speedMs = Number.isFinite(speed) ? speed : state.speedMs;
    els.speedValue.textContent = String(Math.max(0, Math.round(kmh(state.speedMs))));
    updateCarMarker(state.position, state.heading);
    if (state.activeRoute) updateNavUi();
    void refreshAlerts();
    void refreshSpeedLimit();
  }

  function startWatch() {
    if (!navigator.geolocation) {
      toast(t("gpsDenied"));
      return;
    }
    toast(t("locating"));
    navigator.geolocation.watchPosition(
      (pos) => {
        onPosition(
          pos.coords.latitude,
          pos.coords.longitude,
          pos.coords.heading,
          pos.coords.speed,
        );
      },
      () => toast(t("gpsDenied")),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 8000 },
    );
  }

  function startDemo() {
    state.demo = true;
    const origin = state.config.defaultCenter;
    onPosition(origin.lat, origin.lon, 0, 12);
    const dest = { lat: origin.lat + 0.035, lon: origin.lon + 0.02, name: "Demo" };
    void requestRoute(dest, true).then(() => {
      if (!state.activeRoute) return;
      const points = state.activeRoute.geometry;
      let index = 0;
      window.setInterval(() => {
        index = Math.min(index + 1, points.length - 1);
        const point = points[index];
        const next = points[Math.min(index + 1, points.length - 1)];
        const heading = (Math.atan2(next[1] - point[1], next[0] - point[0]) * 180) / Math.PI;
        onPosition(point[0], point[1], heading, 14);
      }, 700);
    });
  }

  async function sendReport(type) {
    if (!state.position) return;
    const response = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, lat: state.position[0], lon: state.position[1] }),
    });
    const payload = await response.json();
    if (payload.ok) {
      toast(t("reported"));
      state.lastAlertFetch = 0;
      void refreshAlerts();
    }
  }

  function openSheet(el) {
    [els.searchSheet, els.routeSheet, els.reportSheet, els.musicSheet, els.settingsSheet].forEach((sheet) => {
      sheet.hidden = sheet !== el;
    });
  }

  function closeSheets() {
    [els.searchSheet, els.routeSheet, els.reportSheet, els.musicSheet, els.settingsSheet].forEach((sheet) => {
      sheet.hidden = true;
    });
  }

  function loadTokens() {
    try {
      state.tokens = JSON.parse(localStorage.getItem("mawja_spotify") || "null");
    } catch {
      state.tokens = null;
    }
  }

  function saveTokens(tokens) {
    state.tokens = {
      ...state.tokens,
      ...tokens,
      obtained_at: Date.now(),
    };
    localStorage.setItem("mawja_spotify", JSON.stringify(state.tokens));
  }

  async function validAccessToken() {
    if (!state.tokens || !state.tokens.access_token) return null;
    const age = Date.now() - (state.tokens.obtained_at || 0);
    const expires = (state.tokens.expires_in || 3600) * 1000 - 30000;
    if (age < expires) return state.tokens.access_token;
    const response = await fetch("/api/spotify/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: spotifyClientId(),
        refresh_token: state.tokens.refresh_token,
      }),
    });
    const payload = await response.json();
    if (!payload.ok) return null;
    saveTokens(payload.tokens);
    return state.tokens.access_token;
  }

  async function spotifyApi(path, method, body) {
    const token = await validAccessToken();
    if (!token) throw new Error("No Spotify token");
    const response = await fetch(`https://api.spotify.com/v1${path}`, {
      method: method || "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (response.status === 204) return null;
    return response.json();
  }

  function renderPlayback(player) {
    if (!player || !player.item) return;
    const title = player.item.name;
    const artist = (player.item.artists || []).map((item) => item.name).join(", ");
    const art = (((player.item.album || {}).images || [])[0] || {}).url || "";
    els.musicTitle.textContent = title;
    els.nowTitle.textContent = title;
    els.musicArtist.textContent = artist;
    els.nowArtist.textContent = artist;
    els.musicArt.src = art;
    els.nowArt.src = art;
    const playing = player.is_playing;
    els.musicPlayIcon.textContent = playing ? "❚❚" : "▶";
    document.getElementById("toggle-track").textContent = playing ? "❚❚" : "▶";
    const pct = player.progress_ms && player.item.duration_ms ? (player.progress_ms / player.item.duration_ms) * 100 : 0;
    els.progressBar.style.width = `${pct}%`;
    state.playback = player;
  }

  async function refreshPlayback() {
    if (!state.tokens) return;
    try {
      const player = await spotifyApi("/me/player");
      if (player) renderPlayback(player);
      const devices = await spotifyApi("/me/player/devices");
      if (devices && devices.devices) {
        els.deviceList.innerHTML = "";
        devices.devices.forEach((device) => {
          const button = document.createElement("button");
          button.type = "button";
          const tesla = /tesla/i.test(device.name) ? ` · ${t("teslaDevice")}` : "";
          button.textContent = `${t("playingOn")} ${device.name}${tesla}`;
          button.addEventListener("click", () => {
            void spotifyApi("/me/player", "PUT", { device_ids: [device.id], play: true });
          });
          els.deviceList.appendChild(button);
        });
        if (!devices.devices.length) {
          els.deviceList.textContent = t("noDevice");
        }
      }
    } catch {
      // Spotify is optional; keep driving if the session expired.
    }
  }

  async function connectSpotify() {
    const clientId = spotifyClientId();
    if (!clientId) {
      openSheet(els.settingsSheet);
      toast("Spotify Client ID");
      return;
    }
    localStorage.setItem("mawja_spotify_client_id", clientId);
    const verifierBytes = new Uint8Array(32);
    crypto.getRandomValues(verifierBytes);
    const verifier = Array.from(verifierBytes, (byte) => ("0" + byte.toString(16)).slice(-2)).join("");
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
    const challenge = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    localStorage.setItem("mawja_pkce", verifier);
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri(),
      code_challenge_method: "S256",
      code_challenge: challenge,
      scope: [
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "streaming",
        "user-read-email",
      ].join(" "),
    });
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async function handleSpotifyCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return;
    const verifier = localStorage.getItem("mawja_pkce");
    const response = await fetch("/api/spotify/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        code_verifier: verifier,
        redirect_uri: redirectUri(),
        client_id: spotifyClientId(),
      }),
    });
    const payload = await response.json();
    if (payload.ok) {
      saveTokens(payload.tokens);
      history.replaceState({}, "", "/");
      toast("Spotify");
      void refreshPlayback();
      void setupWebPlayback();
    }
  }

  function setupWebPlayback() {
    if (window.Spotify || document.getElementById("spotify-sdk")) {
      void createSpotifyPlayer();
      return;
    }
    window.onSpotifyWebPlaybackSDKReady = () => {
      void createSpotifyPlayer();
    };
    const script = document.createElement("script");
    script.id = "spotify-sdk";
    script.src = "https://sdk.scdn.co/spotify-player.js";
    document.body.appendChild(script);
  }

  async function createSpotifyPlayer() {
    if (!window.Spotify || state.player) return;
    const token = await validAccessToken();
    if (!token) return;
    state.player = new window.Spotify.Player({
      name: "Mawja Tesla",
      getOAuthToken: (cb) => {
        void validAccessToken().then((value) => cb(value || token));
      },
      volume: 0.8,
    });
    state.player.addListener("ready", ({ device_id }) => {
      state.spotifyDeviceId = device_id;
    });
    state.player.addListener("initialization_error", () => {
      state.player = null;
    });
    state.player.addListener("authentication_error", () => {
      state.player = null;
    });
    await state.player.connect();
  }

  async function playUri(uri) {
    const device = state.spotifyDeviceId;
    try {
      await spotifyApi(`/me/player/play${device ? `?device_id=${device}` : ""}`, "PUT", { uris: [uri] });
    } catch {
      toast(t("noDevice"));
    }
    window.setTimeout(() => void refreshPlayback(), 800);
  }

  async function searchTracks(query) {
    const payload = await spotifyApi(`/search?type=track&limit=6&q=${encodeURIComponent(query)}`);
    els.trackResults.innerHTML = "";
    (payload.tracks && payload.tracks.items ? payload.tracks.items : []).forEach((track) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${track.name} — ${(track.artists || []).map((item) => item.name).join(", ")}`;
      button.addEventListener("click", () => void playUri(track.uri));
      els.trackResults.appendChild(button);
    });
  }

  async function startApp(demo) {
    if (state.started) return;
    state.started = true;
    els.splash.hidden = true;
    els.hud.hidden = false;
    if (navigator.wakeLock && navigator.wakeLock.request) {
      navigator.wakeLock.request("screen").catch(() => undefined);
    }
    if (demo) startDemo();
    else startWatch();
    void refreshAlerts();
    if (state.tokens) {
      void refreshPlayback();
      void setupWebPlayback();
    }
    window.setInterval(() => void refreshPlayback(), 4000);
  }

  function bind() {
    document.getElementById("start-drive").addEventListener("click", () => void startApp(false));
    document.getElementById("start-demo").addEventListener("click", () => void startApp(true));
    document.getElementById("search-open").addEventListener("click", () => {
      openSheet(els.searchSheet);
      els.searchInput.focus();
    });
    document.getElementById("search-close").addEventListener("click", closeSheets);
    document.getElementById("route-cancel").addEventListener("click", closeSheets);
    document.getElementById("report-open").addEventListener("click", () => openSheet(els.reportSheet));
    document.getElementById("report-close").addEventListener("click", closeSheets);
    document.getElementById("music-toggle").addEventListener("click", () => openSheet(els.musicSheet));
    document.getElementById("music-close").addEventListener("click", closeSheets);
    document.getElementById("btn-settings").addEventListener("click", () => openSheet(els.settingsSheet));
    document.getElementById("settings-close").addEventListener("click", closeSheets);
    document.getElementById("btn-stop").addEventListener("click", stopNav);
    document.getElementById("btn-recenter").addEventListener("click", () => {
      state.follow = true;
      els.recenter.hidden = true;
      if (state.position) state.map.setView(state.position, 16, { animate: false });
    });
      document.getElementById("btn-compass").addEventListener("click", () => {
      state.follow = !state.follow;
      els.recenter.hidden = state.follow;
      if (state.follow && state.position) state.map.setView(state.position, Math.max(state.map.getZoom(), 16), { animate: false });
    });
    document.getElementById("btn-zoom-in").addEventListener("click", () => state.map.zoomIn());
    document.getElementById("btn-zoom-out").addEventListener("click", () => state.map.zoomOut());
    document.getElementById("btn-satellite").addEventListener("click", () => {
      state.satellite = !state.satellite;
      localStorage.setItem("mawja_satellite", state.satellite ? "1" : "0");
      setTiles();
    });
    els.policeSound.addEventListener("change", () => {
      state.policeSound = els.policeSound.checked;
      localStorage.setItem("mawja_police_sound", state.policeSound ? "1" : "0");
    });
    document.getElementById("btn-voice").addEventListener("click", () => {
      state.voice = !state.voice;
      localStorage.setItem("mawja_voice", state.voice ? "1" : "0");
      toast(t("voice"));
    });
    document.getElementById("btn-night").addEventListener("click", () => {
      state.night = !state.night;
      localStorage.setItem("mawja_night", state.night ? "1" : "0");
      setTiles();
    });
    document.getElementById("search-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const query = els.searchInput.value.trim();
      if (query) void searchPlaces(query);
    });
    document.querySelectorAll("[data-place]").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.getAttribute("data-place");
        const saved = localStorage.getItem(`mawja_${key}`);
        if (saved) {
          void requestRoute(JSON.parse(saved));
          closeSheets();
          return;
        }
        if (state.position) {
          localStorage.setItem(
            `mawja_${key}`,
            JSON.stringify({ lat: state.position[0], lon: state.position[1], name: t(key) }),
          );
          toast(t(key));
        }
      });
    });
    document.querySelectorAll("[data-report]").forEach((button) => {
      button.addEventListener("click", () => {
        void sendReport(button.getAttribute("data-report"));
        closeSheets();
      });
    });
    document.getElementById("spotify-connect").addEventListener("click", () => void connectSpotify());
    document.getElementById("music-search-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const query = document.getElementById("music-search").value.trim();
      if (query) void searchTracks(query);
    });
    document.getElementById("toggle-track").addEventListener("click", () => {
      const playing = state.playback && state.playback.is_playing;
      void spotifyApi(playing ? "/me/player/pause" : "/me/player/play", "PUT");
      if (state.player) {
        if (playing) void state.player.pause();
        else void state.player.resume();
      }
      window.setTimeout(() => void refreshPlayback(), 500);
    });
    document.getElementById("next-track").addEventListener("click", () => {
      void spotifyApi("/me/player/next", "POST");
      if (state.player) void state.player.nextTrack();
    });
    document.getElementById("prev-track").addEventListener("click", () => {
      void spotifyApi("/me/player/previous", "POST");
      if (state.player) void state.player.previousTrack();
    });
    els.langSelect.addEventListener("change", () => {
      state.lang = els.langSelect.value;
      localStorage.setItem("mawja_lang", state.lang);
      applyI18n();
    });
    els.unitSelect.addEventListener("change", () => {
      state.units = els.unitSelect.value;
      localStorage.setItem("mawja_units", state.units);
      applyI18n();
    });
    els.spotifyClientId.addEventListener("change", () => {
      localStorage.setItem("mawja_spotify_client_id", els.spotifyClientId.value.trim());
    });
  }

  async function boot() {
    applyI18n();
    loadTokens();
    els.spotifyClientId.value = localStorage.getItem("mawja_spotify_client_id") || "";
    try {
      const response = await fetch("/api/config");
      const payload = await response.json();
      if (payload.ok) state.config = payload.config;
    } catch {
      // Use Cairo fallback if the Worker config call fails.
    }
    if (!els.spotifyClientId.value) els.spotifyClientId.value = state.config.spotifyClientId || "";
    applyI18n();
    initMap();
    bind();
    await handleSpotifyCallback();
    const params = new URLSearchParams(window.location.search);
    if (params.get("code")) void startApp(false);
  }

  void boot();
})();
