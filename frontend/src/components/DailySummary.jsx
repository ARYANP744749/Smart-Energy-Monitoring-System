import React from 'react';

export default function DailySummary({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow border mb-6">
        <p className="text-gray-500">No data for summary</p>
      </div>
    );
  }

  const totalEnergy =
    history[history.length - 1].energy - history[0].energy;

  const avgVoltage =
    history.reduce((s, r) => s + r.voltage, 0) / history.length;

  const avgPF =
    history.reduce((s, r) => s + r.powerFactor, 0) / history.length;

  const peakPower = Math.max(...history.map(r => r.activePower));

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <SummaryCard label="Total Energy" value={totalEnergy.toFixed(2)} unit="kWh" />
      <SummaryCard label="Avg Voltage" value={avgVoltage.toFixed(1)} unit="V" />
      <SummaryCard label="Peak Power" value={peakPower.toFixed(2)} unit="kW" />
      <SummaryCard label="Avg PF" value={avgPF.toFixed(2)} unit="" />
    </div>
  );
}

function SummaryCard({ label, value, unit }) {
  return (
    <div className="bg-white dark:bg-gray-800 
           text-gray-900 dark:text-gray-100
           rounded-lg shadow border dark:border-gray-700
           p-4 text-center"
>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold">
        {value} <span className="text-sm">{unit}</span>
      </div>
    </div>
  );
}
