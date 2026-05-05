import { useState } from "react";
import ProfileInfo from "../components/profileInfo";
import AddressSection from "../components/AddressSection";
import OrderHistory from "../components/OrderHistory";
import Settings from "../components/Settings";


const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderSection = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo />;
      case "address":
        return <AddressSection />;
      case "orders":
        return <OrderHistory />;
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded shadow flex">
        
        {/* LEFT MENU */}
        <div className="w-1/4 border-r p-4 space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "profile" && "bg-blue-500 text-white"
            }`}
          >
            Profile
          </button>

          <button
            onClick={() => setActiveTab("address")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "address" && "bg-blue-500 text-white"
            }`}
          >
            Addresses
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "orders" && "bg-blue-500 text-white"
            }`}
          >
            Order History
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "settings" && "bg-blue-500 text-white"
            }`}
          >
            Settings
          </button>
        </div>

        {/* RIGHT CONTENT */}
       <div className="w-3/4 p-6 overflow-y-auto max-h-[80vh]">
  {renderSection()}
</div>

      </div>
    </div>
  );
};

export default Profile;
