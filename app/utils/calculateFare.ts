import { pricing } from "./pricing";

export const calculateFare = (
  distance: number,
  mode: "rent" | "oneway" | "airport",
  car: "WagonR" | "Dzire" | "Ertiga" | "Innova",
  pkg?: "8hr/80km" | "12hr/120km"
) => {

  // 🟢 RENT
  if (mode === "rent") {
    if (!pkg) return 0;
    return pricing.rent.packages[pkg][car];
  }

  // 🟣 ONEWAY (🔥 FIXED)
  if (mode === "oneway") {
    if (!distance) return 0;

    const base = pricing.oneway.base[car];
    const perKm = pricing.oneway.perKm[car];
    const minKm = pricing.oneway.minKm;

    // 👉 if <=100 km → fixed price
    if (distance <= minKm) {
      return base;
    }

    // 👉 if >100 km → base + extra
    const extraKm = distance - minKm;
    return Math.round(base + extraKm * perKm);
  }

  // 🔵 AIRPORT
  if (mode === "airport") {
    return pricing.airport.base[car];
  }

  return 0;
};