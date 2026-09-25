import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = (email = localStorage.getItem('nytex_email') || 'partner@nytex.com') => {
    fetch(`/api/auth/me?email=${email}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setUser(data);
        localStorage.setItem('nytex_email', data.email);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user auth data:', err);
        setLoading(false);
      });
  };

  const login = async (role) => {
    let email = 'partner@nytex.com';
    if (role === 'Admin') email = 'admin@nytex.com';
    if (role === 'Client') email = 'cliente@empresa.com';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      const data = await response.json();
      setUser(data);
      localStorage.setItem('nytex_email', data.email);
      return data;
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const replaceSubscriptions = (modulesArray) => {
    setUser(prev => ({
      ...prev,
      subscriptions: modulesArray
    }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, replaceSubscriptions, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
