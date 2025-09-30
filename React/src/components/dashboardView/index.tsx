'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  FileText,
  Clock,
  Award,
  Briefcase,
  User,
  ShieldCheck,
  Menu,
  X,
  Trash2,
} from 'lucide-react';
import axios from 'axios';
import Sidebar from './sidebar';

// ----- TypeScript Interfaces -----
interface Stats {
  total_jobs: number;
  total_users: number;
  total_applications: number;
}

interface ChartDataPoint {
  month?: string;
  day?: string;
  jobPosting: number;
  applications: number;
}

interface JobCategory {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Add index signature for recharts compatibility
}

interface UserData {
  id: string;
  username?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  role?: string;
  status?: string;
}

interface JobData {
  id: string;
  title?: string;
  description?: string;
  company?: string;
  location?: string;
  salary?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
}

interface ApplicationData {
  jobTitle: string;
  applicant_name: string;
  status: string;
  applied_at: string;
}

interface DeleteConfirmState {
  show: boolean;
  userId: string | null;
  username: string;
}

interface ApiJobCategoryResponse {
  name: string;
  value: number;
}

// ----- Card Components -----

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg bg-white/70 backdrop-blur-sm text-card-foreground shadow-lg ${
      className || ''
    }`}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 ${className || ''}`}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-2xl font-semibold leading-none tracking-tight ${
      className || ''
    }`}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className || ''}`} {...props} />
));
CardContent.displayName = 'CardContent';

// ----- Button Component -----

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

// ----- Dashboard Component -----

function DashView() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<Stats>({
    total_jobs: 0,
    total_users: 0,
    total_applications: 0,
  });
  const [selectedData, setSelectedData] = useState<
    (UserData | JobData | ApplicationData)[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'job' | 'user' | 'none'>('job');
  const [filteredData, setFilteredData] = useState<
    (UserData | JobData | ApplicationData)[]
  >([]);
  const [platformActivityData, setPlatformActivityData] = useState<
    ChartDataPoint[]
  >([]);
  const [jobCategoriesData, setJobCategoriesData] = useState<JobCategory[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    show: false,
    userId: null,
    username: '',
  });
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No access token found. Please log in.');
        return;
      }

      const response = await axios.get<Stats>(
        'http://localhost:8000/admin/stats',
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000, // 10 second timeout
        },
      );
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to fetch statistics. Please try again.');
    }
  }, []);

  const fetchPlatformActivity = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await axios.get<ChartDataPoint[]>(
        'http://localhost:8000/stats/daily',
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        },
      );

      setPlatformActivityData(response.data);
    } catch (error) {
      console.error('Error fetching platform activity:', error);
      // Use fallback data if API fails
      setPlatformActivityData([
        { day: 'Monday', jobPosting: 12, applications: 18 },
        { day: 'Tuesday', jobPosting: 15, applications: 22 },
        { day: 'Wednesday', jobPosting: 18, applications: 28 },
        { day: 'Thursday', jobPosting: 16, applications: 24 },
        { day: 'Friday', jobPosting: 20, applications: 32 },
        { day: 'Saturday', jobPosting: 8, applications: 12 },
        { day: 'Sunday', jobPosting: 5, applications: 8 },
      ]);
    }
  }, []);

  const fetchJobCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await axios.get<ApiJobCategoryResponse[]>(
        'http://localhost:8000/admin/stats/job-categories',
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        },
      );

      const colors = [
        '#10b981',
        '#6ee7b7',
        '#34d399',
        '#a7f3d0',
        '#f59e0b',
        '#6366f1',
      ];

      const formatted: JobCategory[] = response.data.map(
        (item: ApiJobCategoryResponse, index: number) => ({
          name: item.name || 'Unknown',
          value: item.value || 0,
          color: colors[index % colors.length],
        }),
      );

      setJobCategoriesData(formatted);
    } catch (error) {
      console.error('Error fetching job categories:', error);
      // Use fallback data if API fails
      setJobCategoriesData([
        { name: 'Technology', value: 45, color: '#10b981' },
        { name: 'Healthcare', value: 25, color: '#6ee7b7' },
        { name: 'Finance', value: 20, color: '#34d399' },
        { name: 'Education', value: 10, color: '#a7f3d0' },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchPlatformActivity();
    fetchJobCategories();

    // Cleanup function
    return () => {
      setError(null);
    };
  }, [fetchStats, fetchPlatformActivity, fetchJobCategories]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredData(selectedData);
      return;
    }

    const query = searchQuery.toLowerCase();

    const filtered = selectedData.filter((item) => {
      if (searchType === 'user') {
        const userData = item as UserData;
        return (
          userData.username?.toLowerCase().includes(query) ||
          userData.email?.toLowerCase().includes(query)
        );
      } else if (searchType === 'job') {
        const jobData = item as JobData;
        return jobData.title?.toLowerCase().includes(query);
      }
      return false;
    });

    setFilteredData(filtered);
    setModalTitle(`Search results for "${searchQuery}"`);
  }, [searchQuery, selectedData, searchType]);

  const handleCardClick = useCallback(
    async (endpoint: string, title: string) => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`http://localhost:8000${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
        });

        const data = response.data || [];
        setSelectedData(data);
        setFilteredData(data);
        setModalTitle(title);
        setShowModal(true);

        if (title === 'Active Users') setSearchType('user');
        else if (title === 'Total Application') setSearchType('none');
        else setSearchType('job');

        setSearchQuery('');
      } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setError('Session expired. Please log in again.');
          } else if (error.response?.status === 403) {
            setError('Access denied. Insufficient permissions.');
          } else {
            setError('Failed to fetch data. Please try again.');
          }
        } else {
          setError('Network error. Please check your connection.');
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleDeleteUser = useCallback(
    async (userId: string) => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Authentication required.');
        return;
      }

      try {
        await axios.delete(`http://localhost:8000/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });

        // Update UI optimistically
        const updatedData = filteredData.filter(
          (user) => (user as UserData).id !== userId,
        );
        setFilteredData(updatedData);
        setSelectedData(
          selectedData.filter((user) => (user as UserData).id !== userId),
        );

        // Update stats
        setStats((prev) => ({
          ...prev,
          total_users: Math.max(0, prev.total_users - 1),
        }));

        setDeleteConfirm({ show: false, userId: null, username: '' });
      } catch (error) {
        console.error('Error deleting user:', error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setError('User not found.');
          } else if (error.response?.status === 403) {
            setError('Access denied. Cannot delete this user.');
          } else {
            setError('Failed to delete user. Please try again.');
          }
        } else {
          setError('Network error. Please check your connection.');
        }
      }
    },
    [filteredData, selectedData],
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedData([]);
    setModalTitle('');
    setSearchQuery('');
    setSearchType('job');
    setDeleteConfirm({ show: false, userId: null, username: '' });
    setError(null);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (deleteConfirm.show) {
          setDeleteConfirm({ show: false, userId: null, username: '' });
        } else if (showModal) {
          closeModal();
        }
      }
    },
    [deleteConfirm.show, showModal, closeModal],
  );

  return (
    <div
      className="min-h-screen bg-gray-50 font-sans"
      onKeyDown={handleKeyDown}
    >
      {error && (
        <div className="fixed top-0 left-0 right-0 bg-red-100 text-white p-3 text-center z-50">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-4 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}

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

      <div className="flex">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 lg:ml-0">
          <header className="mb-6 lg:mb-8 mt-12 lg:mt-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm lg:text-base text-gray-600">
              Manage your SmartHire platform with ease
            </p>
          </header>

          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 lg:mb-8">
            {[
              {
                title: 'Total Jobs Posted',
                value: stats.total_jobs,
                growth: '+3%',
                icon: Briefcase,
                endpoint: '/admin/jobs',
              },
              {
                title: 'Active Users',
                value: stats.total_users,
                growth: '+4%',
                icon: User,
                endpoint: '/admin/users',
              },
              {
                title: 'Total Application',
                value: stats.total_applications,
                growth: '+3%',
                icon: FileText,
                endpoint: '/admin/applications',
              },
            ].map(({ title, value, growth, icon: Icon, endpoint }, idx) => (
              <Card
                key={idx}
                className="hover:shadow-xl transition-all duration-300 hover:bg-white/80"
                onClick={() => handleCardClick(endpoint, title)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6 lg:p-6">
                  <CardTitle className="text-xl md:text-lg lg:text-2xl font-light text-black">
                    {title}
                  </CardTitle>
                  <div className="w-14 h-14 md:w-12 md:h-12 lg:w-15 lg:h-15 bg-secondary rounded-lg flex items-center justify-center">
                    <Icon className="w-7 h-7 md:w-6 md:h-6 lg:w-8 lg:h-8 text-black" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 lg:p-6 pt-0">
                  <div className="text-3xl md:text-xl lg:text-2xl font-bold text-primary">
                    {value}
                  </div>
                  <div className="flex items-center text-base md:text-sm lg:text-md text-primary">
                    <TrendingUp className="w-4 h-4 lg:w-4 lg:h-4 mr-1" />
                    {growth}{' '}
                    <p className="text-black font-thin ml-2 lg:ml-4 hidden sm:inline">
                      from last month
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Modal */}
          {showModal && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <div className="bg-white rounded-xl shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto p-6 relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2
                    id="modal-title"
                    className="text-xl font-bold text-primary"
                  >
                    {modalTitle || 'Search Jobs'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="hover:text-red-500 font-bold text-4xl focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label="Close modal"
                  >
                    &times;
                  </button>
                </div>

                {/* Search Bar */}
                {searchType !== 'none' && (
                  <div className="flex gap-2 mb-6">
                    <input
                      type="text"
                      placeholder={
                        searchType === 'user'
                          ? 'Search user by username...'
                          : 'Search job by title...'
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={
                        searchType === 'user' ? 'Search users' : 'Search jobs'
                      }
                    />
                    <Button
                      onClick={handleSearch}
                      className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      Search
                    </Button>
                  </div>
                )}

                {/* Results */}
                {loading ? (
                  <div
                    className="text-center py-10 text-gray-500 animate-pulse"
                    role="status"
                    aria-live="polite"
                  >
                    Loading...
                  </div>
                ) : filteredData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          {modalTitle === 'Total Application' ? (
                            <>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Job Title
                              </th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Applicant Name
                              </th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Status
                              </th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Applied At
                              </th>
                            </>
                          ) : (
                            filteredData.length > 0 &&
                            Object.keys(filteredData[0]).map((key) => (
                              <th
                                key={key}
                                className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700 capitalize"
                              >
                                {key.replace(/_/g, ' ')}
                              </th>
                            ))
                          )}
                          {searchType === 'user' && (
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                              Actions
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            {modalTitle === 'Total Application' ? (
                              <>
                                <td className="border border-gray-300 px-4 py-2 text-gray-900">
                                  {(item as ApplicationData).jobTitle}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-gray-900">
                                  {(item as ApplicationData).applicant_name}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-gray-900">
                                  {(item as ApplicationData).status}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-gray-900">
                                  {(item as ApplicationData).applied_at}
                                </td>
                              </>
                            ) : (
                              Object.entries(item).map(([, value], i) => (
                                <td
                                  key={i}
                                  className="border border-gray-300 px-4 py-2 text-gray-900"
                                >
                                  {value !== null && value !== undefined
                                    ? String(value)
                                    : 'N/A'}
                                </td>
                              ))
                            )}

                            {/* Delete Button for Users */}
                            {searchType === 'user' && (
                              <td className="border border-gray-300 px-4 py-2">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      show: true,
                                      userId: (item as UserData).id,
                                      username:
                                        (item as UserData).username ||
                                        (item as UserData).email ||
                                        'Unknown User',
                                    })
                                  }
                                  className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                  aria-label={`Delete user ${
                                    (item as UserData).username ||
                                    (item as UserData).email
                                  }`}
                                >
                                  <Trash2
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                  />
                                  Delete
                                </Button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    No data available.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {deleteConfirm.show && (
            <div
              className="fixed inset-0 flex items-center justify-center z-60 bg-black/50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-title"
            >
              <div className="bg-white rounded-xl shadow-lg w-96 p-6">
                <h3
                  id="delete-title"
                  className="text-lg font-bold text-gray-900 mb-4"
                >
                  Confirm Delete
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete user "{deleteConfirm.username}
                  "? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setDeleteConfirm({
                        show: false,
                        userId: null,
                        username: '',
                      })
                    }
                    className="focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      deleteConfirm.userId &&
                      handleDeleteUser(deleteConfirm.userId)
                    }
                    className="focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete User
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {/* Line Chart */}
            <Card className="xl:col-span-2 hover:shadow-xl transition-all duration-300 hover:bg-white/80">
              <CardHeader className="p-4 lg:p-6">
                <CardTitle className="text-lg lg:text-2xl font-semibold text-primary">
                  Platform Activity
                </CardTitle>
                <p className="text-sm lg:text-md text-black font-thin">
                  Daily job postings and applications over the last 7 days
                </p>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="h-64 lg:h-80 w-full">
                  {platformActivityData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={platformActivityData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="day"
                          tick={{ fontSize: 12, fill: '#666' }}
                          axisLine={{ stroke: '#ccc' }}
                          tickLine={{ stroke: '#ccc' }}
                        />
                        <YAxis
                          tick={{ fontSize: 12, fill: '#666' }}
                          axisLine={{ stroke: '#ccc' }}
                          tickLine={{ stroke: '#ccc' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          }}
                          formatter={(value, name) => [
                            value,
                            name === 'jobPosting'
                              ? 'Job Postings'
                              : 'Applications',
                          ]}
                          labelFormatter={(label) => `Day: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="jobPosting"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                          activeDot={{
                            r: 6,
                            stroke: '#10b981',
                            strokeWidth: 2,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="applications"
                          stroke="#ffc107b8"
                          strokeWidth={3}
                          dot={{ fill: '#ffc107b8', strokeWidth: 2, r: 4 }}
                          activeDot={{
                            r: 6,
                            stroke: '#ffc107b8',
                            strokeWidth: 2,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Loading chart data...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:bg-white/80">
              <CardHeader className="p-4 lg:p-6">
                <CardTitle className="text-lg lg:text-2xl font-semibold text-primary">
                  Job Categories
                </CardTitle>
                <p className="text-sm lg:text-md text-black font-thin">
                  Distribution by Industry
                </p>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="h-64 lg:h-80 w-full">
                  {jobCategoriesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={jobCategoriesData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {jobCategoriesData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          }}
                          formatter={(value: number, name: string) => [
                            `${value}%`,
                            name,
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Loading chart data...
                    </div>
                  )}
                </div>
                <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                  {jobCategoriesData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs lg:text-sm py-1"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-700 font-medium">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Success Rate',
                value: '80%',
                growth: '+3%',
                icon: ShieldCheck,
              },
              {
                title: 'Avg time to Hire',
                value: '60%',
                growth: '+4%',
                icon: Clock,
              },
              {
                title: 'Top Performer',
                value: '90%',
                growth: '+4%',
                icon: Award,
              },
            ].map(({ title, value, growth, icon: Icon }, idx) => (
              <Card
                key={idx}
                className="hover:shadow-xl transition-all duration-300 hover:bg-white/80"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6 lg:p-6">
                  <CardTitle className="text-xl md:text-lg lg:text-2xl text-black">
                    {title}
                  </CardTitle>
                  <div className="w-14 h-14 md:w-12 md:h-12 lg:w-15 lg:h-15 bg-secondary rounded-lg flex items-center justify-center">
                    <Icon className="w-7 h-7 md:w-6 md:h-6 lg:w-8 lg:h-8 text-black" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 lg:p-6 pt-0">
                  <div className="text-3xl md:text-xl lg:text-2xl font-bold text-primary">
                    {value}
                  </div>
                  <div className="flex items-center text-base md:text-sm lg:text-md text-primary">
                    <TrendingUp className="w-4 h-4 lg:w-4 lg:h-4 mr-1" />
                    {growth}{' '}
                    <p className="text-black font-thin ml-2 lg:ml-4 hidden sm:inline">
                      from last month
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashView;
