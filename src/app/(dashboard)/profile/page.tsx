'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  location: string;
  yearsOfExperience: number;
  skills: string[];
  preferredJobType: string;
}

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    yearsOfExperience: '',
    skills: '',
    preferredJobType: 'any'
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const { name, location, yearsOfExperience, skills, preferredJobType } = formData;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData: User = await response.json();
        
        setFormData({
          name: userData.name,
          location: userData.location,
          yearsOfExperience: userData.yearsOfExperience.toString(),
          skills: userData.skills.join(', '),
          preferredJobType: userData.preferredJobType
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Convert skills string to array
      const skillsArray = skills.split(',').map(skill => skill.trim());
      
      // Convert yearsOfExperience to number
      const yearsExp = parseInt(yearsOfExperience);

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          name,
          location,
          yearsOfExperience: yearsExp,
          skills: skillsArray,
          preferredJobType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-500 to-purple-600">
        <h3 className="text-lg leading-6 font-medium text-white">Profile Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-indigo-100">
          Update your personal details and preferences
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative m-4" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={name}
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={skills}
              onChange={handleChange}
            />
            <p className="mt-1 text-sm text-gray-500">Enter your skills separated by commas (e.g., JavaScript, React, Node.js)</p>
          </div>
          
          <div>
            <label htmlFor="preferredJobType" className="block text-sm font-medium text-gray-700">Preferred Job Type</label>
            <select
              id="preferredJobType"
              name="preferredJobType"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={preferredJobType}
              onChange={handleChange}
            >
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
              <option value="any">Any</option>
            </select>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={updating}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
