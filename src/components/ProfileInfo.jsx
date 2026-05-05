import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const ProfileInfo = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

      <div className="space-y-4">
        <input
          value={user.name}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
        />
        <input
          value={user.email}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
        />
        <input
          value={user.phone}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
        />
      </div>
    </div>
  );
};

export default ProfileInfo;
