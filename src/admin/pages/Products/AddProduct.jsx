import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
    description: "",
    connectionType: "",
    technicalSpecs: {
      driverSize: "",
      frequencyResponse: "",
      impedance: "",
      batteryLife: "",
      bluetoothVersion: "",
    },
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle technical specs
    if (name.startsWith("spec_")) {
      const key = name.replace("spec_", "");
      setForm((prev) => ({
        ...prev,
        technicalSpecs: {
          ...prev.technicalSpecs,
          [key]: value,
        },
      }));
      return;
    }

    // Clear bluetooth when switching to wired
    if (name === "connectionType" && value === "wired") {
      setForm((prev) => ({
        ...prev,
        connectionType: value,
        technicalSpecs: {
          ...prev.technicalSpecs,
          bluetoothVersion: "",
        },
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanedData = {
      title: form.title.trim(),
      image: form.image.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      connectionType: form.connectionType,
      technicalSpecs: {
        driverSize: form.technicalSpecs.driverSize.trim(),
        frequencyResponse: form.technicalSpecs.frequencyResponse.trim(),
        impedance: form.technicalSpecs.impedance.trim(),
        batteryLife: form.technicalSpecs.batteryLife.trim(),
        ...(form.connectionType === "wireless" && {
          bluetoothVersion: form.technicalSpecs.bluetoothVersion.trim(),
        }),
      },
    };

    //  VALIDATION
    if (!cleanedData.title) {
      setError("Product title is required");
      return;
    }

    if (!cleanedData.image) {
      setError("Image path is required");
      return;
    }

    if (!cleanedData.connectionType) {
      setError("Please select wired or wireless");
      return;
    }

    if (isNaN(cleanedData.price) || cleanedData.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    const specs = cleanedData.technicalSpecs;

    if (
      !specs.driverSize ||
      !specs.frequencyResponse ||
      !specs.impedance ||
      !specs.batteryLife
    ) {
      setError(
        "Driver size, frequency response, impedance, and battery life are required"
      );
      return;
    }

    if (
      cleanedData.connectionType === "wireless" &&
      !specs.bluetoothVersion
    ) {
      setError("Bluetooth version is required for wireless products");
      return;
    }

    try {
      await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      navigate("/admin/products");
    } catch {
      setError("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Add Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow max-w-lg"
      >
        {/* Title */}
        <input
          name="title"
          placeholder="Product Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* Price */}
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* Image */}
        <input
          name="image"
          placeholder="/images/headphones.jpg"
          value={form.image}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* Connection */}
        <div className="flex gap-4 mb-4">
          <label>
            <input
              type="radio"
              name="connectionType"
              value="wired"
              checked={form.connectionType === "wired"}
              onChange={handleChange}
            />{" "}
            Wired
          </label>

          <label>
            <input
              type="radio"
              name="connectionType"
              value="wireless"
              checked={form.connectionType === "wireless"}
              onChange={handleChange}
            />{" "}
            Wireless
          </label>
        </div>

        {/* Technical Specs */}
        <input
          name="spec_driverSize"
          placeholder="Driver Size (40mm)"
          value={form.technicalSpecs.driverSize}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-2"
        />

        <input
          name="spec_frequencyResponse"
          placeholder="Frequency Response (20Hz–20kHz)"
          value={form.technicalSpecs.frequencyResponse}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-2"
        />

        <input
          name="spec_impedance"
          placeholder="Impedance (32Ω)"
          value={form.technicalSpecs.impedance}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-2"
        />

        {/* Battery always visible */}
        <input
          name="spec_batteryLife"
          placeholder="Battery Life (e.g. 20 hours)"
          value={form.technicalSpecs.batteryLife}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-2"
        />

        {/* Bluetooth only for wireless */}
        {form.connectionType === "wireless" && (
          <input
            name="spec_bluetoothVersion"
            placeholder="Bluetooth Version (5.3)"
            value={form.technicalSpecs.bluetoothVersion}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mb-2"
          />
        )}

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
