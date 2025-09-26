import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import {
  Briefcase,
  Calendar,
  Menu,
  MessageSquare,
  Plus,
  TrendingUp,
  User,
  X,
} from 'lucide-react';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white/70 backdrop-blur-sm shadow-lg"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 
            w-64 h-screen bg-white/70 backdrop-blur-sm shadow-lg
            transition-transform duration-300 ease-in-out
          `}
        >
          <div className="p-4 lg:p-6 flex flex-col h-full">
            <div className="flex flex-col items-center gap-1 mb-6 lg:mb-8">
              <a href="/" aria-label="SmartHire Home">
                <img
                  src="WhatsApp_Image_2025-09-03_at_12.18.10-removebg-preview.png"
                  alt="SmartHire Logo"
                  className="w-32 lg:w-45 h-auto object-cover"
                />
              </a>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">
                Admin Portal
              </p>
            </div>

            <nav
              className="space-y-2 flex-1"
              role="navigation"
              aria-label="Main navigation"
            >
              <div className="text-xs lg:text-md font-medium text-black uppercase tracking-wider mb-3">
                MAIN MENU
              </div>

              <a
                href="dashview"
                className="flex items-center gap-3 px-3 text-gray-600 hover:text-secondary py-2 rounded-lg text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Dashboard Overview"
              >
                <TrendingUp
                  className="w-5 h-5 text-primary"
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Dashboard Overview</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-secondary rounded-lg text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Job Management"
              >
                <Briefcase
                  className="w-5 h-5 text-primary"
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Job Management</span>
              </a>
              <a
                href="management"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-secondary rounded-lg text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="User Management"
              >
                <User className="w-5 h-5 text-primary" aria-hidden="true" />
                <span className="hidden sm:inline">User Management</span>
              </a>
              <a
                href="/feedadmins"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-secondary rounded-lg text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Feedback Management"
              >
                <MessageSquare
                  className="w-5 h-5 text-primary"
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Feedback Management</span>
              </a>

              <div className="text-xs lg:text-md font-medium text-black uppercase tracking-wider mb-3 mt-6">
                QUICK ACTIONS
              </div>
              <a
                href="/jobstate"
                className="flex items-center gap-3 px-3 text-gray-600 hover:text-secondary py-2 rounded-lg text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Add New Job"
              >
                <Plus className="w-5 h-5 text-primary" aria-hidden="true" />
                <span className="hidden sm:inline">Approve Job</span>
              </a>
              <a
                href="/adminReport"
                className="flex items-center gap-3 px-3 text-gray-600 hover:text-secondary py-2 rounded-lg text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Schedule Report"
              >
                <Calendar className="w-5 h-5 text-primary" aria-hidden="true" />
                <span className="hidden sm:inline">Schedule Report</span>
              </a>

              <a
                href="/pending-users"
                className="flex items-center gap-3 px-3 text-gray-600 hover:text-secondary py-2 rounded-lg text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Schedule Report"
              >
                <Calendar className="w-5 h-5 text-primary" aria-hidden="true" />
                <span className="hidden sm:inline">Approve Accounts</span>
              </a>
            </nav>
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-8 lg:ml-0 overflow-y-auto">
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
