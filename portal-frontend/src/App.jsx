import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
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
import RopView from './views/RopView';
import PredictiveModelsView from './views/PredictiveModelsView';
import WmsView from './views/WmsView';
import CxcView from './views/CxcView';
import CircuitoComercialView from './views/CircuitoComercialView';
import CxpView from './views/CxpView';
import CircuitoProduccionView from './views/CircuitoProduccionView';
import CircuitoFinancieroView from './views/CircuitoFinancieroView';
import CircuitoNominaView from './views/CircuitoNominaView';
import ProcessMiningView from './views/ProcessMiningView';
import CircuitoProcesosView from './views/CircuitoProcesosView';
import DashboardsView from './views/DashboardsView';
import PlaneacionView from './views/PlaneacionView';
import IaAssistantView from './views/IaAssistantView';
import CircuitoIaPlaneacionView from './views/CircuitoIaPlaneacionView';
import BiCubeView from './views/BiCubeView';
import BigDataView from './views/BigDataView';
import DataMiningView from './views/DataMiningView';
import CircuitoGobernanzaView from './views/CircuitoGobernanzaView';
import CircuitoFase1View from './views/CircuitoFase1View';
import CircuitoFase2View from './views/CircuitoFase2View';
import CircuitoFase3View from './views/CircuitoFase3View';
import CircuitoFase4View from './views/CircuitoFase4View';
import PhaseWorkspaceView from './views/PhaseWorkspaceView';

// Guardia de Seguridad para el Portal y Workspace
const ProtectedPortalRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const checkoutParam = params.get('checkout') || params.get('contratar');

  // Si el usuario viene a contratar en línea desde la landing page, permitimos abrir el checkout
  if (checkoutParam) {
    return children;
  }

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white font-sans text-sm">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Verificando credenciales de seguridad...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Guardia para módulos individuales
const ProtectedModuleRoute = ({ moduleId, children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-100 font-semibold">Cargando...</div>;
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  const hasAccess = user.role === 'Admin' || user.role === 'Partner' || user.subscriptions?.includes(moduleId);
  if (!hasAccess) {
    return <Navigate to="/portal" replace />;
  }
  return children;
};

const ModuleLayout = ({ children }) => {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <nav className="bg-[#0A2540] text-white p-3.5 px-6 flex justify-between items-center shadow-lg border-b border-slate-700">
        <div className="flex items-center gap-4">
          <Link to="/portal" className="font-black text-xl tracking-tight text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 px-2 py-0.5 rounded font-black text-sm">NyTEX</span>
            <span>ERP</span>
          </Link>
          <span className="text-slate-600 hidden md:inline">|</span>
          <Link 
            to="/app/workspace" 
            className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <span>🚀</span> Mi Espacio de Trabajo Integrado (Workspace)
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/app/workspace" className="sm:hidden bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold">
            Workspace
          </Link>
          <Link to="/portal" className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-lg transition-colors text-xs font-semibold border border-slate-700">
            Menú Principal (Portal) ➔
          </Link>
          <Link 
            to="/login"
            onClick={() => logout && logout()}
            className="bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white px-3 py-1.5 rounded-lg transition-all text-xs font-bold border border-rose-500/40 flex items-center gap-1 shadow-sm"
            title="Cerrar sesión y volver al Control de Acceso"
          >
            <span>🔒</span> Salir
          </Link>
        </div>
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
        {/* Rutas de autenticación y seguridad */}
        <Route path="/" element={<LoginView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/dashboard" element={<DashboardView />} />

        {/* Portal principal protegido */}
        <Route path="/portal" element={
          <ProtectedPortalRoute>
            <Dashboard />
          </ProtectedPortalRoute>
        } />
        
        {/* Redirección de módulos individuales al Workspace Unificado con Menú Lateral */}
        <Route path="/app/ventas" element={<Navigate to="/app/workspace?mod=ventas" replace />} />
        <Route path="/app/crm" element={<Navigate to="/app/workspace?mod=crm" replace />} />
        <Route path="/app/inventario" element={<Navigate to="/app/workspace?mod=inventario" replace />} />
        <Route path="/app/compras" element={<Navigate to="/app/workspace?mod=compras" replace />} />
        <Route path="/app/produccion" element={<Navigate to="/app/workspace?mod=produccion" replace />} />
        <Route path="/app/contabilidad" element={<Navigate to="/app/workspace?mod=contabilidad" replace />} />
        <Route path="/app/tesoreria" element={<Navigate to="/app/workspace?mod=tesoreria" replace />} />
        <Route path="/app/activosfijos" element={<Navigate to="/app/workspace?mod=activosfijos" replace />} />
        <Route path="/app/logistica" element={<Navigate to="/app/workspace?mod=logistica" replace />} />
        <Route path="/app/rrhh" element={<Navigate to="/app/workspace?mod=rrhh" replace />} />
        <Route path="/app/nomina" element={<Navigate to="/app/workspace?mod=nomina" replace />} />
        <Route path="/app/processsuite" element={<Navigate to="/app/workspace?mod=processsuite" replace />} />
        <Route path="/app/businesspartners" element={<Navigate to="/app/workspace?mod=businesspartners" replace />} />
        <Route path="/app/biyreportes" element={<Navigate to="/app/workspace?mod=biyreportes" replace />} />
        <Route path="/app/configuracion" element={<Navigate to="/app/workspace?mod=configuracion" replace />} />
        <Route path="/app/rop" element={<Navigate to="/app/workspace?mod=rop" replace />} />
        <Route path="/app/wms" element={<Navigate to="/app/workspace?mod=wms" replace />} />
        <Route path="/app/cxc" element={<Navigate to="/app/workspace?mod=cxc" replace />} />
        <Route path="/app/cxp" element={<Navigate to="/app/workspace?mod=cxp" replace />} />
        <Route path="/app/processmining" element={<Navigate to="/app/workspace?mod=processmining" replace />} />
        <Route path="/app/dashboards" element={<Navigate to="/app/workspace?mod=dashboards" replace />} />
        <Route path="/app/bi" element={<Navigate to="/app/workspace?mod=bi" replace />} />
        <Route path="/app/bigdata" element={<Navigate to="/app/workspace?mod=bigdata" replace />} />
        <Route path="/app/mineriadatos" element={<Navigate to="/app/workspace?mod=mineriadatos" replace />} />
        <Route path="/app/ia" element={<Navigate to="/app/workspace?mod=ia" replace />} />
        <Route path="/app/predictivos" element={<Navigate to="/app/workspace?mod=predictivos" replace />} />
        <Route path="/app/planeacion" element={<Navigate to="/app/workspace?mod=planeacion" replace />} />
        
        {/* Circuitos Integrados de Operación */}
        <Route path="/app/circuito-comercial" element={<ModuleLayout><CircuitoComercialView /></ModuleLayout>} />
        <Route path="/app/circuito-produccion" element={<ModuleLayout><CircuitoProduccionView /></ModuleLayout>} />
        <Route path="/app/circuito-financiero" element={<ModuleLayout><CircuitoFinancieroView /></ModuleLayout>} />
        <Route path="/app/circuito-nomina" element={<ModuleLayout><CircuitoNominaView /></ModuleLayout>} />
        <Route path="/app/circuito-procesos" element={<ModuleLayout><CircuitoProcesosView /></ModuleLayout>} />
        <Route path="/app/circuito-ia-planeacion" element={<ModuleLayout><CircuitoIaPlaneacionView /></ModuleLayout>} />
        <Route path="/app/circuito-gobernanza" element={<ModuleLayout><CircuitoGobernanzaView /></ModuleLayout>} />
        
        {/* Los 4 Circuitos de Demostración por Fases -> Workspace */}
        <Route path="/app/circuito-fase1" element={<Navigate to="/app/workspace?phase=1" replace />} />
        <Route path="/app/circuito-fase2" element={<Navigate to="/app/workspace?phase=2" replace />} />
        <Route path="/app/circuito-fase3" element={<Navigate to="/app/workspace?phase=3" replace />} />
        <Route path="/app/circuito-fase4" element={<Navigate to="/app/workspace?phase=4" replace />} />

        {/* Espacio de Trabajo Unificado de Fase (Workspace con Menú Lateral) */}
        <Route path="/app/workspace" element={
          <ProtectedPortalRoute>
            <PhaseWorkspaceView />
          </ProtectedPortalRoute>
        } />
        <Route path="/app/mi-fase" element={
          <ProtectedPortalRoute>
            <PhaseWorkspaceView />
          </ProtectedPortalRoute>
        } />
        
        {/* Redirección por defecto a la ventana de login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
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