'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import config from '@/config';
import { ApiError } from '@/types/error';


interface User {
  _id: string;
  name: string;
  email: string;
  location: string;
  yearsOfExperience: number;
  skills: string[];
  preferredJobType: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${config.apiUrl}/auth/me`, {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        const error = err as Error | ApiError;
        setError(error.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-500 to-purple-600">
        <h3 className="text-lg leading-6 font-medium text-white">Welcome to JobMatch AI</h3>
        <p className="mt-1 max-w-2xl text-sm text-indigo-100">
          Your AI-powered job matching platform
        </p>
      </div>

      {user && (
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.location}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Years of experience</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.yearsOfExperience}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Skills</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Preferred job type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className="capitalize">{user.preferredJobType}</span>
              </dd>
            </div>
          </dl>
        </div>
      )}

      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row gap-4">
        <Link href="/profile" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Update Profile
        </Link>
        <Link href="/jobs" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          Browse Jobs
        </Link>
      </div>
    </div>
  );
}
