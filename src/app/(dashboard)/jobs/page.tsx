'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  jobType: string;
  experienceLevel: string;
  salary?: string;
}

interface Recommendation {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  skills: string[];
  reason: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState('');
  const [recommendationError, setRecommendationError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:5000/api/jobs', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const jobsData = await response.json();
        setJobs(jobsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const getRecommendations = async () => {
    setLoadingRecommendations(true);
    setRecommendationError('');
    setRecommendations([]);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/recommendations', {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const recommendationsData = await response.json();
      setRecommendations(recommendationsData);
    } catch (err: any) {
      setRecommendationError(err.message);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-500 to-purple-600 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-white">Available Jobs</h3>
            <p className="mt-1 max-w-2xl text-sm text-indigo-100">
              Browse through our job listings
            </p>
          </div>
          <button
            onClick={getRecommendations}
            disabled={loadingRecommendations}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loadingRecommendations ? 'Finding matches...' : 'Find My Matches'}
          </button>
        </div>
        
        {recommendationError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
            <span className="block sm:inline">{recommendationError}</span>
          </div>
        )}
        
        {recommendations.length > 0 && (
          <div className="p-4 bg-indigo-50 border-b border-gray-200">
            <h4 className="text-lg font-medium text-indigo-800 mb-4">AI Recommended Jobs For You</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((job) => (
                <div key={job._id} className="bg-white overflow-hidden shadow rounded-lg border-2 border-indigo-500">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">{job.title}</h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 capitalize">
                        {job.jobType}
                      </span>
                    </div>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{job.company} • {job.location}</p>
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-500">Skills</h4>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {job.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-500">Why it's a match</h4>
                      <p className="mt-1 text-sm text-gray-900">{job.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{job.title}</h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 capitalize">
                      {job.jobType}
                    </span>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">{job.company} • {job.location}</p>
                  <p className="mt-3 text-sm text-gray-500 line-clamp-3">{job.description}</p>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-500">Skills</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  {job.salary && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-500">Salary</h4>
                      <p className="mt-1 text-sm text-gray-900">{job.salary}</p>
                    </div>
                  )}
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {job.experienceLevel} level
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
