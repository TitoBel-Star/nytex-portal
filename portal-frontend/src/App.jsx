import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import DashboardView from './views/DashboardView'; 
import LoginView from './views/LoginView';
import PlaceholderView from './views/PlaceholderView';

// Importar los módulos y vistas
import Ventas from './modules/Ventas';
import CrmDashboardView from './views/CrmDashboardView';
import InventoryView from './views/InventoryView';
import Compras from './modules/Compras';
import Produccion from './modules/Produccion';
import Contabilidad from './modules/Contabilidad';
import Tesoreria from './modules/Tesoreria';
import ActivosFijos from './modules/ActivosFijos';
import Logistica from './modules/Logistica';
import RRHH from './modules/RRHH';
import Nomina from './modules/Nomina';
import SynexProcessSuiteView from './views/SynexProcessSuiteView';
import BusinessPartnersView from './views/BusinessPartnersView';
import BIyReportes from './modules/BIyReportes';
import Configuracion from './modules/Configuracion';

const ProtectedModuleRoute = ({ moduleId, children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-100">Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (!user.subscriptions?.includes(moduleId)) {
    return <Navigate to="/portal" replace />;
  }
  return children;
};

const ModuleLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-nytex-navy text-white p-4 flex justify-between items-center shadow-md">
        <div className="font-bold text-xl">NyTEX ERP</div>
        <Link to="/portal" className="bg-nytex-blue hover:bg-nytex-blue-light px-4 py-2 rounded transition-colors text-sm font-medium">
          Volver al Menú Principal (Portal)
        </Link>
      </nav>
      <main className="flex-1 h-full w-full">
        {children}
      </main>
    </div>
  );
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/portal" element={<Dashboard />} />
        
        {/* Rutas de módulos protegidas */}
        <Route path="/app/ventas" element={<ProtectedModuleRoute moduleId="Ventas"><ModuleLayout><Ventas /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/crm" element={<ProtectedModuleRoute moduleId="CRM"><ModuleLayout><CrmDashboardView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/inventario" element={<ProtectedModuleRoute moduleId="Inventario"><ModuleLayout><InventoryView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/compras" element={<ProtectedModuleRoute moduleId="Compras"><ModuleLayout><Compras /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/produccion" element={<ProtectedModuleRoute moduleId="Produccion"><ModuleLayout><Produccion /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/contabilidad" element={<ProtectedModuleRoute moduleId="Contabilidad"><ModuleLayout><Contabilidad /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/tesoreria" element={<ProtectedModuleRoute moduleId="Tesoreria"><ModuleLayout><Tesoreria /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/activosfijos" element={<ProtectedModuleRoute moduleId="ActivosFijos"><ModuleLayout><ActivosFijos /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/logistica" element={<ProtectedModuleRoute moduleId="Logistica"><ModuleLayout><Logistica /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/rrhh" element={<ProtectedModuleRoute moduleId="RRHH"><ModuleLayout><RRHH /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/nomina" element={<ProtectedModuleRoute moduleId="Nomina"><ModuleLayout><Nomina /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/processsuite" element={<ProtectedModuleRoute moduleId="ProcessSuite"><ModuleLayout><SynexProcessSuiteView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/businesspartners" element={<ProtectedModuleRoute moduleId="BusinessPartners"><ModuleLayout><BusinessPartnersView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/biyreportes" element={<ProtectedModuleRoute moduleId="BIyReportes"><ModuleLayout><BIyReportes /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/configuracion" element={<ProtectedModuleRoute moduleId="Configuracion"><ModuleLayout><Configuracion /></ModuleLayout></ProtectedModuleRoute>} />
        
        {/* Nuevos módulos añadidos */}
        <Route path="/app/cxc" element={<ProtectedModuleRoute moduleId="CxC"><ModuleLayout><PlaceholderView title="Cuentas por Cobrar (CxC)" /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/cxp" element={<ProtectedModuleRoute moduleId="CxP"><ModuleLayout><PlaceholderView title="Cuentas por Pagar (CxP)" /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/wms" element={<ProtectedModuleRoute moduleId="WMS"><ModuleLayout><PlaceholderView title="Warehouse Management System (WMS)" /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/dashboards" element={<ProtectedModuleRoute moduleId="Dashboards"><ModuleLayout><PlaceholderView title="Dashboards Operativos" /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/bi" element={<ProtectedModuleRoute moduleId="BI"><ModuleLayout><PlaceholderView title="Business Intelligence (BI)" /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/bigdata" element={<ProtectedModuleRoute moduleId="BigData"><ModuleLayout><PlaceholderView title="Big Data" /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/ia" element={<ProtectedModuleRoute moduleId="IA"><ModuleLayout><PlaceholderView title="Inteligencia Artificial (IA)" /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/predictivos" element={<ProtectedModuleRoute moduleId="Predictivos"><ModuleLayout><PlaceholderView title="Modelos Predictivos" /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/planeacion" element={<ProtectedModuleRoute moduleId="Planeacion"><ModuleLayout><PlaceholderView title="Planeación" /></ModuleLayout></ProtectedModuleRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}