/*
 * Cálculo de plazos administrativos según la Ley 39/2015, art. 30.
 * Funciona en el navegador (window.OposicionesPlazos) y en Node (require) para los tests.
 *
 *  - El plazo empieza a contar el día siguiente a la publicación (art. 30.3 y 30.4).
 *  - Días hábiles: se excluyen sábados, domingos y festivos (art. 30.2).
 *  - Días naturales: se cuentan todos los días (art. 30.2).
 *  - Meses: el plazo termina el mismo día de la publicación en el mes de vencimiento;
 *    si ese día no existe en ese mes, el último día del mes (art. 30.4).
 *  - Si el último día es inhábil, el plazo se prorroga al primer día hábil siguiente (art. 30.5).
 *
 * Las fechas se manejan siempre como texto "AAAA-MM-DD" y en UTC para evitar
 * problemas de zona horaria y de cambio de hora.
 */
(function (root) {
  var datos = (typeof module !== "undefined" && module.exports)
    ? require("./festivos.js")
    : root.OPOSICIONES_FESTIVOS;

  var DIA_MS = 86400000;
  var LIMITES = { habiles: 365, naturales: 730, meses: 36 };

  function parse(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    var t = Date.UTC(y, mo - 1, d);
    var dt = new Date(t);
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
    return t;
  }
  function iso(t) { return new Date(t).toISOString().slice(0, 10); }
  function addDays(t, n) { return t + n * DIA_MS; }
  function diasDelMes(y, m0) { return new Date(Date.UTC(y, m0 + 1, 0)).getUTCDate(); }

  /** Motivo por el que un día es inhábil, o null si es hábil. */
  function motivoInhabil(fecha, ccaa) {
    var t = parse(fecha);
    var dow = new Date(t).getUTCDay();
    if (dow === 6) return { tipo: "sabado", texto: "Sábado" };
    if (dow === 0) return { tipo: "domingo", texto: "Domingo" };
    var anio = datos.FESTIVOS[fecha.slice(0, 4)];
    if (!anio || !anio.publicado) return null;
    if (anio.nacional[fecha]) return { tipo: "nacional", texto: "Festivo nacional: " + anio.nacional[fecha] };
    if (ccaa && anio.ccaa[ccaa] && anio.ccaa[ccaa].indexOf(fecha) !== -1) {
      return { tipo: "autonomico", texto: "Festivo en " + datos.CCAA[ccaa] };
    }
    return null;
  }

  function esHabil(fecha, ccaa) { return motivoInhabil(fecha, ccaa) === null; }

  /**
   * calcularPlazo({ publicacion: "2026-03-02", cantidad: 20, tipo: "habiles"|"naturales"|"meses", ccaa: "MD" })
   * Devuelve { inicio, fin, finNominal, prorrogado, saltados: [{fecha, motivo, tipo}], avisos: [] }
   */
  function calcularPlazo(opts) {
    opts = opts || {};
    var tipo = opts.tipo;
    var cantidad = Number(opts.cantidad);
    var ccaa = opts.ccaa || "";
    var tPub = parse(opts.publicacion);

    if (tPub === null) throw new Error("La fecha de publicación no es válida.");
    if (!LIMITES[tipo]) throw new Error("Tipo de plazo no válido.");
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > LIMITES[tipo]) {
      throw new Error("El número debe ser un entero entre 1 y " + LIMITES[tipo] + ".");
    }
    if (ccaa && !datos.CCAA[ccaa]) throw new Error("Comunidad autónoma no válida.");

    var inicio = addDays(tPub, 1);
    var saltados = [];
    var finNominal, fin;

    if (tipo === "habiles") {
      var t = inicio, contados = 0;
      for (;;) {
        var m = motivoInhabil(iso(t), ccaa);
        if (m) {
          saltados.push({ fecha: iso(t), motivo: m.texto, tipo: m.tipo });
        } else if (++contados === cantidad) {
          break;
        }
        t = addDays(t, 1);
      }
      finNominal = fin = t;
    } else {
      if (tipo === "naturales") {
        finNominal = addDays(tPub, cantidad);
      } else {
        var p = new Date(tPub);
        var total = p.getUTCMonth() + cantidad;
        var y = p.getUTCFullYear() + Math.floor(total / 12);
        var m0 = total % 12;
        finNominal = Date.UTC(y, m0, Math.min(p.getUTCDate(), diasDelMes(y, m0)));
      }
      // Art. 30.5: si el último día es inhábil, se pasa al primer día hábil siguiente.
      fin = finNominal;
      for (;;) {
        var mm = motivoInhabil(iso(fin), ccaa);
        if (!mm) break;
        saltados.push({ fecha: iso(fin), motivo: mm.texto, tipo: mm.tipo });
        fin = addDays(fin, 1);
      }
    }

    // Avisos sobre años sin festivos cargados
    var avisos = [];
    var y0 = new Date(inicio).getUTCFullYear(), y1 = new Date(fin).getUTCFullYear();
    for (var a = y0; a <= y1; a++) {
      var info = datos.FESTIVOS[a];
      if (!info) {
        avisos.push("No hay festivos cargados para " + a + ": en ese año solo se han descontado sábados y domingos.");
      } else if (!info.publicado) {
        avisos.push("El BOE aún no ha publicado los días inhábiles de " + a + ": en ese año solo se han descontado sábados y domingos.");
      }
    }

    return {
      publicacion: iso(tPub),
      inicio: iso(inicio),
      finNominal: iso(finNominal),
      fin: iso(fin),
      prorrogado: fin !== finNominal,
      diasNaturales: Math.round((fin - tPub) / DIA_MS),
      saltados: saltados,
      avisos: avisos
    };
  }

  var api = {
    calcularPlazo: calcularPlazo,
    esHabil: esHabil,
    motivoInhabil: motivoInhabil,
    CCAA: datos.CCAA,
    FESTIVOS: datos.FESTIVOS
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.OposicionesPlazos = api;
})(this);
