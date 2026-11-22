/*
 * ============================================================
 *  CONFIGURACIÓN DE LA WEB — cambia SOLO estos valores
 * ============================================================
 *  Todas las páginas leen de aquí los enlaces al bot, al canal
 *  y los datos de contacto. Ver README.md para más detalles.
 */
window.OPOSICIONES_CONFIG = {
  // Nombre de usuario del bot, sin la @ (https://t.me/BOT_USERNAME)
  BOT_USERNAME: "OposicionesESP_bot",

  // Nombre de usuario del canal de Telegram, sin la @ (https://t.me/CANAL_USERNAME)
  CANAL_USERNAME: "OposicionesESP",

  // Correo de contacto (privacidad, aviso legal, bajas...)
  EMAIL_CONTACTO: "contacto@ejemplo.com",

  // Titular / responsable que aparece en privacidad y aviso legal
  NOMBRE_RESPONSABLE: "Nombre Apellido Ejemplo",
  NIF_RESPONSABLE: "00000000X",
  DOMICILIO_RESPONSABLE: "Calle Ejemplo 1, 28000 Madrid (España)"
};

/* ---------- No hace falta tocar nada a partir de aquí ---------- */
(function () {
  var c = window.OPOSICIONES_CONFIG;
  var urls = {
    bot: "https://t.me/" + c.BOT_USERNAME,
    canal: "https://t.me/" + c.CANAL_USERNAME,
    email: "mailto:" + c.EMAIL_CONTACTO
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
      if (key === "BOT_USERNAME" || key === "CANAL_USERNAME") {
        el.textContent = "@" + c[key];
      } else if (c[key] != null) {
        el.textContent = c[key];
      }
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
