import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const ALL_MODULES = [
  'Ventas', 'CRM', 'Inventario', 'Compras', 'Produccion',
  'Contabilidad', 'CxC', 'CxP', 'Tesoreria', 'ActivosFijos',
  'Logistica', 'RRHH', 'Nomina', 'ProcessSuite', 'ProcessMining',
  'BusinessPartners', 'BIyReportes', 'Configuracion', 'WMS',
  'Dashboards', 'BI', 'BigData', 'MineriaDatos', 'IA',
  'Predictivos', 'Planeacion'
];

const getDefaultUser = (role = 'Partner', customEmail = null) => {
  let email = customEmail || 'partner@nytex.com';
  let name = 'Distribuidor Partner';
  let subscriptions = ['CRM', 'Inventario', 'ProcessSuite', 'BusinessPartners', 'Ventas', 'Contabilidad', 'Compras'];

  if (role === 'Admin') {
    email = customEmail || 'admin@nytex.com';
    name = 'Super Admin';
    subscriptions = ALL_MODULES;
  } else if (role === 'Client') {
    email = customEmail || 'cliente@empresa.com';
    name = 'Cliente Final';
    subscriptions = ['Ventas', 'Inventario'];
  }

  return {
    email,
    name,
    role,
    subscriptions,
    customQuoteAmount: null
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = (email = localStorage.getItem('nytex_email') || 'partner@nytex.com') => {
    const savedRole = localStorage.getItem('nytex_role') || (email.includes('admin') ? 'Admin' : email.includes('cliente') ? 'Client' : 'Partner');

    fetch(`/api/auth/me?email=${encodeURIComponent(email)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Not found');
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error('Not JSON');
        }
        return res.json();
      })
      .then(data => {
        if (data && data.email) {
          setUser(data);
          localStorage.setItem('nytex_email', data.email);
          if (data.role) localStorage.setItem('nytex_role', data.role);
        } else {
          setUser(getDefaultUser(savedRole, email));
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Backend unavailable, using fallback auth user:', err);
        setUser(getDefaultUser(savedRole, email));
        setLoading(false);
      });
  };

  const login = async (role) => {
    let email = 'partner@nytex.com';
    if (role === 'Admin') email = 'admin@nytex.com';
    if (role === 'Client') email = 'cliente@empresa.com';

    const fallbackUser = getDefaultUser(role, email);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem('nytex_email', data.email);
        localStorage.setItem('nytex_role', role);
        return data;
      }
    } catch (error) {
      console.warn('Backend login endpoint failed, using fallback auth user:', error);
    }

    // Always succeed so navigation is never blocked
    setUser(fallbackUser);
    localStorage.setItem('nytex_email', fallbackUser.email);
    localStorage.setItem('nytex_role', role);
    return fallbackUser;
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const replaceSubscriptions = (modulesArray) => {
    setUser(prev => ({
      ...(prev || getDefaultUser('Partner')),
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

