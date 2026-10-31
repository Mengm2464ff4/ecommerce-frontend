import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const data = response.data;

    // Backend returns { token, id, username, email, role, ... }
    const userData = {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);

    return userData;
  };

  const register = async (data) => {
    const response = await authApi.register(data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // ✅ NEW — request reset link
  const forgotPassword = async (email) => {
    const response = await authApi.forgotPassword(email);
    return response.data;
  };

  // ✅ NEW — reset password using token
  const resetPassword = async (token, newPassword) => {
    const response = await authApi.resetPassword(token, newPassword);
    return response.data;
  };

  const isAdmin = () => user?.role === "ADMIN";

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAdmin,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = ()=>{
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
  



