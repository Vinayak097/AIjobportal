'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import config from '@/config';
import { ApiError } from '@/types/error';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    yearsOfExperience: '',
    skills: '',
    preferredJobType: 'any'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { name, email, password, location, yearsOfExperience, skills, preferredJobType } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert skills string to array
      const skillsArray = skills.split(',').map(skill => skill.trim());

      // Convert yearsOfExperience to number
      const yearsExp = parseInt(yearsOfExperience);

      const response = await fetch(`${config.apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          location,
          yearsOfExperience: yearsExp,
          skills: skillsArray,
          preferredJobType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Registration failed');
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      const error = err as Error | ApiError;
      setError(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password (min 6 characters)"
                minLength={6}
                value={password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="City, State"
                value={location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                required
                min="0"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Years of Experience"
                value={yearsOfExperience}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
              <input
                id="skills"
                name="skills"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="JavaScript, React, Node.js, etc."
                value={skills}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="preferredJobType" className="block text-sm font-medium text-gray-700">Preferred Job Type</label>
              <select
                id="preferredJobType"
                name="preferredJobType"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={preferredJobType}
                onChange={handleChange}
              >
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="any">Any</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
