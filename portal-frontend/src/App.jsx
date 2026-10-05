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

const ProtectedModuleRoute = ({ moduleId, children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-100">Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  const hasAccess = user.role === 'Admin' || user.role === 'Partner' || user.subscriptions?.includes(moduleId);
  if (!hasAccess) {
    return <Navigate to="/portal" replace />;
  }
  return children;
};

const ModuleLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
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
        <Route path="/app/processmining" element={<ProtectedModuleRoute moduleId="ProcessMining"><ModuleLayout><ProcessMiningView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/businesspartners" element={<ProtectedModuleRoute moduleId="BusinessPartners"><ModuleLayout><BusinessPartnersView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/biyreportes" element={<ProtectedModuleRoute moduleId="BIyReportes"><ModuleLayout><BIyReportes /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/configuracion" element={<ProtectedModuleRoute moduleId="Configuracion"><ModuleLayout><Configuracion /></ModuleLayout></ProtectedModuleRoute>} />
        
        {/* Módulos Operativos Integrados: Circuito Comercial O2C */}
        <Route path="/app/cxc" element={<ProtectedModuleRoute moduleId="CxC"><ModuleLayout><CxcView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/wms" element={<ProtectedModuleRoute moduleId="WMS"><ModuleLayout><WmsView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/rop" element={<ProtectedModuleRoute moduleId="Rop"><ModuleLayout><RopView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/circuito-comercial" element={<ModuleLayout><CircuitoComercialView /></ModuleLayout>} />
        {/* Módulos Operativos Integrados: Circuito Compras, Inventario y Producción (P2P & M) */}
        <Route path="/app/cxp" element={<ProtectedModuleRoute moduleId="CxP"><ModuleLayout><CxpView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/circuito-produccion" element={<ModuleLayout><CircuitoProduccionView /></ModuleLayout>} />
        {/* Módulos Operativos Integrados: Núcleo Financiero y Contable ([10], [11], [12]) */}
        <Route path="/app/circuito-financiero" element={<ModuleLayout><CircuitoFinancieroView /></ModuleLayout>} />
        {/* Módulos Operativos Integrados: Talento Humano y Nómina ([13], [14]) */}
        <Route path="/app/circuito-nomina" element={<ModuleLayout><CircuitoNominaView /></ModuleLayout>} />
        {/* Módulos Operativos Integrados: Gobernanza y Minería de Procesos ([15], [16]) */}
        <Route path="/app/circuito-procesos" element={<ModuleLayout><CircuitoProcesosView /></ModuleLayout>} />
        {/* Módulos Operativos Integrados: IA, Predictivos y Planeación S&OP ([23], [24], [25], [19]) */}
        <Route path="/app/circuito-ia-planeacion" element={<ModuleLayout><CircuitoIaPlaneacionView /></ModuleLayout>} />
        {/* Circuito 7: Inteligencia de Negocios, Big Data y Gobernanza Global ([20], [18], [21], [22], [26]) */}
        <Route path="/app/circuito-gobernanza" element={<ModuleLayout><CircuitoGobernanzaView /></ModuleLayout>} />
        
        {/* LOS 4 CIRCUITOS DE DEMOSTRACIÓN ALINEADOS A LAS 4 FASES COMERCIALES */}
        <Route path="/app/circuito-fase1" element={<ModuleLayout><CircuitoFase1View /></ModuleLayout>} />
        <Route path="/app/circuito-fase2" element={<ModuleLayout><CircuitoFase2View /></ModuleLayout>} />
        <Route path="/app/circuito-fase3" element={<ModuleLayout><CircuitoFase3View /></ModuleLayout>} />
        <Route path="/app/circuito-fase4" element={<ModuleLayout><CircuitoFase4View /></ModuleLayout>} />

        {/* ESPACIO DE TRABAJO UNIFICADO DE FASE (WORKSPACE INTEGRADO) */}
        <Route path="/app/workspace" element={<ModuleLayout><PhaseWorkspaceView /></ModuleLayout>} />
        <Route path="/app/mi-fase" element={<ModuleLayout><PhaseWorkspaceView /></ModuleLayout>} />

        <Route path="/app/dashboards" element={<ProtectedModuleRoute moduleId="Dashboards"><ModuleLayout><DashboardsView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/bi" element={<ProtectedModuleRoute moduleId="BI"><ModuleLayout><BiCubeView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/bigdata" element={<ProtectedModuleRoute moduleId="BigData"><ModuleLayout><BigDataView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/mineriadatos" element={<ProtectedModuleRoute moduleId="MineriaDatos"><ModuleLayout><DataMiningView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/ia" element={<ProtectedModuleRoute moduleId="IA"><ModuleLayout><IaAssistantView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/predictivos" element={<ProtectedModuleRoute moduleId="Predictivos"><ModuleLayout><PredictiveModelsView /></ModuleLayout></ProtectedModuleRoute>} />
        <Route path="/app/planeacion" element={<ProtectedModuleRoute moduleId="Planeacion"><ModuleLayout><PlaneacionView /></ModuleLayout></ProtectedModuleRoute>} />
        
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