import { pricing } from "./pricing";

export const calculateFare = (
  distance: number,
  mode: "rent" | "oneway" | "airport",
  car: "WagonR" | "Dzire" | "Ertiga" | "Innova",
  pkg?: "8hr/80km" | "12hr/120km"
) => {
  if (mode === "rent") {
    if (!pkg) return 0;
    return pricing.rent.packages[pkg][car];
  }

  if (mode === "oneway") {
    if (!distance) return 0;

    const km = Math.max(distance, pricing.oneway.minKm);
    return Math.round(km * pricing.oneway.perKm[car]);
  }

  if (mode === "airport") {
    return pricing.airport.base[car];
  }

  return 0;
};