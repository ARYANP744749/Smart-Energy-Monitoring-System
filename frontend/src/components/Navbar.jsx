import SimulatorStatus from './SimulatorStatus';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ latest }) {
  const { theme, toggleTheme } = useTheme();

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-blue-600 dark:bg-gray-900
                    text-white px-6 py-3 flex justify-between items-center">
      <h1 className="font-semibold">Smart Energy Monitoring</h1>

      <div className="flex items-center gap-4">
        <SimulatorStatus latest={latest} />

        <button
          onClick={toggleTheme}
          className="bg-gray-200 dark:bg-gray-700
                     text-black dark:text-white
                     px-3 py-1 rounded">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
