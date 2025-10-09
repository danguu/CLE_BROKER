
(() => {
  // ================= CONFIG =================
  const CFG = {
    businessName: "Cle_Broker",
    tagline: "online",
    email: "cle23gallo@gmail.com",
    phone: "+573003137616",
    phoneDisplay: "+57 300 3137 616",
    whatsappURL: "573003137616",
    hours: [
      { d: "Lunes a Viernes", h: "8:00–17:00" },
      { d: "Sábados", h: "9:00–14:00" },
    ],
    nav: {
      inicio: "/Cle_Broker/",
      sobre: "/sobre.html",
      contacto: "/contacto.html",
      servicios: "/servicios.html",
      faq: "/faq.html",
      propiedades: "/servicios.html#propiedades-destacadas"
    },
    leadWebhook: "", // opcional backend
    consentText: "Acepto el tratamiento de datos para ser contactado."
  };

  // ============== HTML ==============
  const html = `
  <div id="cbot-root" class="cbot-root cbot-theme-dark" aria-live="polite">
    <button class="cbot-fab" id="cbot-fab" aria-expanded="false" aria-controls="cbot-panel" title="Abrir chatbot">
      💬
    </button>
    <section class="cbot-panel" id="cbot-panel" role="dialog" aria-label="Asistente ${CFG.businessName}">
      <header class="cbot-header">
        <div class="cbot-brand">
          <div class="cbot-logo" aria-hidden="true">🤖</div>
          <div>
            <div class="cbot-title">${CFG.businessName}</div>
            <div class="cbot-sub">${CFG.tagline}</div>
          </div>
        </div>
        <div class="cbot-actions">
          <button class="cbot-action" id="cbot-theme" title="Cambiar tema">🌓</button>
          <button class="cbot-action" id="cbot-close" title="Cerrar">✖</button>
        </div>
      </header>
      <div class="cbot-body" id="cbot-body" tabindex="0"></div>
      <form class="cbot-composer" id="cbot-form" autocomplete="on">
        <input id="cbot-input" type="text" inputmode="text" placeholder="Escribe tu consulta…"/>
        <button class="cbot-send" id="cbot-send" type="submit">Enviar</button>
      </form>
    </section>
  </div>`;

  if (document.getElementById("cbot-root")) return;
  const mount = document.createElement("div");
  mount.innerHTML = html;
  document.body.appendChild(mount);

  // ============== UTIL ==============
  const $ = (sel) => document.querySelector(sel);
  const bodyEl = $("#cbot-body");
  const inputEl = $("#cbot-input");
  const scrollToEnd = () => requestAnimationFrame(() => { bodyEl.scrollTop = bodyEl.scrollHeight; });
  const fmtCurrency = (n) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
  const parseBudget = (txt) => {
    const m = txt.toLowerCase().match(/(\d+([.,]\d+)?)(\s*[mk])?/);
    if (!m) return null;
    let val = parseFloat(m[1].replace(",", "."));
    const suf = m[3]?.trim();
    if (suf === "m" || suf === "M") val *= 1_000_000;
    if (suf === "k" || suf === "K") val *= 1_000;
    return Math.round(val);
  };
  const sanitize = (s) => s.replace(/[<>]/g, "");
  const featuredPropertiesUrl = new URL(CFG.nav.propiedades, window.location.origin);
  const goToFeaturedProperties = () => {
    const samePath = window.location.pathname === featuredPropertiesUrl.pathname
      || window.location.pathname.endsWith(featuredPropertiesUrl.pathname);
    if (samePath) {
      if (featuredPropertiesUrl.hash) {
        const target = document.getElementById(featuredPropertiesUrl.hash.slice(1));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        window.location.hash = featuredPropertiesUrl.hash;
        return;
      }
    }
    window.location.href = featuredPropertiesUrl.href;
  };

  // ============== VIEW HELPERS ==============
  const bot = {
    msg(html, who = "bot") {
      const wrap = document.createElement("div");
      wrap.className = `cbot-msg ${who}`;
      wrap.innerHTML = `<div class="cbot-bubble">${html}</div>`;
      bodyEl.appendChild(wrap); scrollToEnd();
    },
    choices(items) {
      const wrap = document.createElement("div");
      wrap.className = "cbot-choices";
      items.forEach(it => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "cbot-choice";
        b.textContent = it.label;
        b.addEventListener("click", () => it.onClick?.(it));
        wrap.appendChild(b);
      });
      bodyEl.appendChild(wrap); scrollToEnd();
    },
    formLead(prefill = {}) {
      const f = document.createElement("form");
      f.className = "cbot-lead";
      f.innerHTML = `
        <div class="row">
          <label>Nombre<input name="name" required placeholder="Tu nombre" value="${prefill.name || ""}"/></label>
          <label>Teléfono<input name="phone" required placeholder="+57 ..." value="${prefill.phone || ""}"/></label>
        </div>
        <div class="row">
          <label>Correo<input name="email" type="email" placeholder="tucorreo@..." value="${prefill.email || ""}"/></label>
          <label>Ciudad<input name="city" placeholder="Bogotá, Medellín..." value="${prefill.city || ""}"/></label>
        </div>
        <div class="row">
          <label>Servicio
            <select name="service">
              <option value="arriendo">Arriendo</option>
              <option value="venta">Venta</option>
              <option value="avaluo">Avalúo</option>
              <option value="administracion">Administración</option>
              <option value="otro">Otro</option>
            </select>
          </label>
          <label>Presupuesto / Valor
            <input name="budget" inputmode="decimal" placeholder="$ ej: 2.000.000 / 280.000.000" value="${prefill.budget || ""}"/>
          </label>
        </div>
        <label>Mensaje
          <textarea name="message" rows="3" placeholder="Cuéntanos lo que buscas">${prefill.message || ""}</textarea>
        </label>
        <label class="consent"><input type="checkbox" name="consent" required /> ${CFG.consentText}</label>
        <div class="actions">
          <button type="submit" class="primary">Enviar</button>
          <button type="button" class="ghost" data-action="whatsapp">WhatsApp</button>
          <button type="button" class="ghost" data-action="email">Email</button>
        </div>
      `;

      f.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(f).entries());
        if (!data.consent) return;
        const payload = {
          timestamp: new Date().toISOString(),
          ...data,
          budgetNumeric: parseBudget(data.budget || "") || null,
          source: location.href,
        };
        localStorage.setItem("cbot:lastLead", JSON.stringify(payload));
        if (CFG.leadWebhook) {
          try {
            await fetch(CFG.leadWebhook, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            bot.msg("Gracias. Tu solicitud fue registrada. Pronto te contactaremos.");
          } catch {
            bot.msg("Guardé tus datos localmente. También puedes escribirnos por WhatsApp o Email.");
          }
        } else {
          bot.msg("Listo. Puedes escribirnos por WhatsApp o Email con los botones debajo.");
        }
      });

      // --- versión sin redirecciones ---
      f.querySelector('[data-action="whatsapp"]').addEventListener("click", () => {
        window.open(`https://api.whatsapp.com/send?phone=${CFG.whatsappURL}`, "_blank", "noopener");
      });

      f.querySelector('[data-action="email"]').addEventListener("click", () => {
        bot.msg(`Nuestro correo es: <strong>${CFG.email}</strong>`);
      });

      const callBtn = document.createElement("button");
      callBtn.type = "button";
      callBtn.className = "ghost";
      callBtn.textContent = "Llamar";
      callBtn.addEventListener("click", () => {
        bot.msg(`Nuestro teléfono es: <strong>${CFG.phoneDisplay}</strong>`);
      });
      f.querySelector(".actions").appendChild(callBtn);
      // ---------------------------------

      bot.msg(`<strong>Déjanos tus datos</strong> y te contactamos:`);
      bodyEl.appendChild(f); scrollToEnd();
    },
    showHours() {
      const lines = CFG.hours.map(h => `<li><strong>${h.d}:</strong> ${h.h}</li>`).join("");
      bot.msg(`<ul class="cbot-list">${lines}</ul>`);
    },
    showNav() {
      bot.msg(`Navega rápido:`);
      const items = [
        { label: "Propiedades", onClick: () => window.open(featuredPropertiesUrl.href, "_blank") },
        { label: "Servicios", onClick: () => window.open(CFG.nav.servicios, "_blank") },
        { label: "FAQ", onClick: () => window.open(CFG.nav.faq, "_blank") },
        { label: "Contacto", onClick: () => window.open(CFG.nav.contacto, "_blank") },
      ];
      bot.choices(items);
    },
    quickActions() {
      bot.choices([
        { label: "Ver Propiedades", onClick: goToFeaturedProperties },
        { label: "Agendar visita", onClick: () => bot.formLead({ message: "Quiero agendar visita" }) },
        {
          label: "WhatsApp",
          onClick: () => window.open(`https://api.whatsapp.com/send?phone=${CFG.whatsappURL}`, "_blank", "noopener"),
        },
        { label: "Llamar", onClick: () => bot.msg(`Teléfono: ${CFG.phoneDisplay}`) },
        { label: "Horarios", onClick: () => bot.showHours() },
        { label: "Email", onClick: () => bot.msg(`Correo: ${CFG.email}`) },
      ]);
    }
  };

  // ============== INTENTS ==============
  function route(textRaw) {
    const text = textRaw.toLowerCase();
    if (/(propiedad|propiedades|inmueble|apartamento|casa|oficina)/.test(text)) {
      bot.msg("Abro el listado de propiedades.");
      window.open(CFG.nav.propiedades, "_blank");
      return;
    }
    if (/(arriendo|arrendar|renta)/.test(text)) {
      const budget = parseBudget(text);
      bot.msg(`Arriendo. ${budget ? "Presupuesto detectado: " + fmtCurrency(budget) : "Puedes indicar presupuesto para filtrar."}`);
      bot.formLead({ service: "arriendo", budget: budget ? fmtCurrency(budget) : "" });
      return;
    }
    if (/(venta|compr(ar|a))/.test(text)) {
      const budget = parseBudget(text);
      bot.msg(`Compra/Venta. ${budget ? "Valor objetivo: " + fmtCurrency(budget) : ""}`);
      bot.formLead({ service: "venta", budget: budget ? fmtCurrency(budget) : "" });
      return;
    }
    if (/(visita|agendar|cita)/.test(text)) {
      bot.msg("Agendemos una visita.");
      bot.formLead({ message: "Quiero agendar visita" });
      return;
    }
    if (/(whats?|wa)/.test(text)) { bot.msg(`WhatsApp: ${CFG.whatsappURL}`); return; }
    if (/(tel(e|é)fono|llamar)/.test(text)) { bot.msg(`Teléfono: ${CFG.phoneDisplay}`); return; }
    if (/(horario|abren|cierran)/.test(text)) { bot.showHours(); return; }
    if (/(servicio|servicios)/.test(text)) { bot.showNav(); return; }
    if (/(faq|preguntas)/.test(text)) { window.open(CFG.nav.faq, "_blank"); return; }
    bot.msg("Puedo ayudarte mejor si me dejas tus datos.");
    bot.formLead({ message: textRaw });
  }

  // ============== BOOT ==============
  function welcome() {
    bot.msg(`Hola, soy el asistente de <strong>${CFG.businessName}</strong>. ¿Qué buscas hoy?`);
    bot.quickActions();
  }

  // ============== EVENTS ==============
  $("#cbot-fab").addEventListener("click", () => {
    const panel = $("#cbot-panel");
    const fab = $("#cbot-fab");
    const open = !panel.classList.contains("open");
    panel.classList.toggle("open", open);
    fab.setAttribute("aria-expanded", String(open));
    if (open) {
      bodyEl.focus();
      if (!panel.dataset.init) { welcome(); panel.dataset.init = "1"; }
    }
  });
  $("#cbot-close").addEventListener("click", () => $("#cbot-fab").click());
  $("#cbot-theme").addEventListener("click", () => {
    $("#cbot-root").classList.toggle("cbot-theme-dark");
    $("#cbot-root").classList.toggle("cbot-theme-light");
  });

  $("#cbot-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = inputEl.value.trim();
    if (!v) return;
    bot.msg(sanitize(v), "user");
    inputEl.value = "";
    route(v);
  });

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "/" && !inputEl.value) {
      e.preventDefault();
      bot.msg("Comandos: /propiedades /arriendo /venta /visita /whatsapp /horarios /email /contacto");
    }
  });

  const last = localStorage.getItem("cbot:lastLead");
  if (last) {
    setTimeout(() => {
      const d = JSON.parse(last);
      bot.msg("Recuperé tu último avance de contacto. Puedes editarlo al enviar de nuevo.");
      bot.formLead(d);
    }, 8000);
  }
})();
