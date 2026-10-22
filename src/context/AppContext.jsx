import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/config/api';

const AppContext = createContext();

const getErrMsg = (err, fallback) => {
  return err.response?.data?.error || fallback;
};

const LOGIN_MSG = {
  url: '/api/auth/login',
  pass: 'Welcome back!',
  fail: 'Login failed',
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Auth Actions Helper
  const authAction = async (requestFn, successMsg, errorFallback) => {
    try {
      const { data } = await requestFn();

      setUser(data.user);

      if (successMsg) {
        toast.success(successMsg);
      }

      return true;
    } catch (err) {
      toast.error(getErrMsg(err, errorFallback));
      return false;
    }
  };

  const login = (email, password) => {
    return authAction(
      () => api.post('/api/auth/login', { email, password }),
      'Welcome back!',
      'Login failed',
    );
  };

  const register = (name, email, password) => {
    return authAction(
      () => api.post('/api/auth/register', { name, email, password }),
      'Account created successfully!',
      'Registration failed',
    );
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/register');
      setUser(null);
      toast.success('Logged out');
    } catch (err) {
      toast.success('Logged error');
    }
  };

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
