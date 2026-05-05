import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
    description: "",
    connectionType: "",
    technicalSpecs: {
      driver: "",
      frequency: "",
      impedance: "",
      battery: "",
      bluetooth: "",
    },
  });

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/products/${id}`);
        const data = await res.json();

        setForm({
          title: data.title || "",
          price: data.price || "",
          image: data.image || "",
          description: data.description || "",
          connectionType: data.connectionType || data.category || "",
          technicalSpecs: {
            driver: data.technicalSpecs?.driver || "",
            frequency: data.technicalSpecs?.frequency || "",
            impedance: data.technicalSpecs?.impedance || "",
            battery: data.technicalSpecs?.battery || "",
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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("spec_")) {
      const key = name.replace("spec_", "");

      setForm((prev) => ({
        ...prev,
        technicalSpecs: {
          ...prev.technicalSpecs,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Validation
  const validateForm = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.price || Number(form.price) <= 0)
      return "Price must be greater than 0";
    if (!form.connectionType) return "Select wired or wireless";

    const specs = form.technicalSpecs;

    if (!specs.driver) return "Driver is required";
    if (!specs.frequency) return "Frequency is required";
    if (!specs.impedance) return "Impedance is required";

    if (form.connectionType === "wireless") {
      if (!specs.battery) return "Battery is required";
      if (!specs.bluetooth) return "Bluetooth version is required";
    }

    return "";
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      title: form.title,
      price: Number(form.price),
      image: form.image,
      description: form.description,
      connectionType: form.connectionType,
      technicalSpecs: {
        driver: form.technicalSpecs.driver,
        frequency: form.technicalSpecs.frequency,
        impedance: form.technicalSpecs.impedance,
        battery: form.technicalSpecs.battery,
        bluetooth:
          form.connectionType === "wired"
            ? ""
            : form.technicalSpecs.bluetooth,
      },
    };

    try {
      await fetch(`http://localhost:5000/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      navigate("/admin/products");
    } catch {
      setError("Failed to update product");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow max-w-lg"
      >
        {/* Title */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Title"
          className="w-full border px-3 py-2 mb-3"
        />

        {/* Price */}
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border px-3 py-2 mb-3"
        />

        {/* Image */}
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border px-3 py-2 mb-3"
        />

        {form.image && (
          <img
            src={form.image}
            alt="preview"
            className="w-24 h-24 object-cover rounded mb-3"
          />
        )}

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          placeholder="Description"
          className="w-full border px-3 py-2 mb-4"
        />

        {/* Connectivity */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Connectivity</label>

          <label className="mr-4">
            <input
              type="radio"
              name="connectionType"
              value="wired"
              checked={form.connectionType === "wired"}
              onChange={handleChange}
            />
            Wired
          </label>

          <label>
            <input
              type="radio"
              name="connectionType"
              value="wireless"
              checked={form.connectionType === "wireless"}
              onChange={handleChange}
            />
            Wireless
          </label>
        </div>

        {/* Technical Specs */}

        <input
          name="spec_driver"
          value={form.technicalSpecs.driver}
          onChange={handleChange}
          placeholder="Driver (40mm)"
          className="w-full border px-3 py-2 mb-2"
        />

        <input
          name="spec_frequency"
          value={form.technicalSpecs.frequency}
          onChange={handleChange}
          placeholder="Frequency (20Hz-20kHz)"
          className="w-full border px-3 py-2 mb-2"
        />

        <input
          name="spec_impedance"
          value={form.technicalSpecs.impedance}
          onChange={handleChange}
          placeholder="Impedance (32 Ohm)"
          className="w-full border px-3 py-2 mb-2"
        />

        <input
          name="spec_battery"
          value={form.technicalSpecs.battery}
          onChange={handleChange}
          placeholder="Battery (35 Hours)"
          className="w-full border px-3 py-2 mb-2"
        />

        {form.connectionType === "wireless" && (
          <input
            name="spec_bluetooth"
            value={form.technicalSpecs.bluetooth}
            onChange={handleChange}
            placeholder="Bluetooth (5.2)"
            className="w-full border px-3 py-2 mb-2"
          />
        )}

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Update Product
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;