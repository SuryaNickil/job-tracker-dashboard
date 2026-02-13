import React, { useState } from 'react';

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

interface ApplicationListProps {
  applications: Application[];
  onUpdate: (id: number, updates: Partial<Application>) => void;
  onDelete: (id: number) => void;
}

const statusColors: Record<string, string> = {
  Applied: 'bg-blue-100 text-blue-800',
  Interviewing: 'bg-amber-100 text-amber-800',
  Offered: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Ghosted: 'bg-purple-100 text-purple-800',
};

export default function ApplicationList({ applications, onUpdate, onDelete }: ApplicationListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState('');

  const handleStatusChange = (id: number, newStatus: string) => {
    onUpdate(id, { status: newStatus });
    setEditingId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (applications.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
        <p className="text-slate-400 text-lg">No applications found. Start tracking your job search!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700 border-b border-slate-600">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Company</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Position</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Applied</th>
              <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {applications.map(app => (
              <tr key={app.id} className="hover:bg-slate-700 transition">
                <td className="px-6 py-4">
                  <p className="font-semibold">{app.company}</p>
                </td>
                <td className="px-6 py-4 text-slate-300">{app.position}</td>
                <td className="px-6 py-4 text-slate-300">{app.location}</td>
                <td className="px-6 py-4">
                  {editingId === app.id ? (
                    <select
                      value={editStatus}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="bg-slate-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offered">Offered</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Ghosted">Ghosted</option>
                    </select>
                  ) : (
                    <span
                      onClick={() => {
                        setEditingId(app.id);
                        setEditStatus(app.status);
                      }}
                      className="cursor-pointer px-3 py-1 rounded text-sm font-medium bg-blue-900 text-blue-100 hover:bg-blue-800"
                    >
                      {app.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-300 text-sm">{formatDate(app.applied_date)}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onDelete(app.id)}
                    className="text-red-400 hover:text-red-300 transition text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
