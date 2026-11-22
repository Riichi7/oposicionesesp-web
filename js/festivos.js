/*
 * ============================================================
 *  DÍAS INHÁBILES PARA EL CÓMPUTO DE PLAZOS (Ley 39/2015, art. 30)
 * ============================================================
 *  Fuente: las resoluciones anuales de la Secretaría de Estado de Función Pública
 *  que fijan «a efectos de cómputo de plazos, el calendario de días inhábiles en el
 *  ámbito de la Administración General del Estado» (art. 30.7 de la Ley 39/2015).
 *  Recogen los días inhábiles en todo el territorio nacional y los de cada
 *  comunidad autónoma, a partir de las fiestas laborales publicadas por la
 *  Dirección General de Trabajo.
 *
 *  - 2026: Resolución de 18 de noviembre de 2025 (BOE núm. 282, de 24/11/2025)
 *          https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-23702
 *          (fiestas laborales: Resolución de la DG de Trabajo de 17/10/2025)
 *  - 2027: Resolución de 5 de noviembre de 2026 (BOE núm. 284, de 14/11/2026)
 *          https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-23826
 *          (fiestas laborales: Resolución de la DG de Trabajo de 8/10/2026,
 *           BOE-A-2026-21254)
 *
 *  Los sábados y domingos no se listan: el cálculo los excluye siempre.
 *  Solo se listan los días que caen de lunes a viernes, igual que el anexo del BOE.
 *
 *  NO incluidos (el anexo los cita en notas, pero no los asigna a toda la comunidad):
 *   - Festivos insulares de Canarias.
 *   - Fiesta de Arán (Cataluña).
 *   - Festivos locales de cada municipio.
 *
 *  CÓMO AÑADIR UN AÑO NUEVO: copia el bloque de un año, cambia la fuente y las
 *  fechas del anexo de la nueva resolución. Si aún no se ha publicado, pon
 *  `publicado: false` (la web lo indicará y calculará solo con sábados y domingos).
 */
(function (root) {
  var CCAA = {
    AN: "Andalucía",
    AR: "Aragón",
    AS: "Principado de Asturias",
    IB: "Illes Balears",
    CN: "Canarias",
    CB: "Cantabria",
    CL: "Castilla y León",
    CM: "Castilla-La Mancha",
    CT: "Cataluña",
    VC: "Comunitat Valenciana",
    EX: "Extremadura",
    GA: "Galicia",
    MD: "Comunidad de Madrid",
    MC: "Región de Murcia",
    NC: "Comunidad Foral de Navarra",
    PV: "País Vasco",
    RI: "La Rioja",
    CE: "Ciudad de Ceuta",
    ML: "Ciudad de Melilla"
  };

  var FESTIVOS = {
    2026: {
      publicado: true,
      fuente: "Resolución de 18 de noviembre de 2025 (BOE-A-2025-23702)",
      url: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-23702",
      // «Inhábil en todo el territorio nacional»
      nacional: {
        "2026-01-01": "Año Nuevo",
        "2026-01-06": "Epifanía del Señor",
        "2026-04-03": "Viernes Santo",
        "2026-05-01": "Fiesta del Trabajo",
        "2026-10-12": "Fiesta Nacional de España",
        "2026-12-08": "Inmaculada Concepción",
        "2026-12-25": "Natividad del Señor"
      },
      // Días inhábiles en cada comunidad autónoma (anexo, por comunidad)
      ccaa: {
        AN: ["2026-04-02", "2026-11-02", "2026-12-07"],
        AR: ["2026-04-02", "2026-04-23", "2026-11-02", "2026-12-07"],
        AS: ["2026-04-02", "2026-09-08", "2026-11-02", "2026-12-07"],
        IB: ["2026-03-02", "2026-04-02", "2026-04-06"],
        CN: ["2026-04-02", "2026-11-02"],
        CB: ["2026-04-02", "2026-07-28", "2026-09-15", "2026-12-07"],
        CL: ["2026-04-02", "2026-04-23", "2026-11-02", "2026-12-07"],
        CM: ["2026-04-02", "2026-04-06", "2026-06-04", "2026-11-02"],
        CT: ["2026-04-06", "2026-06-24", "2026-09-11"],
        VC: ["2026-03-19", "2026-04-06", "2026-06-24", "2026-10-09"],
        EX: ["2026-04-02", "2026-09-08", "2026-11-02", "2026-12-07"],
        GA: ["2026-03-19", "2026-04-02", "2026-06-24"],
        MD: ["2026-04-02", "2026-11-02", "2026-12-07"],
        MC: ["2026-03-19", "2026-04-02", "2026-06-09", "2026-12-07"],
        NC: ["2026-03-19", "2026-04-02", "2026-04-06", "2026-11-02"],
        PV: ["2026-03-19", "2026-04-02", "2026-04-06"],
        RI: ["2026-04-02", "2026-04-06", "2026-06-09", "2026-12-07"],
        CE: ["2026-04-02", "2026-05-27", "2026-08-05", "2026-09-02"],
        ML: ["2026-03-20", "2026-04-02", "2026-05-27", "2026-12-07"]
      }
    },
    2027: {
      publicado: true,
      fuente: "Resolución de 5 de noviembre de 2026 (BOE-A-2026-23826)",
      url: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-23826",
      nacional: {
        "2027-01-01": "Año Nuevo",
        "2027-01-06": "Epifanía del Señor",
        "2027-03-26": "Viernes Santo",
        "2027-10-12": "Fiesta Nacional de España",
        "2027-11-01": "Todos los Santos",
        "2027-12-06": "Día de la Constitución Española",
        "2027-12-08": "Inmaculada Concepción"
      },
      ccaa: {
        AN: ["2027-03-01", "2027-03-25", "2027-08-16"],
        AR: ["2027-03-25", "2027-04-23", "2027-08-16"],
        AS: ["2027-03-25", "2027-08-16", "2027-09-08"],
        IB: ["2027-03-01", "2027-03-25", "2027-03-29"],
        CN: ["2027-03-25", "2027-08-16"],
        CB: ["2027-03-25", "2027-07-28", "2027-09-15"],
        CL: ["2027-03-25", "2027-04-23", "2027-08-16"],
        CM: ["2027-03-25", "2027-05-27", "2027-05-31"],
        CT: ["2027-03-29", "2027-06-24"],
        VC: ["2027-03-19", "2027-03-29"],
        EX: ["2027-03-25", "2027-09-08", "2027-10-11"],
        GA: ["2027-03-19", "2027-03-25", "2027-05-17"],
        MD: ["2027-03-19", "2027-03-25", "2027-08-16"],
        MC: ["2027-03-19", "2027-03-25", "2027-06-09"],
        NC: ["2027-03-19", "2027-03-25", "2027-03-29"],
        PV: ["2027-03-25", "2027-03-29", "2027-10-07"],
        RI: ["2027-03-25", "2027-03-29", "2027-06-09"],
        CE: ["2027-03-25", "2027-05-17", "2027-08-05"],
        ML: ["2027-03-10", "2027-03-25", "2027-05-17"]
      }
    }
  };

  var datos = { CCAA: CCAA, FESTIVOS: FESTIVOS };
  if (typeof module !== "undefined" && module.exports) module.exports = datos;
  else root.OPOSICIONES_FESTIVOS = datos;
})(this);
