// Tests de la calculadora de plazos. Ejecutar con:  node --test tests/
const test = require("node:test");
const assert = require("node:assert/strict");
const { calcularPlazo, esHabil, FESTIVOS } = require("../js/plazos.js");

const calc = (publicacion, cantidad, tipo, ccaa) => calcularPlazo({ publicacion, cantidad, tipo, ccaa });

test("hábiles: empieza el día siguiente a la publicación", () => {
  // Publicado el lunes 12/01/2026 → 1 día hábil = martes 13
  const r = calc("2026-01-12", 1, "habiles");
  assert.equal(r.inicio, "2026-01-13");
  assert.equal(r.fin, "2026-01-13");
});

test("hábiles: excluye sábados y domingos y los lista en el desglose", () => {
  // Publicado el viernes 09/01/2026; 10 hábiles: 12-16 y 19-23 de enero
  const r = calc("2026-01-09", 10, "habiles");
  assert.equal(r.fin, "2026-01-23");
  assert.deepEqual(r.saltados.map((s) => s.fecha), ["2026-01-10", "2026-01-11", "2026-01-17", "2026-01-18"]);
  assert.equal(r.saltados[0].motivo, "Sábado");
});

test("hábiles: festivo nacional en medio del plazo (Viernes Santo 2026)", () => {
  // 01/04/2026 (mié). Hábiles: 2 abr, 6, 7, 8, 9 → fin 9 abr. Se salta el 3 (Viernes Santo), 4 y 5
  const r = calc("2026-04-01", 5, "habiles");
  assert.equal(r.fin, "2026-04-09");
  const festivo = r.saltados.find((s) => s.fecha === "2026-04-03");
  assert.equal(festivo.tipo, "nacional");
  assert.match(festivo.motivo, /Viernes Santo/);
});

test("hábiles: festivo autonómico según la comunidad elegida", () => {
  // Madrid: el Jueves Santo (2 abr) también es inhábil → fin 10 abr
  assert.equal(calc("2026-04-01", 5, "habiles", "MD").fin, "2026-04-10");
  // Cataluña: el 2 abr es hábil pero el Lunes de Pascua (6 abr) no → fin 10 abr
  const ct = calc("2026-04-01", 5, "habiles", "CT");
  assert.equal(ct.fin, "2026-04-10");
  assert.ok(ct.saltados.some((s) => s.fecha === "2026-04-06" && s.tipo === "autonomico"));
  assert.ok(!ct.saltados.some((s) => s.fecha === "2026-04-02"));
});

test("hábiles: cruza Navidad y el cambio de año (2026 → 2027)", () => {
  // 30/12/2026 (mié): 31 dic (1), 1 ene festivo, 2-3 fin de semana, 4 ene (2), 5 ene (3)
  const r = calc("2026-12-30", 3, "habiles");
  assert.equal(r.fin, "2027-01-05");
  assert.ok(r.saltados.some((s) => s.fecha === "2027-01-01" && s.tipo === "nacional"));
  assert.deepEqual(r.avisos, []);
});

test("naturales: el último día cae en sábado → pasa al lunes", () => {
  // 04/03/2026 + 10 días naturales = sábado 14/03 → lunes 16/03
  const r = calc("2026-03-04", 10, "naturales");
  assert.equal(r.finNominal, "2026-03-14");
  assert.equal(r.fin, "2026-03-16");
  assert.equal(r.prorrogado, true);
  assert.deepEqual(r.saltados.map((s) => s.fecha), ["2026-03-14", "2026-03-15"]);
});

test("naturales: el último día es festivo nacional → pasa al siguiente hábil", () => {
  // 27/11/2026 + 11 = martes 08/12/2026 (Inmaculada) → 09/12
  const r = calc("2026-11-27", 11, "naturales");
  assert.equal(r.fin, "2026-12-09");
  assert.equal(r.saltados[0].tipo, "nacional");
});

test("naturales: sin prórroga si el último día es hábil", () => {
  const r = calc("2026-03-02", 10, "naturales"); // jueves 12/03
  assert.equal(r.fin, "2026-03-12");
  assert.equal(r.prorrogado, false);
  assert.equal(r.diasNaturales, 10);
});

test("meses: termina el mismo día del mes de vencimiento", () => {
  assert.equal(calc("2026-03-10", 1, "meses").fin, "2026-04-10");
  assert.equal(calc("2026-10-15", 3, "meses").fin, "2027-01-15");
});

test("meses: fin de mes sin día equivalente → último día del mes", () => {
  // 31/03/2026 + 1 mes → 30/04/2026 (jueves, hábil)
  assert.equal(calc("2026-03-31", 1, "meses").fin, "2026-04-30");
});

test("meses: 31 de enero + 1 mes = 28 de febrero (sábado) → lunes 2 de marzo", () => {
  const r = calc("2026-01-31", 1, "meses");
  assert.equal(r.finNominal, "2026-02-28");
  assert.equal(r.fin, "2026-03-02");
  // En Illes Balears el 2 de marzo de 2026 es inhábil → martes 3
  assert.equal(calc("2026-01-31", 1, "meses", "IB").fin, "2026-03-03");
});

test("meses: año bisiesto y aviso por año sin festivos cargados", () => {
  // 31/12/2027 + 2 meses → 29/02/2028 (martes). 2028 no tiene festivos cargados.
  const r = calc("2027-12-31", 2, "meses");
  assert.equal(r.fin, "2028-02-29");
  assert.equal(r.avisos.length, 1);
  assert.match(r.avisos[0], /2028/);
});

test("festivo autonómico de 2027 (Ceuta, 5 de agosto)", () => {
  assert.equal(calc("2027-08-04", 1, "habiles", "CE").fin, "2027-08-06");
  assert.equal(calc("2027-08-04", 1, "habiles").fin, "2027-08-05");
});

test("esHabil y datos de festivos coherentes (ningún festivo listado cae en fin de semana)", () => {
  assert.equal(esHabil("2026-01-01"), false);
  assert.equal(esHabil("2026-01-02"), true);
  for (const [anio, info] of Object.entries(FESTIVOS)) {
    const fechas = Object.keys(info.nacional).concat(...Object.values(info.ccaa));
    for (const f of fechas) {
      assert.ok(f.startsWith(anio), `${f} no es de ${anio}`);
      const dow = new Date(f + "T00:00:00Z").getUTCDay();
      assert.ok(dow !== 0 && dow !== 6, `${f} cae en fin de semana`);
    }
  }
});

test("valida la entrada", () => {
  assert.throws(() => calc("2026-02-30", 5, "habiles"), /fecha/);
  assert.throws(() => calc("2026-02-10", 0, "habiles"), /entero/);
  assert.throws(() => calc("2026-02-10", 2.5, "naturales"), /entero/);
  assert.throws(() => calc("2026-02-10", 5, "semanas"), /Tipo/);
  assert.throws(() => calc("2026-02-10", 5, "habiles", "XX"), /Comunidad/);
});
