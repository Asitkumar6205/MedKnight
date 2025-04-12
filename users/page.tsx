// // app/admin/users/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// type User = {
//   id: string;
//   username: string;
//   email: string;
//   role: string;
//   status: string;
//   emailVerified: Date | null;
// };

// export default function AdminUsersPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   useEffect(() => {
//     // Check if user is admin
//     if (status === 'authenticated') {
//       if (session?.user?.role !== 'ADMIN') {
//         router.push('/unauthorized');
//         return;
//       }
//       fetchUsers();
//     } else if (status === 'unauthenticated') {
//       router.push('/signin');
//     }
//   }, [status, session, router]);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch('/api/admin/users');
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch users');
//       }
      
//       const data = await response.json();
//       setUsers(data.users);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       setError('Failed to load users. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateUser = async (userId: string, updates: { role?: string, status?: string }) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/admin/users/${userId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updates),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to update user');
//       }
      
//       // Show success message
//       setSuccessMessage('User updated successfully');
//       setTimeout(() => setSuccessMessage(null), 3000);
      
//       // Refresh user list
//       fetchUsers();
//     } catch (err) {
//       console.error('Error updating user:', err);
//       setError('Failed to update user. Please try again.');
//       setTimeout(() => setError(null), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && users.length === 0) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
//       {error && (
//         <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
//           {error}
//         </div>
//       )}
      
//       {successMessage && (
//         <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
//           {successMessage}
//         </div>
//       )}
      
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-3 px-4 border-b text-left">Username</th>
//               <th className="py-3 px-4 border-b text-left">Email</th>
//               <th className="py-3 px-4 border-b text-left">Role</th>
//               <th className="py-3 px-4 border-b text-left">Status</th>
//               <th className="py-3 px-4 border-b text-left">Email Verified</th>
//               <th className="py-3 px-4 border-b text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id} className="hover:bg-gray-50">
//                 <td className="py-3 px-4 border-b">{user.username}</td>
//                 <td className="py-3 px-4 border-b">{user.email}</td>
//                 <td className="py-3 px-4 border-b">
//                   <select
//                     className="p-2 border rounded"
//                     value={user.role}
//                     onChange={(e) => updateUser(user.id, { role: e.target.value })}
//                     disabled={loading}
//                   >
//                     <option value="PENDING">Pending</option>
//                     <option value="ADMIN">Admin</option>
//                     <option value="RADIOLOGIST">Radiologist</option>
//                     <option value="HOSPITAL">Hospital</option>
//                   </select>
//                 </td>
//                 <td className="py-3 px-4 border-b">
//                   <select
//                     className="p-2 border rounded"
//                     value={user.status}
//                     onChange={(e) => updateUser(user.id, { status: e.target.value })}
//                     disabled={loading}
//                   >
//                     <option value="PENDING_APPROVAL">Pending Approval</option>
//                     <option value="ACTIVE">Active</option>
//                     <option value="SUSPENDED">Suspended</option>
//                   </select>
//                 </td>
//                 <td className="py-3 px-4 border-b">
//                   {user.emailVerified 
//                     ? new Date(user.emailVerified).toLocaleDateString() 
//                     : 'Not Verified'}
//                 </td>
//                 <td className="py-3 px-4 border-b">
//                   <button
//                     className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
//                     onClick={() => updateUser(user.id, { status: 'ACTIVE' })}
//                     disabled={loading || user.status === 'ACTIVE'}
//                   >
//                     Approve
//                   </button>
//                 </td>
//               </tr>
//             ))}
            
//             {users.length === 0 && (
//               <tr>
//                 <td colSpan={6} className="py-4 text-center text-gray-500">
//                   No users found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }