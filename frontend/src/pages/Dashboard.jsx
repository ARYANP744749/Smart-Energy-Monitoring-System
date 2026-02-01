import React, { useEffect, useRef, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import KPIGrid from '../components/KPIGrid';
import DailySummary from '../components/DailySummary';
import MeasurementsChart from '../components/MeasurementsChart';

export default function Dashboard() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [liveFeed, setLiveFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isFilterMode, setIsFilterMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const intervalRef = useRef(null);
  const lastTimestampRef = useRef(null);

  /* ================= FETCH LATEST (DEDUP SAFE) ================= */
  const fetchLatest = async () => {
    try {
      const res = await api.get('/readings/latest');
      const data = res.data;
      if (!data) return;

      if (lastTimestampRef.current === data.timestamp) return;
      lastTimestampRef.current = data.timestamp;

      setLatest(data);

      setLiveFeed(prev => {
        const updated = [data, ...prev];
        const seen = new Set();
        const unique = [];

        for (const r of updated) {
          if (!seen.has(r.timestamp)) {
            seen.add(r.timestamp);
            unique.push(r);
          }
        }
        return unique.slice(0, 20);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH HISTORY ================= */
  const fetchHistory = async () => {
    const from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const res = await api.get(`/readings?from=${from}`);
    setHistory(res.data.reverse());
  };

  /* ================= AUTO REFRESH ================= */
  useEffect(() => {
    fetchLatest();
    if (!isFilterMode) fetchHistory();

    if (autoRefresh) {
      intervalRef.current = setInterval(fetchLatest, 5000);
    }

    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, isFilterMode]);

  /* ================= DATE FILTER ================= */
  const applyDateFilter = async () => {
    if (!fromDate || !toDate) return;

    setIsFilterMode(true);

    const from = new Date(fromDate);
    const to = new Date(toDate);
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    const res = await api.get(
      `/readings?from=${from.toISOString()}&to=${to.toISOString()}`
    );
    setHistory(res.data.reverse());
  };

  const clearFilter = () => {
    setIsFilterMode(false);
    setFromDate('');
    setToDate('');
    fetchHistory();
  };

  /* ================= CSV EXPORT ================= */
  const exportCSV = () => {
    if (!history.length) {
      alert('No data available');
      return;
    }

    const headers = ['Time', 'Voltage', 'Current', 'Power', 'Energy', 'PF'];

    const rows = history.map(r => [
      new Date(r.timestamp).toLocaleString(),
      r.voltage,
      r.current,
      r.activePower,
      r.energy,
      r.powerFactor
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `energy_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <>
        <Navbar latest={latest} />
        <div className="min-h-screen flex items-center justify-center
                        bg-gray-100 dark:bg-gray-900">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar latest={latest} />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900
                      text-gray-900 dark:text-gray-100 p-6">

        <h1 className="text-2xl font-semibold mb-4">
          Smart Energy Monitoring
        </h1>

        {/* KPI CARDS */}
        <KPIGrid latest={latest} />

        {/* DAILY SUMMARY */}
        <DailySummary history={history} />

        {/* FILTER CONTROLS */}
        <div className="bg-white dark:bg-gray-800
                        border border-gray-200 dark:border-gray-700
                        p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 items-end">

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="block border rounded px-3 py-1 mt-1
                           bg-white dark:bg-gray-700
                           text-gray-900 dark:text-gray-100
                           border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="block border rounded px-3 py-1 mt-1
                           bg-white dark:bg-gray-700
                           text-gray-900 dark:text-gray-100
                           border-gray-300 dark:border-gray-600"
              />
            </div>

            <button
              onClick={applyDateFilter}
              className="bg-blue-600 text-white px-4 py-2 rounded">
              Apply Filter
            </button>

            <button
              onClick={clearFilter}
              className="bg-gray-600 text-white px-4 py-2 rounded">
              Clear Filter
            </button>

            <button
              onClick={exportCSV}
              className="bg-green-600 text-white px-4 py-2 rounded">
              Export CSV
            </button>

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded text-white
                ${autoRefresh ? 'bg-red-600' : 'bg-gray-500'}`}>
              {autoRefresh ? 'Pause Live Data' : 'Resume Live Data'}
            </button>

          </div>
        </div>

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LATEST READING */}
          <div className="bg-white dark:bg-gray-800
                          border border-gray-200 dark:border-gray-700
                          p-5 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Latest Reading</h3>
            {latest && (
              <div className="space-y-1 text-sm">
                <div>Time: {new Date(latest.timestamp).toLocaleString()}</div>
                <div>Voltage: {latest.voltage} V</div>
                <div>Current: {latest.current} A</div>
                <div>Power: {latest.activePower} kW</div>
                <div>Energy: {latest.energy} kWh</div>
                <div>PF: {latest.powerFactor}</div>
              </div>
            )}
          </div>

          {/* CHART */}
          <div className="bg-white dark:bg-gray-800
                          border border-gray-200 dark:border-gray-700
                          p-5 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Energy Trends</h3>
            {history.length === 0
              ? <p>No data available</p>
              : <MeasurementsChart readings={history} />}
          </div>
        </div>

        {/* LIVE FEED (NOT REMOVED) */}
        <div className="mt-6 bg-white dark:bg-gray-800
                        border border-gray-200 dark:border-gray-700
                        p-5 rounded-lg shadow">
          <h3 className="font-semibold mb-3 text-green-600 dark:text-green-400">
            Live Energy Feed (updates only when simulator is ON)
          </h3>

          {liveFeed.length === 0 ? (
            <p>No live data</p>
          ) : (
            <div className="overflow-auto max-h-64">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th>Time</th>
                    <th>V</th>
                    <th>I</th>
                    <th>P</th>
                    <th>E</th>
                    <th>PF</th>
                  </tr>
                </thead>
                <tbody>
                  {liveFeed.map((r, i) => (
                    <tr key={i}
                        className="border-b last:border-0
                                   border-gray-200 dark:border-gray-700
                                   bg-green-50 dark:bg-green-900/20">
                      <td>{new Date(r.timestamp).toLocaleTimeString()}</td>
                      <td>{r.voltage}</td>
                      <td>{r.current}</td>
                      <td>{r.activePower}</td>
                      <td>{r.energy}</td>
                      <td>{r.powerFactor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
