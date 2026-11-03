/* ==========================================================================
   TOP1WEBS · INTERACCIÓN
   Los datos (precios, planes, test, contacto) vienen de js/config.js.
   No hace falta tocar este archivo para cambiar textos o precios.
   ========================================================================== */
(() => {
  "use strict";

  const C = window.TOP1 || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const plans = C.planes || [];
  const planById = id => plans.find(p => p.id === id);
  const numberFmt = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 });
  const eur = n => `${numberFmt.format(n)} €`;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const icon = (id, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;

  // Cada bloque va aislado: si uno falla, el resto de la web sigue funcionando.
  const safe = (name, fn) => { try { fn(); } catch (err) { console.error(`[Top1webs] Error en ${name}:`, err); } };

  /* ---------- Animación del logo al abrir (clic o tecla para saltarla) ---------- */
  function initIntro() {
    const root = document.documentElement;
    const intro = $("#intro");
    if (!intro || !root.classList.contains("intro-active")) return;
    const skip = () => {
      root.classList.remove("intro-hold", "intro-active");
      intro.removeEventListener("click", skip);
      window.removeEventListener("keydown", skip);
    };
    intro.addEventListener("click", skip);
    window.addEventListener("keydown", skip);
  }

  /* ---------- Contacto (teléfono, WhatsApp, email) ---------- */
  const contact = C.contacto || {};
  function whatsappUrl(message = contact.mensajeWhatsapp) {
    if (!contact.whatsapp) return "#pide-tu-web";
    return `https://wa.me/${contact.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
  }

  function initContact() {
    $$("[data-wa]").forEach(a => {
      a.href = whatsappUrl();
      if (contact.whatsapp) { a.target = "_blank"; a.rel = "noopener"; }
    });
    if (contact.telefonoEnlace) $$("[data-tel]").forEach(a => { a.href = `tel:${contact.telefonoEnlace}`; });
    if (contact.telefono) $$("[data-tel-text]").forEach(el => { el.textContent = contact.telefono; });
    if (contact.email) {
      $$("[data-mail]").forEach(a => { a.href = `mailto:${contact.email}`; });
      $$("[data-mail-text]").forEach(el => { el.textContent = contact.email; });
    }
    $$("[data-price]").forEach(el => {
      const plan = planById(el.dataset.price);
      if (plan) el.textContent = eur(plan.precio);
    });
    $$("[data-price-num]").forEach(el => {
      const plan = planById(el.dataset.priceNum);
      if (plan) el.textContent = numberFmt.format(plan.precio);
    });
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
    if (C.mostrarAvisosEditables) document.documentElement.classList.add("show-edit");
  }

  /* ---------- Cabecera y menú móvil ---------- */
  function initHeader() {
    const header = $(".site-header");
    const toggle = $(".menu-toggle");
    const nav = $("#menu");
    const wa = $(".wa-float");

    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 8);
      if (wa) wa.classList.toggle("is-visible", y > 320);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const setOpen = open => {
      toggle.setAttribute("aria-expanded", String(open));
      $(".sr-only", toggle).textContent = open ? "Cerrar menú" : "Menú";
      document.body.classList.toggle("menu-open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    $$("a", nav).forEach(a => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 961px)").addEventListener("change", e => { if (e.matches) setOpen(false); });

    // Marca en el menú la sección en la que está el visitante
    const links = $$(".nav-list a");
    const sections = $$("main > section[id]");
    let ticking = false;
    const spy = () => {
      ticking = false;
      const mid = window.innerHeight * .45;
      const currentSection = sections.filter(sec => sec.getBoundingClientRect().top <= mid).pop();
      links.forEach(a => {
        if (currentSection && a.hash === `#${currentSection.id}`) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
    spy();
  }

  /* ---------- Rellenar el formulario desde planes, calculadora o test ---------- */
  function budgetFor(total) {
    if (total <= 300) return "Hasta 300 €";
    if (total <= 500) return "300 – 500 €";
    if (total <= 800) return "500 – 800 €";
    return "Más de 800 €";
  }

  function flash(el) {
    if (!el) return;
    el.classList.remove("is-flash");
    void el.offsetWidth;
    el.classList.add("is-flash");
  }

  function prefillOrder({ plan, message, budget } = {}) {
    const form = $("#order-form");
    if (!form) return;
    if (form.hidden) resetOrderForm();
    if (plan) {
      const select = $("#f-plan");
      const option = $$("option", select).find(o => o.dataset.id === plan);
      if (option) { select.value = option.value; flash(select); }
    }
    if (message) {
      const need = $("#f-need");
      if (!need.value.trim() || need.dataset.autofilled === "true") {
        need.value = message;
        need.dataset.autofilled = "true";
        flash(need);
      }
    }
    if (budget) {
      const radio = $$('input[name="presupuesto"]', form).find(r => r.value === budget);
      if (radio) { radio.checked = true; flash(radio.nextElementSibling); }
    }
    const target = $("#pide-tu-web");
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.setTimeout(() => $("#f-name").focus({ preventScroll: true }), reduceMotion ? 0 : 650);
  }

  /* ---------- 2. Planes y tabla comparativa ---------- */
  function initPlans() {
    const grid = $("#plans-grid");
    const table = $("#compare-table");
    const planSelect = $("#f-plan");

    if (grid) {
      grid.innerHTML = plans.map((p, i) => `
        <article class="plan reveal${p.destacado ? " plan-featured" : ""}" style="--d:${i}">
          ${p.etiqueta ? `<span class="plan-badge">${esc(p.etiqueta)}</span>` : ""}
          <h3 class="plan-name">${esc(p.nombre)}</h3>
          <p class="plan-desc">${esc(p.resumen)}</p>
          <p class="plan-price"><small>desde</small><strong>${numberFmt.format(p.precio)}</strong><span>€</span></p>
          <p class="plan-once">Pago único · sin cuotas mensuales</p>
          ${p.propuesta ? `<span class="plan-edit" data-edit="Precio propuesto · editable en config.js"></span>` : ""}
          <ul class="plan-list">${(p.incluye || []).map(t => `<li>${icon("i-check")}<span>${esc(t)}</span></li>`).join("")}</ul>
          <button type="button" class="btn ${p.destacado ? "btn-primary" : "btn-ghost"} btn-block" data-choose-plan="${esc(p.id)}">Elegir ${esc(p.nombre)}</button>
        </article>`).join("");
      grid.addEventListener("click", e => {
        const btn = e.target.closest("[data-choose-plan]");
        if (btn) prefillOrder({ plan: btn.dataset.choosePlan });
      });
    }

    if (table) {
      const cell = (value, plan) => {
        const cls = plan.destacado ? ' class="is-featured"' : "";
        if (value === true) return `<td${cls}>${icon("i-check", "icon yes")}<span class="sr-only">Incluido</span></td>`;
        if (value === false || value == null) return `<td${cls}>${icon("i-dash", "icon no")}<span class="sr-only">No incluido</span></td>`;
        return `<td${cls}>${esc(value)}</td>`;
      };
      table.innerHTML = `
        <caption class="sr-only">Comparativa de los planes ${plans.map(p => esc(p.nombre)).join(", ")}</caption>
        <thead><tr>
          <th scope="col"><span class="sr-only">Qué incluye</span></th>
          ${plans.map(p => `<th scope="col"${p.destacado ? ' class="is-featured"' : ""}>${esc(p.nombre)}<span>desde ${eur(p.precio)}</span></th>`).join("")}
        </tr></thead>
        <tbody>
          ${(C.comparativa || []).map(row => `<tr><th scope="row">${esc(row.texto)}</th>${plans.map(p => cell(row[p.id], p)).join("")}</tr>`).join("")}
        </tbody>`;
    }

    if (planSelect) {
      planSelect.insertAdjacentHTML("beforeend", plans.map(p =>
        `<option value="${esc(p.nombre)}" data-id="${esc(p.id)}">${esc(p.nombre)} · desde ${eur(p.precio)}</option>`).join(""));
    }
  }

  /* ---------- 4. Calculadora de presupuesto ---------- */
  function initCalculator() {
    const cfg = C.calculadora;
    const form = $("#calc-form");
    if (!cfg || !form) return;

    const pages = $("#calc-pages");
    const langs = $("#calc-langs");
    const extrasBox = $("#calc-extras");
    const totalEl = $("#calc-total");
    const linesEl = $("#calc-lines");
    const tipEl = $("#calc-tip");
    pages.max = cfg.maxPaginas;
    langs.max = cfg.maxIdiomas;
    $$('[data-calc-price="pagina"]').forEach(el => { el.textContent = eur(cfg.precioPaginaExtra); });
    $$('[data-calc-price="idioma"]').forEach(el => { el.textContent = eur(cfg.precioIdioma); });

    extrasBox.innerHTML = cfg.extras.map(x => `
      <label class="extra">
        <input type="checkbox" name="extra" value="${esc(x.id)}">
        <span class="extra-box">${icon("i-check")}</span>
        <span class="extra-text"><b>${esc(x.nombre)}</b><small>${esc(x.descripcion)}</small></span>
        <span class="extra-price">+${eur(x.precio)}</span>
      </label>`).join("");

    const read = input => {
      const min = Number(input.min), max = Number(input.max);
      const v = parseInt(input.value, 10);
      return Number.isNaN(v) ? min : Math.min(max, Math.max(min, v));
    };

    let shownTotal = cfg.precioBase;
    let animFrame;
    function animateTotal(to) {
      cancelAnimationFrame(animFrame);
      const from = shownTotal;
      if (reduceMotion || from === to) { shownTotal = to; totalEl.textContent = eur(to); return; }
      const start = performance.now();
      const dur = 380;
      const step = now => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        shownTotal = Math.round(from + (to - from) * eased);
        totalEl.textContent = eur(shownTotal);
        if (t < 1) animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
    }

    let current = {};
    function update() {
      const nPages = read(pages);
      const nLangs = read(langs);
      const chosen = $$('input[name="extra"]:checked', extrasBox).map(i => cfg.extras.find(x => x.id === i.value));

      const lines = [[`Precio base (1 página)`, cfg.precioBase]];
      if (nPages > 1) lines.push([`${nPages - 1} ${nPages - 1 === 1 ? "página más" : "páginas más"}`, (nPages - 1) * cfg.precioPaginaExtra]);
      chosen.forEach(x => lines.push([x.nombre, x.precio]));
      if (nLangs > 0) lines.push([`${nLangs} ${nLangs === 1 ? "idioma adicional" : "idiomas adicionales"}`, nLangs * cfg.precioIdioma]);
      const total = lines.reduce((sum, [, price]) => sum + price, 0);

      linesEl.innerHTML = lines.map(([label, price], i) => `<li><span>${esc(label)}</span><span>${i ? "+" : ""}${eur(price)}</span></li>`).join("");
      animateTotal(total);

      // ¿Algún plan cubre lo elegido por menos dinero?
      const ids = chosen.map(x => x.id);
      const better = plans
        .filter(p => p.paginas >= nPages && (p.idiomas || 0) >= nLangs && ids.every(id => (p.extras || []).includes(id)) && p.precio < total)
        .sort((a, b) => a.precio - b.precio)[0];
      if (better) {
        tipEl.hidden = false;
        tipEl.innerHTML = `Con estas opciones le sale mejor el <strong>plan ${esc(better.nombre)}</strong>: desde ${eur(better.precio)} en lugar de ${eur(total)}. <button type="button" class="btn-link" data-tip-plan="${esc(better.id)}">Elegir ${esc(better.nombre)}</button>`;
      } else {
        tipEl.hidden = true;
        tipEl.innerHTML = "";
      }

      $$(".stepper-btn").forEach(btn => {
        const input = document.getElementById(btn.dataset.target);
        const v = read(input);
        btn.disabled = Number(btn.dataset.step) < 0 ? v <= Number(input.min) : v >= Number(input.max);
      });

      current = { nPages, nLangs, chosen, total, better };
    }

    $$(".stepper-btn").forEach(btn => btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      input.value = read(input) + Number(btn.dataset.step);
      input.value = read(input);
      update();
    }));
    [pages, langs].forEach(input => {
      input.addEventListener("input", update);
      input.addEventListener("change", () => { input.value = read(input); update(); });
    });
    extrasBox.addEventListener("change", update);
    form.addEventListener("submit", e => e.preventDefault());

    tipEl.addEventListener("click", e => {
      const btn = e.target.closest("[data-tip-plan]");
      if (btn) prefillOrder({ plan: btn.dataset.tipPlan, budget: budgetFor(planById(btn.dataset.tipPlan).precio) });
    });

    $("#calc-request").addEventListener("click", () => {
      const { nPages, nLangs, chosen, total, better } = current;
      const parts = [`${nPages} ${nPages === 1 ? "página" : "páginas"}`, ...chosen.map(x => x.nombre.toLowerCase())];
      if (nLangs) parts.push(`${nLangs} ${nLangs === 1 ? "idioma adicional" : "idiomas adicionales"}`);
      prefillOrder({
        plan: better ? better.id : undefined,
        message: `Presupuesto orientativo de la calculadora: ${eur(total)} (${parts.join(", ")}).`,
        budget: budgetFor(better ? better.precio : total)
      });
    });

    update();
  }

  /* ---------- 5. Mini test ---------- */
  function initQuiz() {
    const cfg = C.test;
    const form = $("#quiz-form");
    if (!cfg || !form) return;

    const questions = cfg.preguntas;
    const answers = new Array(questions.length).fill(null);
    const stepEl = $("#quiz-step");
    const bar = $("#quiz-bar");
    const legend = $("#quiz-question");
    const options = $("#quiz-options");
    const back = $("#quiz-back");
    const next = $("#quiz-next");
    const result = $("#quiz-result");
    let step = 0;

    legend.tabIndex = -1;

    function render(moveFocus) {
      const q = questions[step];
      stepEl.textContent = `Pregunta ${step + 1} de ${questions.length}`;
      bar.style.width = `${((step + 1) / questions.length) * 100}%`;
      legend.textContent = q.pregunta;
      options.innerHTML = q.opciones.map((o, i) => `
        <label class="quiz-option">
          <input type="radio" name="quiz-q" value="${i}"${answers[step] === i ? " checked" : ""}>
          <span class="quiz-radio" aria-hidden="true"></span>
          <span>${esc(o.texto)}</span>
        </label>`).join("");
      options.classList.remove("is-changing");
      void options.offsetWidth;
      options.classList.add("is-changing");
      back.style.visibility = step === 0 ? "hidden" : "visible";
      next.disabled = answers[step] === null;
      next.innerHTML = step === questions.length - 1 ? `Ver mi recomendación ${icon("i-arrow")}` : `Siguiente ${icon("i-arrow")}`;
      if (moveFocus) legend.focus({ preventScroll: true });
    }

    options.addEventListener("change", e => {
      if (e.target.name !== "quiz-q") return;
      answers[step] = Number(e.target.value);
      next.disabled = false;
    });

    back.addEventListener("click", () => {
      if (step > 0) { step--; render(true); }
    });

    form.addEventListener("submit", e => {
      e.preventDefault();
      if (answers[step] === null) return;
      if (step < questions.length - 1) { step++; render(true); }
      else showResult();
    });

    function showResult() {
      const picked = answers.map((a, i) => questions[i].opciones[a]);
      const score = picked.reduce((sum, o) => sum + (o.puntos || 0), 0);
      const rec = cfg.recomendacion.find(r => score <= r.hasta) || cfg.recomendacion[cfg.recomendacion.length - 1];
      const plan = planById(rec.plan) || plans[0];
      const notes = picked.map(o => o.nota).filter(Boolean);

      // Funciones pedidas que el plan no incluye → se sugieren como extra
      const calc = C.calculadora || { extras: [] };
      const missing = picked.map(o => o.requiere).filter(Boolean).filter(req =>
        req === "idioma" ? !(plan.idiomas > 0) : !(plan.extras || []).includes(req));
      const extras = [...new Set(missing)].map(req => req === "idioma"
        ? { nombre: "Idioma adicional", precio: calc.precioIdioma }
        : calc.extras.find(x => x.id === req)).filter(Boolean);

      result.innerHTML = `
        <p class="result-kicker">Le recomendamos</p>
        <h3 class="result-plan">Plan ${esc(plan.nombre)}<span>desde ${eur(plan.precio)}</span></h3>
        <p class="result-text">${esc(rec.texto)}</p>
        ${notes.length ? `<p class="result-sub">Lo que ha marcado:</p><ul class="result-list">${notes.map(n => `<li>${icon("i-check")}${esc(n)}</li>`).join("")}</ul>` : ""}
        ${extras.length ? `<p class="result-sub">Puede añadirlo como extra:</p><ul class="result-list extras">${extras.map(x => `<li>${icon("i-info")}${esc(x.nombre)} · +${eur(x.precio)}</li>`).join("")}</ul>` : ""}
        <div class="result-actions">
          <button type="button" class="btn btn-primary" id="quiz-request">Solicitar el plan ${esc(plan.nombre)} ${icon("i-arrow")}</button>
          <button type="button" class="btn-link" id="quiz-restart">Repetir el test</button>
        </div>`;
      form.hidden = true;
      stepEl.textContent = "Resultado";
      bar.style.width = "100%";
      result.hidden = false;
      result.focus({ preventScroll: true });

      $("#quiz-request").addEventListener("click", () => {
        const extraTotal = extras.reduce((s, x) => s + x.precio, 0);
        const extraText = extras.length ? ` y me interesa añadir: ${extras.map(x => x.nombre.toLowerCase()).join(", ")}` : "";
        prefillOrder({
          plan: plan.id,
          message: `Según el test, me encaja el plan ${plan.nombre}${extraText}.`,
          budget: budgetFor(plan.precio + extraTotal)
        });
      });
      $("#quiz-restart").addEventListener("click", () => {
        answers.fill(null);
        step = 0;
        result.hidden = true;
        form.hidden = false;
        render(true);
      });
    }

    render(false);
  }

  /* ---------- 7. Comparador antes / después ---------- */
  function initCompare() {
    const ba = $("#ba");
    const range = $("#ba-range");
    if (!ba || !range) return;
    const set = v => {
      ba.style.setProperty("--pos", `${v}%`);
      range.setAttribute("aria-valuetext", `${Math.round(v)} % antes, ${100 - Math.round(v)} % después`);
    };
    range.addEventListener("input", () => set(Number(range.value)));
    set(Number(range.value));

    // Pequeña demostración del deslizador la primera vez que se ve
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      let touched = false;
      range.addEventListener("pointerdown", () => { touched = true; }, { once: true });
      range.addEventListener("keydown", () => { touched = true; }, { once: true });
      const keys = [[0, 50], [600, 32], [1300, 68], [1900, 50]];
      const start = performance.now() + 500;
      const tick = now => {
        if (touched) return;
        const t = now - start;
        if (t < 0) return requestAnimationFrame(tick);
        let i = keys.findIndex(([time]) => time > t);
        if (i === -1) { set(50); range.value = 50; return; }
        const [t0, v0] = keys[i - 1], [t1, v1] = keys[i];
        const p = (t - t0) / (t1 - t0);
        const eased = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        const v = v0 + (v1 - v0) * eased;
        range.value = Math.round(v);
        set(v);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: .6 });
    io.observe(ba);
  }

  /* ---------- Galería del material de marca ---------- */
  function initGallery() {
    const dialog = $("#brand-gallery");
    if (!dialog || typeof dialog.showModal !== "function") return;
    $$("[data-open-gallery]").forEach(btn => btn.addEventListener("click", () => dialog.showModal()));
    $$("[data-close-dialog]", dialog).forEach(btn => btn.addEventListener("click", () => dialog.close()));
    dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
  }

  /* ---------- 9. Formulario de encargo ---------- */
  let resetOrderForm = () => {};

  function initOrderForm() {
    const form = $("#order-form");
    if (!form) return;
    const cfg = C.formulario || {};
    const isDemo = !cfg.endpoint;
    const success = $("#form-success");
    const errorsBox = $("#form-errors");
    const submit = $("#order-submit");
    const submitHtml = submit.innerHTML;
    // El aviso de "modo demostración" solo se ve mientras se revisa la web (mostrarAvisosEditables)
    if (isDemo && C.mostrarAvisosEditables) $("#form-demo").hidden = false;

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const rules = [
      { id: "f-name", label: "Nombre", check: el => el.value.trim().length >= 2 || "Escriba su nombre." },
      {
        id: "f-contact", label: "Teléfono o email", check: el => {
          const v = el.value.trim();
          if (!v) return "Indique un teléfono o un email para poder responderle.";
          if (v.includes("@")) return emailRe.test(v) || "Revise el email: parece incompleto.";
          const digits = v.replace(/[\s().+-]/g, "");
          return (/^\d{9,15}$/.test(digits)) || "Escriba un teléfono válido (al menos 9 cifras) o un email.";
        }
      },
      { id: "f-type", label: "Tipo de negocio", check: el => !!el.value || "Elija el tipo de negocio." },
      { id: "f-need", label: "¿Qué necesita?", check: el => el.value.trim().length >= 10 || "Cuéntenos en unas palabras qué necesita (mínimo 10 caracteres)." },
      { id: "budget", label: "Presupuesto aproximado", check: () => !!$('input[name="presupuesto"]:checked', form) || "Elija un presupuesto aproximado." },
      { id: "f-consent", label: "Consentimiento", check: el => el.checked || "Necesitamos su permiso para responder a su solicitud." }
    ];
    const fieldOf = rule => rule.id === "budget" ? $(".budget", form) : document.getElementById(rule.id);
    const errorOf = rule => document.getElementById(rule.id === "budget" ? "f-budget-err" : `${rule.id}-err`);
    let submitted = false;

    function validate(rule) {
      const el = fieldOf(rule);
      const res = rule.check(el);
      const msg = res === true ? "" : res;
      errorOf(rule).textContent = msg;
      el.setAttribute("aria-invalid", msg ? "true" : "false");
      return msg;
    }

    // Tras el primer intento, los errores se actualizan mientras se escribe
    rules.forEach(rule => {
      const el = fieldOf(rule);
      const evt = rule.id === "f-name" || rule.id === "f-contact" || rule.id === "f-need" ? "input" : "change";
      el.addEventListener(evt, () => { if (submitted || el.getAttribute("aria-invalid") === "true") validate(rule); });
      if (evt === "input") el.addEventListener("blur", () => { if (el.value.trim()) validate(rule); });
    });
    $("#f-need").addEventListener("input", e => { e.target.dataset.autofilled = "false"; });

    function collect() {
      const data = Object.fromEntries(new FormData(form).entries());
      delete data._gotcha;
      data.consentimiento = "Sí";
      return data;
    }

    function summaryText(d) {
      return [
        `Hola, soy ${d.nombre}. Me interesa una web para mi negocio.`,
        `Tipo de negocio: ${d.tipo_negocio}`,
        `Plan: ${d.plan || "Aún no lo sé"}`,
        `Presupuesto aproximado: ${d.presupuesto}`,
        `Lo que necesito: ${d.necesidad}`,
        `Contacto: ${d.contacto}`
      ].join("\n");
    }

    function showSuccess(data, demo) {
      const text = summaryText(data);
      const mail = `mailto:${contact.email || ""}?subject=${encodeURIComponent("Solicitud de web de prueba · " + data.nombre)}&body=${encodeURIComponent(text)}`;
      success.innerHTML = `
        <div class="success-icon">${icon("i-check")}</div>
        <h3>¡Gracias, ${esc(data.nombre.split(" ")[0])}!</h3>
        ${demo
          ? `<p>Su solicitud está lista. Último paso: envíenosla por WhatsApp o por email con un clic.</p>
             ${C.mostrarAvisosEditables ? `<p class="success-demo"><strong>Modo demostración:</strong> el formulario aún no está conectado a un servicio de envío (vea README.md). Mientras tanto, la solicitud se manda por WhatsApp o email.</p>` : ""}
             <div class="success-actions">
               ${contact.whatsapp ? `<a class="btn btn-whatsapp" href="${esc(whatsappUrl(text))}" target="_blank" rel="noopener">${icon("i-wa")} Enviar por WhatsApp</a>` : ""}
               ${contact.email ? `<a class="btn btn-ghost" href="${esc(mail)}">${icon("i-mail")} Enviar por email</a>` : ""}
             </div>`
          : `<p>Hemos recibido su solicitud. Le escribiremos para preparar su web de prueba, sin compromiso.</p>`}
        <div class="success-actions"><button type="button" class="btn-link" id="order-again">Enviar otra solicitud</button></div>`;
      form.hidden = true;
      success.hidden = false;
      success.focus({ preventScroll: true });
      success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      $("#order-again").addEventListener("click", () => { resetOrderForm(); $("#f-name").focus(); });
    }

    resetOrderForm = () => {
      form.reset();
      rules.forEach(rule => { errorOf(rule).textContent = ""; fieldOf(rule).removeAttribute("aria-invalid"); });
      errorsBox.hidden = true;
      submitted = false;
      success.hidden = true;
      form.hidden = false;
    };

    form.addEventListener("submit", async e => {
      e.preventDefault();
      submitted = true;
      const failed = rules.map(rule => ({ rule, msg: validate(rule) })).filter(r => r.msg);

      if (failed.length) {
        errorsBox.innerHTML = `<strong>Revise ${failed.length === 1 ? "este campo" : `estos ${failed.length} campos`}:</strong>
          <ul>${failed.map(({ rule, msg }) => `<li><a href="#${rule.id === "budget" ? "pide-tu-web" : rule.id}" data-focus="${rule.id}">${esc(rule.label)}</a>: ${esc(msg)}</li>`).join("")}</ul>`;
        errorsBox.hidden = false;
        errorsBox.focus();
        return;
      }
      errorsBox.hidden = true;

      // Campo trampa relleno → probablemente spam: se ignora en silencio
      if ($("#f-web").value) { showSuccess(collect(), false); return; }

      const data = collect();
      if (isDemo) { showSuccess(data, true); return; }

      submit.disabled = true;
      submit.classList.add("is-loading");
      submit.textContent = "Enviando…";
      try {
        const res = await fetch(cfg.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...data, ...(cfg.camposExtra || {}), _subject: `Nueva solicitud de web · ${data.nombre}` })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showSuccess(data, false);
      } catch (err) {
        console.error("[Top1webs] Error al enviar el formulario:", err);
        errorsBox.innerHTML = `<strong>No hemos podido enviar su solicitud.</strong>
          <span>Inténtelo de nuevo en unos minutos o escríbanos directamente por <a href="${esc(whatsappUrl(summaryText(data)))}" target="_blank" rel="noopener">WhatsApp</a>.</span>`;
        errorsBox.hidden = false;
        errorsBox.focus();
      } finally {
        submit.disabled = false;
        submit.classList.remove("is-loading");
        submit.innerHTML = submitHtml;
      }
    });

    errorsBox.addEventListener("click", e => {
      const link = e.target.closest("[data-focus]");
      if (!link) return;
      e.preventDefault();
      const id = link.dataset.focus;
      const target = id === "budget" ? $('input[name="presupuesto"]', form) : document.getElementById(id);
      target.focus();
    });
  }

  /* ---------- Aparición suave al hacer scroll ---------- */
  function initReveal() {
    const items = $$(".reveal, .timeline");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(el => io.observe(el));
  }

  safe("intro", initIntro);
  safe("contacto", initContact);
  safe("planes", initPlans);
  safe("cabecera", initHeader);
  safe("calculadora", initCalculator);
  safe("test", initQuiz);
  safe("comparador", initCompare);
  safe("galería", initGallery);
  safe("formulario", initOrderForm);
  // Al final, para incluir también las tarjetas generadas desde config.js.
  // Si algo fallase, se muestra todo el contenido sin animación.
  try { initReveal(); } catch (err) { $$(".reveal").forEach(el => el.classList.add("is-visible")); }
})();
