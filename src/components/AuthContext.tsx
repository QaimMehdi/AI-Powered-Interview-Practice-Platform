import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  fetchUser: () => void;
  logoutLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  fetchUser: () => {},
  logoutLoading: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Fetch user info from backend
  const fetchUser = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('jwt');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchUser on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Login: store token and fetch user
  const login = (token: string) => {
    localStorage.setItem('token', token);
    fetchUser();
  };

  // Logout: clear token and user, show loader
  const logout = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('jwt');
      setUser(null);
      setLogoutLoading(false);
    }, 1200); // 1.2s for smooth loader UX
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser, logoutLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 