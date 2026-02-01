import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function MeasurementsChart({ readings }) {
  const [showVoltage, setShowVoltage] = useState(true);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPower, setShowPower] = useState(true);

  const data = readings.map(r => ({
    time: new Date(r.timestamp).toLocaleTimeString(),
    voltage: r.voltage,
    current: r.current,
    power: r.activePower
  }));

  return (
    <>
      <div className="flex gap-4 mb-2 text-sm">
        <label>
          <input type="checkbox" checked={showVoltage}
            onChange={() => setShowVoltage(!showVoltage)} /> Voltage
        </label>
        <label>
          <input type="checkbox" checked={showCurrent}
            onChange={() => setShowCurrent(!showCurrent)} /> Current
        </label>
        <label>
          <input type="checkbox" checked={showPower}
            onChange={() => setShowPower(!showPower)} /> Power
        </label>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          {showVoltage && <Line type="monotone" dataKey="voltage" stroke="#2563eb" />}
          {showCurrent && <Line type="monotone" dataKey="current" stroke="#16a34a" />}
          {showPower && <Line type="monotone" dataKey="power" stroke="#dc2626" />}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
