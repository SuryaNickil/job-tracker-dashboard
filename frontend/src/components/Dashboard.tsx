import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface Summary {
  total: number;
  applied: number;
  interviewing: number;
  offered: number;
  rejected: number;
}

interface DashboardProps {
  summary: Summary;
  onFilterChange: (status: string | null) => void;
}

const COLORS = {
  Applied: '#3b82f6',
  Interviewing: '#f59e0b',
  Offered: '#10b981',
  Rejected: '#ef4444',
  Ghosted: '#8b5cf6'
};

const statuses = ['Applied', 'Interviewing', 'Offered', 'Rejected', 'Ghosted'];

export default function Dashboard({ summary, onFilterChange }: DashboardProps) {
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchBreakdown();
  }, []);

  const fetchBreakdown = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/analytics/status-breakdown`);
      setBreakdown(response.data);
    } catch (error) {
      console.error('Error fetching breakdown:', error);
    }
  };

  const handleStatusClick = (status: string) => {
    if (selectedStatus === status) {
      setSelectedStatus(null);
      onFilterChange(null);
    } else {
      setSelectedStatus(status);
      onFilterChange(status);
    }
  };

  const chartData = breakdown.filter(item => item.value > 0);

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6">Job Application Summary</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">Total Applications</p>
          <p className="text-4xl font-bold text-white">{summary.total}</p>
        </div>
        
        <div className="bg-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">Interview Stage</p>
          <p className="text-4xl font-bold text-amber-400">{summary.interviewing}</p>
        </div>
        
        <div className="bg-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">Offers</p>
          <p className="text-4xl font-bold text-green-400">{summary.offered}</p>
        </div>
      </div>

      {/* Breakdown Chart */}
      {chartData.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS] || '#666'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filter Buttons */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Filter by Status</h3>
        <div className="flex flex-wrap gap-3">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => handleStatusClick(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
          {selectedStatus && (
            <button
              onClick={() => {
                setSelectedStatus(null);
                onFilterChange(null);
              }}
              className="px-4 py-2 rounded-lg font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
