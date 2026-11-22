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
    document.querySelectorAll("[data-link]").forEach(function (el) {
      var u = urls[el.getAttribute("data-link")];
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
