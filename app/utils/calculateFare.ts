import { pricing } from "./pricing";

export const calculateFare = (
  distance: number,
  mode: "rent" | "oneway" | "airport",
  car: "WagonR" | "Dzire" | "Ertiga" | "Innova",
  pkg?: "8hr/80km" | "12hr/120km"
) => {

  let fare = 0;

  // =========================
  // AIRPORT RULES
  // =========================
  const airportRules = {

    WagonR: {
      includedKm: 10,
      extraKm: 13,
    },

    Dzire: {
      includedKm: 10,
      extraKm: 15,
    },

    Ertiga: {
      includedKm: 10,
      extraKm: 18,
    },

    // ✅ INNOVA 40 KM INCLUDED
    Innova: {
      includedKm: 40,
      extraKm: 25,
    },
  };

  // =========================
  // RENT
  // =========================
  if (mode === "rent") {

    if (!pkg) return 0;

    fare =
      pricing.rent.packages[pkg][car];
  }

  // =========================
  // ONEWAY
  // =========================
  if (mode === "oneway") {

    if (!distance) return 0;

    const base =
      pricing.oneway.base[car];

    const perKm =
      pricing.oneway.perKm[car];

    const minKm =
      pricing.oneway.minKm;

    // MINIMUM KM
    if (distance <= minKm) {

      fare = base;

    } else {

      const extraKm =
        distance - minKm;

      fare =
        base +
        extraKm * perKm;
    }
  }

  // =========================
  // AIRPORT
  // =========================
  if (mode === "airport") {

    // BASE AIRPORT FARE
    fare =
      pricing.airport.base[car];

    const rule =
      airportRules[car];

    // EXTRA KM AFTER INCLUDED KM
    if (
      distance >
      rule.includedKm
    ) {

      const extraDistance =
        distance -
        rule.includedKm;

      fare +=
        extraDistance *
        rule.extraKm;
    }
  }

  // =========================
  // FINAL PRICE
  // =========================
  return Math.round(fare);
};