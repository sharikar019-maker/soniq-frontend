import { useState } from "react";

const ProductForm = ({ initialData = null, onSubmit, isEdit }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [specs, setSpecs] = useState(
    initialData
      ? Object.entries(initialData.specs).map(([key, value]) => ({ key, value }))
      : [{ key: "", value: "" }]
  );

  const handleSpecChange = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpec = (index) =>
    setSpecs(specs.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();

    const specsObject = {};
    specs.forEach(({ key, value }) => {
      if (key && value) specsObject[key] = value;
    });

    onSubmit({
      name,
      description,
      price: Number(price),
      specs: specsObject,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-xl">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit Product" : "Add New Product"}
      </h2>

      <input
        className="input"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <textarea
        className="input mt-3"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        type="number"
        className="input mt-3"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <div className="mt-4">
        <p className="font-medium mb-2">Technical Specifications</p>

        {specs.map((spec, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              className="input flex-1"
              placeholder="Key"
              value={spec.key}
              onChange={(e) =>
                handleSpecChange(index, "key", e.target.value)
              }
            />
            <input
              className="input flex-1"
              placeholder="Value"
              value={spec.value}
              onChange={(e) =>
                handleSpecChange(index, "value", e.target.value)
              }
            />
            {specs.length > 1 && (
              <button
                type="button"
                onClick={() => removeSpec(index)}
                className="text-red-500"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addSpec}
          className="text-blue-600 text-sm mt-2"
        >
          + Add Specification
        </button>
      </div>

      <div className="flex gap-3 mt-6">
        <button className="btn-primary">
          {isEdit ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
