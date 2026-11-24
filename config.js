/*
 * ============================================================
 *  CONFIGURACIÓN DE LA WEB — cambia SOLO estos valores
 * ============================================================
 *  Todas las páginas leen de aquí los enlaces al bot, al canal
 *  y los datos de contacto. Ver README.md para más detalles.
 *
 *  Un valor vacío ("") desactiva lo que depende de él:
 *   - CANAL_USERNAME vacío → se ocultan la sección y los enlaces al canal.
 *   - EMAIL_CONTACTO vacío → el contacto aparece como «próximamente».
 *   - NIF / DOMICILIO vacíos → no se muestra esa línea.
 *  Para activarlos basta con rellenar el valor.
 */
window.OPOSICIONES_CONFIG = {
  // URL pública de la web, sin barra final. Es la ÚNICA que hay que cambiar al pasar
  // al dominio propio (https://oposicionesesp.es). Después ejecuta:
  //   python3 scripts/seo.py
  // para regenerar canonical, Open Graph, Twitter, sitemap.xml y robots.txt.
  SITE_URL: "https://oposicionesesp.es",

  // Nombre de usuario del bot, sin la @ (https://t.me/BOT_USERNAME)
  BOT_USERNAME: "OposicionesESPbot",

  // Nombre de usuario del canal de Telegram, sin la @ (https://t.me/CANAL_USERNAME)
  // Vacío = canal oculto.
  CANAL_USERNAME: "",

  // Correo de contacto (privacidad, aviso legal, bajas...)
  // Vacío = «próximamente».
  EMAIL_CONTACTO: "",

  // Titular / responsable que aparece en privacidad y aviso legal
  NOMBRE_RESPONSABLE: "Ricardo Villaitodo",
  NIF_RESPONSABLE: "",
  DOMICILIO_RESPONSABLE: ""
};

/* ---------- No hace falta tocar nada a partir de aquí ---------- */
(function () {
  var c = window.OPOSICIONES_CONFIG;
  function has(key) { return c[key] != null && String(c[key]).trim() !== ""; }

  var urls = {
    bot: has("BOT_USERNAME") ? "https://t.me/" + c.BOT_USERNAME : null,
    canal: has("CANAL_USERNAME") ? "https://t.me/" + c.CANAL_USERNAME : null,
    email: has("EMAIL_CONTACTO") ? "mailto:" + c.EMAIL_CONTACTO : null
  };

  function apply() {
    // Enlaces: <a data-link="bot|canal|email">
    // En los del bot se añade ?start=web (o el valor de data-start) para saber de dónde llegan.
    document.querySelectorAll("[data-link]").forEach(function (el) {
      var tipo = el.getAttribute("data-link");
      var u = urls[tipo];
      if (u && tipo === "bot") u += "?start=" + encodeURIComponent(el.getAttribute("data-start") || "web");
      if (u) el.setAttribute("href", u);
    });
    // Textos: <span data-config="EMAIL_CONTACTO">
    document.querySelectorAll("[data-config]").forEach(function (el) {
      var key = el.getAttribute("data-config");
      if (!has(key)) return;
      el.textContent = (key === "BOT_USERNAME" || key === "CANAL_USERNAME") ? "@" + c[key] : c[key];
    });
    // Mostrar solo si el valor está configurado: <li data-if="EMAIL_CONTACTO" hidden>
    document.querySelectorAll("[data-if]").forEach(function (el) {
      el.hidden = !has(el.getAttribute("data-if"));
    });
    // Mostrar solo si el valor está vacío: <span data-unless="EMAIL_CONTACTO">próximamente</span>
    document.querySelectorAll("[data-unless]").forEach(function (el) {
      el.hidden = has(el.getAttribute("data-unless"));
    });
    // Año actual en el pie
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  // Estadísticas (GoatCounter): cada clic en un enlace al bot cuenta como evento.
  // En local (localhost, 127.0.0.1, file://) no se cuenta nada.
  var esLocal = location.protocol === "file:" ||
    /^(localhost|127\.\d+\.\d+\.\d+|\[::1\]|0\.0\.0\.0)$|\.local$/.test(location.hostname);
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[data-link="bot"]');
    if (!a || esLocal) return;
    var gc = window.goatcounter;
    if (!gc || typeof gc.count !== "function") return;
    var origen = a.getAttribute("data-start") || "web";
    gc.count({
      path: origen === "web" ? "abrir-telegram" : "abrir-telegram-" + origen,
      title: "Clic en el bot desde " + (location.pathname.replace(/^.*\//, "") || "index.html"),
      event: true
    });
  });

  // Menú en móvil: botón .nav-toggle que abre/cierra la navegación
  function menu() {
    var btn = document.querySelector(".nav-toggle");
    var nav = btn && document.getElementById(btn.getAttribute("aria-controls"));
    if (!nav) return;
    btn.hidden = false;
    btn.addEventListener("click", function () {
      var abierto = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!abierto));
      nav.classList.toggle("is-open", !abierto);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { btn.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        btn.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); btn.focus();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { apply(); menu(); });
  } else {
    apply();
    menu();
  }
})();
