"use client";

import emailjs from "@emailjs/browser";
import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  Navigation,
  Clock3,
  Shield,
  Sparkles,
  CircleCheck,
} from "lucide-react";

export default function BookingForm({ data }: any) {
  const [loading, setLoading] = useState(false);
  const [savedCustomers, setSavedCustomers] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedField, setFocusedField] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    payment: "Cash",
  });

  // =========================
  // LOAD SAVED CUSTOMERS
  // =========================
  useEffect(() => {
    const customers = localStorage.getItem("saved_customers");
    if (customers) {
      setSavedCustomers(JSON.parse(customers));
    }

    // Auto-detect last used customer
    const lastCustomer = localStorage.getItem("last_customer");
    if (lastCustomer) {
      const customer = JSON.parse(lastCustomer);
      setForm({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        payment: "Cash",
      });
    }

    // Auto-detect email from previous bookings
    const savedEmail = localStorage.getItem("user_email");
    if (savedEmail && !form.email) {
      setForm((prev) => ({
        ...prev,
        email: savedEmail,
      }));
    }
  }, []);

  // =========================
  // SAVE CUSTOMER DATA
  // =========================
  const saveCustomerData = () => {
    if (form.name && form.phone) {
      const customers = localStorage.getItem("saved_customers");
      let customerList = customers ? JSON.parse(customers) : [];

      // Check if customer exists
      const existingIndex = customerList.findIndex(
        (c: any) => c.phone === form.phone
      );

      const customerData = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        lastBooked: new Date().toISOString(),
      };

      if (existingIndex !== -1) {
        customerList[existingIndex] = customerData;
      } else {
        customerList.unshift(customerData);
      }

      // Keep only last 10 customers
      customerList = customerList.slice(0, 10);

      localStorage.setItem("saved_customers", JSON.stringify(customerList));
      localStorage.setItem("last_customer", JSON.stringify(customerData));
      localStorage.setItem("user_email", form.email);

      setSavedCustomers(customerList);
    }
  };

  // =========================
  // GET SUGGESTIONS
  // =========================
  const getSuggestions = (field: string, value: string) => {
    if (!value || value.length < 1) return [];

    const suggestions = savedCustomers.filter((customer) => {
      if (field === "name") {
        return customer.name?.toLowerCase().includes(value.toLowerCase());
      }
      if (field === "phone") {
        return customer.phone?.includes(value);
      }
      if (field === "email") {
        return customer.email?.toLowerCase().includes(value.toLowerCase());
      }
      return false;
    });

    // Remove duplicates
    return suggestions.filter(
      (v, i, a) => a.findIndex((t) => t.phone === v.phone) === i
    );
  };

  // =========================
  // AUTO-FILL FROM SUGGESTION
  // =========================
  const autoFillFromSuggestion = (customer: any) => {
    setForm({
      name: customer.name || form.name,
      phone: customer.phone || form.phone,
      email: customer.email || form.email,
      address: customer.address || form.address,
      payment: "Cash",
    });
    setShowSuggestions(false);
    setFocusedField("");
  };

  // =========================
  // PHONE VALIDATION
  // =========================
  const isValidPhone = (phone: string) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  // =========================
  // EMAIL VALIDATION
  // =========================
  const isValidEmail = (email: string) => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter your full name");
      return;
    }

    if (!isValidPhone(form.phone)) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    if (form.email && !isValidEmail(form.email)) {
      alert("Enter valid email address");
      return;
    }

    if (!form.address.trim()) {
      alert("Please enter your address or landmark");
      return;
    }

    try {
      setLoading(true);
      saveCustomerData();

      await emailjs.send(
        "service_nyf10gh",
        "template_58tjlqp",
        {
          car: data.car,
          mode: data.mode,
          price: data.price,
          pickup: data.pickup,
          drop: data.drop,
          distance: data.distance,
          duration: data.duration,
          bookingDate: data.bookingDate,
          bookingTime: data.bookingTime,
          name: form.name,
          phone: `+91 ${form.phone}`,
          email: form.email,
          address: form.address,
          payment: form.payment,
          to_email: "webappseostudio@gmail.com",
        },
        "hT2h0GCkb0gmhnT2_"
      );

      alert("🎉 Booking Confirmed Successfully! 🚖");

      setTimeout(() => {
        window.location.href = "/thank-you";
      }, 2000);
    } catch (err) {
      console.log(err);
      alert("Booking Failed ❌ Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Premium Background Decoration */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-50" />

      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Premium Header Gradient */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Complete Your Booking
              </h2>
              <p className="text-pink-100 mt-1 text-sm">
                Secure & instant confirmation
              </p>
            </div>
            <Shield className="w-10 h-10 opacity-80" />
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* NAME FIELD */}
          <div className="relative">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                required
                value={form.name}
                onFocus={() => {
                  setFocusedField("name");
                  setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  setShowSuggestions(true);
                }}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-pink-500 focus:bg-white transition-all text-lg"
              />
            </div>

            {/* Suggestions */}
            {showSuggestions && focusedField === "name" && getSuggestions("name", form.name).length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                {getSuggestions("name", form.name).map((customer, idx) => (
                  <div
                    key={idx}
                    onClick={() => autoFillFromSuggestion(customer)}
                    className="px-4 py-3 hover:bg-pink-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center gap-3"
                  >
                    <CircleCheck className="w-4 h-4 text-pink-500" />
                    <div>
                      <p className="font-semibold text-gray-800">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PHONE FIELD */}
          <div className="relative">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500 font-semibold">+91</span>
              </div>
              <input
                type="tel"
                placeholder="9999999999"
                required
                maxLength={10}
                value={form.phone}
                onFocus={() => {
                  setFocusedField("phone");
                  setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  setForm({ ...form, phone: onlyNums });
                  setShowSuggestions(true);
                }}
                className="w-full pl-28 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-pink-500 focus:bg-white transition-all text-lg"
              />
            </div>

            {/* Suggestions */}
            {showSuggestions && focusedField === "phone" && getSuggestions("phone", form.phone).length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                {getSuggestions("phone", form.phone).map((customer, idx) => (
                  <div
                    key={idx}
                    onClick={() => autoFillFromSuggestion(customer)}
                    className="px-4 py-3 hover:bg-pink-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center gap-3"
                  >
                    <CircleCheck className="w-4 h-4 text-pink-500" />
                    <div>
                      <p className="font-semibold text-gray-800">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EMAIL FIELD */}
          <div className="relative">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address (Optional)"
                value={form.email}
                onFocus={() => {
                  setFocusedField("email");
                  setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setShowSuggestions(true);
                }}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-pink-500 focus:bg-white transition-all text-lg"
              />
            </div>

            {/* Suggestions */}
            {showSuggestions && focusedField === "email" && getSuggestions("email", form.email).length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                {getSuggestions("email", form.email).map((customer, idx) => (
                  <div
                    key={idx}
                    onClick={() => autoFillFromSuggestion(customer)}
                    className="px-4 py-3 hover:bg-pink-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center gap-3"
                  >
                    <CircleCheck className="w-4 h-4 text-pink-500" />
                    <div>
                      <p className="font-semibold text-gray-800">{customer.email}</p>
                      <p className="text-xs text-gray-500">{customer.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ADDRESS FIELD */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pickup Address / Landmark"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-pink-500 focus:bg-white transition-all text-lg"
            />
          </div>

          {/* PAYMENT SECTION */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border-2 border-pink-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-pink-600" />
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Cash Payment</h3>
                  <p className="text-gray-600 text-sm">Pay directly to driver after ride</p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-pink-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
          </div>

          {/* BOOKING DETAILS CARD */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-500" />
              Trip Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold text-gray-800">{data.bookingDate || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold text-gray-800">{data.bookingTime || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Distance:</span>
                <span className="font-semibold text-gray-800">{data.distance || 0} km</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold text-gray-800">{data.duration || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* CONFIRM BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm Booking 🚖
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* SECURITY NOTE */}
          <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            Your information is secure and encrypted
          </p>
        </form>
      </div>
    </div>
  );
}