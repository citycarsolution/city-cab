export const pricing = {
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

  oneway: {
    base: {
      WagonR: 1800,
      Dzire: 2000,
      Ertiga: 2750,
      Innova: 4250,
    },
    perKm: {
      WagonR: 13,
      Dzire: 15,
      Ertiga: 20,
      Innova: 25,
    },
    minKm: 100,
    driverAllowance: 300,
  },

  airport: {
    base: {
      WagonR: 650,
      Dzire: 750,
      Ertiga: 950,
      Innova: 2300,
    },
  },

  // 🔥 ADVANCED RULES
  extra: {
    nightCharge: 1.2, // 20% extra
    surge: 1.3, // peak pricing
  },
};