import { Suspense } from "react";
import BookingClient from "./BookingClient";

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <BookingClient />
    </Suspense>
  );
}