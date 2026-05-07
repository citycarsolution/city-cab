import { pricing } from "./pricing";

export const calculateFare = (
  distance: number,
  mode: "rent" | "oneway" | "airport",
  car: "WagonR" | "Dzire" | "Ertiga" | "Innova",
  pkg?: "8hr/80km" | "12hr/120km"
) => {

  let fare = 0;

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

    fare =
      pricing.airport.base[car];
  }

  // =========================
  // FINAL PRICE
  // =========================
  return Math.round(fare);
};