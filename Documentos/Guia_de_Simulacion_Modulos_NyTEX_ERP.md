# 📘 GUÍA DE SIMULACIÓN OPERATIVA TAREA POR TAREA — ERP NyTEX

**Versión:** 4.0 Integral Actualizada • **Plataforma:** NyTEX ERP & Portal Web Multi-Rol  
**Entorno Local:** `http://localhost:5173` • `http://localhost:3001`  
**Entorno Nube (Producción):** `https://nytex-erp-portal.onrender.com/portal`  
**Espacio Unificado (Workspace):** `https://nytex-erp-portal.onrender.com/app/workspace`  
**Landing Comercial & Contratación:** `https://consultores-nyt.onrender.com/`

---

## 🎯 Objetivo de la Guía
Esta guía describe **módulo por módulo** y **tarea por tarea** el procedimiento exacto de captura, digitación y operación en las pantallas de la aplicación NyTEX ERP. Contiene:
1. **Pantalla y Ruta de Acceso.**
2. **Botón o Disparador de la Tarea.**
3. **Formulario y Campos a Digitar** (con datos de ejemplo realistas de simulación textil e industrial).
4. **Acción de Confirmación / Guardado.**
5. **Resultado Visible en Pantalla** (cambios de estado, badges, alertas).
6. **Efecto de Integración Automatizada** (impacto cruzado e inmediato en contabilidad, inventarios, tesorería, etc.).

---

## 🧭 SECCIÓN 0: MARCO DE OPERACIÓN, SIMULADOR DE ROLES Y SELECTOR DE FASES

El ERP NyTEX incorpora una arquitectura adaptativa que permite operar el sistema desde múltiples perspectivas directivas y según la etapa de madurez digital de la empresa.

### 0.1 Simulador de Roles en Tiempo Real (Barra Superior)
En la parte superior de la aplicación y del Workspace se dispone del **Simulador de Roles**, el cual permite alternar instantáneamente entre los 3 perfiles clave:
- **Rol Administrador:** Acceso completo e irrestricto a los 25 módulos del ecosistema, configuración global de localización fiscal multi-país, auditoría inmutable de accesos y administración de catálogos maestros.
- **Rol Partner / Consultor:** Vista de diagnóstico de arquitectura empresarial, matriz de madurez digital, trazabilidad integral de los circuitos operativos y herramientas de consultoría para acelerar la adopción.
- **Rol Cliente Final:** Interfaz ejecutiva y simplificada enfocada en la operación del día a día según la fase contratada, eliminando sobrecarga visual y restringiendo las acciones a su alcance operativo.

### 0.2 Selector Dinámico de Fases de Implementación
El Workspace unificado permite filtrar y visualizar los módulos correspondientes a cada fase de transformación:
- **Fase 1: Starter (7 Módulos):** [1] Ventas, [2] CRM, [3] Inventario, [4] Compras, [5] Producción, [6] Directorio de Business Partners, [17] WMS.
- **Fase 2: Express (+10 = 17 Módulos):** Starter + [7] Logística y Distribución, [8] CxC, [9] CxP, [10] Tesorería, Cajas y Controles Internos, [11] Activos Fijos, [12] Contabilidad Central, [13] RRHH, [14] Nómina, [15] Synex Process Suite (BPMN), [16] Minería de Procesos.
- **Fase 3: Advanced (+5 = 22 Módulos):** Express + [18] BI y Reportes Financieros NIF/IFRS, [19] Dashboards Ejecutivos, [20] BI Cubo OLAP HyperCube, [21] Big Data e IoT Industrial, [22] Minería de Datos y Machine Learning.
- **Fase 4: Enterprise (+3 = 25 Módulos):** Advanced + [23] Asistente Cognitivo IA Copilot, [24] Modelos Predictivos y Riesgo Crediticio (Logit/ARIMA), [25] Planeación S&OP / MRP II.

### 0.3 Flujo de Contratación y Activación Instantánea en la Nube
1. El cliente ingresa a la Landing Page oficial: `https://consultores-nyt.onrender.com/`.
2. En la sección de precios y paquetes, hace clic en **`CONTRATAR EN PORTAL`** de la fase seleccionada (ej. Fase 1 Starter).
3. Se abre la pasarela de simulación de pago en el Portal de NyTEX:
   - Digitar tarjeta de prueba (`4242 4242 4242 4242`, exp: `12/28`, CVC: `123`).
   - Hacer clic en **`Simular Pago y Activar Fase`**.
4. **Resultado:** Se confirma el pago y el sistema desbloquea y redirige automáticamente al usuario a su **Workspace Integrado** (`/app/workspace?phase=1`), con sus módulos listos para operar sin bucles de inicio de sesión.

### 0.4 Centro de Inducción Multimedia
En el panel del Workspace y en el Portal se integran accesos a:
- **Recorrido General en 3 Minutos:** Video introductorio de navegación por el ecosistema.
- **Capacitación Operativa de Fase 1 Starter:** Video intensivo de operación de compras, inventarios, manufactura textil y ventas.

---

## 🏢 BLOQUE 1: NÚCLEO COMERCIAL Y OPERACIONES BASE

---

### [1] MÓDULO DE VENTAS (Order-to-Cash)
- **Ruta de Acceso:** `/app/ventas` o Pestaña **[1] Ventas** en el Workspace.
- **Propósito:** Captura de cotizaciones, confirmación de pedidos, orden de surtido y facturación electrónica CFDI/DTE.

#### Tarea 1.1: Captura de Nueva Cotización / Pedido de Venta
1. **Acción inicial:** Hacer clic en el botón superior derecho **`+ NUEVA ORDEN / COTIZACIÓN`**.
2. **Campos a registrar en el modal:**
   - **Cliente:** Seleccionar del menú desplegable `BP-001 | Confecciones Modernas S.A.`.
   - **Dirección de Entrega:** Verificar que se autocomplete `Av. Central #120, Parque Industrial Norte`.
   - **Términos de Pago:** Seleccionar `Crédito 30 días`.
   - **Buscador Rápido de Catálogo / Partidas:**
     - En el buscador digitar `Gabardina` o seleccionar la categoría `Producto Terminado`.
     - Presionar **`+ Agregar a la orden`** en el artículo `PT-TEL-101 | Rollo Tela Gabardina Algodón Peinado (Azul)`.
     - Alternativamente, en la tabla de partidas escribir directamente:
       - **SKU:** `PT-TEL-101`
       - **Descripción:** `Rollo Tela Gabardina Algodón Peinado (Azul)`
       - **Cantidad:** Digitar `10`
       - **Precio Unitario ($):** Verificar `1,850.00`
   - Si se requiere una segunda partida, hacer clic en **`+ Agregar Partida`** y capturar:
     - **SKU:** `SKU-MEZ-01`
     - **Descripción:** `Rollo Mezclilla Denim 12oz Índigo Strech`
     - **Cantidad:** Digitar `5`
     - **Precio Unitario ($):** `2,400.00`
   - **Resumen Financiero:** Verificar que el sistema calcula automáticamente:
     - Subtotal: `$30,500.00`
     - IVA (13%): `$3,965.00`
     - Total: `$34,465.00`
3. **Acción de confirmación:** Hacer clic en el botón verde **`Crear Orden`**.
4. **Resultado en pantalla:**
   - Aparece notificación: `✓ Cotización SO-XXXX creada exitosamente.`
   - La nueva orden aparece en la primera fila de la tabla con el badge amarillo **`Cotización`**.
5. **Efecto de Integración:** La cotización queda registrada en el historial comercial disponible para seguimiento en el CRM y planeación S&OP.

#### Tarea 1.2: Confirmar Pedido en Firme y Disparar Surtido a Almacén (WMS)
1. **Acción inicial:** En la tabla de órdenes, ubicar la orden recién creada (estado `Cotización`) y hacer clic en el botón **`⚡ Confirmar ➔ WMS`**.
2. **Resultado en pantalla:**
   - El estado de la orden cambia inmediatamente a badge azul **`En Proceso`**.
   - Aparece la alerta: `Orden SO-XXXX confirmada. Se ha generado la Tarea de Picking en WMS.`
3. **Efecto de Integración:** Se genera automáticamente una orden de surtido en **[17] WMS** con los códigos de barras de los rollos listos para escanear en los racks.

#### Tarea 1.3: Emitir Factura Electrónica y Enviar a Cuentas por Cobrar (CxC)
1. **Acción inicial:** Una vez preparado o entregado el pedido (o directamente sobre la orden confirmada), hacer clic en el botón **`🧾 Facturar ➔ CxC`**.
2. **Resultado en pantalla:**
   - El estado de la orden cambia a **`Facturada`**.
   - Se muestra la alerta: `Factura FAC-XXXX generada y enviada a Cuentas por Cobrar.`
3. **Efecto de Integración:**
   - Descuenta físicamente las existencias en **[3] Inventario**.
   - Crea el título de crédito en **[8] CxC** con el saldo por cobrar.
   - Dispara en **[12] Contabilidad** la **Póliza de Diario** (Cargo a Clientes CxC, Abono a Ventas e Impuestos Trasladados).

---

### [2] MÓDULO DE CRM (Embudo Comercial y Oportunidades)
- **Ruta de Acceso:** `/app/crm` o Pestaña **[2] CRM** en el Workspace.
- **Propósito:** Gestión de prospectos (leads), avance de etapas en pipeline y cálculo de probabilidad de cierre.

#### Tarea 2.1: Registrar Nueva Oportunidad Comercial
1. **Acción inicial:** Hacer clic en el botón superior derecho **`+ NUEVA OPORTUNIDAD`**.
2. **Campos a registrar en el modal:**
   - **Título del Trato / Negocio:** Digitar `Suministro Anual de Popelina y Gabardina`.
   - **Empresa / Prospecto:** Digitar `Industrias Textiles del Bajío S.A.`.
   - **Valor Estimado ($):** Digitar `45,000`.
   - **Etapa Inicial:** Seleccionar `Nuevo` o `Contactado`.
   - **Prioridad:** Seleccionar `Alta`.
   - **Fecha Objetivo de Cierre:** Seleccionar fecha futura (ej. `15/10/2026`).
3. **Acción de confirmación:** Hacer clic en **`Guardar Oportunidad`**.
4. **Resultado en pantalla:** La tarjeta de la oportunidad se incorpora a la primera columna (**Nuevo**) del tablero Kanban, y el KPI *Valor del Pipeline* se incrementa en `$45,000`.

#### Tarea 2.2: Avanzar Oportunidad por el Embudo Kanban
1. **Acción inicial:** Arrastrar la tarjeta o hacer clic en los controles de avance de la oportunidad:
   - Pasar de **Nuevo** ➔ **Contactado** (después de llamada inicial de prospección).
   - Pasar de **Contactado** ➔ **Calificado** (al validar capacidad financiera y volumen requerido).
   - Pasar de **Calificado** ➔ **Cotizado** (al enviar propuesta formal desde el módulo [1] Ventas).
   - Pasar de **Cotizado** ➔ **Ganado**.
2. **Resultado en pantalla:** Al mover la oportunidad a **Ganado**, el contador *Ganado este mes* suma el importe y la tasa de conversión global del CRM se recalcula en tiempo real.

---

### [3] MÓDULO DE INVENTARIO Y STOCK
- **Ruta de Acceso:** `/app/inventario` o Pestaña **[3] Inventario** en el Workspace.
- **Propósito:** Catálogo maestro de artículos (SKUs), control de existencias por almacén, lotes, caducidades y valorización PEPS.

#### Tarea 3.1: Alta de Nuevo Artículo en Catálogo Maestro (SKU)
1. **Acción inicial:** Hacer clic en el botón superior derecho **`+ NUEVO PRODUCTO / ARTÍCULO`**.
2. **Campos a registrar en el modal:**
   - **Código SKU:** Digitar `MP-HIL-501`.
   - **Nombre / Descripción:** Digitar `Hilo de Poliéster Texturizado 150D/48F (Blanco Óptico)`.
   - **Categoría:** Seleccionar `Materia Prima` (opciones: *Materia Prima, Producto en Proceso, Producto Terminado, Insumos / Químicos*).
   - **Almacén Principal:** Seleccionar `Almacén Central Materias Primas` (o `Bodega Planta 1`).
   - **Unidad de Medida:** Seleccionar `kg` (o `metros`, `piezas`, `rollos`).
   - **Costo Unitario ($):** Digitar `85.50`.
   - **Precio de Venta ($):** Dejar en blanco o digitar `120.00`.
   - **Stock Inicial:** Digitar `1,200`.
   - **Stock Mínimo (Alerta de Reorden):** Digitar `300`.
   - **Stock Máximo:** Digitar `3,000`.
3. **Acción de confirmación:** Hacer clic en el botón verde **`Guardar en Catálogo`**.
4. **Resultado en pantalla:** El nuevo SKU aparece en la tabla con badge verde de *Stock Óptimo* y el valor total del inventario aumenta en `$102,600.00`.

#### Tarea 3.2: Registrar Ajuste Manual de Inventario (Entrada / Salida)
1. **Acción inicial:** Hacer clic en el botón **`⚖️ Registrar Ajuste de Inventario`**.
2. **Campos a registrar en el modal:**
   - **Artículo / SKU:** Seleccionar `MP-HIL-501`.
   - **Tipo de Movimiento:** Seleccionar `Entrada (+)` o `Salida (-)`.
   - **Cantidad:** Digitar `100`.
   - **Motivo del Ajuste:** Seleccionar `Reconteo Físico Auditoría` (opciones: *Merma de Operación, Daño por Humedad, Muestra Comercial*).
3. **Acción de confirmación:** Hacer clic en **`Aplicar Ajuste Físico`**.
4. **Resultado en pantalla:** El stock se actualiza a 1,300 kg y se genera un registro en el Kardex físico.
5. **Efecto de Integración:** Genera en **[12] Contabilidad** la póliza de variación de existencias.

---

### [4] MÓDULO DE COMPRAS (Procure-to-Pay)
- **Ruta de Acceso:** `/app/compras` o Pestaña **[4] Compras** en el Workspace.
- **Propósito:** Emisión de órdenes de compra (PO), control de abastecimiento con proveedores y recepción física.

#### Tarea 4.1: Crear Orden de Compra (PO) a Proveedor
1. **Acción inicial:** Hacer clic en el botón **`+ NUEVA ORDEN DE COMPRA`**.
2. **Campos a registrar en el modal:**
   - **Proveedor:** Seleccionar `PRV-001 | Hilaturas del Norte S.A. de C.V.`.
   - **Almacén de Destino:** Seleccionar `Almacén Central Materias Primas`.
   - **Condiciones de Pago:** Seleccionar `Crédito 45 días`.
   - **Partida 1:**
     - **SKU:** Seleccionar `MP-HIL-101 | Hilo de Algodón Peinado 30/1`
     - **Cantidad:** Digitar `500` kg
     - **Precio Unitario ($):** Verificar `125.00` (Subtotal: $62,500.00)
   - **Partida 2 (clic en `+ Agregar Partida`):**
     - **SKU:** Seleccionar `MP-HIL-202 | Hilo Poliéster 150D`
     - **Cantidad:** Digitar `200` kg
     - **Precio Unitario ($):** Verificar `138.00` (Subtotal: $27,600.00)
   - **Resumen:** Subtotal `$90,100.00` + IVA (13%) `$11,713.00` = Total `$101,813.00`.
3. **Acción de confirmación:** Hacer clic en **`Emitir Orden de Compra`**.
4. **Resultado en pantalla:** La orden aparece con estatus amarillo **`Aprobada`** (o enviada a workflow de autorización si supera el umbral directivo).

#### Tarea 4.2: Recepción Física de Mercancía en Almacén
1. **Acción inicial:** En la tabla de compras, sobre la orden en estado `Aprobada`, hacer clic en el botón azul **`📦 Recibir Mercancía`**.
2. **Resultado en pantalla:**
   - El estado de la orden cambia de `Aprobada` a badge verde **`Recibida`**.
   - Aparece el mensaje de éxito integral detallando los módulos sincronizados.
3. **Efecto de Integración Automatizada:**
   - **[3] Inventario:** Aumenta las existencias físicas de hilo en 500 kg y 200 kg respectivamente.
   - **[9] CxP:** Genera automáticamente la cuenta por pagar a favor de Hilaturas del Norte por `$101,813.00`.
   - **[12] Contabilidad:** Genera la **Póliza de Provisión de Compra** (Cargo a Inventario de Materias Primas e IVA Acreditable por Pagar, Abono a Proveedores CxP).

---

### [5] MÓDULO DE PRODUCCIÓN (Manufactura Textil)
- **Ruta de Acceso:** `/app/produccion` o Pestaña **[5] Producción** en el Workspace.
- **Propósito:** Plan Maestro de Manufactura, órdenes de tejeduría (OP), consumo de lista de materiales (BOM) y liquidación de producto terminado.

#### Tarea 5.1: Programar Nueva Orden de Producción (OP)
1. **Acción inicial:** Hacer clic en el botón **`+ Nueva Orden de Fabricación (OP)`**.
2. **Campos a registrar en el modal:**
   - **SKU a Producir:** Digitar o seleccionar `PT-TEL-101`.
   - **Descripción del Producto:** `Rollo Tela Gabardina Algodón Peinado (Azul)`.
   - **Cantidad Objetivo:** Digitar `30` (rollos).
   - **Unidad de Medida:** `rollos`.
   - **Centro de Trabajo / Maquinaria:** Seleccionar `Telar Circular #3 - Planta 1 (Mayer & Cie)`.
   - **Operador Responsable:** Digitar `Ing. Miguel Tejeduría`.
   - **Lista de Materiales Estándar (BOM):** Verificar consumos unitarios:
     - Hilo de Algodón 30/1: `3.0 kg/rollo` (Total lote: 90 kg).
     - Hilo de Poliéster 150D: `1.5 kg/rollo` (Total lote: 45 kg).
     - Tinte Reactivo Azul Marino: `0.4 L/rollo` (Total lote: 12 L).
3. **Acción de confirmación:** Hacer clic en el botón verde **`Programar Producción`**.
4. **Resultado en pantalla:** La OP queda registrada con el folio `OP-XXXX` en estado amarillo **`Planificada`**.

#### Tarea 5.2: Iniciar Fabricación (Consumo y Descuento de Materias Primas)
1. **Acción inicial:** En la tabla de órdenes de producción, hacer clic en el botón azul **`⚙️ Iniciar Fabricación (Descontar Insumos)`**.
2. **Resultado en pantalla:**
   - El estado de la OP cambia a badge azul **`En Proceso`**.
   - Aparece la notificación: `Producción iniciada. Materias primas reservadas y descontadas del almacén.`
3. **Efecto de Integración:**
   - Descuenta en **[3] Inventario** los 90 kg de algodón y 45 kg de poliéster.
   - Genera en **[12] Contabilidad** la **Póliza de Traspaso a Producción en Proceso** (WIP).

#### Tarea 5.3: Liquidar Orden de Producción e Ingresar Producto Terminado
1. **Acción inicial:** Al culminar el turno de tejeduría, hacer clic en el botón verde **`✅ Completar & Enviar a Almacén`**.
2. **Resultado en pantalla:**
   - La orden pasa a estado verde **`Terminada`**.
   - Se muestra la confirmación: `Lote de 30 rollos ingresado con éxito al Almacén de Producto Terminado.`
3. **Efecto de Integración:**
   - **[3] Inventario:** Incrementa 30 rollos en existencia de `PT-TEL-101`.
   - **[12] Contabilidad:** Genera la **Póliza de Liquidación de Manufactura** (Cargo a Inventario de Producto Terminado, Abono a Producción en Proceso).

---

### [6] MÓDULO DE BUSINESS PARTNERS (Directorio Central Maestro)
- **Ruta de Acceso:** `/app/partners` o Pestaña **[6] Partners** en el Workspace.
- **Propósito:** Directorio unificado de Clientes, Proveedores, Fleteros y Prospectos comerciales con información fiscal y comercial centralizada.

#### Tarea 6.1: Registrar Nuevo Socio de Negocios
1. **Acción inicial:** Hacer clic en el botón **`+ NUEVO SOCIO DE NEGOCIO`**.
2. **Campos a registrar en el modal:**
   - **Tipo de Socio:** Seleccionar `Cliente` (opciones: *Cliente, Proveedor, Fletero, Prospecto*).
   - **Nombre / Razón Social:** Digitar `Distribuidora Textil de Guadalajara S.A. de C.V.`.
   - **Identificación Fiscal (RFC / Tax ID):** Digitar `DTG980421KM8`.
   - **Términos de Pago Habituales:** Seleccionar `Neto 30 días`.
   - **Contacto Principal:** Digitar `Lic. Fernando Morales`.
   - **Correo Electrónico:** Digitar `fmorales@distribuidoratextil.com`.
   - **Dirección Completa:** Digitar `Calzada del Federalismo #850, Guadalajara, Jal.`.
   - **Límite de Crédito ($):** Digitar `250,000`.
3. **Acción de confirmación:** Hacer clic en **`Guardar Socio de Negocio`**.
4. **Resultado en pantalla:** El socio queda activo en la tabla maestra y se actualizan los contadores superiores de *Clientes Activos*.
5. **Efecto de Integración:** Queda disponible de inmediato en los selectores de **[1] Ventas** y **[8] CxC**.

---

## 🚚 BLOQUE 2: ALMACENES, LOGÍSTICA Y CADENA DE SUMINISTRO

---

### [17] MÓDULO DE WMS (Gestión de Almacenes, Picking & Packing)
- **Ruta de Acceso:** `/app/wms` o Pestaña **[17] WMS** en el Workspace.
- **Propósito:** Surtido físico guiado por código de barras, empaque de mercancía y traspaso a logística.

#### Tarea 17.1: Ejecutar Picking con Lector de Código de Barras
1. **Acción inicial:** En la tabla de tareas de surtido, ubicar la tarea originada por Ventas en estado `Pendiente`.
2. **Acción en pantalla:** Hacer clic en el botón azul **`▶ Iniciar Picking`**.
3. **Verificación visual:** El estado cambia a **`En Picking`**. Se muestra la lista de rollos a surtir con su ubicación en racks (ej. *Rack B-03, Pasillo 2*).
4. **Lectura de código:** Simular la lectura con pistola láser haciendo clic en la casilla de validación de código de barras.

#### Tarea 17.2: Finalizar Empaque y Liberar a Despacho
1. **Acción inicial:** Una vez recolectadas las piezas, presionar el botón morado **`📦 Finalizar Empaque`**.
2. **Paso final:** Hacer clic en el botón verde **`🚀 Liberar a Despacho`**.
3. **Resultado en pantalla:** El estatus cambia a **`Listo para Despacho`**.
4. **Efecto de Integración:** Se genera automáticamente una guía de envío en **[7] Logística** con chofer y unidad preasignada.

---

### [7] MÓDULO DE LOGÍSTICA Y DISTRIBUCIÓN
- **Ruta de Acceso:** `/app/logistica` o Pestaña **[7] Logística** en el Workspace.
- **Propósito:** Gestión de unidades de transporte, seguimiento de ruta (tracking) y confirmación de entrega física.

#### Tarea 7.1: Iniciar Ruta de Tránsito de Mercancía
1. **Acción inicial:** En la tabla de despachos, ubicar el embarque en estatus `Programado`.
2. **Acción en pantalla:** Hacer clic en el botón **`🚛 Iniciar Ruta de Tránsito`**.
3. **Resultado en pantalla:** El estado avanza a **`En Tránsito`** (badge amarillo animado) y se activa el cronómetro de tiempo en ruta.

#### Tarea 7.2: Ingreso a Zona de Reparto y Confirmación de Entrega
1. **Acción inicial:** Al llegar a la ciudad de destino, hacer clic en **`📍 Entrar en Zona de Reparto`** (estado: `En Reparto`).
2. **Acción de entrega:** Al recibir el acuse firmado del cliente, hacer clic en el botón verde **`✅ Confirmar Entrega al Cliente`**.
3. **Resultado en pantalla:** El envío pasa a **`Entregado`**.
4. **Efecto de Integración:** Actualiza la orden de venta en **[1] Ventas** a estatus *Entregada* y notifica al área de cobranza en **[8] CxC**.

---

### [ROP] MÓDULO DE PUNTO DE REORDEN & REABASTECIMIENTO DINÁMICO
- **Ruta de Acceso:** `/app/rop` o vista integrada de Cadena de Suministro en el Workspace.
- **Propósito:** Monitoreo matemático continuo del inventario para evitar quiebres de stock mediante la fórmula estandarizada de reorden dinámico.

#### Tarea ROP.1: Configuración de Parámetros de SKU y Cálculo del Umbral
1. **Fórmula de Cálculo Integrada:**
   $$\text{ROP} = (\text{Demanda Diaria} \times \text{Lead Time del Proveedor}) + \text{Stock de Seguridad}$$
2. **Parámetros por SKU (Ejemplo real en pantalla):**
   - **SKU:** `KC-10185` | *Papel Higiénico Scott RindeMax 12x4*
   - **Proveedor:** `Kimberly Clark` (SUP-001)
   - **Demanda Diaria ($d$):** `45` cajas/día
   - **Lead Time ($L$):** `7` días
   - **Stock de Seguridad ($SS$):** `120` cajas
   - **Cálculo ROP:** $(45 \times 7) + 120 = 435$ cajas.
   - **Stock Actual:** `280` cajas (por debajo del ROP ➔ Alerta de Reorden).

#### Tarea ROP.2: Auditoría del Semáforo de Riesgo y Disparo de Requisición
1. **Acción de inspección:** En el panel de control, revisar los tres semáforos de criticidad:
   - **Verde (Óptimo):** Existencias superiores al ROP (ej. `NES-30114` con 195 cajas vs ROP 130).
   - **Amarillo (Alerta de Reorden):** Existencias por debajo del ROP (ej. `KC-10185` con 280 cajas vs ROP 435).
   - **Rojo (Rotura Crítica):** Existencias por debajo del Stock de Seguridad (ej. `UN-20412` con 140 cajas vs ROP 370).
2. **Acción resolutiva:** Sobre el artículo en alerta amarilla o roja, hacer clic en el botón azul **`⚡ Generar Requisición Sugerida a Compras`**.
3. **Resultado en pantalla:** Se sugiere el **Lote Económico de Pedido (EOQ: 350 cajas)** y se muestra: `✓ Requisición REQ-ROP-XXXX transmitida con éxito a Compras.`
4. **Efecto de Integración:** Aparece inmediatamente una requisición precargada en **[4] Compras** lista para emitir la Orden de Compra (PO) correspondiente.

---

## 💰 BLOQUE 3: NÚCLEO FINANCIERO, TESORERÍA, CONTROLES INTERNOS Y CONTABILIDAD

---

### [8] MÓDULO DE CUENTAS POR COBRAR (CxC & Cartera)
- **Ruta de Acceso:** `/app/cxc` o Pestaña **[8] CxC** en el Workspace.
- **Propósito:** Control de cartera de clientes, facturación directa y aplicación de cobranzas bancarias.

#### Tarea 8.1: Emisión Directa de Factura a Crédito
1. **Acción inicial:** Hacer clic en el botón superior derecho **`+ NUEVA FACTURA DIRECTA`**.
2. **Campos a registrar en el modal:**
   - **Cliente:** Seleccionar `BP-002 | Hilados & Diseños Industriales`.
   - **Días de Crédito:** Digitar `30`.
   - **Concepto / Descripción:** Digitar `Venta de Tela Drill Algodón Calidad Exportación`.
   - **Monto Subtotal ($):** Digitar `18,500.00`.
   - **IVA Calculado (13%):** Verificar que el sistema calcula automáticamente `$2,405.00`.
   - **Total Factura ($):** `20,905.00`.
3. **Acción de confirmación:** Hacer clic en **`Emitir y Contabilizar Factura`**.
4. **Resultado en pantalla:** La factura aparece en la tabla con folio `FAC-XXXX`, estado `Pendiente` y saldo insoluto de `$20,905.00`.
5. **Efecto de Integración:** Genera en **[12] Contabilidad** la **Póliza de Diario de Provisión de Venta**.

#### Tarea 8.2: Aplicar Pago de Cliente (Cobranza Bancaria)
1. **Acción inicial:** En la tabla de facturas, ubicar la factura emitida y hacer clic en el botón verde **`💵 Aplicar Cobro`**.
2. **Campos a registrar en el modal:**
   - **Cuenta de Depósito:** Seleccionar `BBVA Bancomer - Cta Maestra Pesos`.
   - **Método de Pago:** Seleccionar `Transferencia SPEI`.
   - **Monto a Cobrar ($):** Digitar el pago total `20,905.00` (o parcial).
   - **Referencia Bancaria:** Digitar `SPEI-9928172`.
3. **Acción de confirmación:** Hacer clic en **`Confirmar Cobro y Timbrar Recibo`**.
4. **Resultado en pantalla:** El saldo de la factura pasa a `$0.00` y su estatus cambia a badge verde **`Pagada`**.
5. **Efecto de Integración:**
   - **[10] Tesorería:** Ingresan `$20,905.00` a la cuenta de cheques bancaria.
   - **[12] Contabilidad:** Genera la **Póliza de Ingreso** (Cargo a Bancos, Abono a Clientes CxC).

---

### [9] MÓDULO DE CUENTAS POR PAGAR (CxP & Pasivos)
- **Ruta de Acceso:** `/app/cxp` o Pestaña **[9] CxP** en el Workspace.
- **Propósito:** Gestión de obligaciones con proveedores, programación de pagos y retenciones tributarias.

#### Tarea 9.1: Registrar Factura de Proveedor para Pago Programado
1. **Acción inicial:** Hacer clic en el botón **`+ REGISTRAR FACTURA DE PROVEEDOR`**.
2. **Campos a registrar en el modal:**
   - **Proveedor:** Seleccionar `PRV-002 | Tintes & Químicos de Centroamérica`.
   - **Número de Factura Proveedor:** Digitar `FAC-PRV-45019`.
   - **Fecha de Vencimiento:** Seleccionar fecha futura (ej. `30 días`).
   - **Monto Total con Impuestos ($):** Digitar `28,250.00`.
   - **Concepto:** Digitar `Suministro de Pigmentos Reactivos y Suavizantes Lote B-12`.
3. **Acción de confirmación:** Hacer clic en **`Guardar Cuenta por Pagar`**.
4. **Resultado en pantalla:** La cuenta por pagar queda programada con semáforo verde de vencimiento.

#### Tarea 9.2: Dispersión Bancaria y Liquidación de Pasivo
1. **Acción inicial:** En la tabla de cuentas por pagar, ubicar la factura a liquidar y presionar el botón morado **`💳 Pagar Factura`**.
2. **Campos a registrar:**
   - **Cuenta Bancaria Origen:** Seleccionar `BBVA Bancomer - Cta Maestra Pesos`.
   - **Método de Dispersión:** Seleccionar `Transferencia Bancaria Electrónica`.
   - **Monto a Liquidar ($):** Verificar `28,250.00`.
   - **Folio de Autorización / Referencia:** Digitar `TRANS-PAGO-00412`.
3. **Acción de confirmación:** Hacer clic en **`Ejecutar Dispersión Bancaria`**.
4. **Resultado en pantalla:** El pasivo queda saldado con estatus verde **`Liquidada`**.
5. **Efecto de Integración:**
   - **[10] Tesorería:** Resta `$28,250.00` de la cuenta bancaria.
   - **[12] Contabilidad:** Genera la **Póliza de Egresos** (Cargo a Proveedores CxP, Abono a Bancos).

---

### [10] MÓDULO DE TESORERÍA, CONTROLES INTERNOS Y DIRECCIÓN DE FINANZAS
- **Ruta de Acceso:** `/app/tesoreria` o Pestaña **[10] Tesorería** en el Workspace.
- **Propósito:** Administración de liquidez, salvaguarda de efectivo físico, controles de cierre operativo diario, conciliaciones bancarias automatizadas y políticas de gobernanza financiera.
- **Estructura de la Pantalla:** Cuenta con 4 pestañas de control operativo y un área directiva de gobernanza:
  1. *Cuentas Bancarias / Tesorería Principal*
  2. *Cajas y Fondos Fijos (Control Interno & Arqueos)*
  3. *Cierres de Operación Diaria (Gobernanza Administrativa)*
  4. *Conciliación Bancaria Automática*

#### Tarea 10.1: Registrar Movimiento Bancario Manual (Ingresos / Egresos / Traspasos)
1. **Acción inicial:** En la pestaña *Cuentas Bancarias*, hacer clic en el botón superior derecho **`+ REGISTRAR MOVIMIENTO BANCARIO`**.
2. **Campos a registrar en el modal:**
   - **Institución Bancaria:** Seleccionar `BBVA Bancomer - Cta Maestra Pesos` (o `Banorte Operativa`).
   - **Tipo de Movimiento:** Seleccionar `Ingreso` o `Egreso`.
   - **Categoría:** Seleccionar `Inversión de Capital` (opciones: *Operación Comercial, Anticipo de Cliente, Pago a Proveedores, Gastos Administrativos, Traspaso entre Cuentas*).
   - **Monto ($):** Digitar `50,000.00`.
   - **Concepto:** Digitar `Aportación de Capital de Trabajo para Expansión de Telares`.
   - **Referencia Bancaria:** Digitar `DEP-CAP-88192`.
3. **Acción de confirmación:** Hacer clic en **`Guardar y Aplicar en Bancos`**.
4. **Resultado en pantalla:**
   - El saldo disponible de la cuenta se incrementa inmediatamente en `$50,000.00`.
   - El KPI de *Flujo de Efectivo Neto* se actualiza.
5. **Efecto de Integración:** Genera en **[12] Contabilidad** la **Póliza de Ingreso** cuadrada al 100%.

#### Tarea 10.2: Cierre y Arqueo Físico de Caja General
1. **Acción inicial:** Cambiar a la pestaña **`Cajas y Fondos Fijos`**. Ubicar la tarjeta de `Caja General Planta Principal` y hacer clic en el botón **`🔍 Ejecutar Arqueo Físico`**.
2. **Campos a capturar en el modal de arqueo:**
   - **Efectivo Físico Contado ($):** Digitar el monto recontado en billetes y monedas (ej. `1,250.00`).
   - **Total de Comprobantes / Vales ($):** Digitar la suma de recibos y facturas en caja (ej. `450.00`).
   - **Observaciones de Auditoría:** Digitar `Arqueo de corte de turno vespertino. Valores cuadrados.`.
3. **Cálculo automático del sistema:**
   - Saldo Teórico en Libros: `$1,700.00`.
   - Total Físico Justificado: `$1,250.00 + $450.00 = $1,700.00`.
   - Diferencia: `$0.00` (Badge verde: *Arqueo Conforme / Sin Descuadre*).
4. **Acción de confirmación:** Hacer clic en **`Cerrar Caja y Firmar Acta de Arqueo`**.
5. **Resultado en pantalla:** Se emite el acta de arqueo foliada con sello criptográfico digital y se registra en la bitácora histórica de auditoría.

#### Tarea 10.3: Control y Reposición de Caja Chica (Fondo Fijo)
1. **Acción inicial:** En la misma pestaña de *Cajas y Fondos Fijos*, ubicar la tarjeta de `Caja Chica Administrativa (Fondo Fijo: $500.00 USD)`.
2. **Acción en pantalla:** Al detectar que el saldo disponible está bajo (ej. saldo de `$120.00` con gastos comprobados de `$380.00`), presionar el botón azul **`⚡ Solicitar Reposición de Fondo`**.
3. **Confirmación en modal:**
   - Se muestra el desglose de comprobantes de gastos menores a reintegrar (`$380.00 USD`).
   - Banco emisor del cheque o transferencia de reembolso: `BBVA Bancomer`.
4. **Acción de confirmación:** Presionar **`Aprobar y Emitir Reposición`**.
5. **Resultado en pantalla:**
   - El saldo de la Caja Chica se restablece a su techo formal de `$500.00 USD`.
   - Muestra alerta: `✓ Reposición completada por $380.00 USD. Póliza contable POL-EGR-XXXX generada.`
6. **Efecto de Integración:**
   - **[10] Tesorería:** Descuenta `$380.00` de la cuenta bancaria BBVA.
   - **[12] Contabilidad:** Genera la **Póliza de Egresos** afectando las subcuentas de gastos administrativos y acreditamiento de IVA.

#### Tarea 10.4: Cierre Diario de Cobros (Liquidación de Cartera CxC)
1. **Acción inicial:** Cambiar a la pestaña **`Cierres de Operación Diaria`**.
2. **Disparador:** En la tarjeta de *Cierre Diario de Cobros (CxC)*, hacer clic en el botón azul **`🔒 Ejecutar Cierre de Cobros`**.
3. **Campos en el modal:**
   - **Título del Cierre:** `Corte Diario de Cobranza - [Fecha Actual]`.
   - **Monto Total Recaudado:** Verificar el importe acumulado del día (ej. `$24,500.00 USD`).
   - **Notas del Supervisor:** Digitar `Cobranza recibida vía transferencias SPEI y depósitos bancarios verificados con comprobante.`.
4. **Acción de confirmación:** Hacer clic en **`Aplicar Cierre Definitivo`**.
5. **Resultado en pantalla:**
   - Se bloquea la edición de cobranzas con fecha del día cerrado.
   - Se genera el registro de cierre con estatus **`CERRADO / SELLADO`** y hash de verificación.
6. **Efecto de Integración:** Notifica a Contabilidad y Dirección Financiera el corte formal de ingresos líquidos.

#### Tarea 10.5: Cierre Diario de Pagos (Dispersión y Control CxP)
1. **Acción inicial:** En la pestaña **`Cierres de Operación Diaria`**, en la tarjeta de *Cierre Diario de Pagos (CxP)*, hacer clic en **`🔒 Ejecutar Cierre de Pagos`**.
2. **Campos en el modal:**
   - **Título del Cierre:** `Corte Diario de Dispersión a Proveedores y Pasivos`.
   - **Monto Total Dispersado:** Verificar total liquidado (ej. `$18,920.00 USD`).
   - **Notas:** Digitar `Transferencias de pago a proveedores de materia prima y servicios autorizadas según calendario semanal.`.
3. **Acción de confirmación:** Hacer clic en **`Aplicar Cierre Definitivo`**.
4. **Resultado en pantalla:** El lote de transferencias del día queda archivado y sellado, garantizando que no se puedan emitir pagos retroactivos sin previa autorización gerencial.

#### Tarea 10.6: Cierre de Compras Diarias (Validación Recepciones vs Facturas)
1. **Acción inicial:** En la tarjeta de *Cierre de Compras Diarias*, presionar el botón **`🔒 Ejecutar Cierre de Compras`**.
2. **Campos en el modal:**
   - **Título del Cierre:** `Corte Diario de Recepción y Facturación de Compras`.
   - **Monto Comprometido:** Verificar volumen diario de compras (ej. `$32,400.00 USD`).
   - **Notas:** Digitar `Validación 3-Way Match completada: Órdenes de compra aprobadas coinciden con entradas físicas a almacén y CFDI de proveedores.`.
3. **Acción de confirmación:** Hacer clic en **`Aplicar Cierre Definitivo`**.
4. **Resultado en pantalla:** Se cierra el período diario de compras, impidiendo la alteración de precios de compra o inventarios recepcionados durante esa jornada.

#### Tarea 10.7: Conciliación Bancaria Automática y Sello Criptográfico
1. **Acción inicial:** Cambiar a la pestaña **`Conciliación Bancaria Automática`**.
2. **Parámetros de consulta:**
   - **Cuenta Bancaria:** Seleccionar `BBVA Bancomer - Cta Maestra Pesos (BCO-BBVA-01)`.
   - **Período:** Seleccionar `2026-10` (Octubre 2026).
3. **Mecanismo de conciliación interactivo:**
   - En la tabla de partidas conciliatorias, revisar las filas que cruzan los movimientos del **Libro Mayor de Bancos (ERP)** contra el **Extracto Bancario Oficial**.
   - Hacer clic en el botón de punteo o switch de conciliación de las partidas pendientes (ej. comisiones bancarias, depósitos en tránsito).
   - Verificar cómo la **Diferencia No Conciliada** se reduce dinámicamente hasta llegar a `$0.00 USD`.
4. **Acción de confirmación:** Hacer clic en el botón verde superior **`✓ Cerrar Conciliación Formal del Período`**.
5. **Resultado en pantalla:**
   - Aparece la alerta: `✓ Conciliación bancaria cerrada con éxito. Sello criptográfico SHA-256: 7f8a9b1c2d3e4f5a6b7c8d...`.
   - Se genera el reporte oficial de conciliación en formato imprimible con valor probatorio para auditorías externas e internas.

#### Tarea 10.8: Gobernanza Financiera y Matriz de Autorizaciones
1. **Acción de consulta:** En el encabezado del módulo, revisar los umbrales de autorización y firmas electrónicas configuradas:
   - **Nivel Operativo:** Pagos y transferencias hasta `$5,000 USD` (Aprobación por Jefe de Tesorería).
   - **Nivel Gerencial:** Pagos entre `$5,001 USD` y `$25,000 USD` (Requiere firma mancomunada de Gerente Administrativo).
   - **Nivel Dirección General:** Egresos superiores a `$25,000 USD` (Requiere doble token y autorización del Director de Finanzas o CEO).
2. **Efecto de Integración:** Todo movimiento que exceda el límite operativo activa de forma inmediata un workflow jerárquico en **[15] Synex Process Suite**.

---

### [11] MÓDULO DE ACTIVOS FIJOS Y DEPRECIACIONES
- **Ruta de Acceso:** `/app/activosfijos` o Pestaña **[11] Activos Fijos** en el Workspace.
- **Propósito:** Padrón de bienes de capital, maquinaria industrial y corrida de depreciación según NIF C-6.

#### Tarea 11.1: Registrar Nuevo Activo de Planta
1. **Acción inicial:** Hacer clic en el botón **`+ ALTA DE ACTIVO FIJO`**.
2. **Campos a registrar en el modal:**
   - **Nombre / Descripción del Activo:** Digitar `Telar Circular Mayer & Cie Relanit 3.2 II (30 Pulgadas)`.
   - **Categoría:** Seleccionar `Maquinaria & Equipo Fabril` (opciones: *Equipo de Transporte, Mobiliario de Oficina, Equipo de Cómputo*).
   - **Costo de Adquisición ($):** Digitar `385,000.00`.
   - **Vida Útil Estimada:** Digitar `10` (años).
   - **Centro de Costos / Ubicación:** Seleccionar `Planta 1 - Tejeduría`.
3. **Acción de confirmación:** Hacer clic en **`Guardar Activo Fijo`**.
4. **Resultado en pantalla:** El activo se incorpora a la lista con código `AF-XXXX`, valor en libros inicial de `$385,000.00` y depreciación acumulada de `$0.00`.

#### Tarea 11.2: Ejecutar Depreciación Mensual Automática
1. **Acción inicial:** En la cabecera superior, hacer clic en el botón morado **`⚡ EJECUTAR DEPRECIACIÓN MENSUAL`**.
2. **Resultado en pantalla:**
   - Se muestra la alerta: `✓ Depreciación mensual ejecutada exitosamente para todos los activos del padrón.`
   - La depreciación acumulada se incrementa proporcionalmente en cada renglón y el *Valor Residual en Libros* se actualiza.
3. **Efecto de Integración:** Genera automáticamente en **[12] Contabilidad** la **Póliza de Diario de Depreciación** (Cargo a Gasto de Operación por Depreciación, Abono a Depreciación Acumulada de Maquinaria).

---

### [12] MÓDULO DE CONTABILIDAD CENTRAL & PÓLIZAS AUTOMÁTICAS
- **Ruta de Acceso:** `/app/contabilidad` o Pestaña **[12] Contabilidad** en el Workspace.
- **Propósito:** Libro Diario, Libro Mayor, consulta de partida doble y Balanza de Comprobación fiscal.

#### Tarea 12.1: Auditoría y Filtrado de Pólizas Contables
1. **Acción inicial:** En la pestaña principal **Pólizas**, hacer clic en los filtros:
   - `Todas`: Muestra todas las pólizas del ejercicio.
   - `Ingreso`: Pólizas originadas por cobros y depósitos en Tesorería.
   - `Egreso`: Pólizas de pagos a proveedores y dispersión de nómina.
   - `Diario`: Pólizas de facturación, depreciaciones y ajustes de almacén.
2. **Consulta de detalle de partida doble:**
   - Hacer clic en el botón **`Ver Asiento`** de cualquier póliza.
   - El modal despliega las cuentas de catálogo (ej. *1100 Bancos, 1120 Clientes, 2100 Proveedores, 4100 Ventas, 5100 Costo*), verificando que la suma de la columna **Debe** sea exactamente igual a la columna **Haber**.

#### Tarea 12.2: Consulta de la Balanza de Comprobación Cuadrada
1. **Acción inicial:** Cambiar a la pestaña **`Balanza de Comprobación`**.
2. **Verificación operativa:**
   - Revisar los saldos iniciales, movimientos acumulados y saldos finales de cada cuenta.
   - Constatar al final de la tabla la leyenda verde: `✓ Balanza Cuadrada al 100% (Activo = Pasivo + Capital)`.

---

## 👥 BLOQUE 4: TALENTO HUMANO Y NÓMINA

---

### [13] MÓDULO DE RECURSOS HUMANOS (RRHH)
- **Ruta de Acceso:** `/app/rrhh` o Pestaña **[13] RRHH** en el Workspace.
- **Propósito:** Padrón de colaboradores, expedientes laborales y captura de incidencias periódicas.

#### Tarea 13.1: Registrar Nuevo Colaborador
1. **Acción inicial:** En la pestaña *Directorio*, hacer clic en el botón **`+ Registrar Colaborador`**.
2. **Campos a registrar en el modal:**
   - **Nombre Completo:** Digitar `Carlos Alberto Ramos Solís`.
   - **Departamento:** Seleccionar `Producción Fabril` (opciones: *Calidad Textil, Almacén & Logística, Ventas & Marketing, Finanzas & Administración*).
   - **Puesto / Cargo:** Digitar `Operador Maestro de Telar Mayer & Cie`.
   - **RFC:** Digitar `RASC880315HJ2`.
   - **NSS (Seguridad Social IMSS):** Digitar `45088891234`.
   - **Salario Diario ($):** Digitar `650.00`.
   - **Banco para Dispersión:** Seleccionar `BBVA` o `Banorte`.
   - **Cuenta / CLABE Interbancaria:** Digitar `012180001234567890`.
3. **Acción de confirmación:** Hacer clic en **`Guardar Colaborador`**.
4. **Resultado en pantalla:** El colaborador se agrega con código `EMP-XXXX` en estado activo.

#### Tarea 13.2: Capturar Incidencia Laboral (Horas Extra o Bonos)
1. **Acción inicial:** Cambiar a la pestaña *Incidencias* y hacer clic en **`+ Capturar Incidencia`**.
2. **Campos a registrar:**
   - **Colaborador:** Seleccionar a `Carlos Alberto Ramos Solís`.
   - **Tipo de Incidencia:** Seleccionar `Horas Extra Dobles` (opciones: *Horas Extra Triples, Bono de Productividad, Falta Injustificada, Incapacidad IMSS*).
   - **Horas / Cantidad:** Digitar `4`.
   - **Fecha de Aplicación:** Seleccionar fecha del turno.
3. **Acción de confirmación:** Hacer clic en **`Aplicar a Nómina`**.
4. **Resultado en pantalla:** La incidencia queda indexada para acumularse en el próximo cálculo de nómina.

---

### [14] MÓDULO DE NÓMINA & FISCAL
- **Ruta de Acceso:** `/app/nomina` o Pestaña **[14] Nómina** en el Workspace.
- **Propósito:** Pre-nómina, retenciones fiscales de ley (ISR / IMSS / AFP), cálculo de percepciones y dispersión bancaria.

#### Tarea 14.1: Calcular Corrida Periódica de Nómina
1. **Acción inicial:** Hacer clic en el botón morado **`⚡ Calcular Nómina del Período`**.
2. **Parámetros:** Seleccionar período `Quincena 1 - Octubre 2026`.
3. **Resultado en pantalla:**
   - El sistema calcula percepciones brutas, horas extras registradas, retenciones obligatorias de ISR e IMSS/AFP y sueldos netos a pagar.
   - La tabla muestra el estatus amarillo **`Calculada / En Revisión`**.

#### Tarea 14.2: Dispersión Bancaria y Timbrado Fiscal de Recibos
1. **Acción inicial:** Una vez validada la nómina por el Gerente de RRHH, presionar el botón verde **`🏦 Dispersar Nómina y Timbrar CFDI`**.
2. **Resultado en pantalla:**
   - Los recibos se marcan con badge verde **`Dispersada & Timbrada`**.
   - Se muestra la alerta: `Dispersión completada exitosamente vía layout bancario BBVA y recibos timbrados ante la autoridad tributaria.`
3. **Efecto de Integración Automatizada:**
   - **[10] Tesorería:** Descuenta de bancos el monto neto pagado a los colaboradores.
   - **[12] Contabilidad:** Genera la **Póliza de Nómina** (Cargo a Gasto de Sueldos y Salarios, Abono a Retenciones por Pagar y Abono a Bancos).

---

## 🔄 BLOQUE 5: PROCESOS, MINERÍA Y GOBERNANZA

---

### [15] SYNEX PROCESS SUITE (Modelador BPMN & Workflows)
- **Ruta de Acceso:** `/app/processsuite` o Pestaña **[15] Process Suite** en el Workspace.
- **Propósito:** Diseñar flujos de trabajo, modelado BPMN 2.0 interactivo y autorización jerárquica de tareas.

#### Tarea 15.1: Modelar Flujo en Diseñador Visual BPMN 2.0 Interactivo
1. **Acción inicial:** Hacer clic en la pestaña **`Diseñador Visual BPMN 2.0`**.
2. **Interacción con el Canvas:**
   - Utilizar la paleta izquierda de herramientas BPMN para arrastrar o agregar elementos:
     - **Evento de Inicio (Start Event):** Disparo de la solicitud o evento operativo.
     - **Tareas de Usuario y de Servicio (Tasks):** Etapas de revisión, cálculo o ejecución técnica.
     - **Compuertas Exclusivas y Paralelas (Gateways):** Bifurcación por montos, tipos de cliente o validaciones de crédito.
     - **Evento de Fin (End Event):** Culminación y archivo del flujo.
   - Seleccionar un nodo en pantalla y consultar el panel de propiedades para parametrizar el rol ejecutor, SLA en horas y condiciones de aprobación.
3. **Acción de confirmación:** Hacer clic en **`Guardar y Publicar Diagrama BPMN`**.
4. **Resultado en pantalla:** El nuevo flujo queda activo y listo para gobernar las transacciones del ERP.

#### Tarea 15.2: Lanzar Nueva Instancia de Flujo de Aprobación
1. **Acción inicial:** Hacer clic en la pestaña **`Lanzar Flujo / Instancia`**.
2. **Campos a registrar:**
   - **Proceso:** Seleccionar `WF-COM-01 | Aprobación de Órdenes de Compra Mayores`.
   - **Título de la Tarea:** Digitar `Autorización de Compra de Hilo de Algodón Lote Especial`.
   - **Documento de Referencia:** Digitar `PO-2026-088`.
   - **Solicitante:** Digitar `Ing. Juan Pérez (Compras)`.
   - **Rol Aprobador Asignado:** Seleccionar `Director de Finanzas` (opciones: *Gerente de Planta, Director General, Jefe de Almacén*).
   - **Prioridad:** Seleccionar `Alta`.
   - **Monto Involucrado ($):** Digitar `65,000.00`.
   - **Fecha Límite:** Seleccionar fecha y hora límite.
3. **Acción de confirmación:** Hacer clic en **`Iniciar Instancia de Proceso`**.
4. **Resultado en pantalla:** Se notifica: `Instancia de workflow lanzada exitosamente a la bandeja de aprobación.`

#### Tarea 15.3: Resolver Tarea Pendiente en la Bandeja de Aprobaciones
1. **Acción inicial:** Hacer clic en la pestaña **`Bandeja de Aprobaciones (Inbox)`**.
2. **Acción resolutiva:** En la tarjeta de la tarea pendiente, hacer clic en:
   - Botón verde **`Aprobar (Visto Bueno)`** para autorizar el avance.
   - Botón rojo **`Rechazar`** para cancelar con observaciones.
   - Botón gris **`Solicitar Aclaración`** para devolver al solicitante.
3. **Resultado en pantalla:** La tarea se retira de la bandeja y el contador de *Tareas Pendientes* se reduce.

---

### [16] PROCESS MINING (Minería de Procesos & Conformidad)
- **Ruta de Acceso:** `/app/processmining` o Pestaña **[16] Process Mining** en el Workspace.
- **Propósito:** Descubrimiento de procesos reales a partir de los event logs del ERP y detección de cuellos de botella.

#### Tarea 16.1: Simular Descubrimiento de Nuevo Caso en Vivo
1. **Acción inicial:** En la cabecera del módulo, hacer clic en el botón verde **`⚡ Descubrir Nuevo Caso en Vivo`**.
2. **Resultado en pantalla:**
   - El sistema analiza los logs cronológicos de Ventas, WMS y Cobranza.
   - Aparece la confirmación: `✓ Nuevo caso minado e indexado en el grafo DFG.`
   - Se actualizan los KPIs de *Casos Analizados*, *Tiempo Ciclo Promedio* y *Tasa de Conformidad*.
3. **Auditoría visual:**
   - En el grafo de procesos, revisar el nodo rojo que resalta el cuello de botella identificado (ej. *Demora promedio de 4.2 horas en Aprobación de Crédito*).
   - En la tabla de casos recientes, revisar los desvíos respecto a la norma corporativa BPMN.

---

### [26] CONFIGURACIÓN DEL SISTEMA, LOCALIZACIÓN FISCAL MULTI-PAÍS & AUDITORÍA INMUTABLE
- **Ruta de Acceso:** `/app/configuracion` o Pestaña **[26] Configuración** en el Workspace.
- **Propósito:** Parámetros de la empresa, selección de país y autoridad tributaria (El Salvador MH DTE, Guatemala SAT FEL, Honduras SAR, Costa Rica DGT, Panamá DGI, México SAT), catálogo de divisas y bitácora de auditoría inmutable con sellos criptográficos.

#### Tarea 26.1: Configurar Localización Fiscal y Cambiaria Regional
1. **Acción inicial:** En la pestaña **Localización Fiscal & Divisas**:
   - **País de Operación:** Seleccionar el país objetivo (ej. `🇸🇻 El Salvador` o `🇬🇹 Guatemala`).
   - El sistema carga automáticamente el driver de facturación electrónica (`DTE` para El Salvador, `FEL` para Guatemala, `CAI` para Honduras, `SFEP` para Panamá) y la tasa de IVA correspondiente (ej. 13% en El Salvador, 12% en Guatemala, 15% en Honduras).
   - **Razón Social:** `NyTEX Textil de Centroamérica S.A. de C.V.`
   - **Identificación Fiscal:** Digitar NIT/NRC para El Salvador (ej. `0614-180612-102-4`) o el formato respectivo del país seleccionado.
   - **Autoridad Tributaria:** `Ministerio de Hacienda (MH)` o la entidad local correspondiente.
   - **Régimen Fiscal:** `Régimen General / Mediano Contribuyente`
   - **Tipo de Cambio:** Ajustar paridades cambiarias (USD base).
2. **Acción de confirmación:** Hacer clic en el botón negro **`Guardar y Auditar Cambios`**.
3. **Resultado en pantalla:** Aparece el mensaje de confirmación: `✓ Parámetros de [País] y configuración fiscal actualizados con éxito. Evento auditado en bitácora inmutable.`

#### Tarea 26.2: Consultar la Bitácora Inmutable de Auditoría (Audit Trail)
1. **Acción inicial:** Hacer clic en la pestaña **Bitácora Inmutable de Auditoría**.
2. **Verificación operativa y blindaje tributario:**
   - Constatar que la operación anterior quedó sellada en el primer renglón con timestamp ISO, severidad, módulo, usuario e IP de origen.
   - Estos registros son inmutables (no pueden borrarse ni sobreescribirse), brindando blindaje corporativo y trazabilidad ante auditorías fiscales de cualquier ministerio de hacienda de la región.

---

## 📊 BLOQUE 6: INTELIGENCIA DE NEGOCIOS, ANALÍTICA Y MODELOS PREDICTIVOS

---

### [18] BI Y REPORTES FINANCIEROS (NIF / IFRS)
- **Ruta de Acceso:** `/app/reportes` o Pestaña **[18] Reportes** en el Workspace.
- **Propósito:** Emisión ejecutiva de los 4 estados financieros básicos reglamentarios bajo normas NIF/IFRS.

#### Tarea 18.1: Generar Estado de Resultados y Balance General
1. **Acción inicial:** Seleccionar el reporte deseado en los botones superiores:
   - **Estado de Resultados Integral (P&L):** Muestra Ingresos Netos, Costo de Ventas, Margen Bruto, Gastos Operativos y Utilidad Neta del Ejercicio.
   - **Estado de Situación Financiera (Balance General):** Desglosa Activo Circulante/Fijo, Pasivo a Corto/Largo Plazo y Capital Contable.
   - **Estado de Flujo de Efectivo:** Muestra entradas y salidas clasificadas en actividades de Operación, Inversión y Financiamiento.
2. **Acción de exportación:** Hacer clic en el botón **`📥 Descargar PDF Auditado`** o **`📊 Exportar a Excel`**.

---

### [19] DASHBOARDS EJECUTIVOS EN TIEMPO REAL
- **Ruta de Acceso:** `/app/dashboards` o Pestaña **[19] Dashboards** en el Workspace.
- **Propósito:** Cuadro de Mando Integral (KPI Cockpit) con métricas de ventas, rentabilidad, rotación de inventarios y utilización de planta.

#### Tarea 19.1: Análisis de Indicadores Clave de Desempeño (KPIs)
1. **Acción inicial:** En el selector de rango temporal, elegir `Mes Actual` o `Último Trimestre`.
2. **Revisión de cuadrantes:**
   - **Card de Ventas Totales:** Comparativa de ventas reales vs presupuesto comercial.
   - **Card de Eficiencia OEE de Planta:** Porcentaje de disponibilidad, rendimiento y calidad de los telares Mayer & Cie.
   - **Card de Días de Cartera (DSO):** Plazo promedio de cobro a clientes.
   - **Card de Rotación de Inventarios:** Días de permanencia de materias primas y producto terminado en almacén.

---

### [20] BI CUBO MULTIDIMENSIONAL (OLAP HyperCube)
- **Ruta de Acceso:** `/app/bicube` o Pestaña **[20] BI Cubo** en el Workspace.
- **Propósito:** Análisis multidimensional (OLAP Slice & Dice / Drill-Down) para cruzar métricas contra múltiples jerarquías de datos.

#### Tarea 20.1: Ejecutar Navegación Slice & Dice en Cubo de Ventas
1. **Acción inicial:** En el selector de dimensiones, arrastrar o marcar:
   - **Eje Filas:** `Familia de Productos` (Gabardinas, Mezclillas, Popelinas).
   - **Eje Columnas:** `Región Geográfica` (Norte, Centro, Occidente, Exportación).
   - **Métrica / Valor:** `Margen de Contribución Bruto ($)`.
2. **Acción Drill-Down:** Hacer doble clic en la celda de *Gabardinas - Región Norte* para abrir el desglose individual por cliente y vendedor.
3. **Resultado en pantalla:** La matriz se recalcula al instante mostrando subcuentas y totales consolidados.

---

### [21] BIG DATA & TELEMETRÍA IOT INDUSTRIAL
- **Ruta de Acceso:** `/app/bigdata` o Pestaña **[21] Big Data** en el Workspace.
- **Propósito:** Ingestión de señales de sensores industriales en tiempo real instalados en telares circulares, urdidoras y ramas tensoras.

#### Tarea 21.1: Monitor de Telemetría IoT en Vivo
1. **Acción inicial:** En el monitor de telemetría, seleccionar la máquina `Telar Circular #3 (Mayer & Cie)`.
2. **Lectura de parámetros en pantalla:**
   - **Velocidad de RPM:** `28.4 RPM` (Rango operativo normal: 25 - 30 RPM).
   - **Temperatura de Rodamientos:** `48.2 °C` (Umbral de alarma: > 65 °C).
   - **Tensión del Hilo:** `14.2 cN` (Sensor de rotura de trama).
   - **Metros de Tela Tejidos en el Turno:** `1,420 m`.
3. **Simulación de Alerta Preventiva:** Si un sensor detecta micro-paradas o vibración anómala, el sistema emite una orden de servicio a Mantenimiento.

---

### [22] MINERÍA DE DATOS & MACHINE LEARNING
- **Ruta de Acceso:** `/app/datamining` o Pestaña **[22] Data Mining** en el Workspace.
- **Propósito:** Algoritmos de clustering (K-Means), reglas de asociación (Market Basket Analysis) y detección de anomalías en consumo.

#### Tarea 22.1: Ejecutar Segmentación de Clientes con K-Means
1. **Acción inicial:** En la pestaña *Clustering*, hacer clic en **`⚡ Entrenar Modelo de Segmentación K-Means`**.
2. **Resultado en pantalla:**
   - El algoritmo clasifica a la cartera en 3 clusters visuales:
     - **Cluster 1 (Diamante):** Clientes de alto volumen y pago inmediato a 15 días.
     - **Cluster 2 (Frecuentes / Volumen Medio):** Clientes con pedidos recurrentes y crédito a 30 días.
     - **Cluster 3 (Riesgo / Compras Esporádicas):** Clientes con mora habitual o pedidos aislados.
3. **Efecto de Integración:** Sugiere dinámicamente límites de crédito diferenciados en **[6] Business Partners**.

---

### [23] ASISTENTE COGNITIVO IA (Copilot Empresarial)
- **Ruta de Acceso:** `/app/ai-assistant` o Pestaña **[23] Asistente IA** en el Workspace.
- **Propósito:** Interfaz de lenguaje natural impulsada por Inteligencia Artificial para consultas ejecutivas, auditoría de datos y toma de decisiones.

#### Tarea 23.1: Consultar Disponibilidad y Rentabilidad con Prompt
1. **Acción inicial:** En la caja de chat del asistente, escribir el siguiente prompt:
   `"¿Cuál es el margen promedio de la gabardina este mes y cuántos rollos tenemos disponibles en Almacén Central?"`
2. **Presionar:** `Enter` o el botón azul de envío.
3. **Resultado en pantalla:** El Asistente IA responde en 1.5 segundos con datos verídicos cruzados del ERP:
   - *Margen promedio de Gabardina Algodón Peinado:* `42.8%`
   - *Existencias actuales en Almacén Central:* `180 rollos`
   - *Sugerencia proactiva:* Hay 3 pedidos de entrega programada para la próxima semana por 45 rollos; se recomienda mantener el plan de manufactura activo.

---

### [24] MODELOS PREDICTIVOS & RIESGO CREDITICIO
- **Ruta de Acceso:** `/app/predictivos` o Pestaña **[24] Predictivos** en el Workspace.
- **Propósito:** Simulación de regresión logística inferencial (Logit) y pronóstico de series de tiempo (ARIMA).

#### Tarea 24.1: Simular Probabilidad de Mora e Incumplimiento (Logit)
1. **Acción inicial:** En la pestaña *Inferencia Causal*, seleccionar el caso de uso `Predicción de Mora & Incumplimiento Crediticio (CxC)`.
2. **Digitar variables en los controles / sliders:**
   - **Días de atraso histórico:** Mover a `25` días.
   - **Porcentaje de línea de crédito utilizada:** Mover al `85%`.
   - **Antigüedad de la cuenta:** Digitar `6` meses.
   - **Facturas en disputa previa:** Digitar `2`.
3. **Acción de confirmación:** Hacer clic en **`⚡ Calcular Probabilidad de Riesgo e Inferencia`**.
4. **Resultado en pantalla:**
   - El motor logístico calcula la probabilidad (ej. `78.4% - Riesgo Crítico`).
   - Se muestra el Odds Ratio y la recomendación: *Exigir pago de contado o garantía prendaria previa al despacho de nuevos pedidos*.

---

### [25] PLANEACIÓN DE LA DEMANDA & S&OP (MRP II)
- **Ruta de Acceso:** `/app/planeacion` o Pestaña **[25] Planeación** en el Workspace.
- **Propósito:** Sincronización entre demanda comercial proyectada, capacidad de maquinaria y explosión de materiales MRP.

#### Tarea 25.1: Ejecutar la Sincronización S&OP y Disparar Requerimientos
1. **Acción inicial:** Hacer clic en el botón **`⚡ Ejecutar Sincronización S&OP (MRP II)`**.
2. **Resultado en pantalla:**
   - El sistema calcula:
     - Demanda comercial total comprometida (ej. `50 rollos`).
     - Déficit neto de materia prima a adquirir (ej. `600 kg de hilo`).
     - Carga de trabajo en horas de telares Mayer & Cie.
   - Aparece la confirmación: `✓ Sincronización completada. Se han enviado las solicitudes de abastecimiento a Compras y las órdenes sugeridas a Producción.`
3. **Efecto de Integración:** Genera las solicitudes correspondientes en los módulos [4] Compras y [5] Producción.

---

## 🚀 LOS 4 CIRCUITOS DE DEMOSTRACIÓN INTEGRADA

Para demostraciones ejecutivas o pruebas de punta a punta, el sistema dispone de 4 circuitos guiados de un solo clic alineados a las fases de contratación del cliente:

| Circuito | Ruta | Módulos Integrados en el Flujo |
| :--- | :--- | :--- |
| **Circuito Fase 1 (Starter)** | `/app/circuito-fase1` | [1] Ventas ➔ [3] Inventario ➔ [4] Compras ➔ [5] Producción ➔ [6] Partners ➔ [17] WMS |
| **Circuito Fase 2 (Express)** | `/app/circuito-fase2` | Starter + [7] Logística, [8] CxC, [9] CxP, [10] Tesorería & Cajas, [11] Activos Fijos, [12] Contabilidad, [13] RRHH, [14] Nómina, [15] Process Suite BPMN, [16] Process Mining |
| **Circuito Fase 3 (Advanced)** | `/app/circuito-fase3` | Express + [18] BI Reportes, [19] Dashboards, [20] BI Cubo OLAP, [21] Big Data IoT, [22] Data Mining |
| **Circuito Fase 4 (Enterprise)** | `/app/circuito-fase4` | Todos los 25 Módulos completos con IA Copilot [23], Modelos Predictivos [24], Planeación S&OP [25] y Configuración Fiscal [26] |

### Tarea de Simulación en los Circuitos de Fase:
1. Entrar a la ruta del circuito deseado (ej. `/app/circuito-fase1`).
2. Presionar el botón principal **`▶ EJECUTAR FLUJO COMPLETO EN VIVO`** (o presionar paso a paso cada botón de la secuencia).
3. Observar cómo la transacción avanza automáticamente por compras, inventarios, manufactura, facturación, cobro bancario, arqueo y póliza contable en una sola pantalla interactiva.

---

## 🖥️ ESPACIO DE TRABAJO UNIFICADO (WORKSPACE INTEGRADO)
- **Ruta de Acceso:** `https://nytex-erp-portal.onrender.com/app/workspace` (o local `http://localhost:5173/app/workspace`).
- **Ventaja Operativa:** Permite al usuario u operador alternar libremente entre los 25 módulos a través de una barra de pestañas superior persistente sin necesidad de abrir múltiples pestañas del navegador ni perder el contexto de trabajo.
- **Selector de Fase:** Filtra la visualización para mostrar solo los módulos contratados (Fase 1: 7 módulos, Fase 2: 17 módulos, Fase 3: 22 módulos, Fase 4: 25 módulos).
