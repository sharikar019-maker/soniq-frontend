import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const handleSignup = async (e) => {
  e.preventDefault();
  setError("");

  const cleanedData = {
    name: formData.name.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    password: formData.password.trim(),
  };

  //  Name validation 
  if (!cleanedData.name) {
    setError("Name is required");
    return;
  }

  //  Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanedData.email || !emailRegex.test(cleanedData.email)) {
    setError("Please enter a valid email address");
    return;
  }

  //  Phone validation 
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(cleanedData.phone)) {
    setError("Phone number must be exactly 10 digits");
    return;
  }

  // Password validation 
  if (!cleanedData.password || cleanedData.password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  setLoading(true);

  try {
    const result = await signup(cleanedData);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      if (result.error === "EMAIL_EXISTS") {
        setError("Email already exists. Please login.");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  } catch (err) {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            pattern="[0-9]{10}"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            minLength={6}
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
