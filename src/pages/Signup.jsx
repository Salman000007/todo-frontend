import { useState } from "react";
import { signup } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signup(form);
      if(data.status ==="success"){
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-screen">
      <form
        className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Signup
        </h2>
        <div className="space-y-2">
          <input
            name="email"
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
          Signup
        </button>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-green-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
