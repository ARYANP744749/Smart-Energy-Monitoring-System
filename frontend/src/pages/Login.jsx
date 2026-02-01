import React, { useState } from 'react';
import api from '../api';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const url = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

      const res = await api.post(url, payload);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/dashboard'; // force reload → stable auth
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-2">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {isRegister
            ? 'Register to start monitoring energy data'
            : 'Login to your dashboard'}
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          {isRegister ? 'Already have an account?' : 'New user?'}{' '}
          <button
            className="text-blue-600 font-medium hover:underline"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            {isRegister ? 'Login here' : 'Create an account'}
          </button>
        </p>
      </div>
    </div>
  );
}
