const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configurar Base de Datos SQLite (fácil de probar localmente)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

// 2. Crear Modelos (Tablas de la Base de Datos)
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  subscriptions: { 
    type: DataTypes.JSON, 
    defaultValue: [] 
  },
  customQuoteAmount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Partner' // 'Admin', 'Partner', 'Client'
  }
});

const BusinessPartner = sequelize.define('BusinessPartner', {
  code: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }, // Cliente, Proveedor, etc.
  contactName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  balance: { type: DataTypes.FLOAT, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'Activo' }
});

// 3. Crear Endpoints (Rutas de la API)

// Endpoint: Login simulado
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, role } = req.body;
    let subscriptions = [];
    
    if (role === 'Admin') subscriptions = ['Ventas', 'Inventario', 'Contabilidad', 'CxC', 'CxP', 'Compras', 'Logistica', 'CRM', 'RRHH', 'ProcessSuite', 'BIyReportes', 'BusinessPartners', 'Configuracion', 'WMS', 'Dashboards', 'BI', 'BigData', 'IA', 'Predictivos', 'Planeacion', 'Produccion', 'Tesoreria', 'ActivosFijos', 'Nomina'];
    if (role === 'Partner') subscriptions = ['CRM', 'Inventario', 'ProcessSuite', 'BusinessPartners', 'Ventas'];
    if (role === 'Client') subscriptions = ['Ventas', 'Inventario']; // Solo un par operativos, sin BP

    const [user] = await User.findOrCreate({
      where: { email },
      defaults: {
        name: role === 'Admin' ? 'Super Admin' : role === 'Partner' ? 'Distribuidor Partner' : 'Cliente Final',
        subscriptions,
        customQuoteAmount: null,
        role
      }
    });
    // Si ya existía, forzamos actualizar su rol y subs para el demo
    user.role = role;
    user.subscriptions = subscriptions;
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Obtener el usuario activo (simulación de token)
app.get('/api/auth/me', async (req, res) => {
  try {
    const email = req.query.email || 'partner@nytex.com';
    const user = await User.findOne({ where: { email } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Admin set custom quote
app.post('/api/admin/set-quote', async (req, res) => {
  try {
    const { email, amount } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      user.customQuoteAmount = amount;
      await user.save();
      res.json({ success: true, customQuoteAmount: amount });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Obtener todos los Business Partners
app.get('/api/business-partners', async (req, res) => {
  try {
    const partners = await BusinessPartner.findAll();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Crear un nuevo Business Partner
app.post('/api/business-partners', async (req, res) => {
  try {
    const newPartner = await BusinessPartner.create(req.body);
    res.status(201).json(newPartner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint: Simular pago y desbloquear módulos
app.post('/api/payments/simulate', async (req, res) => {
  try {
    const { email, newModules } = req.body;
    
    // Buscar al usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Unir suscripciones antiguas con las nuevas (sin duplicados)
    const currentSubs = user.subscriptions || [];
    const updatedSubs = [...new Set([...currentSubs, ...newModules])];

    // Actualizar la base de datos
    user.subscriptions = updatedSubs;
    await user.save();

    res.json({ success: true, message: 'Pago simulado con éxito. Módulos desbloqueados.', subscriptions: updatedSubs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Sincronizar Base de Datos y Encender Servidor
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // .sync({ force: true }) borrará la DB cada vez. Usamos alter para preservar datos.
    await sequelize.sync({ alter: true });
    
    // Seed: Insertar datos de prueba si la tabla está vacía
    const count = await BusinessPartner.count();
    if (count === 0) {
      await BusinessPartner.bulkCreate([
        { code: 'BP-001', name: 'Distribuidora Global S.A.', type: 'Cliente', contactName: 'María González', email: 'mgonzalez@dglobal.com', balance: 12450 },
        { code: 'BP-002', name: 'TechSupplies Inc.', type: 'Proveedor', contactName: 'John Smith', email: 'jsmith@techsupplies.com', balance: -4300 },
        { code: 'BP-003', name: 'Inversiones del Norte', type: 'Prospecto', contactName: 'Carlos Ruiz', email: 'cruiz@inversionesdn.com', balance: 0, status: 'En negociación' },
      ]);
      console.log('Datos de prueba (seed) insertados.');
    }

    
    const path = require('path');
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('*', (req, res) => {
      // Only serve index.html for non-API routes
      if (!req.path.startsWith('/api')) {
         res.sendFile(path.join(__dirname, 'public', 'index.html'));
      } else {
         res.status(404).json({ error: 'API route not found' });
      }
    });
    
    app.listen(PORT, () => {
      console.log(`🚀 NyTEX Backend Server corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar la base de datos:', error);
  }
}

startServer();
