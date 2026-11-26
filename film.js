/* Pankaj & Muskan — Save the Date. A cartoon film in seven beats, timed to the reference video. */
(function () {
  const $ = (id) => document.getElementById(id);
  const stage = $("stage"), scene = $("scene");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rnd = (a, b) => a + Math.random() * (b - a);
  // two art sets: the bold one (default) and one drawn in the reference's flat style (?style=flat)
  const FLAT = new URLSearchParams(location.search).get("style") === "flat";
  const A = (n) => `${FLAT ? "art_flat" : "art"}/${n}.webp`;

  /* pausable clock, so the film can skip and pause like a story */
  let token = 0, paused = false;
  function wait(ms) {
    const my = token;
    return new Promise((res) => { let acc = 0, last = performance.now();
      (function f(now) { if (my !== token) return; const dt = now - last; last = now; if (!paused) acc += dt; acc >= ms ? res() : requestAnimationFrame(f); })(last); });
  }
  const anim = (el, kf, o) => el.animate(kf, Object.assign({ fill: "forwards", easing: "cubic-bezier(.2,.7,.2,1)" }, o));
  const el = (tag, cls, parent, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; (parent || scene).appendChild(e); return e; };
  const img = (name, cls, parent, style) => { const e = el("img", "abs " + (cls || ""), parent); e.src = A(name); e.alt = ""; if (style) Object.assign(e.style, style); return e; };
  const layer = (z) => { const l = el("div", "layer"); l.style.zIndex = z || 1; return l; };
  const BOUNCE = "cubic-bezier(.34,1.56,.64,1)";

  /* ---------- 1. Doodle paper: a plane with "Hey Muskan!", a party popper, the couple flying in as superheroes, then it all unzips ---------- */
  async function intro() {
    scene.innerHTML = "";
    const paper = layer(1); img("paper_bg", "full", paper);
    const plane = el("div", "abs", paper); plane.style.cssText = "top:5%;left:100%;width:70cqw";
    img("plane", "", plane, { position: "relative", width: "100%" });
    el("div", "banner-text", plane, "Hey Muskan!").style.cssText = "left:40%;top:38%;";
    anim(plane, [{ transform: "translateX(0)" }, { transform: "translateX(-175cqw)" }], { duration: 5200, easing: "linear" });
    const pop = img("popper", "", paper, { width: "26cqw", left: "8%", top: "52%", transformOrigin: "20% 80%" });
    anim(pop, [{ transform: "scale(0) rotate(-30deg)" }, { transform: "scale(1) rotate(0)" }], { duration: 500, delay: 500, easing: BOUNCE });
    const heroes = img("superheroes", "", paper, { width: "78cqw", left: "-80%", top: "18%" });
    await wait(1000);
    // confetti shoots out of the popper
    anim(pop, [{ transform: "scale(1)" }, { transform: "scale(1.15) rotate(-8deg)" }, { transform: "scale(1)" }], { duration: 400 });
    const cols = ["#e94f64", "#f6b93b", "#4bb3fd", "#6ab04c", "#9b59b6", "#ff7aa8"];
    for (let i = 0; i < 46; i++) { const c = el("i", "confetti abs", paper); c.style.left = "22%"; c.style.top = "58%"; c.style.background = cols[i % cols.length];
      const a = rnd(-80, -10) * Math.PI / 180, d = rnd(30, 75);
      anim(c, [{ transform: "translate(0,0) rotate(0)", opacity: 1 }, { transform: `translate(${Math.cos(a) * d}cqw,${Math.sin(a) * d}cqh) rotate(${rnd(200, 720)}deg)`, opacity: 1, offset: .7 }, { transform: `translate(${Math.cos(a) * d * 1.1}cqw,${Math.sin(a) * d + 12}cqh) rotate(${rnd(720, 900)}deg)`, opacity: 0 }], { duration: rnd(1400, 2200), easing: "cubic-bezier(.1,.8,.3,1)" }); }
    anim(heroes, [{ transform: "translate(0,6cqh) rotate(-6deg)" }, { transform: "translate(102cqw,-2cqh) rotate(-2deg)" }], { duration: 1900, easing: "cubic-bezier(.2,.7,.3,1)" });
    await wait(1700);
    // the page unzips from the top-left corner and the cinema shows through
    const next = layer(2); next.style.clipPath = "circle(0% at 0% 0%)"; img("cinema", "full", next);
    const zip = el("div", "zip abs", scene); zip.style.zIndex = 3; zip.style.left = "0"; zip.style.top = "0";
    anim(next, [{ clipPath: "circle(0% at 0% 0%)" }, { clipPath: "circle(125% at 0% 0%)" }], { duration: 1300, easing: "cubic-bezier(.5,0,.3,1)" });
    anim(zip, [{ width: "0", height: "0", transform: "translate(0,0)" }, { width: "250cqh", height: "250cqh", transform: "translate(-125cqh,-125cqh)" }], { duration: 1300, easing: "cubic-bezier(.5,0,.3,1)" });
    await wait(1300);
  }

  /* ---------- 2. Cinema: the old film countdown 3 – 2 – 1 while the camera pushes in on the two of them ---------- */
  async function cinema() {
    scene.innerHTML = "";
    const l = layer(1); const bg = img("cinema", "full", l); bg.style.transformOrigin = "50% 78%";
    anim(bg, [{ transform: "scale(1)" }, { transform: "scale(1.55)" }], { duration: 3200, easing: "cubic-bezier(.4,0,.6,1)" });
    const num = el("div", "count", l); num.style.cssText = "left:0;right:0;top:12%;font-size:30cqw";
    for (const n of ["3", "2", "1"]) {
      num.textContent = n; anim(num, [{ opacity: 0, transform: "scale(1.4)" }, { opacity: .9, transform: "scale(1)" }], { duration: 260, easing: "ease-out" });
      await wait(900);
    }
    // the lights go down: black bars close in
    const top = el("div", "abs", scene), bot = el("div", "abs", scene);
    [top, bot].forEach((b) => Object.assign(b.style, { left: 0, right: 0, height: "51%", background: "#2b231e", zIndex: 5 }));
    top.style.top = "0"; bot.style.bottom = "0";
    anim(top, [{ transform: "translateY(-100%)" }, { transform: "translateY(0)" }], { duration: 450, easing: "cubic-bezier(.6,0,.4,1)" });
    anim(bot, [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], { duration: 450, easing: "cubic-bezier(.6,0,.4,1)" });
    await wait(500);
  }

  /* ---------- 3. A food date: they sit on the floor, she feeds him noodles, dishes pop in; then the camera finds Pankaj, still on his phone ---------- */
  async function food() {
    scene.innerHTML = "";
    const l = layer(1);
    const couple = img("food", "", l, { width: "92cqw", left: "4cqw", top: "28%", transformOrigin: "50% 60%" });
    anim(couple, [{ transform: "scale(.5)" }, { transform: "scale(.8)" }], { duration: 3600, easing: "cubic-bezier(.3,0,.4,1)" });
    await wait(1900);
    const spots = [["dish1", 3, 66, 27], ["dish2", 70, 65, 26], ["dish3", 26, 72, 27], ["dish4", 50, 71, 24]];
    for (const [n, x, y, w] of spots) { const d = img(n, "", l, { width: w + "cqw", left: x + "%", top: y + "%" }); anim(d, [{ transform: "translateY(30cqh) scale(.6)" }, { transform: "none" }], { duration: 600, easing: BOUNCE }); await wait(260); }
    await wait(900);
    // close-up on Pankaj
    anim(l, [{ transform: "scale(1)" }, { transform: "scale(2.2) translate(16%,-3%)" }], { duration: 650, easing: "cubic-bezier(.6,0,.3,1)" });
    await wait(700);
    anim(couple, [{ transform: "scale(.8)" }, { transform: "scale(.8) translateY(-.6%)" }, { transform: "scale(.8)" }], { duration: 600, iterations: 4, easing: "ease-in-out", fill: "none" });
    await wait(2300);
  }

  /* ---------- 4. On top of a giant noodle: Muskan dances, Pankaj scrolls; then the chopsticks lift the noodles and the car drives out ---------- */
  async function dance() {
    scene.innerHTML = "";
    const l = layer(1);
    const nood = img("noodles", "", l, { width: "72cqw", left: "50%", top: "80%", transformOrigin: "50% 50%" });
    nood.style.transform = "translate(-50%,-50%) rotate(-90deg)";
    const box = el("div", "abs", l); box.style.cssText = "left:9%;top:25%;width:82cqw";
    const frames = ["dance", "dance2", "dance3"].map((n, i) => img(n, "", box, { position: i ? "absolute" : "relative", left: 0, top: 0, width: "100%", opacity: i ? 0 : 1 }));
    anim(box, [{ transform: "translateY(-40cqh)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 600, easing: BOUNCE });
    let k = 0; const beat = setInterval(() => { if (paused) return; frames.forEach((f, i) => (f.style.opacity = i === k % 3 ? 1 : 0)); k++; }, 420);
    await wait(4200); clearInterval(beat);
    // the chopsticks lift the noodles upright; the dancers slide away
    anim(box, [{ transform: "none", opacity: 1 }, { transform: "translateY(55cqh) rotate(8deg) scale(.6)", opacity: 0 }], { duration: 1000, easing: "cubic-bezier(.5,0,.6,1)" });
    anim(nood, [{ transform: "translate(-50%,-50%) rotate(-90deg)" }, { transform: "translate(-50%,-88%) rotate(0deg)" }], { duration: 1300, easing: "cubic-bezier(.5,0,.3,1)" });
    await wait(1200);
    const car = img("car", "", l, { width: "46cqw", left: "-50%", bottom: "6%" });
    anim(car, [{ transform: "translateX(0)" }, { transform: "translateX(210cqw)" }], { duration: 1700, easing: "cubic-bezier(.4,0,.7,1)" });
    await wait(1300);
  }

  /* ---------- 5. Driving through Bhopal ---------- */
  async function drive() {
    scene.innerHTML = "";
    const l = layer(1);
    const city = img("city", "full", l); city.style.transformOrigin = "50% 60%";
    anim(city, [{ transform: "scale(1.15)" }, { transform: "scale(1)" }], { duration: 4200, easing: "linear" });
    const car = img("car", "", l, { width: "78cqw", left: "11cqw", bottom: "8%" });
    anim(car, [{ transform: "translateY(20cqh) scale(.5)" }, { transform: "none" }], { duration: 900, easing: BOUNCE });
    await wait(900);
    anim(car, [{ transform: "translateY(0)" }, { transform: "translateY(-1.2cqh) rotate(.6deg)" }, { transform: "translateY(0)" }], { duration: 380, iterations: 8, easing: "ease-in-out", fill: "none" });
    await wait(3000);
    anim(l, [{ opacity: 1 }, { opacity: 0 }], { duration: 500 }); await wait(500);
  }

  /* ---------- 6. Binoculars: someone is watching for the date ---------- */
  async function binoculars() {
    scene.innerHTML = "";
    const l = layer(1);
    const b = img("binoculars", "", l, { width: "96cqw", left: "2cqw", top: "34%" });
    anim(b, [{ transform: "translateY(70cqh)" }, { transform: "none" }], { duration: 700, easing: BOUNCE });
    await wait(800);
    anim(b, [{ transform: "none" }, { transform: "translateX(-4cqw) rotate(-3deg)" }, { transform: "translateX(4cqw) rotate(3deg)" }, { transform: "none" }], { duration: 1400, easing: "ease-in-out" });
    await wait(1400);
    anim(b, [{ transform: "none" }, { transform: "translateY(70cqh)" }], { duration: 450, easing: "cubic-bezier(.6,0,.8,.3)" });
    await wait(400);
  }

  /* ---------- 7. Save the date ---------- */
  function wavyBorder(parent) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 90 160"); svg.setAttribute("preserveAspectRatio", "none");
    Object.assign(svg.style, { position: "absolute", inset: "3cqw", width: "calc(100% - 6cqw)", height: "calc(100% - 6cqw)", overflow: "visible" });
    let d = "M2 2"; const wv = (x0, y0, x1, y1, n) => { for (let i = 1; i <= n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t, nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny), s = (i % 2 ? 1.6 : -1.6); const cx = x0 + (x1 - x0) * (t - .5 / n) + nx / L * s, cy = y0 + (y1 - y0) * (t - .5 / n) + ny / L * s; d += ` Q${cx.toFixed(2)} ${cy.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)}`; } };
    wv(2, 2, 88, 2, 14); wv(88, 2, 88, 158, 26); wv(88, 158, 2, 158, 14); wv(2, 158, 2, 2, 26);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d); path.setAttribute("fill", "none"); path.setAttribute("stroke", "#f2a23a"); path.setAttribute("stroke-width", "1.6"); path.setAttribute("vector-effect", "non-scaling-stroke"); path.style.strokeWidth = "1.4cqw"; path.setAttribute("stroke-linecap", "round");
    svg.appendChild(path); parent.appendChild(svg);
    const len = path.getTotalLength(); path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
    anim(path, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 1500, easing: "cubic-bezier(.4,0,.2,1)" });
    // little red hearts along the frame
    for (let i = 0; i < 14; i++) { const h = el("div", "abs", parent, "♥"); const side = i % 4, t = rnd(.08, .92);
      Object.assign(h.style, { color: "#d42a3a", fontSize: "3.2cqw", left: side === 1 ? "93%" : side === 3 ? "3%" : `${t * 90 + 4}%`, top: side === 0 ? "1.5%" : side === 2 ? "96%" : `${t * 90 + 4}%` });
      anim(h, [{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 400, delay: 900 + i * 60, easing: BOUNCE }); }
  }
  async function savedate() {
    scene.innerHTML = "";
    const l = layer(1);
    wavyBorder(l);
    const names = el("div", "std-names", l, "PANKAJ &amp; MUSKAN"); anim(names, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 300 });
    const couple = img("savedate", "", l, { width: "64cqw", left: "18cqw", bottom: "0" });
    anim(couple, [{ transform: "translateY(60cqh)" }, { transform: "none" }], { duration: 800, delay: 200, easing: BOUNCE });
    await wait(1100);
    const save = el("div", "std-word std-save", l, "SAVE"), de = el("div", "std-word std-de", l, "द"), date = el("div", "std-word std-date", l, "DATE!");
    anim(save, [{ transform: "translate(10%,-40%) rotate(28deg) scale(.6)", opacity: 0 }, { transform: "translate(-50%,0) rotate(0) scale(1)", opacity: 1 }], { duration: 900, easing: BOUNCE });
    anim(date, [{ transform: "translate(-120%,30%) rotate(-40deg) scale(.6)", opacity: 0 }, { transform: "translate(-50%,0) rotate(0) scale(1)", opacity: 1 }], { duration: 900, delay: 150, easing: BOUNCE });
    anim(de, [{ transform: "translate(-50%,0) scale(0)" }, { transform: "translate(-50%,0) scale(1)" }], { duration: 500, delay: 800, easing: BOUNCE });
    await wait(1400);
    const when = el("div", "std-when", l, ""); const txt = "21<sup>st</sup> – 23<sup>rd</sup> JAN, 2027";
    const plain = "21st – 23rd JAN, 2027";
    for (let i = 1; i <= plain.length; i++) { when.innerHTML = txt.length && plain.slice(0, i).replace("21st", "21<sup>st</sup>").replace("23rd", "23<sup>rd</sup>"); await wait(45); }
    const where = el("div", "std-where", l, "BHOPAL"); anim(where, [{ opacity: 0, transform: "translateY(2cqw)" }, { opacity: 1, transform: "none" }], { duration: 600 });
    await wait(800);
  }

  const SC = [intro, cinema, food, dance, drive, binoculars, savedate];
  const DUR = [5000, 3200, 6900, 6600, 4400, 2600, 0];
  $("bars").innerHTML = SC.map(() => "<span><i></i></span>").join("");
  const bars = [...document.querySelectorAll(".bars i")];
  let cur = 0;
  function setBars(i) { bars.forEach((b, k) => { b.getAnimations().forEach((a) => a.cancel()); b.style.transform = `scaleX(${k < i ? 1 : 0})`; }); if (DUR[i]) bars[i].animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: DUR[i], fill: "forwards", easing: "linear" }); else bars[i].style.transform = "scaleX(1)"; }
  async function run(from) {
    token++; const my = token; paused = false; $("end").hidden = true;
    for (let i = from; i < SC.length; i++) { if (my !== token) return; cur = i; setBars(i); await SC[i](); }
    if (my === token) { $("end").hidden = false; anim($("end"), [{ opacity: 0, transform: "translateY(4cqw)" }, { opacity: 1, transform: "none" }], { duration: 600 }); }
  }
  function jump(i) { i = Math.max(0, Math.min(SC.length - 1, i)); scene.getAnimations({ subtree: true }).forEach((a) => a.cancel()); run(i); }
  function setPause(p) { paused = p; document.getAnimations().forEach((a) => (p ? a.pause() : a.play())); if (p) song.pause(); else if (!muted) song.play().catch(() => {}); }

  const song = $("song"); let muted = false, started = false;
  $("gate").addEventListener("click", () => {
    if (started) return; started = true; $("gate").classList.add("open"); stage.classList.add("playing");
    song.volume = .75; song.play().catch(() => {}); setTimeout(() => run(0), 350);
  });
  $("mute").addEventListener("click", (e) => { e.stopPropagation(); muted = !muted; $("mute").setAttribute("aria-pressed", String(muted)); muted ? song.pause() : song.play().catch(() => {}); });
  let holdT, held = false;
  [["next", 1], ["prev", -1]].forEach(([id, dir]) => { const b = $(id);
    b.addEventListener("pointerdown", () => { held = false; holdT = setTimeout(() => { held = true; setPause(true); }, 280); });
    const up = () => { clearTimeout(holdT); if (held) setPause(false); }; b.addEventListener("pointerup", up); b.addEventListener("pointercancel", up);
    b.addEventListener("click", () => { if (held) { held = false; return; } if (started) jump(cur + dir); }); });
  $("replay").addEventListener("click", () => jump(0));
  $("share").href = `https://wa.me/?text=${encodeURIComponent("Save the date! Pankaj & Muskan · 21–23 January 2027 · Bhopal\n" + location.href.split("#")[0])}`;
  document.addEventListener("visibilitychange", () => { if (document.hidden) song.pause(); else if (started && !muted && !paused) song.play().catch(() => {}); });
  ["paper_bg", "plane", "popper", "superheroes", "cinema", "food", "dish1", "dish2", "dish3", "dish4", "noodles", "dance", "dance2", "dance3", "car", "city", "binoculars", "savedate"].forEach((n) => { const i = new Image(); i.src = A(n); });
})();
