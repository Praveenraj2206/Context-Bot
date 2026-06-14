import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      await api.post('/auth/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

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
          Create account
        </h1>
        <p className="text-slate-400 mb-6">Join MoodChat today</p>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full bg-brand-dark border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-brand-dark border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-brand-dark border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent"
          />
          <button
            onClick={handleSubmit}
            className="w-full text-white font-display font-semibold py-3 rounded-xl transition-colors"
            style={{
              backgroundColor: "#238636",
            }}
          >
            Register
          </button>
        </div>
        <p className="text-slate-400 text-sm mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-soft hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
