import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import ApplicationList from './components/ApplicationList';
import ApplicationForm from './components/ApplicationForm';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface Application {
  id: number;
  company: string;
  position: string;
  status: string;
  salary_min?: number;
  salary_max?: number;
  location: string;
  applied_date: string;
  last_updated: string;
  notes?: string;
}

interface Summary {
  total: number;
  applied: number;
  interviewing: number;
  offered: number;
  rejected: number;
}

export default function App() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
    fetchSummary();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const endpoint = statusFilter 
        ? `${API_BASE}/api/applications?status=${statusFilter}`
        : `${API_BASE}/api/applications`;
      
      const response = await axios.get(endpoint);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/analytics/summary`);
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleAddApplication = async (newApp: Omit<Application, 'id' | 'applied_date' | 'last_updated'>) => {
    try {
      const response = await axios.post(`${API_BASE}/api/applications`, newApp);
      setApplications([...applications, response.data]);
      setSummary(await axios.get(`${API_BASE}/api/analytics/summary`).then(r => r.data));
      setShowForm(false);
    } catch (error) {
      console.error('Error adding application:', error);
    }
  };

  const handleUpdateApplication = async (id: number, updates: Partial<Application>) => {
    try {
      const response = await axios.put(`${API_BASE}/api/applications/${id}`, updates);
      setApplications(applications.map(app => app.id === id ? response.data : app));
      fetchSummary();
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const handleDeleteApplication = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/api/applications/${id}`);
      setApplications(applications.filter(app => app.id !== id));
      fetchSummary();
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Job Tracker Dashboard</h1>
          <p className="text-slate-400">Track and analyze your job applications in real-time</p>
        </div>

        {/* Dashboard Summary */}
        {summary && <Dashboard summary={summary} onFilterChange={setStatusFilter} />}

        {/* Add Application Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {showForm ? 'Cancel' : '+ New Application'}
          </button>
        </div>

        {/* Application Form */}
        {showForm && (
          <div className="mb-8 bg-slate-800 p-6 rounded-lg border border-slate-700">
            <ApplicationForm onSubmit={handleAddApplication} />
          </div>
        )}

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading applications...</p>
          </div>
        ) : (
          <ApplicationList
            applications={applications}
            onUpdate={handleUpdateApplication}
            onDelete={handleDeleteApplication}
          />
        )}
      </div>
    </div>
  );
}
