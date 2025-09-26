import { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import type { Job } from '../../../types/jobposting';

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchResults, setSearchResults] = useState<Job[] | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch all public jobs initially
  useEffect(() => {
    fetch('http://127.0.0.1:8000/jobs/public')
      .then((res) => res.json())
      .then((data: Job[]) => setJobs(data))
      .catch((err) => console.error('Error fetching public jobs:', err));
  }, []);

  // Handler for search results from Navbar
  const handleSearchResults = (results: Job[] | null) => {
    setSearchResults(results);
    setRecommendedJobs(null); // Clear recommendations when searching
  };

  // Handler for recommended jobs from Navbar
  const handleRecommendedJobs = (jobs: Job[]) => {
    setRecommendedJobs(jobs);
    setSearchResults(null); // Clear search results when showing recommendations
  };

  const displayedJobs = recommendedJobs?.length
    ? recommendedJobs
    : searchResults?.length
    ? searchResults
    : jobs;

  const getTitle = () => {
    if (recommendedJobs?.length) return 'Recommended Jobs';
    if (searchResults?.length) return 'Search Results';
    return 'All Job Postings';
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        {/* Pass handlers to Navbar */}
        <Navbar
          onSearchResults={handleSearchResults}
          onRecommendedJobs={handleRecommendedJobs}
        />

        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:px-12 flex flex-col h-[calc(100vh-64px)]">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl font-bold">{getTitle()}</h2>
            {(searchResults || recommendedJobs) && (
              <button
                onClick={() => {
                  setSearchResults(null);
                  setRecommendedJobs(null);
                }}
                className="text-sm text-gray-600 hover:text-secondary underline"
              >
                Show All Jobs
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {displayedJobs.length > 0 ? (
              displayedJobs.map((job) => (
                <article
                  key={job.id}
                  className="bg-white rounded-md shadow px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{job.title}</h4>
                    <p className="text-sm mb-2">{job.description}</p>
                    <p className="text-sm mb-2">{job.location}</p>
                    <p className="text-sm mb-2">{job.job_type}</p>
                    <p className="font-bold text-green-600">XAF {job.salary}</p>
                  </div>
                  <button className="bg-primary hover:bg-green-500 cursor-pointer text-white font-semibold px-6 py-2 rounded-full w-full sm:w-auto">
                    Apply
                  </button>
                </article>
              ))
            ) : (
              <p className="text-gray-500">No jobs found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 flex justify-end">
          <div className="w-64 bg-white shadow-lg p-4 h-full">
            {/* Sidebar content */}
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              {/* Close icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Add your sidebar content here */}
          </div>
        </div>
      </div>

      {/* Hamburger button for mobile */}
      <button
        className="block lg:hidden p-2"
        onClick={() => setSidebarOpen(true)}
      >
        {/* Hamburger icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
  );
}