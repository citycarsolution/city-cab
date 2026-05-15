import { pricing } from "./pricing";

export const calculateFare = (
  distance: number,

  mode:
    | "rent"
    | "oneway"
    | "airport"
    | "roundtrip",

  car:
    | "WagonR"
    | "Dzire"
    | "Ertiga"
    | "Innova",

  pkg?: "8hr/80km" | "12hr/120km",

  rideTime?: string,

  returnTime?: string
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
  // ROUNDTRIP
  // =========================
  if (mode === "roundtrip") {

    // USER MUST SELECT RETURN DATE
    if (
      !distance ||
      !rideTime ||
      !returnTime
    ) {
      return 0;
    }

// =====================
// DAYS CALCULATION
// =====================

const start =
  new Date(rideTime);

const end =
  new Date(returnTime);

// ONLY DATE
const startOnly =
  new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );

const endOnly =
  new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate()
  );

// DATE DIFFERENCE
const diffMs =
  endOnly.getTime() -
  startOnly.getTime();

// TOTAL DAYS
let totalDays =
  Math.floor(
    diffMs /
      (1000 * 60 * 60 * 24)
  ) + 1;

// MINIMUM 1 DAY
if (totalDays < 1) {
  totalDays = 1;
}

    // =====================
    // TOTAL ROUNDTRIP KM
    // =====================
    const totalKm =
      distance * 2;

    // =====================
    // MINIMUM 300 KM / DAY
    // =====================
    const minimumKm =
      totalDays * 300;

    // =====================
    // BILLABLE KM
    // =====================
    const billableKm =
      Math.max(
        totalKm,
        minimumKm
      );

    // =====================
    // PER KM RATE
    // =====================
    const perKm = {

      WagonR: 12,

      Dzire: 13,

      Ertiga: 18,

      Innova: 23,
    };

    // =====================
    // DRIVER ALLOWANCE
    // =====================
    const driverAllowance =
      totalDays * 500;

    // =====================
    // FINAL ROUNDTRIP FARE
    // =====================
    fare =
      billableKm *
        perKm[car] +
      driverAllowance;
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