import React from 'react';

export default function KPIGrid({ latest }) {
  if (!latest) return null;

  const kpis = [
    { label: 'Voltage', value: latest.voltage, unit: 'V' },
    { label: 'Current', value: latest.current, unit: 'A' },
    { label: 'Power', value: latest.activePower, unit: 'kW' },
    { label: 'Energy', value: latest.energy, unit: 'kWh' },
    { label: 'PF', value: latest.powerFactor, unit: '' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {kpis.map((kpi, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 
           text-gray-900 dark:text-gray-100
           rounded-lg shadow border dark:border-gray-700
           p-4 text-center"

        >
          <div className="text-sm text-gray-500">{kpi.label}</div>
          <div className="text-2xl font-semibold">
            {kpi.value} <span className="text-sm">{kpi.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
