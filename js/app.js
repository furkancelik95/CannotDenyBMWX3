const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const askScreen = document.getElementById("ask-screen");
const yesScreen = document.getElementById("yes-screen");
const navCard = document.getElementById("nav-card");

const DESTINATION =
  "Kosifler Oto Bostancı BMW MINI ve BMW Motorrad Yetkili Satıcısı ve Yetkili Servisi, İçerenköy Mah. Askent Sok. No:3B, Ataşehir/İstanbul";
const LAT = 40.96182;
const LNG = 29.11279;

function navigationUrl() {
  const dest = encodeURIComponent(DESTINATION);
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;
}

function appleMapsUrl() {
  return `https://maps.apple.com/?daddr=${LAT},${LNG}&q=${encodeURIComponent(
    "Kosifler Oto Bostancı"
  )}&dirflg=d`;
}

function openNavigation(event) {
  event.preventDefault();
  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const url = isiOS ? appleMapsUrl() : navigationUrl();
  window.location.href = url;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function flee(pointerX, pointerY) {
  const pad = 12;
  const width = noBtn.offsetWidth;
  const height = noBtn.offsetHeight;
  const maxX = Math.max(pad, window.innerWidth - width - pad);
  const maxY = Math.max(pad, window.innerHeight - height - pad);

  noBtn.classList.add("is-fleeing");

  let x = pad;
  let y = pad;
  let best = -1;

  for (let i = 0; i < 18; i += 1) {
    const candidateX = pad + Math.random() * (maxX - pad);
    const candidateY = pad + Math.random() * (maxY - pad);
    const cx = candidateX + width / 2;
    const cy = candidateY + height / 2;
    const dist = Math.hypot(cx - pointerX, cy - pointerY);
    if (dist > best) {
      best = dist;
      x = candidateX;
      y = candidateY;
    }
  }

  noBtn.style.left = `${clamp(x, pad, maxX)}px`;
  noBtn.style.top = `${clamp(y, pad, maxY)}px`;
}

function pointerTooClose(event) {
  const rect = noBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const threshold = Math.max(rect.width, 88);
  return Math.hypot(event.clientX - cx, event.clientY - cy) < threshold;
}

function blockNo(event) {
  event.preventDefault();
  event.stopPropagation();
  flee(event.clientX ?? window.innerWidth / 2, event.clientY ?? window.innerHeight / 2);
}

noBtn.setAttribute("tabindex", "-1");

["pointerenter", "pointerdown", "pointerover", "mouseover", "touchstart", "click"].forEach(
  (type) => {
    noBtn.addEventListener(type, blockNo, { passive: false });
  }
);

noBtn.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    blockNo(event);
  }
});

document.addEventListener(
  "pointermove",
  (event) => {
    if (askScreen.hidden) return;
    if (pointerTooClose(event)) {
      flee(event.clientX, event.clientY);
    }
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  if (!noBtn.classList.contains("is-fleeing")) return;
  flee(window.innerWidth / 2, window.innerHeight / 2);
});

yesBtn.addEventListener("click", () => {
  askScreen.hidden = true;
  yesScreen.hidden = false;
  noBtn.style.display = "none";
});

navCard.setAttribute("href", navigationUrl());
navCard.addEventListener("click", openNavigation);
