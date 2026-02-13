import React, { useState } from 'react';

interface Application {
  company: string;
  position: string;
  status: string;
  salary_min?: number;
  salary_max?: number;
  location: string;
  notes?: string;
}

interface ApplicationFormProps {
  onSubmit: (app: Application) => void;
}

export default function ApplicationForm({ onSubmit }: ApplicationFormProps) {
  const [formData, setFormData] = useState<Application>({
    company: '',
    position: '',
    status: 'Applied',
    salary_min: undefined,
    salary_max: undefined,
    location: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('salary') ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company || !formData.position || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }
    
    onSubmit(formData);
    setFormData({
      company: '',
      position: '',
      status: 'Applied',
      salary_min: undefined,
      salary_max: undefined,
      location: '',
      notes: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold mb-6">Add New Application</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Company Name *</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g., Google"
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Position *</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="e.g., Software Engineer"
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., San Francisco, CA"
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
            <option value="Ghosted">Ghosted</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Min Salary</label>
          <input
            type="number"
            name="salary_min"
            value={formData.salary_min || ''}
            onChange={handleChange}
            placeholder="e.g., 100000"
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Max Salary</label>
          <input
            type="number"
            name="salary_max"
            value={formData.salary_max || ''}
            onChange={handleChange}
            placeholder="e.g., 150000"
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any notes about this application..."
          rows={3}
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
      >
        Add Application
      </button>
    </form>
  );
}
