// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define the User type
type User = {
  id: string;
  username: string | null;
  email: string | null;
  role: string;
  status: string;
  name: string | null;
  createdAt?: string;
  emailVerified?: string | null;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING_APPROVAL');
  
  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users?status=${statusFilter}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/signin');
          return;
        }
        if (response.status === 403) {
          router.push('/unauthorized');
          return;
        }
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const approveUser = async (userId: string, role: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          status: 'ACTIVE',
          role,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve user');
      }
      
      // Refresh the user list
      fetchUsers();
    } catch (err) {
      setError('Failed to approve user');
      console.error(err);
    }
  };
  
  const rejectUser = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          status: 'SUSPENDED',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject user');
      }
      
      // Refresh the user list
      fetchUsers();
    } catch (err) {
      setError('Failed to reject user');
      console.error(err);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1"
        >
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="ACTIVE">Active Users</option>
          <option value="SUSPENDED">Suspended Users</option>
          <option value="">All Users</option>
        </select>
      </div>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Registered Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm">
                    No users found with the selected status.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">{user.username}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">{user.email}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                        user.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.status === 'PENDING_APPROVAL' && (
                        <div className="flex space-x-2">
                          <div className="relative inline-block text-left">
                            <div>
                              <button
                                onClick={() => approveUser(user.id, 'RADIOLOGIST')}
                                className="rounded bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600"
                              >
                                Approve as Radiologist
                              </button>
                            </div>
                          </div>
                          <div>
                            <button
                              onClick={() => approveUser(user.id, 'HOSPITAL')}
                              className="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
                            >
                              Approve as Hospital
                            </button>
                          </div>
                          <div>
                            <button
                              onClick={() => rejectUser(user.id)}
                              className="rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                      {(user.status === 'ACTIVE' || user.status === 'SUSPENDED') && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => user.status === 'ACTIVE' 
                              ? rejectUser(user.id) 
                              : approveUser(user.id, user.role)}
                            className={`rounded px-3 py-1 text-xs text-white ${
                              user.status === 'ACTIVE' 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                          >
                            {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}