import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../fetch/adminapi";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title:          "",
    price:          "",
    image:          "",
    description:    "",
    category:       "",       
    noiseReduction: false,    
    technicalSpecs: {
      driver:    "",
      frequency: "",
      impedance: "",
      battery:   "",
      bluetooth: "",          
    },
  });

  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("spec_")) {
      const key = name.replace("spec_", "");
      setForm((prev) => ({
        ...prev,
        technicalSpecs: { ...prev.technicalSpecs, [key]: value },
      }));
      return;
    }

    if (name === "noiseReduction") {
      setForm((prev) => ({ ...prev, noiseReduction: checked }));
      return;
    }

    
    if (name === "category" && value === "wired") {
      setForm((prev) => ({
        ...prev,
        category: value,
        technicalSpecs: { ...prev.technicalSpecs, bluetooth: "" },
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.title.trim())       return "Product title is required";
    if (!form.image.trim())       return "Image URL is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.category)           return "Please select wired or wireless";
    if (!form.price || Number(form.price) <= 0) return "Price must be greater than 0";

    const s = form.technicalSpecs;
    if (!s.driver || !s.frequency || !s.impedance || !s.battery)
      return "Driver, frequency, impedance, and battery life are required";

    if (form.category === "wireless" && !s.bluetooth)
      return "Bluetooth version is required for wireless products";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setError("");
    setLoading(true);

    const payload = {
      title:          form.title.trim(),
      image:          form.image.trim(),
      description:    form.description.trim(),
      price:          Number(form.price),
      category:       form.category,           
      noiseReduction: form.noiseReduction,     
      technicalSpecs: {
        driver:    form.technicalSpecs.driver.trim(),
        frequency: form.technicalSpecs.frequency.trim(),
        impedance: form.technicalSpecs.impedance.trim(),
        battery:   form.technicalSpecs.battery.trim(),
        ...(form.category === "wireless" && {
          bluetooth: form.technicalSpecs.bluetooth.trim(),
        }),
      },
    };

    try {
      
      await adminApi.post("/products", payload);
      navigate("/admin/products");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add product";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-lg">

        <input
          name="title"
          placeholder="Product Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <input
          name="price"
          type="number"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          min="0"
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <input
          name="image"
          placeholder="Image URL (https://... or /images/...)"
          value={form.image}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* Image preview */}
        {form.image && (
          <img
            src={form.image}
            alt="preview"
            className="w-24 h-24 object-cover rounded mb-3"
          />
        )}

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* Category — wired / wireless */}
        <div className="flex gap-6 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value="wired"
              checked={form.category === "wired"}
              onChange={handleChange}
            />
            Wired
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value="wireless"
              checked={form.category === "wireless"}
              onChange={handleChange}
            />
            Wireless
          </label>
        </div>

        {/* Noise reduction toggle */}
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            name="noiseReduction"
            checked={form.noiseReduction}
            onChange={handleChange}
          />
          <span className="text-sm">Noise Reduction</span>
        </label>

        {/* Technical specs */}
        <p className="text-sm font-medium text-gray-600 mb-2">Technical Specs</p>

        <input
          name="spec_driver"
          placeholder="Driver Size (e.g. 40mm)"
          value={form.technicalSpecs.driver}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-2"
        />
        <input
          name="spec_frequency"
          placeholder="Frequency Response (e.g. 20Hz–20kHz)"
          value={form.technicalSpecs.frequency}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-2"
        />
        <input
          name="spec_impedance"
          placeholder="Impedance (e.g. 32Ω)"
          value={form.technicalSpecs.impedance}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-2"
        />
        <input
          name="spec_battery"
          placeholder="Battery Life (e.g. 30 hours)"
          value={form.technicalSpecs.battery}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-2"
        />

        {/* Bluetooth only for wireless */}
        {form.category === "wireless" && (
          <input
            name="spec_bluetooth"
            placeholder="Bluetooth Version (e.g. 5.3)"
            value={form.technicalSpecs.bluetooth}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mb-2"
          />
        )}

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;