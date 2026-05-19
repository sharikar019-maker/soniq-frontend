import { useEffect, useState, useCallback } from "react";
import api from "../fetch/adminapi";
import { toast } from "react-toastify";

const USER_STATUS = {
  ACTIVE: "active",
  BLOCKED: "blocked",
};

const Users = () => {
  const [users, setUsers]               = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [togglingId, setTogglingId]     = useState(null);

  
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      const raw = res.data?.data || [];

      const normalizedUsers = raw.map((user) => ({
        ...user,
        status:    user.status    || USER_STATUS.ACTIVE,
        createdAt: user.createdAt || new Date().toISOString(),
      }));

      setUsers(normalizedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  
  const toggleStatus = async (user) => {
    if (!user?._id) return;

    const updatedStatus =
      user.status === USER_STATUS.ACTIVE
        ? USER_STATUS.BLOCKED
        : USER_STATUS.ACTIVE;

    try {
      setTogglingId(user._id);

      
      await api.patch(`/users/${user._id}/status`, { status: updatedStatus });

    
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, status: updatedStatus } : u
        )
      );

      // Keep modal in sync if open
      if (selectedUser?._id === user._id) {
        setSelectedUser((prev) => ({ ...prev, status: updatedStatus }));
      }

      toast.success(
        `User ${updatedStatus === USER_STATUS.BLOCKED ? "blocked" : "unblocked"} successfully`
      );
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update user status";
      toast.error(message);
    } finally {
      setTogglingId(null);
    }
  };

 
  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading users...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Users</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Joined</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs">
                      {getInitials(user.name)}
                    </div>
                    {user.name || "Unknown"}
                  </td>
                  <td className="p-4">{user.email || "-"}</td>
                  <td className="p-4 text-center capitalize">{user.role || "user"}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === USER_STATUS.ACTIVE
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-center text-gray-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                      {user.role !== "admin" && (
                        <button
                          onClick={() => toggleStatus(user)}
                          disabled={togglingId === user._id}
                          className={`disabled:opacity-50 disabled:cursor-not-allowed ${
                            user.status === USER_STATUS.ACTIVE
                              ? "text-red-600 hover:text-red-800"
                              : "text-green-600 hover:text-green-800"
                          }`}
                        >
                          {togglingId === user._id
                            ? "..."
                            : user.status === USER_STATUS.ACTIVE
                            ? "Block"
                            : "Unblock"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

     
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">User Details</h2>
            <div className="space-y-2 text-sm">
              <p><b>Name:</b>   {selectedUser.name}</p>
              <p><b>Email:</b>  {selectedUser.email}</p>
              <p><b>Phone:</b>  {selectedUser.phone || "-"}</p>
              <p><b>Role:</b>   {selectedUser.role}</p>
              <p><b>Status:</b> {selectedUser.status}</p>
              <p><b>Orders:</b> {selectedUser.orderCount ?? "-"}</p>
              <p><b>Joined:</b> {formatDate(selectedUser.createdAt)}</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              {selectedUser.role !== "admin" && (
                <button
                  onClick={() => toggleStatus(selectedUser)}
                  disabled={togglingId === selectedUser._id}
                  className={`px-4 py-2 text-white rounded disabled:opacity-50 ${
                    selectedUser.status === USER_STATUS.ACTIVE
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {togglingId === selectedUser._id
                    ? "Updating..."
                    : selectedUser.status === USER_STATUS.ACTIVE
                    ? "Block User"
                    : "Unblock User"}
                </button>
              )}
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;