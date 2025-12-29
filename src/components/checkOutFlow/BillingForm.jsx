import { useState, useEffect } from "react";
import { COUNTRY_LIST } from "../../data/dataList";
import { useNavigate } from "react-router-dom";

export function BillingForm({ onNext }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "",
    street: "",
    street2: "",
    city: "",
    county: "",
    postcode: "",
    phone: "",
    email: "",
   
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
  const userData = JSON.parse(localStorage.getItem("user"));

  if (userData) {
    const fullName = userData.name?.trim() || "";
    const nameParts = fullName.split(" ").filter(Boolean);

    setForm((prev) => ({
      ...prev,
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      email: userData.email || "",
    }));
  }
}, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Remove error message as user types
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.country) newErrors.country = "Country is required";
    if (!form.street.trim()) newErrors.street = "Street address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.postcode.trim()) newErrors.postcode = "Postcode is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
  

    // Email validation
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Phone validation (optional but must be numeric)
    if (form.phone && !/^\d+$/.test(form.phone)) {
      newErrors.phone = "Phone must contain only numbers";
    }

    // Username length
    

    // Postcode length
    if (form.postcode && form.postcode.length < 3) {
      newErrors.postcode = "Postcode must be at least 3 characters";
    }

    setErrors(newErrors);

    // If no error return true
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">
        Billing Information
      </h2>

      {/* First + Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-medium text-slate-600">
            First name <span className="text-red-500">*</span>
          </label>
          <input
            name="firstName"
            className="mt-2 w-full text-black border border-slate-300 p-3 rounded-lg focus:border-orange-500 outline-none"
            value={form.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600">
            Last name <span className="text-red-500">*</span>
          </label>
          <input
            name="lastName"
            className="mt-2 w-full text-black  border border-slate-300 p-3 rounded-lg focus:border-orange-500 outline-none"
            value={form.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Country */}
      <div>
        <label className="text-sm font-medium text-slate-600">
          Country / Region <span className="text-red-500">*</span>
        </label>
        <select
          name="country"
          className="mt-2 w-full text-black  border border-slate-300 p-3 rounded-lg focus:border-orange-500 outline-none"
          value={form.country}
          onChange={handleChange}
        >
          <option value="">Select country</option>
          {COUNTRY_LIST.map((item) => (
            <option key={item.id} value={item.country}>
              {item.country}
            </option>
          ))}
        </select>
        {errors.country && (
          <p className="text-red-500 text-xs mt-1">{errors.country}</p>
        )}
      </div>

      {/* Street Address */}
      <div>
        <label className="text-sm font-medium text-slate-600">
          Street address <span className="text-red-500">*</span>
        </label>

        <input
          name="street"
          className="mt-2 w-full text-black  border border-slate-300 p-3 rounded-lg focus:border-orange-500 outline-none"
          value={form.street}
          onChange={handleChange}
        />
        {errors.street && (
          <p className="text-red-500 text-xs mt-1">{errors.street}</p>
        )}

        <input
          name="street2"
          placeholder="Apartment, suite, etc. (optional)"
          className="mt-3 w-full text-black  border border-slate-300 p-3 rounded-lg focus:border-orange-500 outline-none"
          value={form.street2}
          onChange={handleChange}
        />
      </div>

      {/* City */}
      <div>
        <label className="text-sm font-medium text-slate-600">
          Town / City <span className="text-red-500">*</span>
        </label>
        <input
          name="city"
          className="mt-2 w-full text-black  border border-slate-300 p-3 rounded-lg focus:border-orange-500 outline-none"
          value={form.city}
          onChange={handleChange}
        />
        {errors.city && (
          <p className="text-red-500 text-xs mt-1">{errors.city}</p>
        )}
      </div>

      {/* Postcode */}
      <div>
        <label className="text-sm font-medium text-slate-600">
          Postcode <span className="text-red-500">*</span>
        </label>
        <input
          name="postcode"
          className="mt-2 w-full text-black  border border-slate-300 p-3 rounded-lg focus:border-orange-500 outline-none"
          value={form.postcode}
          onChange={handleChange}
        />
        {errors.postcode && (
          <p className="text-red-500 text-xs mt-1">{errors.postcode}</p>
        )}
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-medium text-slate-600">
            Phone (optional)
          </label>
          <input
            name="phone"
            className="mt-2 w-full text-black  border border-slate-300 p-3 rounded-lg focus:border-orange-500 outline-none"
            value={form.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            className="mt-2 w-full text-black  border border-slate-300 p-3 rounded-lg focus:border-orange-500 outline-none"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Username */}
      

      {/* Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={() => navigate("/Dashboard/allStats")}
          className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 cursor-pointer"
        >
          ← Dashboard
        </button>

        <button
          onClick={handleNext}
          className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 cursor-pointer"
        >
          Continue to Shipping →
        </button>
      </div>
    </div>
  );
}
