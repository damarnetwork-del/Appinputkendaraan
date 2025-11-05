import React, { useState, FormEvent } from 'react';
import { CarIcon, LoginIcon, UserIcon, LockIcon } from './icons';

interface LoginProps {
  onLoginSuccess: (username: string, password: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLoginSuccess(username, password);
    if (!success) {
      setError('Username atau password salah. Coba lagi.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 mx-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CarIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Selamat Datang
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Silakan masuk untuk mengelola inventaris kendaraan.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none rounded-md relative block w-full pl-10 px-3 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
            </div>
            <div className="pt-4">
              <label htmlFor="password-login" className="sr-only">
                Password
              </label>
               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password-login"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full pl-10 px-3 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-center text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:-translate-y-px transition-all duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LoginIcon className="h-5 w-5 text-blue-300 group-hover:text-blue-200" />
              </span>
              Masuk
            </button>
          </div>
        </form>
         <div className="text-center text-xs text-gray-400 dark:text-gray-500 pt-4">
            <p>Gunakan username: <b>admin</b> & password: <b>admin</b></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
