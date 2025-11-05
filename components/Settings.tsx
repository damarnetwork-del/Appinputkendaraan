import React, { useState, FormEvent, useEffect } from 'react';
import { User } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, UsersIcon } from './icons';

interface SettingsProps {
  users: User[];
  currentUser: User | null;
  onAddUser: (user: Omit<User, 'id'>) => boolean;
  onUpdateUser: (user: User) => boolean;
  onDeleteUser: (id: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ users, currentUser, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [isEditing, setIsEditing] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isEditing) {
      setUsername(isEditing.username);
      setPassword(isEditing.password);
    } else {
      resetForm();
    }
  }, [isEditing]);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setIsEditing(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
        alert("Username dan password harus diisi.");
        return;
    }

    let success = false;
    if (isEditing) {
      success = onUpdateUser({ id: isEditing.id, username, password });
    } else {
      success = onAddUser({ username, password });
    }
    if (success) {
        resetForm();
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center">
          <UsersIcon className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400"/>
          {isEditing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. user_gudang"
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:text-gray-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:text-gray-200"
            />
          </div>
          <div className="flex justify-end gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 transition-colors"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {isEditing ? 'Update' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Daftar Pengguna</h2>
        <div className="max-h-96 overflow-y-auto pr-2">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-left">
                <thead className="border-b border-gray-200 dark:border-gray-600 sticky top-0 bg-white dark:bg-gray-800">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Username</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Password</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                        <td colSpan={3} className="text-center py-8 text-gray-500 dark:text-gray-400">
                            Tidak ada pengguna terdaftar.
                        </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{user.username}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">••••••••</td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setIsEditing(user)} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-full transition-colors" aria-label="Edit">
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => onDeleteUser(user.id)} 
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed" 
                              aria-label="Hapus"
                              disabled={user.username === 'admin' || user.id === currentUser?.id}
                              title={user.username === 'admin' ? "Tidak dapat menghapus admin" : user.id === currentUser?.id ? "Tidak dapat menghapus diri sendiri" : "Hapus pengguna"}
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
