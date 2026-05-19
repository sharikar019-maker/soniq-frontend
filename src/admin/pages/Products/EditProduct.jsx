import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminApi from "../../fetch/adminapi";

const EditProduct = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

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

  // ─── Fetch existing product ────────────────────────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // ✅ adminApi — auth header included
        const res  = await adminApi.get(`/products/${id}`);
        const data = res.data?.data; // ✅ your backend wraps in { success, data }

        setForm({
          title:          data.title          || "",
          price:          data.price          || "",
          image:          data.image          || "",
          description:    data.description    || "",
          category:       data.category       || "",   // ✅ "wired" or "wireless"
          noiseReduction: data.noiseReduction || false,
          technicalSpecs: {
            driver:    data.technicalSpecs?.driver    || "",
            frequency: data.technicalSpecs?.frequency || "",
            impedance: data.technicalSpecs?.impedance || "",
            battery:   data.technicalSpecs?.battery   || "",
            bluetooth: data.technicalSpecs?.bluetooth || "",
          },
        });
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ─── Handle input changes ──────────────────────────────────────────────────
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

    // Clear bluetooth when switching to wired
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

  // ─── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    if (!form.title.trim())       return "Title is required";
    if (!form.image.trim())       return "Image URL is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.category)           return "Select wired or wireless";
    if (!form.price || Number(form.price) <= 0) return "Price must be greater than 0";

    const s = form.technicalSpecs;
    if (!s.driver || !s.frequency || !s.impedance || !s.battery)
      return "Driver, frequency, impedance, and battery are required";

    if (form.category === "wireless" && !s.bluetooth)
      return "Bluetooth version is required for wireless products";

    return "";
  };

  // ─── Submit update ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setError("");
    setSaving(true);

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
        bluetooth: form.category === "wired"
          ? ""
          : form.technicalSpecs.bluetooth.trim(),
      },
    };

    try {
      // ✅ adminApi PUT /api/products/:id — auth + correct base URL
      await adminApi.put(`/products/${id}`, payload);
      navigate("/admin/products");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update product";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-lg">

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Title"
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price (₹)"
          min="0"
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {form.image && (
          <img
            src={form.image}
            alt="preview"
            className="w-24 h-24 object-cover rounded mb-3"
          />
        )}

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          placeholder="Description"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        {/* Category */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Category</p>
          <div className="flex gap-6">
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
        </div>

        {/* Noise reduction */}
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
          value={form.technicalSpecs.driver}
          onChange={handleChange}
          placeholder="Driver (e.g. 40mm)"
          className="w-full border rounded px-3 py-2 mb-2"
        />
        <input
          name="spec_frequency"
          value={form.technicalSpecs.frequency}
          onChange={handleChange}
          placeholder="Frequency (e.g. 20Hz–20kHz)"
          className="w-full border rounded px-3 py-2 mb-2"
        />
        <input
          name="spec_impedance"
          value={form.technicalSpecs.impedance}
          onChange={handleChange}
          placeholder="Impedance (e.g. 32Ω)"
          className="w-full border rounded px-3 py-2 mb-2"
        />
        <input
          name="spec_battery"
          value={form.technicalSpecs.battery}
          onChange={handleChange}
          placeholder="Battery Life (e.g. 30 hours)"
          className="w-full border rounded px-3 py-2 mb-2"
        />

        {form.category === "wireless" && (
          <input
            name="spec_bluetooth"
            value={form.technicalSpecs.bluetooth}
            onChange={handleChange}
            placeholder="Bluetooth Version (e.g. 5.3)"
            className="w-full border rounded px-3 py-2 mb-2"
          />
        )}

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
