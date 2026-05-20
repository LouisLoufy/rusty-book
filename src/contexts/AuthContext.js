import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import { validateToken } from '../services/githubService';

const TOKEN_STORAGE_KEY = 'beatai-github-token';
const USER_INFO_STORAGE_KEY = 'beatai-user-info';

// 简单 base64 混淆，仅为避免明文存储，不是加密
function encodeToken(token) {
  try {
    return btoa(token);
  } catch (error) {
    return token;
  }
}

function decodeToken(encoded) {
  try {
    return atob(encoded);
  } catch (error) {
    return encoded;
  }
}

const AuthContext = createContext(null);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [githubToken, setGithubToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  // 启动时从 localStorage 恢复登录态
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUserInfo = localStorage.getItem(USER_INFO_STORAGE_KEY);

    if (storedToken && storedUserInfo) {
      try {
        const userInfo = JSON.parse(storedUserInfo);
        setGithubToken(decodeToken(storedToken));
        setUsername(userInfo.username);
        setAvatarUrl(userInfo.avatarUrl);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to restore auth state:', error);
      }
    }
  }, []);

  const login = useCallback(async (token) => {
    try {
      const validation = await validateToken(token);
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid token');
      }

      const { user } = validation;

      localStorage.setItem(TOKEN_STORAGE_KEY, encodeToken(token));
      localStorage.setItem(
        USER_INFO_STORAGE_KEY,
        JSON.stringify({ username: user.username, avatarUrl: user.avatarUrl })
      );

      setGithubToken(token);
      setUsername(user.username);
      setAvatarUrl(user.avatarUrl);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_INFO_STORAGE_KEY);

    setGithubToken(null);
    setUsername(null);
    setAvatarUrl(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    isAuthenticated,
    githubToken,
    username,
    avatarUrl,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
