/* Filtro por categoría y por plazo abierto de /convocatorias/ (página generada por el bot).
   Sin JavaScript se ven todas. La categoría elegida queda en la URL: ?categoria=sanidad */
(function () {
  var filtros = document.getElementById("filtros");
  var lista = document.getElementById("lista");
  if (!filtros || !lista) return;
  var chips = filtros.querySelectorAll(".chip");
  var soloAbiertas = document.getElementById("solo-abiertas");
  var estado = document.getElementById("filtros-estado");
  var vacio = document.getElementById("sin-resultados");
  var items = lista.querySelectorAll(".conv-item");
  var actual = new URLSearchParams(location.search).get("categoria") || "";
  if (!filtros.querySelector('.chip[data-filtro="' + actual.replace(/[^a-z0-9-]/g, "") + '"]')) actual = "";
  soloAbiertas.checked = new URLSearchParams(location.search).get("abiertas") === "1";

  function aplicar() {
    var visibles = 0;
    items.forEach(function (li) {
      var cats = " " + li.getAttribute("data-cat") + " ";
      var ok = (!actual || cats.indexOf(" " + actual + " ") !== -1) &&
               (!soloAbiertas.checked || li.getAttribute("data-plazo") === "abierto");
      li.hidden = !ok;
      if (ok) visibles++;
    });
    chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-filtro") === actual)); });
    vacio.hidden = visibles > 0;
    estado.textContent = visibles === 1 ? "1 convocatoria" : visibles + " convocatorias";
    var p = new URLSearchParams();
    if (actual) p.set("categoria", actual);
    if (soloAbiertas.checked) p.set("abiertas", "1");
    var q = p.toString();
    history.replaceState(null, "", location.pathname + (q ? "?" + q : ""));
  }

  chips.forEach(function (c) {
    c.addEventListener("click", function () { actual = c.getAttribute("data-filtro"); aplicar(); });
  });
  soloAbiertas.addEventListener("change", aplicar);
  filtros.hidden = false;
  aplicar();
})();
