import { pricing } from "./pricing";

export const calculateFare = (
  distance: number,
  mode: "rent" | "oneway" | "airport",
  car: "WagonR" | "Dzire" | "Ertiga" | "Innova",
  pkg?: "8hr/80km" | "12hr/120km"
) => {
  let fare = 0;

  const hour = new Date().getHours();

  // 🌙 NIGHT CHECK
  const isNight = hour >= 22 || hour <= 6;

  // 🔥 SURGE CHECK (example: 8-10 AM & 6-9 PM)
  const isSurge =
    (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 21);

  // 🟢 RENT
  if (mode === "rent") {
    if (!pkg) return 0;
    fare = pricing.rent.packages[pkg][car];
  }

  // 🟣 ONEWAY
  if (mode === "oneway") {
    if (!distance) return 0;

    const base = pricing.oneway.base[car];
    const perKm = pricing.oneway.perKm[car];
    const minKm = pricing.oneway.minKm;

    if (distance <= minKm) {
      fare = base;
    } else {
      const extraKm = distance - minKm;
      fare = base + extraKm * perKm;
    }

    // 🧾 DRIVER ALLOWANCE
    fare += pricing.oneway.driverAllowance;
  }

  // 🔵 AIRPORT
  if (mode === "airport") {
    fare = pricing.airport.base[car];
  }

  // 🌙 APPLY NIGHT
  if (isNight) {
    fare *= pricing.extra.nightCharge;
  }

  // 🔥 APPLY SURGE
  if (isSurge) {
    fare *= pricing.extra.surge;
  }

  return Math.round(fare);
};