# -*- coding: utf-8 -*-
"""
Datos Maestros y Procedimientos Operativos: Fase 2 Express (Operación y Cadena Completa)
Módulos: [2] CRM, [4.1] ROP Inteligente, [5] Producción, [6] Business Partners, [7] Logística,
         [10] Tesorería, [11] Activos Fijos, [13] RRHH y [14] Nómina.
"""

FASE2_MODULES = [
    {
        "num": "2",
        "name": "CRM (Embudo de Ventas & Oportunidades)",
        "folder_name": "Modulo 2 NyTEX CRM",
        "phase_label": "Fase 2: Express (Operación y Cadena Completa)",
        "phase_dir": "Fase 2 Express",
        "macro_area": "Área 1: Dirección Comercial",
        "circuit": "Lead-to-Order (L2O)",
        "subtitle": "Gestión del Pipeline Comercial Kanban, Calificación BANT de Oportunidades, Bandeja Omnicanal (WhatsApp/Email), Selección de Despacho (Sala vs Domicilio) y Conversión Ágil a Pedidos en [1] Ventas y [7] Logística",
        "entities": "Leads / Prospectos, Oportunidades (OPP-XXXX), Pipeline Kanban, Actividades de Seguimiento, Calificación BANT, Cotización Kardex y Modalidad de Despacho",
        "routes": "/app/crm, /app/circuito-fase2",
        "interconnections_summary": (
            "• [1] Ventas: Conversión directa con 1 clic de oportunidad ganada en cotización oficial u orden de venta precargada sin recaptura de datos.\n"
            "• [7] Logística y Despachos: Selección y registro del método de entrega acordado con el cliente (Despacho en Sala de Ventas / Retiro en Tienda vs. Entrega a Domicilio). Al ganar la oportunidad y generar el pedido hacia [1] Ventas, se transfieren automáticamente la dirección exacta de entrega, el contacto de recepción, georreferenciación y restricciones de horario para la programación de la ruta de despacho.\n"
            "• [6] Business Partners: Registro automático del nuevo cliente en el catálogo maestro al ganar la oportunidad o enlace con expediente comercial existente.\n"
            "• [3] Inventario: Verificación preliminar de disponibilidad de existencias físicas y reserva de stock para SKUs cotizados en etapas avanzadas del embudo.\n"
            "• [19] Dashboards: Alimentación en tiempo real de métricas de efectividad comercial, velocidad de ventas y pronósticos ponderados de facturación."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [2] en la Prospección y Cierre Comercial",
            "2. El Circuito Lead-to-Order (L2O), la Metodología BANT y Modalidad de Despacho (Sala vs Domicilio)",
            "3. Estructura de Pantallas, Tablero de 6 KPIs en Vivo y Selector de Tres Vistas",
            "4. Procedimiento Operativo N° 1: Captación, Registro, Calificación BANT y Modalidad de Entrega",
            "5. Procedimiento Operativo N° 2: Búsqueda Predictiva de SKUs de Kardex y Estimación de Monto",
            "6. Procedimiento Operativo N° 3: Gestión Visual del Embudo Kanban, Bitácora y Registro de Actividades",
            "7. Procedimiento Operativo N° 4: Bandeja Omnicanal Integrada (WhatsApp, Instagram, Web y Correo)",
            "8. Procedimiento Operativo N° 5: Conversión Directa de Oportunidad Ganada a Orden en [1] Ventas y Despacho en [7] Logística",
            "9. Matriz de Integración con [1] Ventas, [7] Logística, [6] Business Partners y [19] Dashboards",
            "10. Gobernanza del Pipeline, Metas Comerciales y Auditoría de Actividades de Asesores"
        ],
        "executive_summary": (
            "El Módulo [2] NyTEX CRM (Customer Relationship Management) estructura y profesionaliza la gestión integral de prospectos "
            "y oportunidades de negocio de la empresa. Organiza el embudo de ventas en etapas visuales transparentes (Prospecto, "
            "Contacto Inicial, Propuesta Comercial, Negociación y Cierre Ganado/Perdido).\n\n"
            "Evita que las oportunidades se enfríen por falta de seguimiento, centraliza los chats de WhatsApp y correos en una "
            "bandeja unificada, incorpora cotización predictiva de productos desde Kardex y permite pronosticar los ingresos futuros "
            "(Sales Forecast) con datos objetivos en tiempo real."
        ),
        "purpose_detail": (
            "Antes de llegar a una orden de venta formal en Ventas [1], existe un proceso riguroso de maduración del prospecto. El CRM "
            "aplica el estándar de calificación BANT (Presupuesto, Autoridad, Necesidad y Tiempo) para que los vendedores concentren "
            "su energía en prospectos de alto potencial.\n\n"
            "Asimismo, desde la misma oportunidad se define la modalidad de despacho: si el cliente retirará su producto en Sala de Ventas "
            "o si requerirá Entrega a Domicilio, capturando la dirección y contacto para enlazar automáticamente con [7] Logística.\n\n"
            "Al ganarse un trato, el asesor presiona un botón y el sistema transfiere de inmediato todos los datos del cliente, los productos "
            "cotizados y los detalles de entrega directamente a [1] Ventas y [7] Logística sin recapturar información."
        ),
        "without_module_impact": (
            "No contar con el módulo de CRM ocasiona:\n"
            "1. Pérdida masiva de prospectos por falta de seguimiento oportuno en libretas o celulares personales.\n"
            "2. Fuga de clientes al renunciar vendedores que se llevan las carteras de prospectos en sus teléfonos.\n"
            "3. Ceguera de la Dirección Comercial sobre cuántas cotizaciones se pierden y por qué motivos estratégicos.\n"
            "4. Errores y demoras en entregas al no coordinar con anticipación entre ventas y logística si el pedido requiere flete a domicilio.\n"
            "5. Pronósticos de ventas inexactos basados en suposiciones en lugar de probabilidades matemáticas de cierre."
        ),
        "ecosystem_context": (
            "En el circuito comercial global, el CRM es el extremo frontal. Atrae el interés del mercado, lo califica, "
            "lo nutre mediante interacciones registradas, define la modalidad de entrega y lo transfiere listo para facturar a [1] Ventas "
            "y despachar a través de [7] Logística."
        ),
        "circuit_diagram": (
            "+---------------------------------------------------------------------------------------------------------+\n"
            "|                               CIRCUITO OPERATIVO LEAD-TO-ORDER (L2O)                                    |\n"
            "+---------------------------------------------------------------------------------------------------------+\n"
            "|  LEAD ENTRANTE ➔ CALIFICACIÓN BANT ➔ ESTIMACIÓN KARDEX ➔ MODALIDAD ENTREGA ➔ CIERRE GANADO             |\n"
            "|   - WhatsApp/Web        - Presupuesto/Plazo     - SKUs predictivos    - [Sala de Ventas]      - Facturación [1]  |\n"
            "|   - Bandeja Omnicanal   - Scoring Comercial     - Precios de lista    - [Despacho Domicilio] ➔- Ruta Logística[7]|\n"
            "+---------------------------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La consola de CRM (/app/crm) dispone de una barra superior de métricas estratégicas en tiempo real (KPI Comercial CRM) y 3 vistas operativas clave:\n"
            "• Tarjetas KPI en Vivo:\n"
            "  1. [OPORTUNIDADES ABIERTAS]: Conteo de negociaciones activas vivas en el embudo.\n"
            "  2. [VALOR DEL PIPELINE]: Pronóstico ponderado de ventas (Σ Valor Estimado × % Probabilidad Cierre).\n"
            "  3. [TASA DE CIERRE]: Porcentaje de éxito comercial ((Ganadas / Cerradas) × 100, Meta > 35%).\n"
            "  4. [VELOCIDAD DE VENTA]: Sales Cycle, días promedio transcurridos desde el primer contacto hasta el cierre ganado.\n"
            "  5. [TIEMPO DE RESPUESTA A LEADS]: Minutos transcurridos hasta primera interacción del asesor (Meta < 15 min para triplicar conversión).\n"
            "  6. [GANADO ESTE MES]: Monto acumulado de ventas ganadas en el período actual frente a la cuota mensual.\n"
            "• Selector de Tres Vistas Principales:\n"
            "  1. [📌 Tablero Kanban]: Tablero visual interactivo donde las oportunidades se mueven a través de 5 etapas de maduración.\n"
            "  2. [📥 Bandeja Omnicanal]: Centro unificado de mensajería (WhatsApp Business, Instagram Direct, Correo y Web) con filtro 'Solo Pendientes'.\n"
            "  3. [📊 Indicadores: Cotizaciones vs Vendidas (BI)]: Plataforma analítica con pestaña al tope [📦 Por Códigos (SKU)], auditoría de cotizados vs vendidos vs no vendidos y 5 causales de descarte."
        ),
        "kpi_table": {
            "widths": [2.2, 2.2, 2.8],
            "headers": ["KPI Comercial CRM", "Fórmula / Indicador", "Objetivo Estratégico"],
            "data": [
                ["Valor del Pipeline (Pipeline Value)", "Σ Valor Estimado * % Probabilidad Cierre", "Pronóstico ponderado de ventas para los próximos 30-60 días."],
                ["Tasa de Cierre (Win Rate)", "(Oportunidades Ganadas / Total Cerradas) * 100", "Medición de efectividad del equipo de ventas (Meta > 35%)."],
                ["Velocidad de Venta (Sales Cycle)", "Días promedio desde primer contacto hasta cierre ganado", "Reducir el ciclo de venta para acelerar la rotación de capital."],
                ["Tiempo de Respuesta a Leads", "Minutos transcurridos hasta primera interacción", "Atender prospectos en < 15 min para triplicar la conversión."],
                ["Oportunidades Abiertas", "COUNT(Oportunidades activas en el embudo)", "Monitoreo del flujo de negociaciones en seguimiento comercial."],
                ["Ganado este mes", "SUM(Valor órdenes ganadas mes actual)", "Cumplimiento y avance de la cuota de facturación mensual."]
            ]
        },
        "procedures": [
            {
                "title": "Captación, Registro, Calificación BANT y Modalidad de Despacho",
                "callout": {
                    "title": "METODOLOGÍA BANT Y LOGÍSTICA DE ENTREGA EN NYTEX",
                    "text": "Evalúa 4 factores clave: Budget (Presupuesto), Authority (Tomador de decisión), Need (Dolor operativo a resolver) y Timing (Horizonte de compra). Además, define desde el inicio si la cotización contempla Despacho en Sala de Ventas o Entrega a Domicilio hacia [7] Logística.",
                    "bg": "F0FDF4", "border": "10B981"
                },
                "description": (
                    "El asesor registra la oportunidad comercial capturada desde canales digitales o prospección directa:",
                    "1. Acceder a /app/crm y pulsar el botón [+ NUEVA OPORTUNIDAD].\n"
                    "2. Seleccionar si es un cliente existente desde catálogo maestro de [6] Business Partners o registrar nuevo prospecto.\n"
                    "3. Capturar Empresa / Razón Social, Nombre de Contacto, Teléfono, Correo Electrónico y Sucursal asignada.\n"
                    "4. Completar el bloque BANT: calificar Presupuesto, Nivel de Autoridad, Necesidad/Urgencia y Plazo de Adquisición.\n"
                    "5. Definir la Modalidad de Despacho: seleccionar 'Despacho en Sala de Ventas' (retiro en sucursal) o 'Despacho a Domicilio' (capturando dirección exacta, municipio, contacto de recepción y notas para [7] Logística).\n"
                    "6. Presionar [Crear Oportunidad] para posicionar la tarjeta en la columna inicial del embudo Kanban."
                ),
                "steps": [
                    "Pulsar [+ NUEVA OPORTUNIDAD] en el encabezado del Tablero Kanban.",
                    "Vincular con [6] Business Partners o ingresar datos generales del prospecto.",
                    "Calificar los 4 criterios de maduración BANT (Presupuesto, Autoridad, Necesidad, Tiempo).",
                    "Seleccionar la Modalidad de Entrega (Sala de Ventas o Domicilio) con datos de destino.",
                    "Confirmar la creación; el trato ingresa al pipeline con cálculo automático de probabilidad inicial."
                ]
            },
            {
                "title": "Búsqueda Predictiva de SKUs de Kardex y Estimación de Monto",
                "description": (
                    "Para respaldar el valor monetario de la oportunidad con productos reales del catálogo:",
                    "1. En el formulario de la oportunidad o edición de tarjeta, desplegar el buscador predictivo de artículos.\n"
                    "2. Escribir el código SKU o nombre del producto; el sistema consulta en tiempo real las existencias disponibles en [3] Inventario.\n"
                    "3. Indicar las cantidades requeridas; el sistema aplica los precios de lista y calcula subtotales, IVA y total estimado.\n"
                    "4. El monto total de la oportunidad se actualiza automáticamente alimentando las tarjetas de Valor del Pipeline y Forecast."
                ),
                "steps": [
                    "Abrir la oportunidad y posicionarse en la sección 'Cotización de Productos'.",
                    "Escribir las primeras letras del código SKU o nombre en el buscador interactivo.",
                    "Seleccionar el artículo sugerido con su precio unitario de lista.",
                    "Indicar la cantidad solicitada; el sistema verifica existencias en almacenes.",
                    "Guardar la cotización estimada; el monto ponderado impacta el Forecast del CRM."
                ]
            },
            {
                "title": "Gestión Visual del Embudo Kanban y Avance de Etapas con Bitácora",
                "description": (
                    "Conforme avanza la relación comercial, la oportunidad se traslada entre las 5 etapas del embudo:",
                    "• Prospecto ➔ Contacto Inicial ➔ Propuesta Comercial ➔ Negociación ➔ Cierre (Ganada / Perdida).\n"
                    "• Cada avance exige registrar en la bitácora la actividad realizada (Llamada, Reunión, Envío de Muestras, Correo).\n"
                    "• Se audita en tiempo real la Velocidad de Venta (Sales Cycle) y el cumplimiento del SLA de respuesta (< 15 min)."
                ),
                "steps": [
                    "Arrastrar la tarjeta de la oportunidad hacia la siguiente columna del embudo.",
                    "Capturar en el modal emergente el tipo de actividad realizada y los compromisos acordados.",
                    "Programar la fecha y hora del próximo seguimiento en la agenda del vendedor.",
                    "Monitorear los indicadores en vivo en el encabezado del tablero."
                ]
            },
            {
                "title": "Bandeja Omnicanal Integrada (WhatsApp, Instagram, Web y Correo)",
                "description": (
                    "Centraliza en una sola pantalla todos los mensajes entrantes de clientes potenciales:",
                    "1. Ingresar a la pestaña [📥 Bandeja Omnicanal] en el encabezado de /app/crm.\n"
                    "2. Utilizar el filtro por defecto 'Solo Pendientes' para atender prospectos con mayor urgencia y cumplir la meta de Tiempo de Respuesta (< 15 min).\n"
                    "3. Responder vía chat interactivo con plantillas de mensajes rápidos.\n"
                    "4. Con 1 clic, convertir la conversación en una Oportunidad Kanban o resolverla registrando el motivo."
                ),
                "steps": [
                    "Hacer clic en la vista [📥 Bandeja Omnicanal].",
                    "Filtrar por 'Solo Pendientes' para priorizar mensajes sin atender.",
                    "Abrir la conversación, revisar el canal de origen (WhatsApp, Instagram, etc.) y responder al prospecto.",
                    "Pulsar [Convertir a Oportunidad] para ingresar automáticamente al embudo de ventas."
                ]
            },
            {
                "title": "Cierre Ganado, Conversión a Pedido en [1] Ventas y Pase a [7] Logística",
                "description": (
                    "Al aceptar el cliente la cotización final, se activa el cierre formal del circuito Lead-to-Order:",
                    "1. Arrastrar la oportunidad a la etapa 'Ganada' o presionar [Marcar como Ganada].\n"
                    "2. Pulsar el botón de acción [Convertir a Orden en Ventas].\n"
                    "3. El sistema genera de forma autónoma una Orden de Venta en [1] Ventas & Facturación con todos los SKUs, precios y cliente precargados.\n"
                    "4. Si la oportunidad fue clasificada con 'Despacho a Domicilio', se dispara la notificación automática al Módulo [7] Logística & Despachos con la dirección, georreferenciación y contacto de entrega para programación de ruta y flete.\n"
                    "5. Si fue clasificada con 'Sala de Ventas', el pedido queda programado para retiro inmediato en mostrador."
                ),
                "steps": [
                    "Mover la oportunidad a la columna 'Cierre Ganado'.",
                    "Pulsar [Convertir a Orden en Ventas].",
                    "Verificar la orden generada en el Módulo [1] Ventas lista para facturar.",
                    "Comprobar el pase automático a [7] Logística en caso de despacho a domicilio."
                ]
            }
        ],
        "governance_text": (
            "La cartera de prospectos es propiedad patrimonial de la empresa. Ninguna oportunidad puede ser eliminada del sistema; si un negocio no prospera, debe marcarse obligatoriamente como 'Cerrada Perdida' seleccionando uno de los 5 motivos estratégicos de fuga comercial (Precio Alto, Marca, Falta de Existencias, Falta de Crédito o Mal Servicio). Esta disciplina alimenta el Business Intelligence para auditorías de efectividad comercial."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol en CRM", "Permisos Operativos", "Restricciones de Gobernanza"],
            "data": [
                ["Asesor de Ventas", "Crear y Gestionar sus Propias Oportunidades, Bandeja Omnicanal", "No puede ver oportunidades de otros asesores sin previa autorización."],
                ["Supervisor Comercial", "Reasignar Oportunidades, Auditar Bitácora, Aprobar Descuentos", "Supervisa el avance del equipo, cuotas mensuales y cumplimiento de SLAs."],
                ["Director Comercial", "Acceso Total a Forecast, BI de Pérdidas, Configuración de Etapas", "Define cuotas de venta, metas de Win Rate y políticas de comisiones."]
            ]
        },
        "golden_rules": (
            "1. Cero prospectos en el aire: Todo contacto comercial debe capturarse en el CRM en las primeras 2 horas.\n"
            "2. Atención inmediata (< 15 min): Los leads entrantes por WhatsApp o Web deben atenderse dentro de los primeros 15 minutos para triplicar la probabilidad de cierre.\n"
            "3. Definición de entrega desde el origen: Toda oportunidad debe especificar si el cliente retirará en Sala de Ventas o requerirá Despacho a Domicilio para coordinar a tiempo con [7] Logística.\n"
            "4. Motivo de pérdida obligatorio: No se permite archivar negociaciones no concretadas sin catalogar la causa de descarte.\n"
            "5. Bitácora viva: Toda oportunidad activa debe tener una interacción registrada en los últimos 7 días hábiles."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[2] CRM", "Oportunidad Ganada", "[1] Ventas", "Genera orden de venta precargada lista para confirmación de pedido y facturación."],
                ["[2] CRM", "Selección 'Despacho a Domicilio'", "[7] Logística", "Transmite automáticamente la dirección de entrega, contacto y requerimientos de transporte."],
                ["[2] CRM", "Oportunidad Ganada", "[6] Business Partners", "Da de alta al cliente en el catálogo maestro si no existía o actualiza su expediente comercial."],
                ["[2] CRM", "Etapa de Negociación", "[3] Inventario", "Verificación de existencias en almacenes para validar factibilidad de despacho inmediato."],
                ["[2] CRM", "Actualización de Etapas", "[19] Dashboards", "Actualiza en vivo el embudo visual, velocidad de ventas y el forecast ponderado."]
            ]
        }
    },
    {
        "num": "4.1",
        "name": "ROP Inteligente (Punto de Reorden & Reabastecimiento)",
        "folder_name": "Modulo 4.1 NyTEX ROP Inteligente",
        "phase_label": "Fase 2: Express (Operación y Cadena Completa)",
        "phase_dir": "Fase 2 Express",
        "macro_area": "Área 2: Cadena de Suministro",
        "circuit": "Demand-Driven Replenishment (DDR)",
        "subtitle": "Algoritmos Dinámicos de Stock de Seguridad, Cálculo Automático de ROP según Lead Time y Variabilidad, Semáforo de Criticidad y Disparo Preventivo de Requisiciones",
        "entities": "Puntos de Reorden (ROP), Stocks de Seguridad Dinámicos, Tiempos de Entrega (Lead Time), Consumo Promedio Diario y Órdenes Sugeridas",
        "routes": "/app/reabastecimiento, /app/circuito-fase2",
        "interconnections_summary": (
            "• [3] Inventario: Monitoreo continuo de existencias físicas y reservas comprometidas.\n"
            "• [4] Compras: Generación autónoma de requisiciones y órdenes de compra sugeridas con un solo clic.\n"
            "• [24] Modelos Predictivos: Integración de pronósticos estacionales de demanda para ajustar el ROP.\n"
            "• [25] Planeación S&OP: Sincronización con el plan maestro de producción y compras a mediano plazo."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [4.1] ROP Inteligente",
            "2. Fundamentos Matemáticos: ROP = (Demanda Diaria * Lead Time) + Stock de Seguridad",
            "3. Estructura de Pantallas, Semáforo de Riesgo de Desabasto y Tablero de Control",
            "4. Procedimiento Operativo N° 1: Parametrización de Artículos Críticos y Lead Times de Proveedor",
            "5. Procedimiento Operativo N° 2: Auditoría del Semáforo de Inventarios (Rojo, Amarillo, Verde)",
            "6. Procedimiento Operativo N° 3: Generación y Disparo con 1 Clic de Órdenes de Compra Sugeridas",
            "7. Procedimiento Operativo N° 4: Ajuste Estacional y Amortiguación de Volatilidad de Demanda",
            "8. Procedimiento Operativo N° 5: Reporte de Eficiencia de Reabastecimiento y Capital Optimizado",
            "9. Matriz de Integración con [3] Inventario, [4] Compras y [25] Planeación S&OP",
            "10. Gobernanza de Compras Automatizadas, Umbrales de Autorización y Mejores Prácticas"
        ],
        "executive_summary": (
            "El Módulo [4.1] NyTEX ROP Inteligente (Reabastecimiento Dinámico) sustituye las hojas de cálculo manuales y la intuición "
            "por algoritmos matemáticos que determinan exactamente CUÁNDO y CUÁNTO comprar de cada producto.\n\n"
            "Monitorea segundo a segundo las salidas de almacén, calcula el consumo diario real y el tiempo de respuesta del proveedor, "
            "disparando alertas automáticas antes de que ocurra una rotura de stock que detenga las ventas o la fábrica."
        ),
        "purpose_detail": (
            "El mayor dilema de inventarios es no tener producto para vender (rotura) o tener demasiado capital inmovilizado "
            "(sobrestock). El algoritmo de ROP Inteligente ajusta dinámicamente el Punto de Pedido:\n\n"
            "ROP = (Consumo Promedio Diario x Tiempo de Entrega del Proveedor en Días) + Stock de Seguridad.\n\n"
            "Cuando la existencia disponible desciende hasta el umbral de ROP, el sistema genera de forma autónoma una Orden de Compra "
            "Sugerida en [4] Compras, permitiendo que el comprador la apruebe con un solo clic."
        ),
        "without_module_impact": (
            "Operar sin ROP Inteligente provoca:\n"
            "1. Roturas de stock recurrentes en los productos más vendidos, perdiendo ingresos y clientes.\n"
            "2. Bodegas saturadas con mercancía obsoleta de baja rotación por compras a ciegas.\n"
            "3. Compras apresuradas de pánico con sobrecostos de fletes aéreos o recargos de proveedores.\n"
            "4. Estrés operativo permanente en los departamentos de compras y almacén apagando incendios."
        ),
        "ecosystem_context": (
            "En la Cadena de Suministro Express, el ROP Inteligente actúa como el centinela predictivo entre [3] Inventario y [4] Compras, "
            "garantizando un flujo continuo de insumos y productos terminados con la mínima inversión posible."
        ),
        "circuit_diagram": (
            "+-----------------------------------------------------------------------------------------+\n"
            "|                     CIRCUITO DE REABASTECIMIENTO DINÁMICO                               |\n"
            "+-----------------------------------------------------------------------------------------+\n"
            "|  [3] SALIDAS DE STOCK ➔ [4.1] MOTOR ROP ➔ [4.1] SEMÁFORO CRÍTICO ➔ [4] COMPRA SUGERIDA |\n"
            "|   - Ventas cotidianas       - Calcula D = Consumo/día   - Rojo: Debajo de ROP   - Orden generada|\n"
            "|   - Despachos en piso       - Evalúa Lead Time (LT)     - Amarillo: Preventivo  - Aprobación 1-clic\n"
            "+-----------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La pantalla (/app/reabastecimiento) despliega una matriz de decisión: Tarjetas KPI de SKUs en Riesgo Crítico, "
            "Capital Requerido para Reabastecer ($), Tasa de Disponibilidad Inmediata (%) y Días Promedio de Cobertura. "
            "La tabla clasifica productos por colores (Rojo: Reorden Urgente, Amarillo: Reorden Preventivo, Verde: Nivel Óptimo)."
        ),
        "kpi_table": {
            "widths": [2.2, 1.8, 2.5],
            "headers": ["KPI de ROP", "Fórmula / Indicador", "Objetivo Operativo"],
            "data": [
                ["Nivel de Servicio (OTIF Stock)", "(Demandas Satisfechas sin Faltante / Total) * 100", "Meta superior al 98.5% en productos estratégicos"],
                ["Reducción de Capital Inmovilizado", "Σ Valor de Sobrestock Eliminado", "Liberar liquidez reduciendo inventarios innecesarios"],
                ["SKUs en Nivel Rojo", "Count(SKU donde Stock <= ROP)", "Monitoreo de artículos con riesgo inminente de agotamiento"],
                ["Precisión de Lead Time", "(Días Reales de Entrega / Días Teóricos) * 100", "Auditoría de cumplimiento de tiempos del proveedor"]
            ]
        },
        "procedures": [
            {
                "title": "Configuración de Parámetros ROP y Lead Time por SKU",
                "callout": {
                    "title": "PARÁMETROS MATEMÁTICOS DEL MODELO",
                    "text": "Cada SKU cuenta con su Lead Time en días y su nivel de servicio deseado (ej: 95% o 99%). El sistema calcula la desviación estándar de la demanda.",
                    "bg": "F0FDF4", "border": "10B981"
                },
                "description": (
                    "Se parametrizan los datos de reabastecimiento en la ficha del producto."
                ),
                "steps": [
                    "Ingresar a la consola de ROP Inteligente y abrir la ficha del SKU a configurar.",
                    "Definir el Lead Time del Proveedor Principal (ej: 14 días).",
                    "Seleccionar el Nivel de Confianza de Stock de Seguridad (Factor Z: 1.65 para 95%, 2.33 para 99%).",
                    "Establecer el Lote Mínimo de Compra (MOQ) impuesto por el fabricante.",
                    "Presionar [Calcular Umbrales Automáticos]. El sistema fija el Punto de Pedido y Stock Máximo."
                ]
            },
            {
                "title": "Disparo Automático de Órdenes de Compra Sugeridas",
                "description": (
                    "Mecanismo de generación ágil de órdenes para evitar desabastos:",
                    "• El sistema agrupa todos los artículos en semáforo rojo del mismo proveedor.\n"
                    "• Calcula la cantidad exacta a pedir para alcanzar el Stock Máximo Óptimo.\n"
                    "• El comprador presiona [Disparar Órdenes a Compras] y la orden se crea lista para autorización en [4]."
                ),
                "steps": [
                    "Filtrar la tabla de reabastecimiento por estado [🔴 Rojo - Crítico].",
                    "Revisar las cantidades sugeridas calculadas por el algoritmo.",
                    "Marcar los artículos y hacer clic en el botón superior [⚡ Generar Órdenes de Compra Sugeridas].",
                    "El sistema crea automáticamente las Órdenes de Compra en estado 'Borrador' en el Módulo [4] Compras.",
                    "El comprador recibe la notificación para revisión y envío inmediato al proveedor."
                ]
            }
        ],
        "governance_text": (
            "El sistema de ROP automatiza la sugerencia pero no el compromiso financiero. Todo pedido sugerido debe contar con "
            "la validación del comprador y la aprobación del Gerente de Cadena de Suministro antes de enviarse al proveedor."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol Operativo", "Permisos en ROP", "Gobernanza"],
            "data": [
                ["Analista de Cadena de Suministro", "Monitorear Semáforo, Disparar Sugerencias", "No puede alterar algoritmos de cálculo base."],
                ["Jefe de Compras", "Aprobar Órdenes Sugeridas en [4]", "Valida presupuesto disponible antes de confirmar."],
                ["Director de Operaciones", "Modificar Factores Z de Stock de Seguridad", "Autoriza cambios en las políticas de inventario de la empresa."]
            ]
        },
        "golden_rules": (
            "1. Revisión diaria del semáforo: El tablero de ROP debe auditarse a primera hora cada mañana.\n"
            "2. Actualización de Lead Times: Si un proveedor cambia sus tiempos de entrega, debe actualizarse en el sistema de inmediato.\n"
            "3. Lotes mínimos respetados: Las órdenes sugeridas deben alinearse con los empaques maestros o pallets del fabricante."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[3] Inventario", "Stock desciende de ROP", "[4.1] ROP Inteligente", "Cambia semáforo a Rojo y activa propuesta de compra."],
                ["[4.1] ROP Inteligente", "Disparar Sugerencia", "[4] Compras", "Crea Orden de Compra precargada con proveedor y cantidades."],
                ["[24] Modelos Predictivos", "Proyección de Demanda", "[4.1] ROP Inteligente", "Ajusta preventivamente el ROP ante alzas estacionales."]
            ]
        }
    },
    {
        "num": "5",
        "name": "Producción y Manufactura",
        "folder_name": "Modulo 5 NyTEX Produccion",
        "phase_label": "Fase 2: Express (Operación y Cadena Completa)",
        "phase_dir": "Fase 2 Express",
        "macro_area": "Área 3: Producción y Operaciones",
        "circuit": "Plan-to-Produce (P2P / Manufactura)",
        "subtitle": "Gestión Integral de Órdenes de Producción (OP), Listas de Materiales (BOM / Recetas), Control de Fases de Planta, Consumo de Insumos y Liquidación de Producto Terminado",
        "entities": "Órdenes de Producción (OP-XXXX), Listas de Materiales (BOM), Centros de Trabajo, Hojas de Ruta y Liquidaciones de Costo",
        "routes": "/app/produccion, /app/circuito-fase2",
        "interconnections_summary": (
            "• [3] Inventario: Descuento inmediato de materias primas e ingreso de producto terminado valorizado.\n"
            "• [11] Activos Fijos: Registro de depreciación por horas de uso de maquinaria industrial de planta.\n"
            "• [14] Nómina: Asignación de costo de mano de obra directa (MOD) a las órdenes de fabricación.\n"
            "• [12] Contabilidad: Póliza de costo de manufactura (Inventario Materia Prima ➔ En Proceso ➔ Terminado)."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [5] en la Transformación Industrial",
            "2. Estructura de la Lista de Materiales (BOM / Escandallo) y Rutas de Producción",
            "3. Estructura de Pantallas, Vistas de Planta y Tablero de Control de Piso",
            "4. Procedimiento Operativo N° 1: Creación y Parametrización de Recetas Maestras (BOM)",
            "5. Procedimiento Operativo N° 2: Programación y Emisión de Órdenes de Producción (OP)",
            "6. Procedimiento Operativo N° 3: Liberación de Orden y Explosión de Insumos en Almacén",
            "7. Procedimiento Operativo N° 4: Registro de Tiempos de Maquinaria y Mano de Obra en Planta",
            "8. Procedimiento Operativo N° 5: Cierre, Liquidación de Costos e Ingreso de Producto Terminado",
            "9. Matriz de Integración con [3] Inventario, [11] Activos Fijos, [14] Nómina y [12] Contabilidad",
            "10. Seguridad Industrial, Control de Calidad en Piso y Reducción de Mermas de Producción"
        ],
        "executive_summary": (
            "El Módulo [5] NyTEX Producción y Manufactura transforma materias primas e insumos en productos terminados con "
            "control exacto de cantidades, mermas y costos de fabricación. Administra las Listas de Materiales (BOM o Recetas), "
            "programa las órdenes de trabajo en planta y supervisa el avance en cada estación o centro de maquinado.\n\n"
            "Garantiza el cálculo real del costo unitario integrando la materia prima consumida, la mano de obra aplicada y los "
            "costos indirectos de fabricación (CIF)."
        ),
        "purpose_detail": (
            "Sin control de manufactura, las fábricas desconocen cuánto cuesta realmente producir cada lote y sufren de desabasto "
            "de insumos en mitad de la producción. NyTEX Producción efectúa la 'explosión de materiales' al programar una orden, "
            "verificando que existan todos los componentes en [3] Inventario antes de arrancar las máquinas.\n\n"
            "Al finalizar la producción, descuenta de forma automática los insumos del almacén, da entrada formal al producto terminado "
            "y genera la póliza contable de capitalización en [12] Contabilidad."
        ),
        "without_module_impact": (
            "La falta de un sistema de manufactura integrado ocasiona:\n"
            "1. Desconocimiento del costo real unitario de producción, vendiendo productos con pérdida oculta.\n"
            "2. Paros de línea continuos por falta de un componente menor que nadie previó comprar.\n"
            "3. Fugas masivas de materias primas por falta de cotejo entre consumo teórico y consumo real.\n"
            "4. Incumplimiento de fechas de entrega prometidas a los clientes por falta de programación de planta."
        ),
        "ecosystem_context": (
            "En el flujo industrial de NyTEX, Producción se abastece de Compras e Inventarios, utiliza los activos de planta, "
            "incorpora la mano de obra de RRHH y entrega artículos listos para la venta a WMS y Distribución."
        ),
        "circuit_diagram": (
            "+-----------------------------------------------------------------------------------------+\n"
            "|                     CIRCUITO OPERATIVO PLAN-TO-PRODUCE (P2P)                            |\n"
            "+-----------------------------------------------------------------------------------------+\n"
            "|  RECETA BOM ➔ [5] ORDEN PRODUCCIÓN ➔ [3] CONSUMO INSUMOS ➔ [5] CIERRE PRODUCTO TERMINADO |\n"
            "|   - Insumos y proporciones  - Explosión de materiales  - Descargo automático     - Alta SKU Terminado|\n"
            "|   - Tiempos de máquina      - Programación de piso     - Mano de obra y CIF      - Póliza de Costo  |\n"
            "+-----------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La pantalla de Producción (/app/produccion) ofrece un tablero de piso con Órdenes en Proceso, Eficiencia Global de "
            "Equipos (OEE), Cumplimiento del Programa (%) y Consumo de Materiales. Permite alternar entre vista de lista, diagrama de "
            "Gantt de máquinas y catálogo de Listas de Materiales (BOM)."
        ),
        "kpi_table": {
            "widths": [2.2, 1.8, 2.5],
            "headers": ["KPI de Manufactura", "Fórmula / Indicador", "Objetivo Industrial"],
            "data": [
                ["Eficiencia Global OEE", "Disponibilidad * Rendimiento * Calidad", "Estándar industrial: OEE superior al 85% en líneas principales"],
                ["Variación de Costo de Fabricación", "Costo Real de Orden vs Costo Estándar BOM", "Identificación y control de sobrecostos e ineficiencias"],
                ["Rendimiento de Materia Prima (Yield)", "(Materia Prima en Producto / Materia Prima Consumida) * 100", "Minimizar desperdicios y mermas en los procesos de corte o ensamble"],
                ["Cumplimiento del Programa (PPC)", "(Órdenes Terminadas a Tiempo / Órdenes Programadas) * 100", "Asegurar disponibilidad para entregas comprometidas en ventas"]
            ]
        },
        "procedures": [
            {
                "title": "Configuración de Lista de Materiales (BOM / Receta)",
                "callout": {
                    "title": "ESTRUCTURA DE ESCANDALLO",
                    "text": "La receta especifica los insumos exactos para 1 unidad base de producto terminado, incluyendo porcentaje de merma técnica tolerada.",
                    "bg": "F0FDF4", "border": "10B981"
                },
                "description": (
                    "Se parametriza la fórmula industrial con componentes, cantidades y tiempos requeridos."
                ),
                "steps": [
                    "Hacer clic en [+ NUEVA RECETA / BOM] en el menú de manufactura.",
                    "Seleccionar el Producto Terminado que se va a fabricar.",
                    "Agregar cada una de las materias primas con su cantidad unitaria y factor de desperdicio estimado.",
                    "Definir el Centro de Trabajo (línea de producción, maquinaria) y tiempo estándar de maquinado en horas.",
                    "Asignar costo estimado de mano de obra directa y CIF.",
                    "Guardar la receta con estatus 'Activa'."
                ]
            },
            {
                "title": "Programación, Ejecución y Liquidación de Orden (OP)",
                "description": (
                    "Ciclo de vida de una orden en planta desde su apertura hasta la entrega:",
                    "• Emisión de la OP indicando cantidad a fabricar y fecha límite.\n"
                    "• Explosión y reserva de materia prima en [3] Inventario.\n"
                    "• Inicio de fabricación en piso y captura de horas reales.\n"
                    "• Liquidación final: alta del producto terminado y contabilización del costo de manufactura."
                ),
                "steps": [
                    "Hacer clic en [+ NUEVA ORDEN DE PRODUCCIÓN].",
                    "Elegir el producto y la cantidad a fabricar (ej: 500 piezas).",
                    "El sistema verifica existencias de insumos y reserva el material en bodega.",
                    "Al iniciar trabajos en planta, el supervisor presiona [▶ Iniciar Fabricación]. El estado cambia a 'En Proceso'.",
                    "Al concluir la jornada de ensamble, se captura la cantidad real obtenida y las unidades defectuosas.",
                    "Hacer clic en [Finalizar y Liquidar Orden]. Se descargan las materias primas de Kardex, se ingresan las piezas terminadas y se emite la póliza en [12]."
                ]
            }
        ],
        "governance_text": (
            "Cierre riguroso de órdenes: Ninguna orden puede liquidarse con discrepancias de material no justificadas. Los reportes "
            "de unidades defectuosas o reprocesos requieren inspección y visto bueno formal del área de Control de Calidad."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol en Planta", "Permisos Operativos", "Restricciones de Gobernanza"],
            "data": [
                ["Operario de Maquinaria", "Registrar Avance de Piezas y Horas de Máquina", "No puede cerrar órdenes ni alterar consumos de materiales."],
                ["Supervisor de Producción", "Liberar Órdenes, Registrar Mermas de Proceso", "Responsable del cumplimiento físico del programa."],
                ["Ingeniero de Manufactura", "Crear y Modificar Listas de Materiales (BOM)", "Audita fórmulas y optimiza tiempos de maquinado."],
                ["Contador de Costos", "Auditar Liquidaciones y Asientos de Fabricación", "Verifica cuadre entre costos estándar y costos reales."]
            ]
        },
        "golden_rules": (
            "1. Explosión previa obligatoria: Prohibido arrancar una OP sin confirmación de existencia física de todos los insumos.\n"
            "2. Registro estricto de mermas: Todo insumo dañado en máquina debe registrarse con motivo para no desfasar el Kardex.\n"
            "3. Cuadre de órdenes: Cada orden cerrada debe tener saldo cero en la cuenta de inventario en proceso."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[5] Producción", "Liberar Orden (OP)", "[3] Inventario", "Reserva materias primas en almacén; bloquea su venta o traslado."],
                ["[5] Producción", "Liquidar Orden", "[3] Inventario", "Descarga insumos consumidos e ingresa producto terminado a stock."],
                ["[5] Producción", "Liquidar Orden", "[12] Contabilidad", "Póliza de Costo: Cargo Inventario Terminado, Abono Inventario Materia Prima y MOD."],
                ["[5] Producción", "Horas de Maquinaria", "[11] Activos Fijos", "Registra desgaste para depreciación por unidades producidas."]
            ]
        }
    },
    {
        "num": "6",
        "name": "Business Partners (Socios de Negocio)",
        "folder_name": "Modulo 6 NyTEX Business Partners",
        "phase_label": "Fase 2: Express (Operación y Cadena Completa)",
        "phase_dir": "Fase 2 Express",
        "macro_area": "Área 7: Gobernanza y TI",
        "circuit": "Master Data Management (MDM)",
        "subtitle": "Gestión Centralizada de Datos Maestros de Terceros: Ficha Única para Clientes, Proveedores, Acreedores y Transportistas, Evaluación Crediticia y Cumplimiento Fiscal",
        "entities": "Fichas de Socios (BP-XXXX), Identificadores Fiscales (NIT/RFC/RUT), Direcciones de Entrega, Límites de Crédito y Listas de Precios",
        "routes": "/app/business-partners, /app/circuito-fase2",
        "interconnections_summary": (
            "• [1] Ventas: Consulta de condiciones comerciales, listas de precios y bloqueo por morosidad.\n"
            "• [4] Compras: Directorio de proveedores homologados, cuentas bancarias para transferencias y términos de crédito.\n"
            "• [7] Logística: Directorio de transportistas externos, placas vehiculares y datos patronales de conductores.\n"
            "• [8/9] Finanzas (CxC/CxP): Concentración transversal de saldos de clientes y proveedores en una ficha unificada."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [6] en la Gobernanza de Datos Maestros",
            "2. La Arquitectura MDM de NyTEX: Ficha Única Transversal vs Bases de Datos Separadas",
            "3. Estructura de Pantallas, Clasificación de Socios y Filtros de Búsqueda",
            "4. Procedimiento Operativo N° 1: Alta de Nuevo Socio de Negocios y Validación de Identificador Fiscal",
            "5. Procedimiento Operativo N° 2: Configuración de Roles Duales (Empresas que son Clientes y Proveedores a la vez)",
            "6. Procedimiento Operativo N° 3: Asignación de Límites de Crédito, Días de Gracia y Condiciones de Pago",
            "7. Procedimiento Operativo N° 4: Administración de Múltiples Direcciones de Entrega y Sucursales",
            "8. Procedimiento Operativo N° 5: Bloqueo Preventivo, Auditoría de Documentos y Lista Negra de Riesgo",
            "9. Matriz de Integración con [1] Ventas, [4] Compras, [7] Logística y [8/9] Finanzas",
            "10. Cumplimiento Normativo (KYC / PLAFT), Integridad de Datos y Segregación de Funciones"
        ],
        "executive_summary": (
            "El Módulo [6] NyTEX Business Partners es el sistema central de Gestión de Datos Maestros (Master Data Management - MDM). "
            "Resuelve uno de los problemas históricos más graves del software empresarial: la duplicidad y fragmentación de información "
            "entre clientes, proveedores y acreedores en bases de datos desconectadas.\n\n"
            "Permite administrar una ficha única transversal para cada entidad con la que interactúa la empresa, controlando "
            "sus datos fiscales, cuentas bancarias, límites crediticios y sucursales en un solo lugar con impacto inmediato en todo el ERP."
        ),
        "purpose_detail": (
            "¿Qué ocurre cuando una empresa nos compra productos pero al mismo tiempo nos suministra insumos o fletes? En sistemas "
            "tradicionales se crea dos veces, dificultando la compensación de cuentas o el control de riesgos.\n\n"
            "NyTEX Business Partners asigna un código único al socio (ej: BP-2004) y le asigna roles ('Cliente', 'Proveedor', 'Transportista'). "
            "Si el cliente cambia de dirección fiscal o número telefónico, se actualiza en este módulo e impacta en milisegundos a Ventas, "
            "Compras, Logística, Facturación y Cuentas por Pagar sin recapturas."
        ),
        "without_module_impact": (
            "Prescindir del catálogo central de Business Partners provoca:\n"
            "1. Bases de datos corrompidas con clientes registrados múltiples veces con nombres ligeramente distintos.\n"
            "2. Errores graves en facturación electrónica por datos fiscales desactualizados o incompletos.\n"
            "3. Imposibilidad de conciliar deudas cruzadas con empresas que son clientes y proveedores a la vez.\n"
            "4. Riesgo de fraude al capturar cuentas bancarias erróneas para pagos de tesorería sin validación previa."
        ),
        "ecosystem_context": (
            "Como núcleo maestro del ERP, Business Partners alimenta a toda la cadena transaccional. Sin él, ningún módulo "
            "comercial, operativo o financiero puede emitir documentos válidos hacia terceros."
        ),
        "circuit_diagram": (
            "+-----------------------------------------------------------------------------------------+\n"
            "|                     ARQUITECTURA DE DATOS MAESTROS (MDM)                                |\n"
            "+-----------------------------------------------------------------------------------------+\n"
            "|                          [6] FICHA CENTRAL BUSINESS PARTNER                             |\n"
            "|                 (Razón Social, ID Fiscal, Direcciones, Cuentas Bancarias)               |\n"
            "|                   /                        |                       \\                    |\n"
            "|      [1] ROL CLIENTE               [4] ROL PROVEEDOR          [7] ROL TRANSPORTISTA     |\n"
            "|   (Precios, Crédito, Ventas)      (Términos, Compras, CxP)      (Placas, Choferes, Guías) |\n"
            "+-----------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La consola de Business Partners (/app/business-partners) presenta tarjetas métricas: Total Socios Registrados, "
            "Clientes Activos, Proveedores Homologados y Socios con Crédito Otorgado ($). Incluye buscador dinámico con filtros por "
            "tipo de socio (Cliente, Proveedor, Transportista, Acreedor), estado (Activo, Bloqueado) y nivel de riesgo."
        ),
        "kpi_table": {
            "widths": [2.2, 1.8, 2.5],
            "headers": ["Métrica de Socios", "Fórmula / Indicador", "Objetivo de Gobernanza"],
            "data": [
                ["Índice de Duplicidad de Datos", "Count(Registros con Mismo ID Fiscal) - Únicos", "Meta 0% de duplicados en el maestro de terceros"],
                ["Socios con Expediente Completo", "(Socios con Documentación / Total Socios) * 100", "Cumplimiento normativo y fiscal (Meta > 95%)"],
                ["Líneas de Crédito Auditadas", "Σ Crédito Otorgado vs Evaluaciones Financieras", "Control del riesgo crediticio global asumido por la empresa"],
                ["Tiempo de Homologación de Proveedor", "Días desde solicitud hasta aprobación de expediente", "Agilidad en la incorporación de nuevos aliados comerciales"]
            ]
        },
        "procedures": [
            {
                "title": "Alta y Homologación de Nuevo Socio de Negocios",
                "callout": {
                    "title": "VALIDACIÓN FISCAL EN LÍNEA",
                    "text": "Al ingresar el identificador fiscal (RFC/NIT/RUT), el sistema valida automáticamente la estructura del documento y previene registros duplicados.",
                    "bg": "F0FDF4", "border": "10B981"
                },
                "description": (
                    "Se registra la información jurídica, comercial y bancaria del nuevo socio."
                ),
                "steps": [
                    "Hacer clic en [+ NUEVO BUSINESS PARTNER].",
                    "Seleccionar el Tipo de Persona: Jurídica / Empresa o Natural / Física.",
                    "Ingresar Razón Social, Nombre Comercial y Número de Identificación Tributaria.",
                    "Marcar los roles que desempeña: [x] Cliente, [x] Proveedor, [ ] Transportista.",
                    "Capturar la Dirección Fiscal principal y las Direcciones de Entrega secundarias.",
                    "Ingresar cuentas bancarias para pagos o transferencias y condiciones comerciales.",
                    "Presionar [Guardar y Homologar Socio]. El registro queda activo para operaciones en todo el ERP."
                ]
            },
            {
                "title": "Configuración de Límites de Crédito y Cobranza Cruzada",
                "description": (
                    "Administración de las condiciones financieras otorgadas al socio:",
                    "• Asignación de cupo máximo de crédito autorizado en dólares o moneda local.\n"
                    "• Definición de días de plazo (15, 30, 60 días) y lista de precios preferencial.\n"
                    "• En socios duales (Cliente/Proveedor), activación de la casilla de compensación de saldos en Finanzas."
                ),
                "steps": [
                    "Abrir la ficha del socio y entrar a la pestaña [Crédito y Finanzas].",
                    "Ingresar el Límite de Crédito Autorizado (ej: $50,000.00) avalado por el comité de riesgos.",
                    "Seleccionar los Términos de Pago y la Lista de Precios que se le aplicará en Ventas.",
                    "Si el socio es también proveedor, marcar [Permitir Compensación de Cartera].",
                    "Presionar [Guardar Parámetros Financieros]."
                ]
            }
        ],
        "governance_text": (
            "Para evitar desvíos y fraudes con cuentas bancarias, solo los usuarios con rol de Oficial de Cumplimiento o Gerente de "
            "Finanzas pueden modificar los datos bancarios o fiscales de un socio de negocio. Cada cambio genera una alerta de auditoría."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol en Datos Maestros", "Permisos Operativos", "Restricciones de Gobernanza"],
            "data": [
                ["Asistente de Registro", "Capturar Datos Básicos de Prospectos y Socios", "No puede autorizar crédito ni modificar cuentas bancarias."],
                ["Oficial de Cumplimiento", "Validar Documentos Fiscales y KYC", "Certifica la autenticidad jurídica del tercero."],
                ["Gerente de Finanzas", "Fijar Límites de Crédito y Cuentas Bancarias", "Único facultado para habilitar compras a crédito y transferencias."],
                ["Auditor Interno", "Consulta de Trazabilidad y Modificaciones", "Inspecciona bitácora histórica de cambios en fichas de socios."]
            ]
        },
        "golden_rules": (
            "1. Un socio, un solo registro: Prohibido crear fichas duplicadas bajo variantes del mismo nombre o razón social.\n"
            "2. Validación bancaria estricta: Toda cuenta de depósito a proveedor debe respaldarse con estado de cuenta oficial verificado.\n"
            "3. Bloqueo inmediato ante sospecha: El sistema permite marcar un socio en 'Lista de Observación' congelando transacciones."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[6] Business Partners", "Actualización Fiscal", "[1] Ventas", "Aplica nuevos datos en timbrado de facturas DTE."],
                ["[6] Business Partners", "Actualización de Crédito", "[8] CxC", "Modifica el límite disponible y cálculo de riesgo del cliente."],
                ["[6] Business Partners", "Bloqueo por Riesgo", "[1] y [4]", "Impide levantar órdenes de venta o emitir compras al socio."]
            ]
        }
    },
    {
        "num": "7",
        "name": "Logística y Despachos",
        "folder_name": "Modulo 7 NyTEX Logistica",
        "phase_label": "Fase 2: Express (Operación y Cadena Completa)",
        "phase_dir": "Fase 2 Express",
        "macro_area": "Área 2: Cadena de Suministro",
        "circuit": "Order-to-Delivery (O2D)",
        "subtitle": "Gestión Integral de Envíos, Tráfico Troncal, Rutas de Última Milla, Carta Porte Digital, Tracking en Tiempo Real e Integración Nativa con WMS [17] y CxC [8]",
        "entities": "Guías de Despacho (TRK-NYT-XXXX), Cartas Porte Digitales, Manifiestos de Carga, Unidades Vehiculares y Choferes",
        "routes": "/app/logistica, /app/circuito-fase2",
        "interconnections_summary": (
            "• [17] WMS: Recepción directa de bultos embalados en rampa tras completar picking y packing.\n"
            "• [1] Ventas: Notificación de entrega confirmada y actualización de estado de pedido.\n"
            "• [8] CxC: Habilitación de la exigibilidad de crédito una vez asentado el acuse de recibo firmado.\n"
            "• [12] Contabilidad: Póliza de gastos de transporte, fletes y viáticos de distribución."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [7] en la Distribución Física",
            "2. Ciclo de Vida del Envío: Matriz de los 4 Estados Operativos (Programado, Tránsito, Reparto, Entregado)",
            "3. Estructura de Pantallas, Tablero de Control de Flota y Tarjetas KPI de Envíos",
            "4. Procedimiento Operativo N° 1: Traspaso desde WMS [17] y Generación Automática de Guía",
            "5. Procedimiento Operativo N° 2: Asignación de Unidad, Operador y Despacho a Ruta Troncal",
            "6. Procedimiento Operativo N° 3: Control de Llegada a Zona de Distribución y Reparto de Última Milla",
            "7. Procedimiento Operativo N° 4: Confirmación de Entrega Física, Acuse Digital y Cierre",
            "8. Procedimiento Operativo N° 5: Emisión y Auditoría de la Carta Porte Digital Obligatoria",
            "9. Matriz de Integración con [17] WMS, [1] Ventas, [8] CxC y [12] Contabilidad",
            "10. Seguridad en Ruta, Custodia de Mercancía, Gestión de Siniestros y Mejores Prácticas"
        ],
        "executive_summary": (
            "El Módulo [7] NyTEX Logística y Despachos coordina y certifica el transporte físico de mercancías desde las bahías "
            "del almacén hasta las instalaciones del cliente. Proporciona visibilidad en tiempo real mediante códigos de seguimiento "
            "únicos (TRK-NYT-XXXX), optimiza las rutas de reparto y asegura el cumplimiento fiscal con Cartas Porte Digitales.\n\n"
            "Garantiza que la venta concluya formalmente con un acuse de recibo firmado, habilitando el cobro inmediato en [8] CxC."
        ),
        "purpose_detail": (
            "Una venta no termina cuando se imprime la factura, sino cuando el cliente recibe satisfactoriamente sus productos. "
            "El Módulo [7] elimina las llamadas constantes a choferes para saber dónde está la carga, proporcionando un mapa de "
            "seguimiento satelital y tiempos estimados de llegada (ETA).\n\n"
            "Al entregar la mercancía, el chofer captura la firma digital o fotografía del acuse en la aplicación móvil, actualizando "
            "el sistema instantáneamente y notificando al cliente por correo y WhatsApp."
        ),
        "without_module_impact": (
            "Operar sin módulo de logística provoca:\n"
            "1. Desconocimiento total de la ubicación de los pedidos una vez que salen del almacén.\n"
            "2. Retrasos en cobranza: CxC no puede exigir el pago porque el cliente alega no haber recibido la mercancía.\n"
            "3. Pérdida o robo de bultos en ruta sin poder determinar el responsable de la custodia.\n"
            "4. Multas fiscales cuantiosas por transportar mercancías en carreteras sin Carta Porte Digital válida."
        ),
        "ecosystem_context": (
            "En el circuito Order-to-Delivery, Logística enlaza la preparación física de WMS con la confirmación de recepción del "
            "cliente, activando la etapa final de cobranza y liquidación contable."
        ),
        "circuit_diagram": (
            "+-----------------------------------------------------------------------------------------+\n"
            "|                     CIRCUITO OPERATIVO ORDER-TO-DELIVERY (O2D)                          |\n"
            "+-----------------------------------------------------------------------------------------+\n"
            "|  [17] WMS PACKING ➔ [7] RUTA TRONCAL ➔ [7] ÚLTIMA MILLA ➔ [7] ACUSE DIGITAL ➔ [8] COBRO |\n"
            "|   - Bulto etiquetado        - Asignación chofer    - Tráfico local         - Firma cliente     |\n"
            "|   - Guía TRK-XXXX           - Carta Porte digital  - Notificación ETA      - CxC Exigible      |\n"
            "+-----------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La pantalla de Logística (/app/logistica) despliega métricas en vivo: Envíos Activos, Cumplimiento de Entrega OTIF (%), "
            "Tiempo Promedio de Tránsito y Eficiencia de Ruta. Presenta una tabla con filtros por estado: Programado, En Tránsito, "
            "En Reparto y Entregado, con acceso a Carta Porte y acuses digitales."
        ),
        "kpi_table": {
            "widths": [2.2, 1.8, 2.5],
            "headers": ["KPI de Logística", "Fórmula / Indicador", "Objetivo Operacional"],
            "data": [
                ["Cumplimiento OTIF (On-Time In-Full)", "(Entregas a Tiempo y Completas / Total) * 100", "Meta clase mundial: superar el 96% de entregas perfectas"],
                ["Costo de Flete por Kilogramo / Unidad", "Total Costo Transporte / Unidades Transportadas", "Monitoreo y reducción del costo logístico unitario"],
                ["Tiempo de Tránsito Promedio", "Horas desde salida de rampa hasta entrega final", "Optimización de rutas y tiempos de traslado"],
                ["Incidencia de Daños en Transporte", "(Envíos con Reporte de Daño / Total Envíos) * 100", "Control de calidad en amarre y estiba de vehículos"]
            ]
        },
        "procedures": [
            {
                "title": "Traspaso desde WMS y Asignación de Unidad y Chofer",
                "callout": {
                    "title": "CARTA PORTE Y ASIGNACIÓN DE CUSTODIA",
                    "text": "Al asignar la unidad vehicular, el sistema transfiere formalmente la custodia legal de las mercancías de la bodega al chofer.",
                    "bg": "F0F9FF", "border": "0284C7"
                },
                "description": (
                    "El despachador agrupa pedidos listos en patio y genera el manifiesto de ruta."
                ),
                "steps": [
                    "Seleccionar los pedidos embalados procedentes de [17] WMS.",
                    "Hacer clic en [Crear Nueva Ruta de Despacho].",
                    "Asignar el Vehículo de la flota (placas, capacidad) y el Chofer certificado.",
                    "El sistema verifica que el peso total no supere la capacidad de carga del camión.",
                    "Emitir la Carta Porte Digital con su sello tributario correspondiente.",
                    "Presionar [Iniciar Ruta]. El estado cambia a 'En Tránsito'."
                ]
            },
            {
                "title": "Confirmación de Entrega y Registro de Acuse Digital",
                "description": (
                    "Procedimiento en el domicilio del cliente para cerrar el ciclo de entrega:",
                    "• El cliente inspecciona los bultos entregados.\n"
                    "• Firma en la pantalla táctil de la aplicación móvil del chofer.\n"
                    "• Se captura fotografía del acuse y se sella la entrega en el ERP con georreferencia GPS."
                ),
                "steps": [
                    "El chofer marca en la aplicación [Llegada a Destino].",
                    "Entrega los paquetes y solicita la firma digital del receptor en la pantalla.",
                    "Toma fotografía de los sellos intactos de la carga.",
                    "Presiona [Confirmar Entrega Satisfactoria].",
                    "El sistema cambia el estado a 'Entregado', envía comprobante al cliente y activa la exigibilidad en [8] CxC."
                ]
            }
        ],
        "governance_text": (
            "Gobernanza de transporte: Ningún vehículo puede abandonar las instalaciones sin la Carta Porte Digital emitida "
            "y la verificación física de sellos de seguridad. Los incidentes en ruta (robos, averías) deben reportarse en < 30 min."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol en Logística", "Permisos Operativos", "Restricciones de Gobernanza"],
            "data": [
                ["Operador de Despacho", "Armar Rutas, Asignar Vehículos y Choferes", "No puede alterar datos de facturación ni precios."],
                ["Chofer / Transportista", "Confirmar Llegadas, Capturar Firmas de Acuse", "Acceso restringido a su propia hoja de ruta móvil."],
                ["Jefe de Tráfico y Logística", "Autorizar Fletes Externos y Resolver Siniestros", "Responsable de la seguridad de la flota y seguros."],
                ["Auditor de Envíos", "Consultar Bitácora GPS y Tiempos de Entrega", "Monitorea desviaciones de ruta no autorizadas."]
            ]
        },
        "golden_rules": (
            "1. Carta Porte obligatoria: Prohibido circular sin el comprobante digital fiscal del traslado de mercancía.\n"
            "2. Acuse firmado en cada entrega: No se da por entregado ningún pedido sin firma digital o sello físico documentado.\n"
            "3. Control de peso vehicular: El sistema bloqueará despachos que excedan la tara máxima autorizada por las normas de tránsito."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[17] WMS", "Liberación de Bulto", "[7] Logística", "Pasa paquete a patio y habilita asignación de unidad."],
                ["[7] Logística", "Iniciar Ruta", "[1] Ventas", "Actualiza estatus de pedido a 'En Tránsito' hacia el cliente."],
                ["[7] Logística", "Confirmar Entrega", "[8] CxC", "Certifica recepción del cliente; inicia cómputo de días de crédito."],
                ["[7] Logística", "Cierre de Manifiesto", "[12] Contabilidad", "Póliza de fletes, combustible y viáticos aplicados al periodo."]
            ]
        }
    },
    {
        "num": "10",
        "name": "Tesorería & Cuentas Bancarias",
        "folder_name": "Modulo 10 NyTEX Tesoreria",
        "phase_label": "Fase 2: Express (Operación y Cadena Completa)",
        "phase_dir": "Fase 2 Express",
        "macro_area": "Área 4: Administración y Finanzas",
        "circuit": "Cash Management & Liquidity (C2L)",
        "subtitle": "Gestión Integral de Liquidez: Posición de Efectivo Multimoneda, Arqueos de Caja General y Chica, Conciliación Bancaria Automática y Sello de Auditoría",
        "entities": "Cuentas Bancarias, Cajas Físicas, Arqueos de Caja, Movimientos de Tesorería, Conciliaciones y Sellos Criptográficos",
        "routes": "/app/tesoreria, /app/circuito-fase2",
        "interconnections_summary": (
            "• [8] CxC: Entrada de fondos por cobranza de facturas a clientes y depósitos verificados.\n"
            "• [9] CxP: Salida de fondos por liquidación de lotes de pagos a proveedores y prestadores de servicios.\n"
            "• [14] Nómina: Dispersión de sueldos y salarios de colaboradores de la empresa.\n"
            "• [12] Contabilidad: Sincronización continua de la cuenta 1102 (Bancos) y pólizas de egreso/ingreso."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [10] en la Custodia del Efectivo",
            "2. Posición Global de Liquidez en Tiempo Real: Monedas, Cajas y Bancos",
            "3. Estructura de Pantallas, Vistas Operativas y Tablero de Tesorería",
            "4. Procedimiento Operativo N° 1: Registro de Movimientos Bancarios Manuales y Traspasos",
            "5. Procedimiento Operativo N° 2: Arqueo y Cierre Físico de Caja General",
            "6. Procedimiento Operativo N° 3: Fondo Fijo de Caja Chica y Reembolso de Gastos Menores",
            "7. Procedimiento Operativo N° 4: Conciliación Bancaria Automática contra Extracto Bancario",
            "8. Procedimiento Operativo N° 5: Cierres Diarios de Finanzas y Sello Criptográfico Inmutable",
            "9. Matriz de Integración con [8] CxC, [9] CxP, [14] Nómina y [12] Contabilidad",
            "10. Gobernanza de Fondos, Firmas Mancomunadas y Prevención de Fraudes Financieros"
        ],
        "executive_summary": (
            "El Módulo [10] NyTEX Tesorería & Cuentas Bancarias es el guardián de los recursos líquidos de la empresa. "
            "Supervisa y controla todas las cuentas bancarias (en moneda nacional y extranjera), las cajas registradoras de sucursales "
            "y los fondos fijos de caja chica.\n\n"
            "Ofrece a la Dirección General la visibilidad exacta de 'cuánto dinero tenemos disponible hoy' para operar, "
            "automatiza la conciliación bancaria y aplica sellos criptográficos inmutables en los cierres de jornada financiera."
        ),
        "purpose_detail": (
            "La falta de control de tesorería provoca cheques devueltos, comisiones bancarias imprevistas y desfalcos en efectivo. "
            "NyTEX Tesorería centraliza los movimientos de ingresos por cobros de [8] CxC y egresos por pagos de [9] CxP, "
            "garantizando que ninguna transacción bancaria quede sin respaldo documental ni asiento contable.\n\n"
            "Permite importar extractos bancarios en formatos estándar (OFX, Excel, CSV) y conciliar de forma automática más del "
            "90% de los renglones bancarios en segundos."
        ),
        "without_module_impact": (
            "Operar sin módulo de tesorería estructurado produce:\n"
            "1. Desconocimiento de la liquidez real disponible, emitiendo pagos sin fondos suficientes.\n"
            "2. Conciliaciones bancarias atrasadas por meses, ocultando cargos no reconocidos o fraudes.\n"
            "3. Pérdida de control sobre el dinero en efectivo recibido en sucursales y ventanillas.\n"
            "4. Dificultad para proyectar el flujo de efectivo futuro y necesidad de solicitar créditos costosos de urgencia."
        ),
        "ecosystem_context": (
            "En el núcleo financiero de NyTEX, Tesorería es la válvula de control del dinero en efectivo y cuentas bancarias, "
            "interactuando directamente con Clientes, Proveedores, Empleados y el sistema bancario exterior."
        ),
        "circuit_diagram": (
            "+-----------------------------------------------------------------------------------------+\n"
            "|                     CIRCUITO OPERATIVO DE TESORERÍA (C2L)                               |\n"
            "+-----------------------------------------------------------------------------------------+\n"
            "|  [8] ENTRADAS COBRANZA  ➔ [10] POSICIÓN DE LIQUIDEZ ➔ [9] SALIDAS PAGOS / [14] NÓMINA   |\n"
            "|   - Depósitos clientes       - Saldo real en cuentas    - Proveedores y servicios       |\n"
            "|   - Arqueos de caja          - Conciliación bancaria    - Dispersión bancaria autorizada|\n"
            "+-----------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La pantalla de Tesorería (/app/tesoreria) muestra KPIs directivos: Liquidez Total Disponible ($), Saldo en Cuentas Bancarias, "
            "Saldo en Cajas Físicas y Egresos Comprometidos para Hoy. Ofrece pestañas de navegación: [Cuentas Bancarias], "
            "[Arqueo de Cajas], [Caja Chica], [Conciliación Bancaria] y [Cierres Diarios]."
        ),
        "kpi_table": {
            "widths": [2.2, 1.8, 2.5],
            "headers": ["KPI de Tesorería", "Fórmula / Indicador", "Objetivo de Negocio"],
            "data": [
                ["Posición Neta de Liquidez", "Σ Bancos + Σ Cajas - Pasivos Vencidos", "Monitoreo diario de la solvencia inmediata de la empresa"],
                ["Efectividad de Conciliación", "(Partidas Conciliadas / Total Partidas) * 100", "Meta > 98% de transacciones bancarias conciliadas al día"],
                ["Diferencia en Arqueos de Caja", "Σ (Efectivo Físico Contado - Saldo en Sistema)", "Control estricto de sobrantes o faltantes en cajas físicas ($0.00)"],
                ["Días de Cobertura de Efectivo", "Liquidez Disponible / Egreso Operativo Diario", "Mantener mínimo 30 días de reserva operativa de liquidez"]
            ]
        },
        "procedures": [
            {
                "title": "Arqueo y Cierre Físico de Caja General",
                "callout": {
                    "title": "PROTOCOLO DE ARQUEO CIEGO",
                    "text": "El cajero cuenta el dinero físico sin ver el saldo teórico del sistema. El software compara y alerta inmediatamente si hay faltante o sobrante.",
                    "bg": "F0FDF4", "border": "10B981"
                },
                "description": (
                    "Se audita físicamente el dinero recibido en ventanilla al finalizar el turno operativo."
                ),
                "steps": [
                    "Acceder a la pestaña [Arqueo de Cajas] y seleccionar la caja a cerrar.",
                    "Desglosar las denominaciones de billetes y monedas físicas en la calculadora de conteo.",
                    "Ingresar los vouchers de tarjetas de crédito y cheques recibidos durante el turno.",
                    "Presionar [Comparar con Saldo Teórico].",
                    "Si la diferencia es $0.00, se pulsa [Aprobar y Cerrar Caja]. Si hay discrepancia, se debe capturar la justificación.",
                    "Se imprime el acta oficial de cierre firmada por cajero y supervisor."
                ]
            },
            {
                "title": "Conciliación Bancaria Automática y Sello de Cierre",
                "description": (
                    "Cotejo de los registros internos del ERP contra los extractos oficiales del banco:",
                    "• Carga del archivo de estado de cuenta bancario.\n"
                    "• El algoritmo empareja movimientos por monto, fecha y número de referencia.\n"
                    "• Se marcan las partidas conciliadas y se emite el sello criptográfico del cierre mensual."
                ),
                "steps": [
                    "Ir a la pestaña [Conciliación Bancaria] y seleccionar la cuenta y mes a conciliar.",
                    "Hacer clic en [Subir Extracto Bancario] y seleccionar el archivo bancario.",
                    "El motor de inteligencia financiera empareja los depósitos y retiros automáticamente.",
                    "Revisar las partidas no conciliadas (comisiones bancarias no registradas o cheques no cobrados).",
                    "Generar las pólizas de ajuste para comisiones o intereses devengados.",
                    "Hacer clic en [🔒 APLICAR SELLO DE CONCILIACIÓN]. El mes bancario queda cerrado e inmutable."
                ]
            }
        ],
        "governance_text": (
            "Gobernanza financiera estricta: Separación total entre quienes operan las cajas y quienes autorizan las transferencias. "
            "Toda transferencia superior a $5,000 requiere autorización mancomunada (dos firmas autorizadas en el sistema)."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol en Tesorería", "Permisos Operativos", "Restricciones de Gobernanza"],
            "data": [
                ["Cajero de Sucursal", "Cobrar en Ventanilla, Declarar Arqueo Ciego", "Sin acceso a cuentas bancarias ni transferencias electrónicas."],
                ["Analista de Tesorería", "Registrar Traspasos, Conciliar Bancos", "Prepara dispersiones pero no puede liberarlas solo."],
                ["Tesorero General", "Autorizar Dispersiones de Pago y Cheques", "Firma mancomunada para egresos de cuentas corporativas."],
                ["Auditor Financiero", "Auditar Conciliaciones y Arqueos Sorpresivos", "Inspecciona el cumplimiento de políticas de custodia de fondos."]
            ]
        },
        "golden_rules": (
            "1. Arqueo diario obligatorio: Toda caja física debe cerrarse y depositarse en banco en menos de 24 horas.\n"
            "2. Cero retiros sin comprobante: Prohibido retirar dinero de caja chica sin factura fiscal legalmente autorizada.\n"
            "3. Doble firma en transferencias: Todo movimiento de salida bancaria mayor al umbral base exige doble factor de autenticación."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[8] CxC", "Cobro Confirmado", "[10] Tesorería", "Incrementa saldo en la cuenta bancaria de destino."],
                ["[9] CxP", "Liquidación de Pasivo", "[10] Tesorería", "Descuenta fondos de la cuenta pagadora seleccionada."],
                ["[10] Tesorería", "Conciliación de Comisión", "[12] Contabilidad", "Póliza de Gasto: Cargo Gastos Financieros, Abono a Bancos."],
                ["[14] Nómina", "Dispersión de Sueldos", "[10] Tesorería", "Debita el importe global de nómina de la cuenta concentradora."]
            ]
        }
    },
    {
        "num": "11",
        "name": "Activos Fijos y Depreciaciones",
        "folder_name": "Modulo 11 NyTEX Activos Fijos",
        "phase_label": "Fase 2: Express (Operación y Cadena Completa)",
        "phase_dir": "Fase 2 Express",
        "macro_area": "Área 4: Administración y Finanzas",
        "circuit": "Asset-to-Retire (A2R)",
        "subtitle": "Gestión Integral de Bienes de Capital: Placas de Control Físico, Asignación de Responsables, Cálculo Automático de Depreciación Contable/Fiscal y Bajas",
        "entities": "Activos Fijos (AF-XXXX), Placas de Código de Barras, Categorías de Activo, Tablas de Depreciación y Pólizas Automáticas",
        "routes": "/app/activosfijos, /app/circuito-fase2",
        "interconnections_summary": (
            "• [4] Compras: Incorporación automática de compras de maquinaria y equipo como activos fijos.\n"
            "• [12] Contabilidad: Asiento mensual automático de Póliza de Depreciación (Gasto de Depreciación vs Depreciación Acumulada).\n"
            "• [5] Producción: Seguimiento al desgaste de maquinaria pesada por horas de trabajo.\n"
            "• [13] RRHH: Asignación de laptops, vehículos y celulares a colaboradores con cartas responsivas firmadas."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [11] en la Protección del Patrimonio",
            "2. Métodos de Depreciación Soportados (Línea Recta, Unidades de Producción, Acelerada)",
            "3. Estructura de Pantallas, Inventario Físico de Bienes y Tablero de Control",
            "4. Procedimiento Operativo N° 1: Registro, Plaqueo y Catalogación de Nuevo Activo Fijo",
            "5. Procedimiento Operativo N° 2: Asignación de Custodia y Carta Responsiva a Colaborador [13]",
            "6. Procedimiento Operativo N° 3: Corrida Mensual Automática de Depreciación y Póliza en [12]",
            "7. Procedimiento Operativo N° 4: Mantenimiento, Mejoras que Incrementan Vida Útil y Revaluaciones",
            "8. Procedimiento Operativo N° 5: Proceso de Baja, Venta o Desecho de Activo Fijo Obsoleto",
            "9. Matriz de Integración con [4] Compras, [12] Contabilidad, [13] RRHH y [5] Producción",
            "10. Auditorías Físicas de Activos, Prevención de Pérdidas y Gobernanza Patrimonial"
        ],
        "executive_summary": (
            "El Módulo [11] NyTEX Activos Fijos administra el patrimonio tangible e intangible de la organización: maquinaria, "
            "vehículos, equipos de cómputo, mobiliario e inmuebles. Controla la ubicación física de cada bien, quién es el empleado "
            "responsable de su custodia y su valor en libros neto de depreciación acumulada.\n\n"
            "Automatiza el cálculo mensual de depreciaciones bajo normas fiscales locales y estándares internacionales (IFRS/NIIF), "
            "generando sin intervención manual las pólizas de gasto correspondientes en [12] Contabilidad."
        ),
        "purpose_detail": (
            "Muchas empresas compran computadoras o maquinaria y pierden el rastro de dónde están o quién las tiene asignadas. "
            "NyTEX Activos Fijos genera una placa con código de barras única para cada activo al momento de su compra.\n\n"
            "Cada fin de mes, con un solo clic el módulo corre el algoritmo de depreciación de todos los activos, calcula el gasto "
            "del periodo según su vida útil remanente y actualiza las cuentas de balance sin necesidad de que el contador haga "
            "cálculos manuales en Excel."
        ),
        "without_module_impact": (
            "Operar sin módulo de activos fijos ocasiona:\n"
            "1. 'Pérdida misteriosa' de computadoras, herramientas y mobiliario sin responsables asignados.\n"
            "2. Depreciaciones contables mal calculadas que generan contingencias en auditorías fiscales.\n"
            "3. Activos obsoletos que siguen figurando en balance con valores inflados que no reflejan la realidad.\n"
            "4. Falta de control sobre garantías de fábrica y pólizas de seguro de bienes estratégicos."
        ),
        "ecosystem_context": (
            "En el ciclo Asset-to-Retire, el módulo recibe los bienes adquiridos por Compras, supervisa su uso en Operaciones "
            "y RRHH, y amortiza su valor patrimonial de forma coordinada con la Contabilidad Central."
        ),
        "circuit_diagram": (
            "+-----------------------------------------------------------------------------------------+\n"
            "|                     CIRCUITO OPERATIVO ASSET-TO-RETIRE (A2R)                            |\n"
            "+-----------------------------------------------------------------------------------------+\n"
            "|  [4] ADQUISICIÓN BIEN ➔ [11] ALTA & PLAQUEO ➔ [13] ASIGNACIÓN ➔ [11] DEPRECIACIÓN MENSUAL |\n"
            "|   - Factura de proveedor    - Código placa QR         - Responsiva firmada  - Algoritmo línea recta|\n"
            "|   - Costo capitalizable     - Vida útil estimada      - Ubicación física    - Póliza a [12] Contab.|\n"
            "+-----------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La consola de Activos Fijos (/app/activosfijos) presenta KPIs globales: Valor Original de Activos ($), Depreciación "
            "Acumulada Total ($), Valor Neto en Libros ($) y Activos Próximos a Fin de Vida Útil. Incluye catálogo de bienes con foto, "
            "código de placa, responsable, categoría y estado de conservación."
        ),
        "kpi_table": {
            "widths": [2.2, 1.8, 2.5],
            "headers": ["KPI de Activos Fijos", "Fórmula / Indicador", "Objetivo Patrimonial"],
            "data": [
                ["Valor Neto en Libros", "Σ (Valor Original - Depreciación Acumulada)", "Valor contable real del patrimonio material de la empresa"],
                ["Índice de Cobertura de Plaqueo", "(Activos Plaqueados con QR / Total Activos) * 100", "Meta 100% de bienes identificados físicamente"],
                ["Gasto de Depreciación Mensual", "Σ Depreciación calculada en el mes en curso", "Control del impacto del desgaste de activos en resultados"],
                ["Activos Fuera de Servicio / Dañados", "Count(Activos en Reparación o Inactivos)", "Monitoreo de equipos que no están aportando valor operativo"]
            ]
        },
        "procedures": [
            {
                "title": "Alta, Plaqueo y Catalogación de Nuevo Activo",
                "callout": {
                    "title": "PLACAS FÍSICAS INVIOLABLES",
                    "text": "Cada activo debe recibir una placa metálica o etiqueta de poliéster con código QR adherida en un lugar visible antes de salir a uso.",
                    "bg": "F0FDF4", "border": "10B981"
                },
                "description": (
                    "Se registra el activo adquirido con sus características técnicas y vida útil."
                ),
                "steps": [
                    "Hacer clic en [+ NUEVO ACTIVO FIJO].",
                    "Ingresar Nombre del Bien, Marca, Modelo, Número de Serie de Fabricante y Categoría (Equipo Cómputo, Maquinaria, Vehículo).",
                    "Vincular con la Factura de compra registrada en [4] Compras para tomar el costo original exacto.",
                    "Definir el Método de Depreciación (Línea Recta) y Vida Útil en meses (ej: 36 meses cómputo, 60 meses vehículos).",
                    "Imprimir la etiqueta de placa QR con el folio AF-XXXX y adherirla físicamente al equipo.",
                    "Presionar [Activar Bien]. Comienza a acumular cómputo de depreciación."
                ]
            },
            {
                "title": "Corrida Mensual de Depreciación y Asiento Contable",
                "description": (
                    "Ejecución del cálculo automático mensual al cierre de cada periodo:",
                    "• El sistema evalúa todos los activos activos y calcula la cuota mensual.\n"
                    "• Genera la Póliza de Diario en [12] Contabilidad de forma automática.\n"
                    "• Actualiza el Valor Neto en Libros de cada bien en el reporte oficial."
                ),
                "steps": [
                    "Ingresar a la pestaña [Depreciación Mensual].",
                    "Seleccionar el periodo mensual a procesar (ej: Noviembre 2026).",
                    "Revisar la tabla preliminar con el cálculo detallado por categoría de activo.",
                    "Hacer clic en el botón [⚙ EJECUTAR DEPRECIACIÓN MENSUAL].",
                    "El sistema genera la Póliza de Diario en [12] Contabilidad (Cargos a Gastos de Depreciación, Abonos a Depreciación Acumulada).",
                    "Se bloquea el recálculo para ese mes garantizando inmutabilidad contable."
                ]
            }
        ],
        "governance_text": (
            "Todo activo asignado a un colaborador exige una Carta Responsiva firmada digitalmente en [13] RRHH. La baja o venta "
            "de un activo por obsolescencia o daño irreparable requiere un dictamen técnico y autorización del Director de Finanzas."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol en Activos Fijos", "Permisos Operativos", "Restricciones de Gobernanza"],
            "data": [
                ["Encargado de Inventario Físico", "Plaquear Activos, Registrar Ubicaciones", "No puede autorizar bajas ni modificar vidas útiles."],
                ["Contador de Activos Fijos", "Ejecutar Depreciaciones, Asignar Cuentas", "Responsable del cuadre contable contra el balance general."],
                ["Director de Finanzas", "Autorizar Bajas, Ventas o Revaluaciones", "Único facultado para desafectar activos del patrimonio social."]
            ]
        },
        "golden_rules": (
            "1. Cero activos sin placa: Ningún bien puede ser asignado a un usuario sin su código QR de activo fijo registrado.\n"
            "2. Depreciación sincronizada: La depreciación se ejecuta obligatoriamente antes del cierre contable mensual.\n"
            "3. Bajas documentadas: Todo desecho o venta de activo exige acta de baja formal con firmas y evidencia fotográfica."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[4] Compras", "Compra de Equipo Capitalizable", "[11] Activos Fijos", "Crea activo borrador para asignación de placa."],
                ["[11] Activos Fijos", "Asignar a Empleado", "[13] RRHH", "Genera responsiva de custodia en el expediente laboral."],
                ["[11] Activos Fijos", "Depreciación Mensual", "[12] Contabilidad", "Póliza automática: Cargo Gasto Depreciación, Abono Deprec. Acumulada."],
                ["[11] Activos Fijos", "Baja por Venta", "[12] Contabilidad", "Póliza de utilidad/pérdida en venta de activo fijo."]
            ]
        }
    },
    {
        "num": "13",
        "name": "Recursos Humanos (RRHH & Talento)",
        "folder_name": "Modulo 13 NyTEX RRHH",
        "phase_label": "Fase 2: Express (Operación y Cadena Completa)",
        "phase_dir": "Fase 2 Express",
        "macro_area": "Área 5: Talento Humano",
        "circuit": "Hire-to-Retire (H2R)",
        "subtitle": "Gestión Integral del Personal: Expedientes Digitales, Organigrama, Contratos Laborales, Control de Asistencias, Gestión de Vacaciones, Incidencias y Evaluaciones",
        "entities": "Colaboradores (COL-XXXX), Expedientes Digitales, Contratos, Asistencias, Solicitudes de Vacaciones e Incidencias Laborales",
        "routes": "/app/rrhh, /app/circuito-fase2",
        "interconnections_summary": (
            "• [14] Nómina: Envío automático de incidencias (horas extra, faltas, incapacidades, bonos) para el cálculo de sueldos.\n"
            "• [11] Activos Fijos: Control de equipos de cómputo y vehículos asignados en custodia al trabajador.\n"
            "• [26] Seguridad: Habilitación o revocación inmediata de credenciales y accesos al ERP al contratarse o separarse un empleado.\n"
            "• [15] Process Suite: Enrutamiento de aprobaciones jerárquicas según el organigrama empresarial."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [13] en la Gestión del Talento",
            "2. El Ciclo Hire-to-Retire: Del Reclutamiento a la Separación Laboral",
            "3. Estructura de Pantallas, Vistas de Colaborador y Directorio Corporativo",
            "4. Procedimiento Operativo N° 1: Alta de Nuevo Colaborador y Expediente Digital Único",
            "5. Procedimiento Operativo N° 2: Gestión de Contratos Laborales, Vencimientos y Renovaciones",
            "6. Procedimiento Operativo N° 3: Registro de Asistencias, Justificantes e Incidencias",
            "7. Procedimiento Operativo N° 4: Solicitud, Aprobación y Control del Saldo de Vacaciones",
            "8. Procedimiento Operativo N° 5: Proceso de Baja Laboral, Finiquito y Revocación de Accesos",
            "9. Matriz de Integración con [14] Nómina, [11] Activos Fijos y [26] Seguridad",
            "10. Cumplimiento de Normativa Laboral, Protección de Datos del Empleado y Clima Organizacional"
        ],
        "executive_summary": (
            "El Módulo [13] NyTEX Recursos Humanos (RRHH & Talento) administra el activo más valioso de la organización: sus colaboradores. "
            "Centraliza los expedientes del personal en formato digital, gestiona los contratos y organigramas, y supervisa "
            "las asistencias, permisos, incapacidades y solicitudes de vacaciones.\n\n"
            "Alimenta de forma transparente al módulo de [14] Nómina con las novedades e incidencias del periodo, garantizando "
            "un pago de sueldos exacto y apegado a la legislación laboral."
        ),
        "purpose_detail": (
            "Tener los expedientes de personal en carpetas de papel genera pérdidas de documentos, contratos vencidos sin renovar "
            "y cálculo incorrecto de vacaciones. NyTEX RRHH almacena currículum, contratos firmados, certificaciones y exámenes "
            "médicos en una bóveda digital segura.\n\n"
            "Asimismo, los supervisores pueden autorizar vacaciones y permisos desde el sistema, descontando automáticamente "
            "los días del saldo disponible del colaborador y reflejando las incidencias en el cálculo periódico de la nómina."
        ),
        "without_module_impact": (
            "Prescindir de un módulo estructurado de RRHH genera:\n"
            "1. Demandas laborales por contratos vencidos o falta de evidencia de amonestaciones e incidencias.\n"
            "2. Pagos de nómina erróneos por faltas o incapacidades no notificadas a tiempo al departamento de nóminas.\n"
            "3. Empleados desvinculados que continúan con acceso activo a los sistemas y bases de datos confidenciales.\n"
            "4. Descontrol en los saldos de vacaciones acumuladas, generando pasivos laborales ocultos para la empresa."
        ),
        "ecosystem_context": (
            "En el ciclo Hire-to-Retire, RRHH incorpora el talento humano a la empresa, asigna sus herramientas de trabajo "
            "y suministra los parámetros operativos para la liquidación de sueldos y cumplimiento legal."
        ),
        "circuit_diagram": (
            "+-----------------------------------------------------------------------------------------+\n"
            "|                     CIRCUITO OPERATIVO HIRE-TO-RETIRE (H2R)                             |\n"
            "+-----------------------------------------------------------------------------------------+\n"
            "|  ALTA COLABORADOR ➔ [13] EXPEDIENTE DIGITAL ➔ [13] INCIDENCIAS ➔ [14] NÓMINA PERIODICA  |\n"
            "|   - Contrato firmado        - Puesto y organigrama    - Faltas, horas extra   - Cálculo de sueldo |\n"
            "|   - Alta en seguridad social- Responsivas de equipo   - Vacaciones aprobadas  - Dispersión banco  |\n"
            "+-----------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La pantalla de RRHH (/app/rrhh) presenta tarjetas directivas: Total Colaboradores Activos, Tasa de Rotación Mensual (%), "
            "Contratos Próximos a Vencer y Colaboradores de Vacaciones Hoy. Incluye directorio con fotos, buscador por departamento "
            "y acceso a solicitudes de permisos pendientes de aprobación."
        ),
        "kpi_table": {
            "widths": [2.2, 1.8, 2.5],
            "headers": ["KPI de Talento Humano", "Fórmula / Indicador", "Objetivo Organizacional"],
            "data": [
                ["Tasa de Rotación (Turnover)", "(Bajas del Mes / Promedio Colaboradores) * 100", "Meta directiva: rotación voluntaria menor al 3% mensual"],
                ["Índice de Ausentismo", "(Horas de Ausencia no Programadas / Horas Plan) * 100", "Control de productividad y clima laboral en las áreas"],
                ["Cumplimiento de Contratos", "(Contratos Vigentes / Total Colaboradores) * 100", "Garantía de 100% de personal con expediente contractual en orden"],
                ["Saldo de Pasivo Vacacional", "Σ (Días de Vacaciones Pendientes * Salario Diario)", "Control del pasivo laboral exigible por vacaciones no gozadas"]
            ]
        },
        "procedures": [
            {
                "title": "Alta de Colaborador y Creación de Expediente Digital",
                "callout": {
                    "title": "BÓVEDA DIGITAL DE EXPEDIENTES",
                    "text": "Los documentos confidenciales (DUI/INE, NIT, Curriculum, Exámenes) quedan cifrados y solo son accesibles por personal autorizado de RRHH.",
                    "bg": "F0FDF4", "border": "10B981"
                },
                "description": (
                    "Se registra la incorporación de un nuevo empleado a la estructura de la empresa."
                ),
                "steps": [
                    "Hacer clic en [+ NUEVO COLABORADOR].",
                    "Capturar Datos Personales: Nombre completo, Identificación oficial, Fecha de nacimiento, Dirección y Teléfono.",
                    "Definir Datos Laborales: Puesto, Departamento, Jefe Inmediato en el Organigrama y Fecha de Ingreso.",
                    "Establecer Condiciones Salariales: Tipo de Salario (Mensual, Quincenal, Diario) y Salario Base pactado.",
                    "Cargar los archivos del expediente en formato PDF.",
                    "Presionar [Guardar y Habilitar Colaborador]. El sistema genera el código COL-XXXX y envía solicitud de usuario a [26] Seguridad."
                ]
            },
            {
                "title": "Captura y Aprobación de Incidencias Laborales",
                "description": (
                    "Registro de novedades operativas del personal que impactan en el pago:",
                    "• Horas extras autorizadas por supervisor.\n"
                    "• Incapacidades emitidas por el instituto de seguridad social.\n"
                    "• Permisos con o sin goce de sueldo y amonestaciones disciplinarias."
                ),
                "steps": [
                    "Ingresar a la pestaña [Incidencias y Asistencias].",
                    "Seleccionar el colaborador y el tipo de incidencia (ej: Horas Extra Diurnas / Nocturnas).",
                    "Digitar la cantidad de horas o días correspondientes con la justificación formal.",
                    "Adjuntar el comprobante médico o documento de autorización de horas extra.",
                    "Hacer clic en [Aprobar Incidencia]. Queda consolidada para la próxima corrida de [14] Nómina."
                ]
            }
        ],
        "governance_text": (
            "Privacidad estricta de la información personal (Habeas Data): La información médica y salarial de los colaboradores "
            "es confidencial. Todo despido o separación laboral debe incluir el acta de entrega formal de bienes asignados en [11] Activos Fijos."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol en Talento Humano", "Permisos Operativos", "Restricciones de Gobernanza"],
            "data": [
                ["Asistente de RRHH", "Capturar Asistencias, Cargar Expedientes", "Sin acceso a salarios confidenciales de directores."],
                ["Generalista de RRHH", "Gestionar Contratos, Registrar Incidencias", "Coordina altas, bajas y transferencias de personal."],
                ["Gerente de Talento Humano", "Aprobar Bajas, Autorizar Estructura Salarial", "Responsable de la política laboral y relaciones sindicales."],
                ["Supervisor de Área", "Autorizar Vacaciones y Horas Extra de su Equipo", "Solo tiene visibilidad sobre los empleados a su cargo."]
            ]
        },
        "golden_rules": (
            "1. Cero empleados sin contrato: Prohibido que un trabajador labore sin contrato firmado y cargado en el sistema.\n"
            "2. Cierre de incidencias a tiempo: Todas las incidencias deben aprobarse antes del corte de nómina de cada periodo.\n"
            "3. Revocación inmediata: Al registrar una baja, el sistema debe desactivar accesos a correos y ERP en menos de 10 minutos."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[13] RRHH", "Incidencia Aprobada", "[14] Nómina", "Transfiere horas extra, bonos o descuentos a la prenómina."],
                ["[13] RRHH", "Alta de Empleado", "[26] Seguridad", "Genera usuario de ERP con rol asignado según puesto."],
                ["[13] RRHH", "Baja de Empleado", "[11] Activos Fijos", "Exige devolución y recepción de computadoras y vehículos en custodia."],
                ["[13] RRHH", "Baja de Empleado", "[26] Seguridad", "Bloquea inmediatamente la cuenta de acceso al sistema."]
            ]
        }
    },
    {
        "num": "14",
        "name": "Nómina, Sueldos & Fiscal",
        "folder_name": "Modulo 14 NyTEX Nomina",
        "phase_label": "Fase 2: Express (Operación y Cadena Completa)",
        "phase_dir": "Fase 2 Express",
        "macro_area": "Área 5: Talento Humano",
        "circuit": "Payroll-to-Disburse (P2D)",
        "subtitle": "Cálculo Preciso de Remuneraciones: Percepciones Ordinarias y Extraordinarias, Deducciones de Ley (Seguridad Social, Retención Renta), Timbrado Fiscal y Póliza Automática",
        "entities": "Corridas de Nómina (NOM-XXXX), Recibos de Sueldo, Tablas Impositivas, Archivos de Dispersión Bancaria y Pólizas de Sueldos",
        "routes": "/app/nomina, /app/circuito-fase2",
        "interconnections_summary": (
            "• [13] RRHH: Recepción automática de incidencias, días trabajados y modificaciones salariales.\n"
            "• [10] Tesorería: Generación del lote de dispersión bancaria para acreditación masiva en cuentas de sueldo.\n"
            "• [12] Contabilidad: Póliza de Nómina (Gasto de Sueldos, Cargas Sociales Patronales, Retenciones de Ley vs Pasivos de Nómina).\n"
            "• [26] Configuración: Tablas fiscales de Impuesto sobre la Renta y aportes patronales actualizadas."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [14] en la Remuneración y Cumplimiento Legal",
            "2. El Motor de Cálculo Salarial: Percepciones, Deducciones y Aportes Patronales",
            "3. Estructura de Pantallas, Selector de Periodos (Quincenal / Mensual) y Tablero de Control",
            "4. Procedimiento Operativo N° 1: Apertura de Periodo y Carga de Incidencias desde RRHH [13]",
            "5. Procedimiento Operativo N° 2: Ejecución del Cálculo Preliminar y Auditoría de Prenómina",
            "6. Procedimiento Operativo N° 3: Cierre Definitivo, Timbrado Fiscal Digital y Emisión de Recibos",
            "7. Procedimiento Operativo N° 4: Generación de Archivo de Dispersión Bancaria Masiva en [10]",
            "8. Procedimiento Operativo N° 5: Generación de la Póliza Automática de Nómina en [12] Contabilidad",
            "9. Matriz de Integración con [13] RRHH, [10] Tesorería y [12] Contabilidad",
            "10. Confidencialidad Salarial, Auditoría de Cargas Sociales y Prevención de Multas Laborales"
        ],
        "executive_summary": (
            "El Módulo [14] NyTEX Nómina, Sueldos & Fiscal procesa con precisión matemática el cálculo de sueldos de todo el personal "
            "de la empresa. Integra las percepciones contractuales, horas extras, comisiones de ventas y bonos, calculando de forma "
            "exacta las retenciones de seguridad social (ISSS/IMSS), fondos de pensiones y retención de impuesto sobre la renta.\n\n"
            "Genera los archivos para pago electrónico masivo en banca comercial y emite en [12] Contabilidad la póliza global de nómina, "
            "separando sueldos administrativos, ventas y costos de manufactura."
        ),
        "purpose_detail": (
            "Los errores en nómina generan descontento inmediato en los colaboradores y multas graves de las autoridades tributarias y laborales. "
            "NyTEX Nómina elimina las hojas de cálculo propensas a errores de fórmulas. Con un clic, absorbe las asistencias e incidencias "
            "de [13] RRHH y aplica los tramos de retención fiscal oficiales vigentes.\n\n"
            "Permite a los colaboradores consultar y descargar sus recibos de sueldo digitales timbrados desde el portal del empleado, "
            "ahorrando cientos de horas de impresión y firma de papel en cada pago."
        ),
        "without_module_impact": (
            "Calcular la nómina sin un sistema especializado ocasiona:\n"
            "1. Errores recurrentes en el cálculo de impuestos y seguro social con multas e intereses moratorios.\n"
            "2. Retrasos en el pago de sueldos que deterioran el clima laboral y aumentan la rotación de personal.\n"
            "3. Descuadres contables entre el dinero dispersado por Tesorería y los gastos registrados en Contabilidad.\n"
            "4. Filtración indebida de salarios confidenciales al manejar archivos de Excel sin seguridad adecuada."
        ),
        "ecosystem_context": (
            "En la gestión financiera y de talento, Nómina traduce la actividad de RRHH en egresos monetarios coordinados con "
            "Tesorería y asientos formales en la Contabilidad Central."
        ),
        "circuit_diagram": (
            "+-----------------------------------------------------------------------------------------+\n"
            "|                     CIRCUITO OPERATIVO DE NÓMINA (P2D)                                  |\n"
            "+-----------------------------------------------------------------------------------------+\n"
            "|  [13] INCIDENCIAS ➔ [14] CÁLCULO AUTOMÁTICO ➔ [14] RECIBOS TIMBRADOS ➔ [10] DISPERSIÓN |\n"
            "|   - Horas extra y faltas    - Percepciones de ley     - Sello digital fiscal   - Banco masivo  |\n"
            "|   - Comisiones y bonos      - Retenciones ISSS/Renta  - Envío a colaboradores  - Póliza a [12] |\n"
            "+-----------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La consola de Nómina (/app/nomina) presenta tarjetas KPI de Importe Neto a Pagar ($), Total Cargas Patronales ($), "
            "Retenciones Fiscales por Enterar ($) y Número de Empleados en Nómina. Cuenta con selector de periodo quincenal/mensual, "
            "tabla de prenómina individualizada y botones de acción rápida: [Calcular], [Timbrar], [Dispersar] y [Contabilizar]."
        ),
        "kpi_table": {
            "widths": [2.2, 1.8, 2.5],
            "headers": ["KPI de Nómina", "Fórmula / Indicador", "Objetivo de Negocio"],
            "data": [
                ["Costo Laboral Total (TLC)", "Σ Sueldos Brutos + Σ Cargas Patronales + Beneficios", "Monitoreo del costo total del personal sobre la estructura de ingresos"],
                ["Precisión de Nómina (Payroll Accuracy)", "(Recibos sin Corrección Posterior / Total Recibos) * 100", "Meta del 99.9% de precisión en los cálculos salariales"],
                ["Carga Patronal Relativa", "(Total Aportes Patronales / Total Salarios Base) * 100", "Control del porcentaje de sobrecosto laboral de ley (aprox. 15%-25%)"],
                ["Tiempo de Proceso de Nómina", "Horas dedicadas desde corte hasta dispersión final", "Reducción a menos de 4 horas de proceso gracias a la automatización"]
            ]
        },
        "procedures": [
            {
                "title": "Apertura de Periodo y Cálculo Automático de Prenómina",
                "callout": {
                    "title": "ABSORCIÓN DIRECTA DE NOVEDADES",
                    "text": "Al abrir la corrida de nómina, el sistema integra automáticamente las incidencias aprobadas en [13] RRHH sin recaptura manual.",
                    "bg": "F0FDF4", "border": "10B981"
                },
                "description": (
                    "Se procesa el cálculo quincenal o mensual de remuneraciones del personal activo."
                ),
                "steps": [
                    "Hacer clic en [+ NUEVA CORRIDA DE NÓMINA].",
                    "Seleccionar el Periodo Fiscal (ej: 1a Quincena Noviembre 2026) y Tipo de Nómina (Ordinaria, Extraordinaria, Aguinaldo).",
                    "Presionar [Importar Incidencias de RRHH]. El sistema absorbe horas extras, faltas y bonos.",
                    "Hacer clic en [⚙ EJECUTAR CÁLCULO DE NÓMINA].",
                    "Revisar la tabla de prenómina: verificar Salario Bruto, Retención de Seguro Social, Retención de Renta y Salario Neto.",
                    "Generar el reporte de auditoría de sueldos para validación de la Gerencia Financiera."
                ]
            },
            {
                "title": "Timbrado, Dispersión Bancaria y Póliza en [12]",
                "description": (
                    "Fase final de pago y cierre contable de la nómina:",
                    "• Timbrado de comprobantes fiscales digitales.\n"
                    "• Descarga del archivo bancario y dispersión de fondos desde [10] Tesorería.\n"
                    "• Generación automática de la póliza de nómina en [12] Contabilidad."
                ),
                "steps": [
                    "Con la nómina aprobada, hacer clic en [🔒 Cerrar y Timbrar Recibos].",
                    "Presionar [Generar Archivo de Dispersión Bancaria] (formato TXT/CSV para la banca corporativa).",
                    "Tesorería carga el archivo en el banco y confirma la dispersión exitosa de los sueldos.",
                    "Hacer clic en [Emitir Póliza de Nómina a Contabilidad].",
                    "El sistema asienta la Póliza de Diario en [12] Contabilidad cargando gastos por centro de costo y acreditando sueldos por pagar."
                ]
            }
        ],
        "governance_text": (
            "Máxima confidencialidad: El acceso al módulo de Nómina está restringido exclusivamente al Especialista de Nómina "
            "y al Director de Finanzas mediante credenciales con autenticación de dos factores (2FA). Los recibos no timbrados no pueden dispersarse."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol en Nómina", "Permisos Operativos", "Restricciones de Gobernanza"],
            "data": [
                ["Especialista de Nómina", "Calcular Prenómina, Generar Recibos", "No tiene acceso para liberar fondos en cuentas bancarias."],
                ["Director de Finanzas", "Autorizar Corrida Definitiva y Dispersión", "Revisa que los montos cuadren con el presupuesto del mes."],
                ["Contador General", "Auditar Póliza de Sueldos y Retenciones Fiscales", "Supervisa las declaraciones de impuestos retenidos al personal."]
            ]
        },
        "golden_rules": (
            "1. Pago puntual inamovible: La nómina debe quedar dispersada en las cuentas bancarias el día pactado sin excepciones.\n"
            "2. Retenciones al centavo: Prohibido redondear o modificar manualmente las fórmulas de impuestos y seguridad social.\n"
            "3. Póliza contable inmediata: La póliza de gasto y provisión debe quedar asentada el mismo día del pago salarial."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[13] RRHH", "Cierre de Incidencias", "[14] Nómina", "Alimenta horas extra, faltas y bonos al cálculo salarial."],
                ["[14] Nómina", "Dispersión Aprobada", "[10] Tesorería", "Genera salida de fondos bancarios masivos en cuentas de sueldo."],
                ["[14] Nómina", "Cierre de Nómina", "[12] Contabilidad", "Póliza de Nómina: Cargo a Gastos de Sueldos y Cargas Patronales, Abono a Bancos y Retenciones."]
            ]
        }
    }
]
