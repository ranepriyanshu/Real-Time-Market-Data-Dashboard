import React, { useState } from "react";
import { loginRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../api/client";

export default function LoginPage() {
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await loginRequest({ username, password });
      login(token);
      setAuthToken(token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || alert("Incorrect username/password or U HAVEN'T STARTED RADIS YET"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-400">
          Market Data Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder-gray-500 transition-all"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder-gray-500 transition-all"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition-all 
                       ${
                         loading
                           ? "bg-blue-400 cursor-not-allowed"
                           : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
                       }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Demo credentials: <span className="text-gray-300">demo / password</span>
        </p>
      </div>
    </div>
  );
}
