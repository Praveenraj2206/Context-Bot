import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);

      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "#0d1117",
      }}
    >
      <div
        className="p-8 rounded-2xl w-full max-w-md shadow-xl border"
        style={{
          backgroundColor: "#161b22",
          borderColor: "#30363d",
        }}
      >
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          Welcome Back
        </h1>

        <p className="text-slate-400 mb-6">Sign in to continue</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-brand-dark border border-slate-700 rounded-xl px-4 py-3 text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-brand-dark border border-slate-700 rounded-xl px-4 py-3 text-white"
          />

          <button
            onClick={handleSubmit}
            className="w-full text-white py-3 rounded-xl font-semibold"
            style={{
              backgroundColor: "#238636",
            }}
          >
            Sign In
          </button>
        </div>

        <p className="text-slate-400 text-sm mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-accent">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
