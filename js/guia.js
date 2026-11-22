/* Selector «Mi titulación es…» de guia-titulacion.html */
(function () {
  var caja = document.getElementById("selector");
  var select = document.getElementById("titulacion");
  var salida = document.getElementById("guia-resultado");
  if (!caja || !select || !salida) return;

  var GRUPOS = [
    { id: "A1", nombre: "Subgrupo A1", pide: "Grado universitario" },
    { id: "A2", nombre: "Subgrupo A2", pide: "Grado universitario" },
    { id: "B", nombre: "Grupo B", pide: "Técnico Superior" },
    { id: "C1", nombre: "Subgrupo C1", pide: "Bachiller o Técnico" },
    { id: "C2", nombre: "Subgrupo C2", pide: "ESO" },
    { id: "AP", nombre: "Agrupaciones Profesionales", pide: "Sin titulación" }
  ];
  // Nivel de cada titulación: índice del grupo más alto al que da acceso
  var TITULOS = {
    sin: { desde: 5 },
    eso: { desde: 4 },
    tecnico: { desde: 3 },
    bach: { desde: 3 },
    tsup: { desde: 2 },
    grado: { desde: 0 },
    master: { desde: 0, nota: "El Máster o el Doctorado no abren un grupo superior al del Grado, pero algunos cuerpos los exigen, como el Máster de Formación del Profesorado para Secundaria y FP." }
  };

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    (children || []).forEach(function (c) { n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }

  function pintar() {
    var t = TITULOS[select.value];
    if (!t) { salida.replaceChildren(); return; }
    var ok = GRUPOS.slice(t.desde).map(function (g) { return g.id === "AP" ? "Agrupaciones Profesionales" : g.id; });
    var resumen = ok.length === 1
      ? "Puedes optar a las Agrupaciones Profesionales, que no piden titulación."
      : "Puedes optar a " + ok.slice(0, -1).join(", ") + " y " + ok[ok.length - 1] + ".";
    var lista = el("ul", { class: "groups" }, GRUPOS.map(function (g, i) {
      var si = i >= t.desde;
      return el("li", { class: si ? "is-ok" : "is-no" }, [
        el("strong", {}, [g.nombre]),
        el("span", { class: "estado" }, [si ? "✓ Puedes presentarte" : "✗ Pide " + g.pide]),
      ]);
    }));
    var hijos = [el("p", { style: "margin:1.25rem 0 0;font-weight:700" }, [resumen]), lista];
    if (t.nota) hijos.push(el("p", { class: "field__hint", style: "margin-top:1rem" }, [t.nota]));
    hijos.push(el("p", { class: "field__hint", style: "margin-top:1rem" }, ["Revisa siempre las bases: algunos cuerpos piden un título concreto."]));
    salida.replaceChildren.apply(salida, hijos);
  }

  caja.hidden = false; // sin JavaScript, el selector no se muestra (queda la tabla)
  select.addEventListener("change", pintar);
  pintar();
})();
