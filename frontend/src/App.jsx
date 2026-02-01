import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setChecked(true);
  }, []);

  // Prevent render until auth is checked
  if (!checked) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn
              ? <Navigate to="/dashboard" />
              : <Login />
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn
              ? <Dashboard />
              : <Navigate to="/login" />
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={isLoggedIn ? '/dashboard' : '/login'} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
