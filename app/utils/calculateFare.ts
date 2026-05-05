import { pricing } from "./pricing";

export const calculateFare = (
  km: number,
  mode: "oneway" | "airport",
  car: string
) => {
  const data = pricing[mode];
  const carData = data.cars[car as keyof typeof data.cars];

  if (!carData) return 0;

  if (km <= data.baseKm) return carData.base;

  const extraKm = km - data.baseKm;

  return Math.round(carData.base + extraKm * carData.extra);
};