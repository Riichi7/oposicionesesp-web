/* Interfaz de calculadora-plazos.html. La lógica está en js/plazos.js. */
(function () {
  var P = window.OposicionesPlazos;
  var form = document.getElementById("calc");
  if (!P || !form) return;

  var $pub = document.getElementById("f-pub");
  var $num = document.getElementById("f-num");
  var $ccaa = document.getElementById("f-ccaa");
  var $error = document.getElementById("calc-error");
  var $res = document.getElementById("resultado");
  var MAX = { habiles: 365, naturales: 730, meses: 36 };
  var UNIDAD = { habiles: ["día hábil", "días hábiles"], naturales: ["día natural", "días naturales"], meses: ["mes", "meses"] };

  // Comunidades autónomas, en orden alfabético
  Object.keys(P.CCAA)
    .sort(function (a, b) { return P.CCAA[a].localeCompare(P.CCAA[b], "es"); })
    .forEach(function (k) { $ccaa.appendChild(new Option(P.CCAA[k], k)); });

  // Fecha por defecto: hoy (hora local)
  var hoy = new Date();
  $pub.value = hoy.getFullYear() + "-" + String(hoy.getMonth() + 1).padStart(2, "0") + "-" + String(hoy.getDate()).padStart(2, "0");

  // Estado de los festivos cargados
  var anios = Object.keys(P.FESTIVOS).sort();
  var publicados = anios.filter(function (a) { return P.FESTIVOS[a].publicado; });
  var pendientes = anios.filter(function (a) { return !P.FESTIVOS[a].publicado; });
  var estado = "Festivos oficiales cargados: " + (publicados.join(" y ") || "ninguno") + ".";
  if (pendientes.length) {
    estado += " Los de " + pendientes.join(" y ") + " aún no se han publicado en el BOE: para ese año solo se descuentan sábados y domingos.";
  }
  document.getElementById("estado-festivos").textContent = estado;

  function fechaLarga(iso) {
    var p = iso.split("-");
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).toLocaleDateString("es-ES", {
      weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
    });
  }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    (children || []).forEach(function (c) { n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function tipoActual() { return form.querySelector('input[name="tipo"]:checked').value; }

  function pintar(r, tipo, cantidad, ccaa) {
    var dl = el("dl", {}, [
      el("dt", {}, ["Publicación"]), el("dd", {}, [fechaLarga(r.publicacion)]),
      el("dt", {}, ["Empieza a contar"]), el("dd", {}, [fechaLarga(r.inicio)]),
      el("dt", {}, ["Plazo"]), el("dd", {}, [cantidad + " " + UNIDAD[tipo][cantidad === 1 ? 0 : 1] + (ccaa ? " · festivos de " + P.CCAA[ccaa] : " · solo festivos nacionales")]),
      el("dt", {}, ["Días naturales en total"]), el("dd", {}, [String(r.diasNaturales)])
    ]);
    if (r.prorrogado) {
      dl.appendChild(el("dt", {}, ["Prórroga"]));
      dl.appendChild(el("dd", {}, ["El " + fechaLarga(r.finNominal) + " es inhábil, así que el plazo pasa al siguiente día hábil."]));
    }

    var hijos = [
      el("p", { class: "result__label" }, ["El plazo termina el"]),
      el("p", { class: "result__date" }, [fechaLarga(r.fin)]),
      dl
    ];

    if (r.saltados.length) {
      var filas = r.saltados.map(function (s) {
        return el("tr", {}, [el("td", {}, [fechaLarga(s.fecha)]), el("td", { class: "tipo-" + s.tipo }, [s.motivo])]);
      });
      var festivos = r.saltados.filter(function (s) { return s.tipo === "nacional" || s.tipo === "autonomico"; }).length;
      var resumen = (tipo === "habiles" ? "Días que no cuentan" : "Días inhábiles al final del plazo") +
        " (" + r.saltados.length + (festivos ? ", " + festivos + " festivo" + (festivos > 1 ? "s" : "") : "") + ")";
      var tabla = el("div", { class: "table-wrap" }, [el("table", {}, [
        el("thead", {}, [el("tr", {}, [el("th", { scope: "col" }, ["Fecha"]), el("th", { scope: "col" }, ["Motivo"])])]),
        el("tbody", {}, filas)
      ])]);
      var det = el("details", {}, [el("summary", {}, [resumen]), tabla]);
      if (r.saltados.length <= 12) det.open = true;
      hijos.push(det);
    } else {
      hijos.push(el("p", {}, ["No se ha saltado ningún día."]));
    }

    if (r.avisos.length) {
      hijos.push(el("ul", { class: "warn-list" }, r.avisos.map(function (a) { return el("li", {}, [a]); })));
    }

    $res.replaceChildren(el("div", { class: "result" }, hijos));
  }

  function calcular(mostrarErrores) {
    var tipo = tipoActual();
    var cantidad = Number($num.value);
    try {
      var r = P.calcularPlazo({ publicacion: $pub.value, cantidad: cantidad, tipo: tipo, ccaa: $ccaa.value });
      $error.hidden = true;
      pintar(r, tipo, cantidad, $ccaa.value);
    } catch (e) {
      if (!mostrarErrores) return;
      $error.textContent = e.message;
      $error.hidden = false;
      $res.replaceChildren();
    }
  }

  form.addEventListener("change", function (e) {
    if (e.target.name === "tipo") $num.max = MAX[tipoActual()];
    calcular(false);
  });
  $num.addEventListener("input", function () { calcular(false); });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calcular(true);
  });

  calcular(false); // resultado inicial con los valores por defecto
})();
