export const pricing = {

  // =========================
  // RENT
  // =========================
  rent: {
    packages: {

      "8hr/80km": {
        WagonR: 2000,
        Dzire: 2400,
        Ertiga: 3000,
        Innova: 4000,
      },

      "12hr/120km": {
        WagonR: 2500,
        Dzire: 3000,
        Ertiga: 3700,
        Innova: 4900,
      },

    },
  },

  // =========================
  // ONEWAY
  // =========================
  oneway: {

    // BASE FARE
    base: {
      WagonR: 1800,
      Dzire: 2000,
      Ertiga: 2750,
      Innova: 4250,
    },

    // PER KM
    perKm: {
      WagonR: 13,
      Dzire: 15,
      Ertiga: 20,
      Innova: 25,
    },

    // MINIMUM KM
    minKm: 100,

    // DRIVER ALLOWANCE ❌ REMOVED
    driverAllowance: 0,
  },

  // =========================
  // AIRPORT
  // =========================
  airport: {

    base: {
      WagonR: 650,
      Dzire: 750,
      Ertiga: 950,
      Innova: 2300,
    },

  },

  // =========================
  // EXTRA RULES
  // =========================

  // ❌ NIGHT CHARGE REMOVED
  // ❌ SURGE PRICING REMOVED

  extra: {

    // NORMAL PRICE ONLY
    nightCharge: 1,

    // NO SURGE
    surge: 1,
  },
};