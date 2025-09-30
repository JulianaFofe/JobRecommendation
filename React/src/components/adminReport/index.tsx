import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import Sidebar from '../dashboardView/sidebar';
import { Menu, X } from 'lucide-react';

interface ReportData {
  hiring_stats: {
    total_jobs: number;
    total_applications: number;
    total_users: number;
  };
  most_applied_jobs: {
    job_id: number;
    title: string;
    total_applications: number;
  }[];
  most_active_employers: {
    employer_id: number;
    employer_name: string;
    total_jobs_posted: number;
    total_applications: number;
  }[];
}

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const baseClasses =
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline:
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        className || ''
      }`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export default function AdminReport() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get('http://localhost:8000/admin/reports', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReportData(res.data);
      } catch (error) {
        console.error('Error fetching admin report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [navigate]);

  if (loading)
    return <div className="text-center py-10">Loading report...</div>;
  if (!reportData)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load report
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans">

      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} />

        <main className="flex-1 p-4 lg:p-8 lg:ml-0 overflow-y-auto">
          <button
            className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          {/* Header */}
          <h2 className="text-3xl font-bold text-primary mb-6">
            📊 Admin Report
          </h2>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-blue-50 shadow">
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">
                {reportData.hiring_stats.total_users}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 shadow">
              <p className="text-sm text-gray-500">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-800">
                {reportData.hiring_stats.total_jobs}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50 shadow">
              <p className="text-sm text-gray-500">Total Applications</p>
              <p className="text-2xl font-bold text-gray-800">
                {reportData.hiring_stats.total_applications}
              </p>
            </div>
          </div>

          {/* Most Applied Jobs */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Most Applied Jobs
            </h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                      Job ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                      Title
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                      Applications
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.most_applied_jobs?.map((job, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">{job.job_id}</td>
                      <td className="px-4 py-2 text-sm">{job.title}</td>
                      <td className="px-4 py-2 text-sm">
                        {job.total_applications}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Most Active Employers */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Most Active Employers
            </h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                      Employer ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                      Jobs Posted
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                      Applications
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.most_active_employers?.map((employer, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">
                        {employer.employer_id}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {employer.employer_name}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {employer.total_jobs_posted}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {employer.total_applications}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
