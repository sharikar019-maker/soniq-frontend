import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";

const AddAddress = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");

  const handleSave = () => {
    if (!label || !address) {
      toast.warning("Please fill all fields");
      return;
    }

    const key = `addresses_${user.email}`;
    const existing = JSON.parse(localStorage.getItem(key)) || [];

    const newAddress = {
      id: Date.now(),
      label,
      address,
    };

    localStorage.setItem(key, JSON.stringify([...existing, newAddress]));

    toast.success("Address added successfully!");
    navigate("/profile"); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add Address</h2>

        <input
          type="text"
          placeholder="Label (Home / Office)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <textarea
          placeholder="Full Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Save Address
        </button>
      </div>
    </div>
  );
};

export default AddAddress;
