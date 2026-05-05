import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";

const AddressSection = () => {
  const { user } = useContext(AuthContext);
  const storageKey = `addresses_${user.email}`;

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");

  // Load addresses
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(storageKey)) || [];
    setAddresses(stored);
  }, [storageKey]);

  // Save to localStorage
  const saveAddresses = (data) => {
    localStorage.setItem(storageKey, JSON.stringify(data));
    setAddresses(data);
  };

  // Add / Update address
  const handleSave = () => {
    if (!label || !address) {
      toast.warning("Please fill all fields");
      return;
    }

    let updated;

    if (editingId) {
      updated = addresses.map((item) =>
        item.id === editingId ? { ...item, label, address } : item
      );
    } else {
      updated = [
        ...addresses,
        { id: Date.now(), label, address },
      ];
    }

    saveAddresses(updated);
    resetForm();
  };

  // Edit
  const handleEdit = (item) => {
    setEditingId(item.id);
    setLabel(item.label);
    setAddress(item.address);
    setShowForm(true);
  };

  // Delete
  const handleDelete = (id) => {
    if (!window.confirm("Delete this address?")) return;
    saveAddresses(addresses.filter((item) => item.id !== id));
  };

  const resetForm = () => {
    setLabel("");
    setAddress("");
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Saved Addresses</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add New Address
        </button>
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="border p-4 rounded mb-4">
          <input
            type="text"
            placeholder="Label (Home / Office)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <textarea
            placeholder="Full Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {editingId ? "Update" : "Save"}
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <p className="text-gray-500">No addresses added yet.</p>
      ) : (
        addresses.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded mb-3"
          >
            <p className="font-semibold">{item.label}</p>
            <p className="text-gray-700">{item.address}</p>

            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AddressSection;
