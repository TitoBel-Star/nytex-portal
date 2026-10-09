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

const getDefaultUser = (role = 'Partner', customEmail = null, customPhase = null) => {
  let email = customEmail || 'partner@nytex.com';
  let name = 'Distribuidor Partner';
  let subscriptions = ALL_MODULES;

  if (role === 'Admin') {
    email = customEmail || 'admin@nytex.com';
    name = 'Super Admin (Control Total)';
    subscriptions = ALL_MODULES;
  } else if (role === 'Client') {
    email = customEmail || 'cliente@empresa.com';
    name = 'Cliente Final (Empresa)';
    const phaseVal = customPhase || parseInt(localStorage.getItem('nytex_active_phase'), 10) || 1;
    const p1 = ['Ventas', 'Inventario', 'Compras', 'Contabilidad', 'CxC', 'CxP', 'Tesoreria'];
    const p2 = [...p1, 'CRM', 'Rop', 'Produccion', 'Logistica', 'RRHH', 'Nomina', 'ProcessSuite', 'ProcessMining', 'WMS', 'Dashboards'];
    const p3 = [...p2, 'ActivosFijos', 'BIyReportes', 'BigData', 'BI', 'Planeacion'];
    if (phaseVal === 1) subscriptions = p1;
    else if (phaseVal === 2) subscriptions = p2;
    else if (phaseVal === 3) subscriptions = p3;
    else subscriptions = ALL_MODULES;
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('nytex_authenticated') === 'true';
  });

  const [user, setUser] = useState(() => {
    const isAuth = localStorage.getItem('nytex_authenticated') === 'true';
    if (!isAuth) return null;
    const savedRole = localStorage.getItem('nytex_role') || 'Partner';
    const savedEmail = localStorage.getItem('nytex_email') || 'partner@nytex.com';
    const savedPhase = parseInt(localStorage.getItem('nytex_active_phase'), 10) || 1;
    return getDefaultUser(savedRole, savedEmail, savedPhase);
  });

  const [loading, setLoading] = useState(false);

  const fetchUser = (email = localStorage.getItem('nytex_email')) => {
    const isAuth = localStorage.getItem('nytex_authenticated') === 'true';
    if (!isAuth || !email) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const savedRole = localStorage.getItem('nytex_role') || (email.includes('admin') ? 'Admin' : email.includes('cliente') ? 'Client' : 'Partner');
    const savedPhase = parseInt(localStorage.getItem('nytex_active_phase'), 10) || 1;

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
          setIsAuthenticated(true);
        } else {
          setUser(getDefaultUser(savedRole, email, savedPhase));
          setIsAuthenticated(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Backend unavailable, using fallback auth user:', err);
        setUser(getDefaultUser(savedRole, email, savedPhase));
        setIsAuthenticated(true);
        setLoading(false);
      });
  };

  const login = async (role = 'Partner', customEmail = null, customPassword = null, customPhase = null) => {
    let email = customEmail;
    if (!email || email.trim() === '') {
      if (role === 'Admin') email = 'admin@nytex.com';
      else if (role === 'Client') email = 'cliente@empresa.com';
      else email = 'partner@nytex.com';
    }

    const phaseNumber = customPhase ? parseInt(customPhase, 10) : (parseInt(localStorage.getItem('nytex_active_phase'), 10) || 1);
    if (role === 'Client') {
      localStorage.setItem('nytex_active_phase', phaseNumber.toString());
    }

    const fallbackUser = getDefaultUser(role, email, phaseNumber);
    localStorage.setItem('nytex_authenticated', 'true');
    localStorage.setItem('nytex_email', email);
    localStorage.setItem('nytex_role', role);
    setIsAuthenticated(true);
    setUser(fallbackUser);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, phaseId: phaseNumber, password: customPassword })
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem('nytex_email', data.email);
        localStorage.setItem('nytex_role', data.role || role);
        return data;
      }
    } catch (error) {
      console.warn('Backend login endpoint offline, usando sesión local fallback:', error);
    }

    return fallbackUser;
  };

  const logout = () => {
    localStorage.removeItem('nytex_authenticated');
    localStorage.removeItem('nytex_role');
    localStorage.removeItem('nytex_email');
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (localStorage.getItem('nytex_authenticated') === 'true') {
      fetchUser();
    }
  }, []);

  const replaceSubscriptions = (modulesArray) => {
    setUser(prev => ({
      ...(prev || getDefaultUser('Partner')),
      subscriptions: modulesArray
    }));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, replaceSubscriptions, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
