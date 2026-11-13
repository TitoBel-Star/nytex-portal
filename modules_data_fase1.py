# -*- coding: utf-8 -*-
"""
Datos Maestros y Procedimientos Operativos: Fase 1 Starter (Núcleo Operativo Básico)
Módulos: [1] Ventas, [3] Inventario, [4] Compras, [8] CxC, [9] CxP, [12] Contabilidad y [17] WMS.
"""

FASE1_MODULES = [
    {
        "num": "1",
        "name": "Ventas & Facturación",
        "folder_name": "Modulo 1 NyTEX Ventas",
        "phase_label": "Fase 1: Starter (Núcleo Operativo Básico)",
        "phase_dir": "Fase 1 Starter",
        "macro_area": "Área 1: Dirección Comercial",
        "circuit": "Order-to-Cash (O2C) / Lead-to-Order (L2O)",
        "subtitle": "Gestión del Ciclo Comercial Completo: Cotizaciones, Pedidos en Firme, Facturación Electrónica DTE, Descuento Automático de Stock y Pólizas Contables",
        "entities": "Cotizaciones, Órdenes de Venta (OV-XXXX), Facturas CFDI / DTE, Clientes y Líneas de Pedido",
        "routes": "/app/ventas, /app/circuito-fase1",
        "interconnections_summary": (
            "• [3] Inventario: Descuento inmediato de existencias físicas y reserva de stock comprometido.\n"
            "• [17] WMS: Disparo automático de la orden de preparación (Picking y Packing) al confirmar pedido.\n"
            "• [7] Logística: Disparo automático de Orden de Embarque, Guía de Remisión y Hoja de Ruta para pedidos con entrega a domicilio.\n"
            "• [8] CxC: Generación de cuenta por cobrar, plazo de crédito y exigibilidad de pago al facturar.\n"
            "• [12] Contabilidad: Asiento automático de Póliza de Diario/Ingreso (Ingresos por Ventas, IVA Débito y Costo de Venta)."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [1] en el Ecosistema Comercial",
            "2. Ubicación en el Macrocircuito Order-to-Cash (O2C)",
            "3. Estructura de Pantallas, Vistas Operativas y Tarjetas KPI",
            "4. Procedimiento Operativo N° 1: Captura de Nueva Cotización y Búsqueda Predictiva de SKUs",
            "5. Procedimiento Operativo N° 2: Confirmación de Pedido y Disparo Automático a WMS [17]",
            "6. Procedimiento Operativo N° 3: Facturación Electrónica (DTE) y Generación de Cartera en CxC [8]",
            "7. Procedimiento Operativo N° 4: Tratamiento de Ventas de Mostrador y Clientes sin Registro Previo",
            "8. Procedimiento Operativo N° 5: Anulaciones, Notas de Crédito y Reversión de Inventario",
            "9. Matriz de Integración e Interconexión con [3] Inventario, [17] WMS, [7] Logística, [8] CxC y [12] Contabilidad",
            "10. Gobernanza Comercial, Segregación de Funciones (SoD) y Reglas de Auditoría"
        ],
        "executive_summary": (
            "El Módulo [1] NyTEX Ventas & Facturación es el motor generador de ingresos de la empresa. Gestiona de manera centralizada "
            "el ciclo de ventas desde el primer contacto formal (cotización) hasta la conversión en pedido en firme y la posterior "
            "emisión del comprobante fiscal (Factura electrónica / DTE).\n\n"
            "Al operar como núcleo de la Fase 1: Starter, permite una venta fluida tanto para clientes corporativos con crédito como "
            "para transacciones ágiles de mostrador (público en general), coordinando de forma automática a los almacenes y a la contabilidad."
        ),
        "purpose_detail": (
            "En la operación diaria, el personal de ventas necesita responder con agilidad a las cotizaciones de los clientes sin "
            "vender productos agotados ni aplicar precios incorrectos. El Módulo [1] resuelve esto integrando el catálogo en tiempo real con "
            "[3] Inventario, permitiendo consultar existencias disponibles en múltiples bodegas al momento de digitar cada partida.\n\n"
            "Asimismo, elimina la duplicidad de captura: una vez que el cliente aprueba la cotización, con un solo clic el documento se transforma "
            "en Pedido Confirmado, enviando la notificación de despacho a [17] WMS y preparando la factura en [8] Cuentas por Cobrar."
        ),
        "without_module_impact": (
            "Si la empresa no opera con el Módulo de Ventas centralizado:\n"
            "1. Venta a ciegas: Los vendedores comercializan productos sin stock, generando retrasos, quejas y cancelaciones costosas.\n"
            "2. Fugas de dinero y errores de precio: Cotizaciones manuales en Excel con márgenes erróneos o descuentos no autorizados.\n"
            "3. Facturación desfasada: Retrasos de días entre la entrega del producto y la emisión de la factura, retrasando el flujo de caja.\n"
            "4. Descuadre contable: El departamento de contabilidad debe capturar manualmente las pólizas de ventas, acumulando rezagos de semanas."
        ),
        "ecosystem_context": (
            "Dentro del circuito Order-to-Cash (O2C), el Módulo de Ventas actúa como el gatillo iniciador. Recibe oportunidades del CRM "
            "o solicitudes directas de clientes, compromete stock físico y orquesta la entrega logística y la cobranza financiera."
        ),
        "circuit_diagram": (
            "+-----------------------------------------------------------------------------------------+\n"
            "|                     CIRCUITO OPERATIVO ORDER-TO-CASH (O2C)                              |\n"
            "+-----------------------------------------------------------------------------------------+\n"
            "|  [1] COTIZACIÓN / ORDEN  -->  [17] SURTIDO WMS  -->  [7] LOGÍSTICA / RUTA  -->  [1] FACTURACIÓN  -->  [8] CxC / [12] POLIZA |\n"
            "|   - Seleccionar Cliente        - Picking Lector RF    - Timbrado DTE        - Cuenta x Cobrar   |\n"
            "|   - Partidas de SKUs           - Packing y Guía       - Rebaja Kardex [3]   - Póliza de Diario  |\n"
            "+-----------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La pantalla principal de NyTEX Ventas (/app/ventas) cuenta con una barra superior de KPIs en vivo, "
            "un selector de filtros rápidos (Todas, Cotizaciones, En Proceso, Entregadas, Facturadas) y un botón de acción principal "
            "[+ NUEVA ORDEN / COTIZACIÓN]. La tabla operativa despliega Folio, Cliente, Fecha, Total, Estado y Botones de Acción Rápida."
        ),
        "kpi_table": {
            "widths": [2.2, 1.8, 2.5],
            "headers": ["Indicador KPI", "Fórmula / Valor", "Propósito Operativo"],
            "data": [
                ["Ventas del Mes", "Σ Facturas Emitidas (Mes)", "Control de cumplimiento de cuota comercial del periodo"],
                ["Pedidos Pendientes", "Count(Órdenes en Proceso)", "Monitoreo del cuello de botella en surtido y despacho"],
                ["Tasa de Conversión", "(Cotizaciones Vendidas / Total) * 100", "Efectividad del equipo de ventas al cerrar propuestas"],
                ["Ticket Promedio", "Total Venta / Número de Facturas", "Medición de volumen y venta cruzada por transacción"]
            ]
        },
        "procedures": [
            {
                "title": "Captura de Nueva Cotización y Búsqueda Predictiva de SKUs",
                "callout": {
                    "title": "REGLA OPERATIVA DE COTIZACIONES",
                    "text": "Toda cotización tiene una vigencia predeterminada de 15 días. Si el cliente no confirma en dicho periodo, el sistema libera la reserva preventiva de existencias.",
                    "bg": "F0FDF4", "border": "10B981"
                },
                "description": (
                    "El vendedor inicia el proceso comercial capturando los requerimientos del cliente en el formulario oficial de orden."
                ),
                "steps": [
                    "Hacer clic en el botón [+ NUEVA ORDEN / COTIZACIÓN] en la esquina superior derecha.",
                    "Seleccionar el Cliente en el menú desplegable. En Fase 1 (Starter), se seleccionan clientes precargados o el comodín BP-GEN (Venta Mostrador).",
                    "Ingresar la Dirección de Entrega y los Términos de Pago (Contado, Crédito 15 días, Crédito 30 días).",
                    "En la cuadrícula de partidas, escribir el nombre o código del producto. El buscador predictivo mostrará la existencia actual en bodega y el precio de lista.",
                    "Especificar la cantidad solicitada. El sistema calculará automáticamente Subtotal, IVA (13% / 16%) y Total.",
                    "Hacer clic en [Guardar como Cotización]. El sistema generará el folio oficial COT-XXXX."
                ],
                "table": {
                    "widths": [1.8, 1.4, 3.3],
                    "headers": ["Campo del Formulario", "Tipo de Dato", "Validación y Regla de Negocio"],
                    "data": [
                        ["Cliente", "Selector", "Obligatorio. Valida si el cliente tiene crédito bloqueado por morosidad."],
                        ["Términos de Pago", "Selector", "Define la fecha de vencimiento al momento de facturar."],
                        ["SKU / Producto", "Buscador Predictivo", "Muestra existencias reales disponibles; alerta si cantidad excede stock."],
                        ["Descuento (%)", "Numérico", "Máximo 10% para vendedores estándar; requiere supervisor si es mayor."]
                    ]
                },
                "technical_box": "POST /api/ventas/ordenes\nPayload: { \"clienteId\": \"CLI-1002\", \"terminoPago\": \"CREDITO_30\", \"partidas\": [{\"sku\": \"SKU-001\", \"cantidad\": 10, \"precio\": 45.00}] }\nResponse: 201 Created -> { \"ordenId\": \"OV-2026-0891\", \"estado\": \"COTIZACION\" }"
            },
            {
                "title": "Confirmación de Pedido y Disparo a WMS [17]",
                "callout": {
                    "title": "COMPROMISO DE STOCK EN FIRME",
                    "text": "Al presionar Confirmar, el stock pasa de 'Disponible' a 'Comprometido'. Ningún otro vendedor podrá vender esas unidades.",
                    "bg": "EFF6FF", "border": "3B82F6"
                },
                "description": (
                    "Cuando el cliente aprueba la propuesta formal, la orden debe transformarse en Pedido en Firme para surtido."
                ),
                "steps": [
                    "Ubicar la cotización en la lista de órdenes bajo el filtro [Cotizaciones].",
                    "Hacer clic en el botón de acción [⚡ Confirmar ➔ WMS].",
                    "El sistema valida en milisegundos que aún exista stock suficiente en el almacén asignado.",
                    "El estado cambia inmediatamente a 'En Proceso' y se emite la orden de preparación digital hacia [17] WMS.",
                    "Se imprime o envía por correo la confirmación de pedido al cliente con fecha estimada de entrega."
                ]
            },
            {
                "title": "Facturación Electrónica (DTE / CFDI) y Generación de CxC [8]",
                "callout": {
                    "title": "TIMBRADO Y PÓLIZA CONTABLE INMEDIATA",
                    "text": "La emisión de la factura es irreversible. Descuenta el inventario físico en Kardex y genera la póliza automática en [12] Contabilidad.",
                    "bg": "FEF2F2", "border": "DC2626"
                },
                "description": (
                    "Al completarse el surtido o acordarse el despacho, se procede a emitir el comprobante tributario definitivo."
                ),
                "steps": [
                    "Seleccionar la orden en estado 'Listo para Facturar' o 'Entregada'.",
                    "Hacer clic en el botón [🧾 Facturar ➔ CxC].",
                    "Confirmar la serie fiscal, el método de pago y el uso de comprobante fiscal.",
                    "El motor tributario de NyTEX sella digitalmente el DTE con el Ministerio de Hacienda / SAT.",
                    "El sistema genera la cuenta por cobrar en [8] CxC y asienta la Póliza de Diario en [12] Contabilidad."
                ]
            },
            {
                "title": "Tratamiento de Ventas de Mostrador (Público General)",
                "description": (
                    "Para ventas de piso o mostrador sin registro de cliente previo:",
                    "• Se selecciona el socio comodín: BP-GEN (Público en General / Venta Mostrador).\n"
                    "• Términos de pago: Contado / Efectivo / Tarjeta.\n"
                    "• La venta se liquida de inmediato, ingresando a caja de [10] Tesorería y cerrando el ciclo sin saldo pendiente en [8] CxC."
                ),
                "steps": [
                    "Abrir formulario de orden y seleccionar BP-GEN.",
                    "Agregar los productos entregados al momento al comprador.",
                    "Seleccionar método de pago inmediato (Efectivo / Tarjeta).",
                    "Hacer clic en [Facturar y Cobrar Mostrador]. El ticket/factura se imprime y el stock se rebaja al instante."
                ]
            }
        ],
        "governance_text": (
            "El Módulo de Ventas exige segregación de funciones entre quienes cotizan, quienes autorizan descuentos especiales "
            "y quienes facturan fiscalmente. Ningún usuario puede anular una factura sin la clave de supervisión comercial."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol Operativo", "Nivel de Permisos", "Restricciones de Gobernanza"],
            "data": [
                ["Vendedor / Asesor", "Crear Cotizaciones, Consultar Stock", "No puede modificar precios mínimos ni autorizar crédito."],
                ["Supervisor Comercial", "Aprobar Descuentos, Liberar Pedidos", "Autoriza excepciones comerciales y pedidos por encima del límite."],
                ["Cajero / Facturador", "Emitir Facturas DTE, Cobrar Mostrador", "No puede alterar cantidades ni partidas ya aprobadas."],
                ["Auditor / Administrador", "Acceso Total y Registro Inmutable", "Visualiza bitácora completa de eventos en /app/seguridad."]
            ]
        },
        "golden_rules": (
            "1. Cero ventas en negativo: El sistema bloqueará cualquier confirmación si la existencia física es menor a la requerida.\n"
            "2. Descuentos auditados: Cualquier descuento que supere la matriz permitida requerirá código de autorización gerencial.\n"
            "3. Facturación sincronizada: No se emitirán facturas fiscales sin orden previa aprobada o registro de caja liquidado."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[1] Ventas", "Confirmar Pedido (Bodega)", "[17] WMS", "Crea orden de picking; aparta stock físico en almacén."],
                ["[1] Ventas", "Confirmar Pedido (A Domicilio)", "[7] Logística", "Genera orden de embarque, asigna camión, chofer y programa hoja de ruta vehicular."],
                ["[7] Logística", "Confirmar Entrega en Destino", "[1] Ventas", "Actualiza la orden comercial al estado Entregado con acuse de recibo."],
                ["[1] Ventas", "Facturar ➔ CxC", "[8] CxC", "Registra saldo deudor a nombre del cliente con fecha de vencimiento."],
                ["[1] Ventas", "Facturar ➔ CxC", "[3] Inventario", "Descarga unidades del Kardex permanente valorizado."],
                ["[1] Ventas", "Facturar ➔ CxC", "[12] Contabilidad", "Póliza automática: Cargo a Clientes, Abono a Ventas e IVA Débito."]
            ]
        }
    },
    {
        "num": "3",
        "name": "Inventario & Control de Stock",
        "folder_name": "Modulo 3 NyTEX Inventario y Control de Stock",
        "phase_label": "Fase 1: Starter (Núcleo Operativo Básico)",
        "phase_dir": "Fase 1 Starter",
        "macro_area": "Área 2: Cadena de Suministro",
        "circuit": "Inventory-to-Supply / Kardex Valued",
        "subtitle": "Control Integral de Existencias Multialmacén, Catálogo de SKUs, Lotes, Series, Ajustes de Entrada/Salida y Costeo Permanente PEPS / Promedio",
        "entities": "Artículos (SKUs), Almacenes Físicos, Movimientos de Kardex, Ajustes de Inventario y Conteos Cíclicos",
        "routes": "/app/inventario, /app/circuito-fase1",
        "interconnections_summary": (
            "• [1] Ventas: Consulta en tiempo real de stock disponible y descargo por ventas facturadas.\n"
            "• [4] Compras: Recepción de mercancía de proveedores con incremento de existencias y actualización de costo.\n"
            "• [17] WMS: Sincronización de ubicaciones físicas (pasillo, estante, nivel) con el saldo contable.\n"
            "• [12] Contabilidad: Pólizas automáticas de variación de inventario y costo de ventas."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [3] en la Cadena de Suministro",
            "2. Estructura del Kardex Permanente y Métodos de Costeo (Promedio / PEPS)",
            "3. Estructura de Pantallas, Vistas por Almacén y Semáforo de Existencias",
            "4. Procedimiento Operativo N° 1: Alta y Catalogación Maestra de Artículos (SKUs)",
            "5. Procedimiento Operativo N° 2: Ajustes Manuales de Entrada y Salida Justificada",
            "6. Procedimiento Operativo N° 3: Traspasos entre Sucursales y Almacenes Físicos",
            "7. Procedimiento Operativo N° 4: Auditoría de Inventarios y Conteos Cíclicos Ciegos",
            "8. Procedimiento Operativo N° 5: Consulta y Exportación del Kardex Valorizado",
            "9. Matriz de Integración con [1] Ventas, [4] Compras, [17] WMS y [12] Contabilidad",
            "10. Controles Internos, Gobernanza de Almacén y Prevención de Mermas"
        ],
        "executive_summary": (
            "El Módulo [3] NyTEX Inventario & Control de Stock es la columna vertebral de la custodia física y valorizada "
            "de las mercancías y suministros de la organización. Garantiza que cada unidad física existente en los almacenes "
            "tenga un reflejo exacto en el sistema informático y en los libros contables.\n\n"
            "Permite administrar múltiples almacenes, bodegas de tránsito y centros de distribución con seguimiento detallado "
            "por número de lote, fecha de vencimiento y serie de fabricación."
        ),
        "purpose_detail": (
            "Sin un inventario en línea, las empresas sufren de 'stock fantasma': productos que el sistema dice que existen "
            "pero físicamente se perdieron o dañaron, o ventas perdidas por creer que no hay mercancía disponible.\n\n"
            "NyTEX Inventario calcula automáticamente el Costo Promedio Ponderado o PEPS tras cada compra, actualiza el valor "
            "patrimonial de la empresa en [12] Contabilidad y alerta cuando un artículo cae por debajo del umbral de seguridad."
        ),
        "without_module_impact": (
            "La ausencia de un control de inventarios profesional provoca:\n"
            "1. Mermas y robo hormiga no detectado por falta de trazabilidad en las entradas y salidas.\n"
            "2. Paros de surtido y venta por discrepancias entre lo físico y lo computarizado.\n"
            "3. Capital de trabajo inmovilizado en productos de nula rotación que se vuelven obsoletos.\n"
            "4. Descuadre entre el inventario físico y la cuenta 1105 de balance en contabilidad."
        ),
        "ecosystem_context": (
            "El módulo sirve como el nodo central entre la adquisición de bienes ([4] Compras), la manipulación en piso ([17] WMS) "
            "y la comercialización final ([1] Ventas), informando continuamente a la Dirección Financiera sobre el valor del activo realizable."
        ),
        "circuit_diagram": (
            "+-----------------------------------------------------------------------------------------+\n"
            "|                          CICLO INTEGRAL DE INVENTARIOS                                  |\n"
            "+-----------------------------------------------------------------------------------------+\n"
            "|  [4] COMPRAS ➔ ENTRADA ALMACÉN  ➔  [3] KARDEX / STOCK  ➔  [1] VENTA / SALIDA CONSUMO   |\n"
            "|   - Recepción física OC              - Costo Promedio          - Descuento automático   |\n"
            "|   - Asignación de Lote               - Existencia en Vivo      - Póliza Costo de Venta  |\n"
            "+-----------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La vista principal de Inventarios (/app/inventario) despliega métricas globales: Total SKUs Activos, "
            "Valor Total del Inventario ($), Artículos con Stock Crítico y Rotación Mensual. Debajo, la tabla de productos incluye "
            "Código SKU, Descripción, Categoría, Unidad de Medida, Stock Físico, Stock Comprometido, Stock Disponible y Acciones."
        ),
        "kpi_table": {
            "widths": [2.2, 1.8, 2.5],
            "headers": ["KPI de Inventario", "Fórmula / Indicador", "Objetivo Operacional"],
            "data": [
                ["Exactitud de Registro (ERI)", "(Items Correctos / Items Auditados) * 100", "Meta > 98% de coincidencia entre físico y sistema"],
                ["Días de Inventario (DSI)", "(Inventario Promedio / Costo Ventas) * 365", "Medición de los días que tarda en rotar el stock completo"],
                ["Valorización Total", "Σ (Existencia * Costo Promedio)", "Valor financiero del activo realizable en balance"],
                ["Tasa de Merma / Pérdida", "(Valor Mermas / Valor Total) * 100", "Control preventivo de mermas, daños y robos"]
            ]
        },
        "procedures": [
            {
                "title": "Alta y Catalogación Maestra de Artículos (SKUs)",
                "callout": {
                    "title": "ESTANDARIZACIÓN DE CÓDIGOS DE PRODUCTO",
                    "text": "Los códigos SKU deben seguir la nomenclatura establecida por la empresa (ej: CAT-SUB-001). No se permiten espacios ni caracteres especiales.",
                    "bg": "F0FDF4", "border": "10B981"
                },
                "description": (
                    "Para comercializar o consumir cualquier artículo, debe estar registrado con sus parámetros técnicos y contables."
                ),
                "steps": [
                    "Hacer clic en [+ NUEVO ARTÍCULO] en la consola de inventario.",
                    "Ingresar el Código SKU único, Descripción comercial, Código de Barras EAN-13 y Categoría.",
                    "Definir Unidad de Medida base (Pieza, Metro, Litro, Kilogramo, Caja).",
                    "Asignar la cuenta contable de activo y el costo inicial estimado.",
                    "Establecer los umbrales de control: Stock Mínimo y Stock Máximo para alertas automáticas.",
                    "Hacer clic en [Guardar SKU]. El artículo queda disponible en el catálogo maestro."
                ],
                "table": {
                    "widths": [1.8, 1.4, 3.3],
                    "headers": ["Parámetro SKU", "Tipo", "Efecto Operativo"],
                    "data": [
                        ["Código SKU", "Alfanumérico", "Identificador universal para compras, ventas y códigos de barras."],
                        ["Stock Mínimo", "Numérico", "Dispara alerta visual amarilla cuando la existencia desciende de este valor."],
                        ["Maneja Lotes / Vencimiento", "Booleano", "Obliga a capturar lote y caducidad al ingresar o despachar."],
                        ["Cuenta Contable", "Código Cuenta", "Cuenta de balance donde se registra el valor de este activo."]
                    ]
                }
            },
            {
                "title": "Ajuste Manual de Entrada o Salida con Justificación",
                "callout": {
                    "title": "CONTROL DE AJUSTES MANUALES",
                    "text": "Todo ajuste manual requiere seleccionar un motivo oficial (Merma, Donación, Corrección de Conteo, Muestra Comercial). Genera póliza de ajuste.",
                    "bg": "FFFBEB", "border": "D97706"
                },
                "description": (
                    "Cuando se detecta una discrepancia física no asociada a compras o ventas, se debe asentar un ajuste justificado."
                ),
                "steps": [
                    "Hacer clic en el botón [⚙ REGISTRAR AJUSTE DE STOCK].",
                    "Seleccionar el tipo de movimiento: 'Entrada por Ajuste' o 'Salida por Ajuste'.",
                    "Seleccionar el Almacén afectado y el SKU correspondiente.",
                    "Digitar la cantidad de piezas a ajustar y el motivo justificado en el menú desplegable.",
                    "Adjuntar el folio de acta de auditoría física.",
                    "Presionar [Aplicar Ajuste]. El Kardex se actualiza y se emite la póliza contable correspondiente."
                ]
            },
            {
                "title": "Traspasos entre Almacenes y Sucursales",
                "description": (
                    "Moviliza inventario entre la bodega central y tiendas satélite o almacenes de tránsito sin generar efectos de compra/venta.",
                    "• Se genera documento de Traspaso TRAS-XXXX.\n"
                    "• El almacén origen descuenta el stock.\n"
                    "• El almacén destino confirma la recepción física con lector óptico para dar de alta las unidades."
                ),
                "steps": [
                    "Seleccionar opción [Nuevo Traspaso entre Bodegas].",
                    "Elegir Bodega Origen y Bodega Destino.",
                    "Agregar las partidas de SKUs con sus cantidades físicas.",
                    "Confirmar la salida de almacén origen (estado: 'En Tránsito').",
                    "Al llegar el vehículo al destino, el encargado recibe y confirma (estado: 'Completado')."
                ]
            }
        ],
        "governance_text": (
            "El personal de almacén tiene prohibido modificar los costos unitarios de los productos. Solo el área contable "
            "o de costos puede recalcular valores base. Los ajustes de inventario por encima de $500 requieren autorización de Gerencia de Operaciones."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol en Almacén", "Permisos Operativos", "Controles de Seguridad"],
            "data": [
                ["Auxiliar de Almacén", "Consultar Stock, Registrar Conteos", "Sin permiso para crear SKUs ni autorizar salidas."],
                ["Jefe de Almacén", "Aprobar Traspasos, Registrar Ajustes < $500", "Responsable de la custodia física y cuadre de piso."],
                ["Contador de Costos", "Auditar Kardex, Recalcular Costo Promedio", "Acceso a balances de inventario y asientos de ajuste."],
                ["Auditor Interno", "Conteos Cíclicos Ciegos, Reportes de Merma", "Supervisión independiente sin acceso a manipular stock."]
            ]
        },
        "golden_rules": (
            "1. Kardex inmutable: Ningún movimiento de stock puede borrarse; los errores se corrigen con movimientos de contra-asiento.\n"
            "2. Prohibido stock negativo: Ningún almacén puede despachar mercancía que el sistema registre en cero unidades.\n"
            "3. Conteo cíclico semanal: Los 50 artículos de mayor rotación (Clase A) deben contarse semanalmente para garantizar ERI > 98%."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[4] Compras", "Recepción de Mercancía", "[3] Inventario", "Aumenta existencias físicas y actualiza costo promedio ponderado."],
                ["[1] Ventas", "Facturación de Pedido", "[3] Inventario", "Disminuye existencias físicas en Kardex."],
                ["[3] Inventario", "Salida por Merma / Daño", "[12] Contabilidad", "Póliza de Gasto: Cargo a Pérdida por Merma, Abono a Inventario."],
                ["[17] WMS", "Confirmación de Picking", "[3] Inventario", "Traspasa stock de disponible a zona de despacho en patio."]
            ]
        }
    },
    {
        "num": "4",
        "name": "Compras y Abastecimiento",
        "folder_name": "Modulo 4 NyTEX Compras y Abastecimiento",
        "phase_label": "Fase 1: Starter (Núcleo Operativo Básico)",
        "phase_dir": "Fase 1 Starter",
        "macro_area": "Área 2: Cadena de Suministro",
        "circuit": "Procure-to-Pay (P2P)",
        "subtitle": "Ciclo Integral de Compras: Requisiciones, Órdenes de Compra (PO), Recepción Física en Almacén, Validación 3-Way Match y Programación de Pagos en CxP [9]",
        "entities": "Requisiciones de Compra, Órdenes de Compra (OC-XXXX), Proveedores, Recepciones de Mercancía y Facturas Recibidas",
        "routes": "/app/compras, /app/circuito-fase1",
        "interconnections_summary": (
            "• [3] Inventario: Incremento de existencias en almacén y actualización de costos de adquisición.\n"
            "• [9] CxP: Generación automática de la cuenta por pagar al proveedor según condiciones crediticias.\n"
            "• [12] Contabilidad: Póliza de Provisión de Compras (Cargo a Inventario/Gasto, Cargo a IVA Crédito y Abono a Proveedores).\n"
            "• [17] WMS: Notificación previa de embarque (ASN) para preparar bahías de descarga y recepción."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [4] en la Gestión de Suministros",
            "2. Ubicación en el Macrocircuito Procure-to-Pay (P2P)",
            "3. Estructura de Pantallas, Vistas Operativas y Semáforo de Compras",
            "4. Procedimiento Operativo N° 1: Emisión y Autorización de Órdenes de Compra (PO)",
            "5. Procedimiento Operativo N° 2: Recepción Física de Mercancía y Cotejo con Orden de Compra",
            "6. Procedimiento Operativo N° 3: Validación Tripartita (3-Way Match: PO vs Recepción vs Factura)",
            "7. Procedimiento Operativo N° 4: Generación Automática del Pasivo en CxP [9]",
            "8. Procedimiento Operativo N° 5: Evaluación de Desempeño y Tiempos de Entrega de Proveedores",
            "9. Matriz de Integración con [3] Inventario, [9] CxP, [12] Contabilidad y [17] WMS",
            "10. Políticas de Compras, Gobernanza de Gastos y Prevención de Sobrecostos"
        ],
        "executive_summary": (
            "El Módulo [4] NyTEX Compras y Abastecimiento controla rigurosamente los egresos de capital destinados a la "
            "adquisición de mercancías para reventa, materias primas y suministros operativos. Establece un flujo formal "
            "desde la necesidad interna hasta la entrega pactada por el proveedor.\n\n"
            "Incorpora el protocolo de validación 3-Way Match para evitar que la empresa pague facturas de mercancía "
            "no recibida o con precios no pactados previamente."
        ),
        "purpose_detail": (
            "El módulo garantiza que ninguna compra se efectúe sin una Orden de Compra formalmente autorizada. Esto evita compras "
            "duplicadas, precios inflados o compras innecesarias que drenan la liquidez de la empresa.\n\n"
            "Al recibir la mercancía, el sistema alimenta automáticamente al módulo de [3] Inventario y programa el vencimiento "
            "del pago en [9] CxP, respetando los días de crédito negociados con el proveedor."
        ),
        "without_module_impact": (
            "Prescindir de un módulo de compras automatizado ocasiona:\n"
            "1. Pagos indebidos por facturas de proveedores con sobreprecios o cantidades no recibidas físicamente.\n"
            "2. Compras desorganizadas de última hora con precios de urgencia y altos costos de flete.\n"
            "3. Descontrol de pasivos: La administración desconoce los compromisos de pago futuros hasta que llega el cobrador.\n"
            "4. Cero historial de precios para negociar mejores condiciones con los proveedores estratégicos."
        ),
        "ecosystem_context": (
            "En el circuito Procure-to-Pay (P2P), el módulo inicia con el requerimiento de insumos, coordina la entrega con "
            "los almacenes y culmina transfiriendo el pasivo validado a Tesorería y Contabilidad para su pago puntual."
        ),
        "circuit_diagram": (
            "+-----------------------------------------------------------------------------------------+\n"
            "|                     CIRCUITO OPERATIVO PROCURE-TO-PAY (P2P)                             |\n"
            "+-----------------------------------------------------------------------------------------+\n"
            "|  [4] ORDEN DE COMPRA (PO) ➔ [3/17] RECEPCIÓN FÍSICA ➔ [4] 3-WAY MATCH ➔ [9] PASIVO CxP |\n"
            "|   - Precios negociados         - Conteo en bahía        - PO = Rec = Fact   - Cuenta x Pagar    |\n"
            "|   - Aprobación Gerencial       - Ingreso a Kardex       - Visto Bueno       - Póliza Contable   |\n"
            "+-----------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La pantalla de Compras (/app/compras) presenta tarjetas KPI de Órdenes del Mes, Valor Total Comprado ($), "
            "Órdenes Pendientes de Recepción y Cumplimiento de Entrega de Proveedores (OTIF). Dispone de un botón principal "
            "[+ NUEVA ORDEN DE COMPRA] y filtros por estado: Borrador, Aprobada, En Tránsito, Recibida y Facturada."
        ),
        "kpi_table": {
            "widths": [2.2, 1.8, 2.5],
            "headers": ["Métrica de Compras", "Fórmula / Indicador", "Objetivo de Negocio"],
            "data": [
                ["Cumplimiento OTIF Proveedor", "(Órdenes a Tiempo y Completas / Total) * 100", "Calificación de fiabilidad del proveedor (> 95%)"],
                ["Ahorro en Negociación (PPV)", "Σ (Precio Presupuesto - Precio Real Comprado)", "Medición de eficiencia del departamento de compras"],
                ["Ciclo de Orden (PO Cycle Time)", "Días desde Requisición hasta Recepción en Bodega", "Reducción de tiempos de entrega y reabastecimiento"],
                ["Órdenes Abiertas con Rezago", "Count(Órdenes Vencidas no Entregadas)", "Alerta temprana para evitar roturas de stock en ventas"]
            ]
        },
        "procedures": [
            {
                "title": "Emisión y Aprobación de Orden de Compra (PO)",
                "callout": {
                    "title": "PRECIOS Y CONDICIONES CONTRACTUALES",
                    "text": "La orden de compra es un compromiso legal con el proveedor. Una vez aprobada, fija el precio unitario y la fecha máxima de entrega.",
                    "bg": "F0FDF4", "border": "10B981"
                },
                "description": (
                    "El comprador genera la orden detallando productos requeridos, cantidades, costos pactados y bodega de destino."
                ),
                "steps": [
                    "Hacer clic en el botón [+ NUEVA ORDEN DE COMPRA].",
                    "Seleccionar el Proveedor en el catálogo maestro y la condición de pago acordada (ej: Crédito 30 días).",
                    "Elegir el Almacén Destino donde se recibirá físicamente el embarque.",
                    "Agregar las partidas de SKUs indicando cantidad solicitada y costo unitario pactado.",
                    "Adjuntar cotización o acuerdo de precios del proveedor.",
                    "Presionar [Generar Orden de Compra]. Si el importe supera el límite del comprador, pasará a estado 'Pendiente de Aprobación'."
                ]
            },
            {
                "title": "Recepción Física de Mercancía en Almacén",
                "callout": {
                    "title": "RECEPCIÓN CIEGA Y CONTEO FÍSICO",
                    "text": "El almacenista debe contar y verificar las unidades físicas recibidas antes de firmar el comprobante de entrega al transportista.",
                    "bg": "EFF6FF", "border": "3B82F6"
                },
                "description": (
                    "Al llegar el camión del proveedor a la bahía de carga, se registra la entrada en el ERP."
                ),
                "steps": [
                    "Localizar la Orden de Compra mediante el número de folio (OC-XXXX) o nombre del proveedor.",
                    "Hacer clic en el botón [📦 Registrar Recepción Física].",
                    "Capturar las cantidades reales recibidas por partida y reportar cualquier daño o faltante.",
                    "Ingresar número de lote y fecha de caducidad si el producto lo requiere.",
                    "Hacer clic en [Confirmar Ingreso a Kardex]. El inventario en [3] se incrementa inmediatamente."
                ]
            },
            {
                "title": "Validación 3-Way Match y Envío a CxP [9]",
                "description": (
                    "El protocolo de tres vías garantiza que solo se pague lo efectivamente acordado y recibido:",
                    "1. Orden de Compra autorizada (Precios y cantidades negociadas).\n"
                    "2. Comprobante de Recepción Física (Cantidades contadas en almacén).\n"
                    "3. Factura del Proveedor (Importe fiscal cobrado).\n"
                    "Al coincidir las 3 fuentes, el sistema aprueba la factura y crea el pasivo en [9] CxP con póliza contable automática."
                ),
                "steps": [
                    "Ingresar a la bandeja de Facturas de Proveedores pendientes de revisión.",
                    "Cargar el archivo XML/PDF de la factura remitida por el proveedor.",
                    "El motor 3-Way Match compara automáticamente los importes contra la recepción física.",
                    "Si no hay discrepancia, se pulsa [Aprobar y Enviar a CxP].",
                    "El pasivo queda calendarizado para pago en [9] y reflejado en el pasivo de [12] Contabilidad."
                ]
            }
        ],
        "governance_text": (
            "Está estrictamente prohibido que la misma persona que emite la orden de compra realice la recepción física en almacén "
            "o apruebe la factura para pago. Esta segregación de funciones protege el patrimonio de la empresa contra fraudes."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol en Compras", "Permisos Asignados", "Restricciones de Gobernanza"],
            "data": [
                ["Auxiliar de Compras", "Crear Requisiciones y Órdenes Borrador", "No puede aprobar órdenes mayores a $1,000."],
                ["Gerente de Compras", "Autorizar Órdenes de Compra y Proveedores", "Aprueba hasta $25,000; montos mayores requieren Dirección."],
                ["Receptor de Bodega", "Registrar Recepciones Físicas en Bahía", "No tiene visibilidad de precios ni facturas contables."],
                ["Analista de CxP", "Ejecutar 3-Way Match y Programar Pago", "Solo procesa facturas con recepción física validada."]
            ]
        },
        "golden_rules": (
            "1. Sin PO no hay pago: Ningún pago a proveedor será procesado por Tesorería sin una Orden de Compra previa en el sistema.\n"
            "2. Validación estricta 3-Way Match: Cualquier diferencia superior al 1% en precio o cantidad bloquea automáticamente la factura.\n"
            "3. Proveedores certificados: Solo se pueden emitir órdenes a proveedores con expediente fiscal y bancario validado en el sistema."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[4] Compras", "Recepción en Bodega", "[3] Inventario", "Aumenta stock físico y recalcula costo promedio."],
                ["[4] Compras", "Recepción en Bodega", "[17] WMS", "Habilita tarea de acomodo (Putaway) en estanterías."],
                ["[4] Compras", "3-Way Match Aprobado", "[9] CxP", "Registra cuenta por pagar con fecha de vencimiento según crédito."],
                ["[4] Compras", "3-Way Match Aprobado", "[12] Contabilidad", "Póliza de Provisión: Cargo a Inventario e IVA Crédito, Abono a Proveedores."]
            ]
        }
    },
    {
        "num": "8",
        "name": "Cuentas por Cobrar (CxC & Cartera)",
        "folder_name": "Modulo 8 NyTEX Cuentas por Cobrar",
        "phase_label": "Fase 1: Starter (Núcleo Operativo Básico)",
        "phase_dir": "Fase 1 Starter",
        "macro_area": "Área 4: Administración y Finanzas",
        "circuit": "Credit-to-Cash (C2C) / Order-to-Cash",
        "subtitle": "Gestión Integral de Cartera de Clientes, Límites de Crédito, Análisis de Antigüedad de Saldos (Aging), Aplicación de Cobranza Bancaria y Pólizas de Ingreso",
        "entities": "Documentos por Cobrar, Fichas de Cartera, Cobros Aplicados, Límites de Crédito y Antigüedad de Saldos",
        "routes": "/app/cxc, /app/circuito-fase1",
        "interconnections_summary": (
            "• [1] Ventas: Recepción automática de facturas a crédito y bloqueo de clientes morosos.\n"
            "• [10] Tesorería: Conciliación de depósitos bancarios contra saldos deudores de clientes.\n"
            "• [12] Contabilidad: Asiento automático de Póliza de Ingreso (Cargo a Bancos, Abono a Clientes y Cancelación de IVA por Cobrar).\n"
            "• [24] Modelos Predictivos: Alimentación del scoring de probabilidad de mora e incumplimiento."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [8] en la Salud Financiera",
            "2. Estructura de la Cartera de Clientes y Políticas de Crédito",
            "3. Estructura de Pantallas, Vistas Operativas y Reporte de Antigüedad (Aging)",
            "4. Procedimiento Operativo N° 1: Consulta y Auditoría de Saldos Pendientes de Cobro",
            "5. Procedimiento Operativo N° 2: Aplicación de Cobros Bancarios (Total y Parcial)",
            "6. Procedimiento Operativo N° 3: Gestión de Anticipos y Notas de Crédito de Clientes",
            "7. Procedimiento Operativo N° 4: Bloqueo Automático por Morosidad y Desbloqueo Gerencial",
            "8. Procedimiento Operativo N° 5: Generación y Consulta de Estados de Cuenta de Clientes",
            "9. Matriz de Integración con [1] Ventas, [10] Tesorería y [12] Contabilidad",
            "10. Gobernanza de Créditos, Segregación de Funciones y Control de Incobrables"
        ],
        "executive_summary": (
            "El Módulo [8] NyTEX Cuentas por Cobrar (CxC & Cartera) resguarda la liquidez de la empresa al asegurar que "
            "las ventas a crédito se conviertan efectivamente en dinero en el banco. Controla los vencimientos de facturas, "
            "los límites de crédito autorizados y la antigüedad de la deuda de cada cliente.\n\n"
            "Ofrece un tablero analítico en tiempo real que clasifica la cartera por rangos de vencimiento (Corriente, "
            "1 a 30 días, 31 a 60 días, 61 a 90 días y más de 90 días), permitiendo una gestión de cobro oportuna y profesional."
        ),
        "purpose_detail": (
            "Vender a crédito sin control de cartera es el camino más rápido a la quiebra. El módulo monitorea constantemente "
            "el comportamiento de pago de cada cliente. Si un comprador excede su límite de crédito o acumula facturas vencidas, "
            "el sistema bloquea automáticamente la emisión de nuevos pedidos en [1] Ventas hasta que regularice su situación.\n\n"
            "Al recibir transferencias o cheques, el operador asienta el cobro, cancela el saldo deudor e instruye a [12] Contabilidad "
            "para generar la póliza de ingreso sin intervención manual."
        ),
        "without_module_impact": (
            "Operar sin un módulo de CxC estructurado genera:\n"
            "1. Incremento descontrolado de la cartera vencida y dinero atrapado en la calle.\n"
            "2. Clientes morosos que continúan recibiendo pedidos a crédito sin pagar sus deudas anteriores.\n"
            "3. Disputas constantes con clientes por falta de estados de cuenta claros y conciliados.\n"
            "4. Falta de liquidez para que Tesorería afronte nóminas y pagos a proveedores críticos."
        ),
        "ecosystem_context": (
            "En el ciclo Order-to-Cash, CxC toma el relevo de Ventas al emitirse la factura, gestiona la custodia del activo "
            "exigible y entrega los fondos recaudados a Tesorería y Contabilidad para consolidar el ciclo de efectivo."
        ),
        "circuit_diagram": (
            "+-----------------------------------------------------------------------------------------+\n"
            "|                     CIRCUITO OPERATIVO CREDIT-TO-CASH (C2C)                             |\n"
            "+-----------------------------------------------------------------------------------------+\n"
            "|  [1] FACTURA A CRÉDITO ➔ [8] REGISTRO EN CARTERA ➔ [8] GESTIÓN / AGING ➔ [8/10] COBRO   |\n"
            "|   - Plazo pactado           - Asignación de plazo    - Alerta por mora       - Depósito banco   |\n"
            "|   - Límite de crédito       - Monitoreo en vivo      - Bloqueo preventivo    - Póliza Ingreso   |\n"
            "+-----------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La pantalla de CxC (/app/cxc) despliega métricas directivas: Cartera Total ($), Cartera Vencida ($), "
            "Días Promedio de Cobro (DSO) y Porcentaje de Efectividad de Cobranza. La vista principal incluye un selector de "
            "antigüedad de saldos (Todos, Al Corriente, 1-30 días, 31-60 días, >90 días) y buscador instantáneo por cliente o folio."
        ),
        "kpi_table": {
            "widths": [2.2, 1.8, 2.5],
            "headers": ["KPI de Cartera", "Fórmula / Indicador", "Objetivo Operacional"],
            "data": [
                ["Días de Venta en la Calle (DSO)", "(Cuentas x Cobrar / Ventas Totales) * 365", "Mantener el DSO por debajo de 42 días promedio"],
                ["Índice de Morosidad", "(Cartera > 30 días / Cartera Total) * 100", "Meta directiva: menor al 5% del saldo global"],
                ["Efectividad de Cobro (CEI)", "(Cobranza Real / Cobranza Programada) * 100", "Medición del rendimiento del equipo de cobranzas"],
                ["Antigüedad Promedio Ponderada", "Σ (Monto Factura * Días Vencida) / Cartera Total", "Alerta temprana de envejecimiento de la deuda"]
            ]
        },
        "procedures": [
            {
                "title": "Auditoría de Saldos y Reporte de Antigüedad (Aging)",
                "callout": {
                    "title": "CLASIFICACIÓN DE RIESGO DE CARTERA",
                    "text": "El reporte de aging se actualiza en tiempo real con cada factura emitida y cada cobro aplicado en el sistema.",
                    "bg": "F0F9FF", "border": "0284C7"
                },
                "description": (
                    "El analista de crédito supervisa los vencimientos de la semana para iniciar la cobranza preventiva."
                ),
                "steps": [
                    "Ingresar a la consola de CxC (/app/cxc) y seleccionar la pestaña [Reporte de Antigüedad].",
                    "Filtrar por vendedor, zona geográfica o rango de días de vencimiento.",
                    "Hacer clic en el cliente para desplegar el detalle de facturas pendientes con fecha de emisión y vencimiento.",
                    "Exportar el estado de cuenta en formato PDF o Excel para envío formal al contacto de pagos del cliente."
                ]
            },
            {
                "title": "Aplicación de Cobros Bancarios (Total y Parcial)",
                "callout": {
                    "title": "APLICACIÓN CONTABLE Y FISCAL",
                    "text": "Al aplicar el cobro, el sistema traslada automáticamente el IVA Devengado a IVA Cobrado en [12] Contabilidad.",
                    "bg": "F0FDF4", "border": "10B981"
                },
                "description": (
                    "Al confirmarse el ingreso de fondos en el estado de cuenta bancario, se procede a saldar las facturas correspondientes."
                ),
                "steps": [
                    "Localizar la factura pendiente mediante el buscador de CxC.",
                    "Hacer clic en el botón [💵 Aplicar Cobro].",
                    "Seleccionar la Cuenta Bancaria de destino en [10] Tesorería.",
                    "Ingresar la fecha real del depósito y el número de referencia bancaria.",
                    "Digitar el monto cobrado. Si es menor al saldo, el sistema aplicará un abono parcial y mantendrá el remanente.",
                    "Hacer clic en [Confirmar Cobro]. Se emite el recibo oficial de caja y la Póliza de Ingreso en Contabilidad."
                ],
                "table": {
                    "widths": [1.8, 1.4, 3.3],
                    "headers": ["Campo de Registro", "Tipo", "Efecto en el Sistema"],
                    "data": [
                        ["Cuenta Bancaria", "Selector", "Acredita el saldo en la cuenta de bancos de Tesorería."],
                        ["Referencia Bancaria", "Texto", "Permite conciliación automática con el extracto bancario."],
                        ["Monto Cobrado", "Moneda", "Disminuye el saldo deudor del cliente en el módulo."],
                        ["Tipo de Aplicación", "Opción", "Total (cancela factura) o Parcial (genera saldo pendiente)."]
                    ]
                }
            },
            {
                "title": "Bloqueo Automático por Morosidad y Desbloqueo",
                "description": (
                    "Mecanismo de protección para impedir despachos a clientes con saldos vencidos:",
                    "• El sistema bloquea de forma autónoma al cliente cuando alcanza 31 días de mora o excede su límite de crédito.\n"
                    "• En Ventas [1], el botón de confirmación aparecerá deshabilitado con alerta roja.\n"
                    "• El desbloqueo solo puede autorizarlo la Dirección Financiera con firma digital documentada."
                ),
                "steps": [
                    "El analista identifica el cliente bloqueado en la vista de alertas.",
                    "Revisa el compromiso de pago firmado o garantía presentada por el cliente.",
                    "Si procede, el Gerente de Finanzas ingresa a la ficha y presiona [Liberar Temporalmente].",
                    "Se especifica un plazo máximo de gracia (ej: 48 horas) para regularizar pagos pendientes."
                ]
            }
        ],
        "governance_text": (
            "Existe estricta segregación entre el personal comercial que otorga crédito y el área de cobranza que concilia depósitos. "
            "Ningún cobrador puede recibir dinero en efectivo sin emitir de inmediato el comprobante numerado del ERP."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol en Cartera", "Permisos Operativos", "Restricciones de Gobernanza"],
            "data": [
                ["Gestor de Cobranza", "Consultar Saldos, Enviar Recordatorios", "No puede aplicar cobros directos sin comprobante bancario."],
                ["Analista de Caja / CxC", "Aplicar Cobros, Emitir Recibos", "Aplica pagos verificados contra cuenta de bancos."],
                ["Gerente de Finanzas", "Autorizar Límites de Crédito y Desbloqueos", "Único facultado para otorgar líneas de crédito corporativas."],
                ["Contador General", "Auditar Conciliación CxC vs Bancos", "Valida que el saldo de cartera cuadre con el balance general."]
            ]
        },
        "golden_rules": (
            "1. Cero tolerancia al retraso de aplicación: Todo depósito bancario debe aplicarse a la factura en menos de 24 horas hábiles.\n"
            "2. Límite de crédito inviolable: El sistema rechazará cotizaciones que superen el crédito disponible sin excepción técnica.\n"
            "3. Recibos fiscales oficiales: Toda cobranza debe acompañarse de su complemento de recepción de pago digital."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[1] Ventas", "Facturación a Crédito", "[8] CxC", "Registra nuevo saldo por cobrar y activa plazo de crédito."],
                ["[8] CxC", "Aplicar Cobro", "[10] Tesorería", "Acredita saldo en la cuenta bancaria seleccionada."],
                ["[8] CxC", "Aplicar Cobro", "[12] Contabilidad", "Póliza de Ingreso: Cargo a Bancos, Abono a Clientes e IVA Cobrado."],
                ["[8] CxC", "Cliente en Mora > 30 días", "[1] Ventas", "Bloquea generación de nuevos pedidos y entregas."]
            ]
        }
    },
    {
        "num": "9",
        "name": "Cuentas por Pagar & Pasivos",
        "folder_name": "Modulo 9 NyTEX Cuentas por Pagar y Pasivos",
        "phase_label": "Fase 1: Starter (Núcleo Operativo Básico)",
        "phase_dir": "Fase 1 Starter",
        "macro_area": "Área 4: Administración y Finanzas",
        "circuit": "Invoice-to-Pay (I2P) / Procure-to-Pay",
        "subtitle": "Programación Estratégica de Pagos a Proveedores, Control de Pasivos Corrientes, Retenciones Fiscales de Ley, Dispersión Bancaria y Pólizas de Egreso",
        "entities": "Facturas por Pagar, Programación de Pagos, Órdenes de Dispersión, Retenciones Fiscales y Proveedores",
        "routes": "/app/cxp, /app/circuito-fase1",
        "interconnections_summary": (
            "• [4] Compras: Recepción de pasivos aprobados mediante validación 3-Way Match.\n"
            "• [10] Tesorería: Calendario de pagos para proyección de flujo de caja y emisión de cheques/transferencias.\n"
            "• [12] Contabilidad: Asiento automático de Póliza de Egreso (Cargo a Proveedores, Abono a Bancos y Acreditación de IVA Pagado).\n"
            "• [26] Configuración: Parámetros de retención de IVA e Impuesto sobre la Renta según legislación fiscal."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [9] en la Gobernanza Financiera",
            "2. Ciclo del Pasivo: Desde la Provisión hasta la Dispersión Bancaria",
            "3. Estructura de Pantallas, Vistas por Vencimiento y Calendario de Pagos",
            "4. Procedimiento Operativo N° 1: Registro y Auditoría de Facturas de Proveedores",
            "5. Procedimiento Operativo N° 2: Aplicación de Retenciones Fiscales de Ley (IVA y Renta)",
            "6. Procedimiento Operativo N° 3: Programación y Calendario Semanal de Pagos",
            "7. Procedimiento Operativo N° 4: Emisión de Pagos, Dispersión Bancaria y Cierre de Pasivo",
            "8. Procedimiento Operativo N° 5: Generación de Comprobantes de Retención y Certificados",
            "9. Matriz de Integración con [4] Compras, [10] Tesorería y [12] Contabilidad",
            "10. Controles Internos, Segregación de Pagos y Políticas Antifraude"
        ],
        "executive_summary": (
            "El Módulo [9] NyTEX Cuentas por Pagar & Pasivos administra metódicamente las obligaciones financieras de la "
            "empresa con sus proveedores y prestadores de servicios. Optimiza el capital de trabajo al permitir que los pagos "
            "se realicen en la fecha exacta pactada, evitando moras sin pagar anticipadamente sin justificación.\n\n"
            "Calcula automáticamente las retenciones tributarias correspondientes, emite los certificados oficiales y alimenta "
            "la proyección de flujo de efectivo en [10] Tesorería."
        ),
        "purpose_detail": (
            "El módulo centraliza todas las deudas de la empresa en una sola bandeja de control, eliminando facturas traspapeladas "
            "o dobles pagos a un mismo proveedor. Permite crear lotes de pago para dispersión electrónica bancaria con autorización "
            "mancomunada.\n\n"
            "Al efectuarse el pago, el sistema cancela el pasivo en el módulo, rebaja el saldo en la cuenta bancaria de [10] Tesorería "
            "y genera en [12] Contabilidad la póliza de egreso con acreditación del IVA pagado."
        ),
        "without_module_impact": (
            "No contar con un módulo de Cuentas por Pagar estructurado produce:\n"
            "1. Pagos duplicados por error al recibir facturas repetidas del mismo proveedor.\n"
            "2. Pérdida de credibilidad comercial y corte de suministros por facturas vencidas no detectadas.\n"
            "3. Sanciones tributarias por no retener o enterar a tiempo los impuestos de ley (IVA/Renta).\n"
            "4. Imposibilidad de proyectar el flujo de caja semanal de Tesorería por falta de calendario de pasivos."
        ),
        "ecosystem_context": (
            "Como parte del macrocircuito Procure-to-Pay, CxP recibe los pasivos de Compras tras la validación 3-Way Match, "
            "organiza la agenda financiera y coordina con Tesorería la salida ordenada de fondos."
        ),
        "circuit_diagram": (
            "+-----------------------------------------------------------------------------------------+\n"
            "|                     CIRCUITO OPERATIVO INVOICE-TO-PAY (I2P)                             |\n"
            "+-----------------------------------------------------------------------------------------+\n"
            "|  [4] FACTURA VALIDADA ➔ [9] CALENDARIZACIÓN ➔ [9] RETENCIONES ➔ [9/10] DISPERSIÓN PAGO   |\n"
            "|   - 3-Way Match aprobado    - Fecha vencimiento     - IVA / Renta ley       - Transferencia     |\n"
            "|   - Provisión contable      - Lote de pago          - Certificado oficial   - Póliza de Egreso  |\n"
            "+-----------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La consola de CxP (/app/cxp) presenta KPIs de Pasivos Totales ($), Pasivos Vencidos ($), Pagos Programados de la Semana "
            "y Días Promedio de Pago (DPO). Incluye una tabla con filtros por fecha de vencimiento, proveedor, tipo de documento y estado de pago."
        ),
        "kpi_table": {
            "widths": [2.2, 1.8, 2.5],
            "headers": ["KPI de Cuentas por Pagar", "Fórmula / Indicador", "Objetivo de Negocio"],
            "data": [
                ["Días de Pago a Proveedores (DPO)", "(Cuentas por Pagar / Costo de Ventas) * 365", "Optimización del plazo de financiamiento sin caer en mora"],
                ["Pasivos Vencidos", "Σ (Facturas con Fecha Vencimiento < Hoy)", "Meta 0% para mantener excelente historial crediticio comercial"],
                ["Ahorro por Descuento Pronto Pago", "Σ Descuentos obtenidos por pago anticipado", "Maximización de la rentabilidad del exceso de liquidez"],
                ["Índice de Facturas con Discrepancia", "(Facturas Rechazadas / Total Facturas) * 100", "Control de calidad en facturas recibidas de proveedores"]
            ]
        },
        "procedures": [
            {
                "title": "Registro y Provisión de Facturas de Proveedores",
                "callout": {
                    "title": "FECHA DE EMISIÓN VS FECHA DE VENCIMIENTO",
                    "text": "La fecha de vencimiento se calcula automáticamente sumando los días de crédito contractuales a la fecha de recepción de la factura.",
                    "bg": "F0F9FF", "border": "0284C7"
                },
                "description": (
                    "Se asienta la factura oficial del proveedor vinculándola a su orden de compra correspondiente."
                ),
                "steps": [
                    "Hacer clic en [+ REGISTRAR FACTURA DE PROVEEDOR].",
                    "Seleccionar el Proveedor y escribir el Folio Fiscal (Factura / CCF).",
                    "Vincular con la Orden de Compra previa o seleccionar 'Gasto Directo' (servicios públicos, alquiler).",
                    "Capturar Subtotal, IVA y monto total de la factura.",
                    "Verificar el cálculo automático de retenciones fiscales si aplica.",
                    "Hacer clic en [Guardar y Contabilizar Provisión]. Se genera la póliza de diario en [12] Contabilidad."
                ]
            },
            {
                "title": "Programación y Calendario Semanal de Pagos",
                "callout": {
                    "title": "OPTIMIZACIÓN DE FLUJO DE CAJA",
                    "text": "La programación semanal agrupa los pagos por fecha de vencimiento para que Tesorería valide la disponibilidad de fondos antes de dispersar.",
                    "bg": "FFFBEB", "border": "D97706"
                },
                "description": (
                    "El coordinador de pagos elabora la propuesta de dispersión semanal para aprobación de Dirección Financiera."
                ),
                "steps": [
                    "Ingresar a la vista [Calendario de Pagos].",
                    "Filtrar las facturas con vencimiento en la semana en curso.",
                    "Seleccionar las facturas a programar marcando las casillas de verificación.",
                    "Hacer clic en [Crear Lote de Pago Semanal].",
                    "Revisar el total a pagar contra el saldo proyectado en [10] Tesorería.",
                    "Enviar el lote a revisión y visto bueno de la Gerencia Financiera."
                ]
            },
            {
                "title": "Dispersión Bancaria y Liquidación de Pasivos",
                "description": (
                    "Ejecución final de las transferencias bancarias autorizadas:",
                    "• Se genera el archivo de dispersión bancaria para banca electrónica.\n"
                    "• Al confirmarse las transferencias, se asienta la liquidación en el ERP.\n"
                    "• Se emite la Póliza de Egreso en [12] Contabilidad rebajando la cuenta de bancos."
                ),
                "steps": [
                    "Abrir el lote de pago con estatus 'Aprobado para Dispersión'.",
                    "Seleccionar la Cuenta Bancaria pagadora de [10] Tesorería.",
                    "Hacer clic en [Descargar Archivo Bancario] o [Dispersar Pagos].",
                    "Capturar los números de confirmación bancaria correspondientes.",
                    "Presionar [Liquidar Facturas]. El pasivo queda cerrado y el estado cambia a 'Pagado'."
                ]
            }
        ],
        "governance_text": (
            "Rigurosa segregación de funciones: La persona que captura facturas de proveedores no tiene permisos para programar "
            "lotes de pago ni para autorizar transferencias bancarias. Toda salida de fondos requiere doble autorización."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol en Pasivos", "Permisos Operativos", "Restricciones de Gobernanza"],
            "data": [
                ["Auxiliar de CxP", "Capturar Facturas, Validar Retenciones", "No puede autorizar pagos ni dispersar transferencias."],
                ["Jefe de CxP", "Elaborar Lotes Semanales de Pago", "Propone calendario de pagos sujeto a disponibilidad de caja."],
                ["Tesorero / Gerente Finanzas", "Autorizar y Ejecutar Dispersión Bancaria", "Único facultado para emitir transferencias efectivas."],
                ["Auditor Interno", "Revisión de Retenciones y Saldos de Pasivo", "Valida que no existan facturas duplicadas ni sobrepagos."]
            ]
        },
        "golden_rules": (
            "1. Prohibido pagar sin factura fiscal válida: No se emitirá ningún pago sin el comprobante tributario legalmente soportado.\n"
            "2. Retenciones automáticas obligatorias: Toda factura sujeta a retención de IVA o Renta debe procesarse con retención aplicada.\n"
            "3. Doble factor en transferencias: Ninguna dispersión bancaria se procesará en el ERP sin aprobación mancomunada."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[4] Compras", "3-Way Match Aprobado", "[9] CxP", "Genera pasivo por pagar con fecha de vencimiento contractual."],
                ["[9] CxP", "Crear Lote de Pago", "[10] Tesorería", "Reserva fondos en la proyección de flujo de caja semanal."],
                ["[9] CxP", "Liquidar Pago", "[10] Tesorería", "Descarga saldo de la cuenta bancaria de egresos."],
                ["[9] CxP", "Liquidar Pago", "[12] Contabilidad", "Póliza de Egreso: Cargo a Proveedores, Abono a Bancos e IVA Acreditable."]
            ]
        }
    },
    {
        "num": "12",
        "name": "Contabilidad Central & Pólizas",
        "folder_name": "Modulo 12 NyTEX Contabilidad Central y Polizas",
        "phase_label": "Fase 1: Starter (Núcleo Operativo Básico)",
        "phase_dir": "Fase 1 Starter",
        "macro_area": "Área 4: Administración y Finanzas",
        "circuit": "Record-to-Report (R2R)",
        "subtitle": "Motor Automático de Pólizas Contables, Balanza de Comprobación en Tiempo Real, Catálogo de Cuentas Agrupador, Libros de IVA Legales y Cumplimiento Tributario",
        "entities": "Pólizas Contables (Diario, Ingreso, Egreso), Catálogo de Cuentas, Balanza de Comprobación, Libros de IVA y Cierres Fiscales",
        "routes": "/app/contabilidad, /app/circuito-fase1",
        "interconnections_summary": (
            "• [1] Ventas: Generación automática de pólizas de ingresos, IVA débito y costo de venta.\n"
            "• [4] Compras: Generación automática de pólizas de compras, gastos y retenciones fiscales.\n"
            "• [8] CxC: Pólizas de ingreso por cobranza y traslado de IVA devengado a cobrado.\n"
            "• [9] CxP: Pólizas de egreso por pagos a proveedores y cancelación de pasivos.\n"
            "• [3] Inventario: Contabilización periódica de ajustes por merma y variación de existencias.\n"
            "• [18] BI y Reportes: Generación de Estados Financieros bajo Normas IFRS / NIIF."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [12] como Núcleo de la Verdad Contable",
            "2. El Motor de Pólizas Automáticas: Reglas de Mapeo y Cuadre Matemático",
            "3. Estructura de Pantallas, Selector de Periodos y Tarjetas de Control Fiscal",
            "4. Procedimiento Operativo N° 1: Auditoría y Filtrado de Pólizas Contables en Vivo",
            "5. Procedimiento Operativo N° 2: Creación Manual de Pólizas de Ajuste y Reclasificación",
            "6. Procedimiento Operativo N° 3: Consulta y Exportación de la Balanza de Comprobación Cuadrada",
            "7. Procedimiento Operativo N° 4: Generación de Libros Legales Digitales de IVA (Compras y Ventas)",
            "8. Procedimiento Operativo N° 5: Declaración Mensual de IVA (F-07), Pago a Cuenta (F-14) y Candado Fiscal",
            "9. Matriz de Integración Integral con Todos los Módulos Transaccionales",
            "10. Gobernanza Contable, Inmutabilidad Criptográfica de Asientos y Auditoría Fiscal"
        ],
        "executive_summary": (
            "El Módulo [12] NyTEX Contabilidad Central & Pólizas es el cerebro normativo y fiscal de la empresa. "
            "A diferencia de los sistemas tradicionales donde los contadores deben digitar manualmente cada factura y recibo, "
            "NyTEX cuenta con un motor transaccional que contabiliza en tiempo real cada evento ocurrido en Ventas, Compras, "
            "Inventarios, CxC, CxP y Tesorería.\n\n"
            "Garantiza que la Balanza de Comprobación siempre esté cuadrada al centavo y que los libros legales y declaraciones "
            "fiscales se generen de manera digital con sello de inmutabilidad."
        ),
        "purpose_detail": (
            "El módulo transforma transacciones operativas en lenguaje contable estandarizado. Cada vez que se factura en Ventas [1], "
            "se compra en [4] o se cobra en [8], el sistema genera instantáneamente la póliza con partida doble perfecta (Cargos = Abonos).\n\n"
            "Asimismo, incluye la localización fiscal completa con cálculo automatizado de declaraciones de impuestos (IVA, Pago a Cuenta, "
            "Retenciones) y aplicación de candados fiscales mensuales que impiden modificaciones extemporáneas en periodos ya declarados."
        ),
        "without_module_impact": (
            "Operar sin el módulo de Contabilidad Central ocasiona:\n"
            "1. Ceguera financiera: La dirección desconoce las utilidades y márgenes reales hasta semanas después de cerrado el mes.\n"
            "2. Retrasos y multas tributarias graves por errores o desfases en las declaraciones de impuestos.\n"
            "3. Cargas laborales extenuantes para el equipo contable capturando pólizas manuales en hojas de cálculo externas.\n"
            "4. Vulnerabilidad en auditorías fiscales externas por falta de trazabilidad entre pólizas y documentos origen."
        ),
        "ecosystem_context": (
            "En el circuito Record-to-Report (R2R), la Contabilidad Central es el receptor universal. Consolida todos los flujos "
            "operativos del ERP en libros oficiales y entrega los balances para la toma de decisiones estratégicas de la Dirección."
        ),
        "circuit_diagram": (
            "+-----------------------------------------------------------------------------------------+\n"
            "|                     CIRCUITO OPERATIVO RECORD-TO-REPORT (R2R)                           |\n"
            "+-----------------------------------------------------------------------------------------+\n"
            "|  OPERACIÓN ERP ➔ [12] MOTOR DE PÓLIZAS ➔ [12] BALANZA CUADRADA ➔ [12] LIBROS & CIERRE   |\n"
            "|   - Ventas, Compras, Stock    - Asiento Partida Doble    - Débitos = Créditos   - Libros IVA    |\n"
            "|   - Tesorería, Cobranzas      - Reglas de Cuentas        - Auditoría en Vivo    - Candado Fiscal|\n"
            "+-----------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La pantalla de Contabilidad (/app/contabilidad) presenta tarjetas de control: Total Débitos ($), Total Créditos ($), "
            "Diferencia de Cuadre ($0.00), Estado del Periodo Fiscal (Abierto/Cerrado) e Indicadores de Impuestos. Cuenta con pestañas "
            "de navegación: [Pólizas Contables], [Balanza de Comprobación], [Libros de IVA], [Declaraciones Fiscales] y [Catálogo de Cuentas]."
        ),
        "kpi_table": {
            "widths": [2.2, 1.8, 2.5],
            "headers": ["Indicador Contable", "Valor / Estatus", "Importancia Normativa"],
            "data": [
                ["Diferencia de Cuadre", "$0.00 (Centavos exactos)", "Garantía matemática de partida doble en todas las pólizas del sistema"],
                ["Pólizas Automáticas vs Manuales", "> 95% Automáticas", "Medición de automatización contable y reducción de captura manual"],
                ["Estatus de Cierre Fiscal", "Candado Fiscal Aplicado", "Seguridad contra alteraciones en periodos tributarios declarados"],
                ["Conciliación Débito/Crédito IVA", "Cuadrado con Libros Legales", "Prevención de discrepancias ante la autoridad tributaria"]
            ]
        },
        "procedures": [
            {
                "title": "Auditoría y Filtrado de Pólizas Contables en Tiempo Real",
                "callout": {
                    "title": "TRAZABILIDAD TOTAL AL DOCUMENTO ORIGEN",
                    "text": "Cada póliza automática contiene un enlace directo al documento que la generó (Factura, Pago, Recepción, Ajuste).",
                    "bg": "F0F9FF", "border": "0284C7"
                },
                "description": (
                    "El contador audita los asientos generados por la operación diaria para comprobar cuentas y montos."
                ),
                "steps": [
                    "Ingresar a /app/contabilidad en la pestaña [Pólizas Contables].",
                    "Filtrar por rango de fechas, tipo de póliza (Diario, Ingreso, Egreso) o módulo origen.",
                    "Hacer clic en el folio de la póliza (ej: POL-2026-00412) para ver el detalle de cuentas cargadas y abonadas.",
                    "Verificar que la sumatoria de cargos sea exactamente igual a la sumatoria de abonos.",
                    "Hacer clic en [Ver Documento Origen] para auditar la factura o cobro vinculado."
                ]
            },
            {
                "title": "Generación y Consulta de la Balanza de Comprobación",
                "callout": {
                    "title": "BALANZA CUADRADA EN VIVO",
                    "text": "La balanza se calcula en tiempo real; no requiere esperar al fin de mes para conocer saldos de cuentas de balance y resultados.",
                    "bg": "F0FDF4", "border": "10B981"
                },
                "description": (
                    "Se emite la balanza con saldos iniciales, movimientos del mes (debe y haber) y saldos finales."
                ),
                "steps": [
                    "Seleccionar la pestaña [Balanza de Comprobación].",
                    "Elegir el ejercicio fiscal (año) y el periodo mensual a consultar.",
                    "Seleccionar el nivel de detalle de cuentas (Nivel Mayor, Nivel Subcuenta o Nivel Auxiliar).",
                    "Comprobar al pie de la tabla que las sumas de Debe y Haber coincidan exactamente con diferencia $0.00.",
                    "Presionar [Descargar Balanza PDF] o [Exportar Excel] para firma de contador y auditor externo."
                ]
            },
            {
                "title": "Declaraciones Fiscales y Aplicación del Candado Mensual",
                "description": (
                    "Cierre definitivo de los periodos fiscales declarados ante la autoridad tributaria:",
                    "• Generación automática de Libros de IVA (Ventas a Contribuyente, Consumidor Final y Compras).\n"
                    "• Cálculo de formularios oficiales (F-07 IVA, F-14 Renta y Pago a Cuenta).\n"
                    "• Aplicación del Candado Fiscal Criptográfico que sella el periodo para evitar manipulaciones."
                ),
                "steps": [
                    "Ir a la pestaña [Declaraciones Fiscales].",
                    "Revisar los importes consolidados de Débito Fiscal, Crédito Fiscal y Remanente.",
                    "Generar los archivos legales TXT / CSV para carga en la plataforma de la autoridad fiscal.",
                    "Una vez presentada la declaración, hacer clic en [🔒 APLICAR CANDADO FISCAL].",
                    "El periodo queda blindado; ninguna transacción previa a esa fecha podrá ser editada ni eliminada."
                ]
            }
        ],
        "governance_text": (
            "La contabilidad es inmutable. Los asientos contables no se pueden borrar ni editar una vez generados; cualquier "
            "corrección exige una póliza de reclasificación o contra-asiento formalmente justificada. Los candados fiscales son irreversibles."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol Contable", "Permisos Operativos", "Restricciones de Gobernanza"],
            "data": [
                ["Auxiliar Contable", "Consultar Pólizas, Capturar Asientos Borrador", "No puede aplicar candados ni modificar catálogo."],
                ["Contador General", "Crear Pólizas Manuales, Generar Libros IVA", "Responsable técnico de la presentación de declaraciones."],
                ["Auditor Fiscal", "Acceso Total a Balanzas y Trazabilidad", "Permiso de sólo lectura con certificación de auditoría."],
                ["Director de Finanzas", "Autorizar Cierres Anuales y Políticas Contables", "Facultad exclusiva para reabrir periodos bajo protocolo formal."]
            ]
        },
        "golden_rules": (
            "1. Partida doble obligatoria: El sistema impedirá físicamente guardar cualquier póliza manual con diferencia mayor a $0.00.\n"
            "2. Inmutabilidad de periodos cerrados: Un periodo con candado fiscal jamás aceptará movimientos extemporáneos.\n"
            "3. Conciliación diaria: Las cuentas puente de bancos y clientes deben conciliarse diariamente contra sus módulos auxiliares."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[1] Ventas", "Facturación DTE", "[12] Contabilidad", "Póliza de Venta: Cargo Clientes, Abono Ventas e IVA Débito."],
                ["[4] Compras", "3-Way Match", "[12] Contabilidad", "Póliza de Compra: Cargo Inventario/Gasto e IVA Crédito, Abono Proveedores."],
                ["[8] CxC", "Cobro de Cartera", "[12] Contabilidad", "Póliza de Ingreso: Cargo Bancos, Abono Clientes y Traslado de IVA."],
                ["[9] CxP", "Pago de Proveedor", "[12] Contabilidad", "Póliza de Egreso: Cargo Proveedores, Abono Bancos y Retenciones de Ley."]
            ]
        }
    },
    {
        "num": "17",
        "name": "WMS (Gestión de Almacenes)",
        "folder_name": "Modulo 17 NyTEX WMS",
        "phase_label": "Fase 1: Starter (Núcleo Operativo Básico)",
        "phase_dir": "Fase 1 Starter",
        "macro_area": "Área 2: Cadena de Suministro",
        "circuit": "Order-to-Delivery (O2D) / Warehouse Execution",
        "subtitle": "Gestión Integral de Almacenes en Piso: Ubicaciones Físicas (Pasillo-Estante-Nivel), Picking con Código de Barras / Radiofrecuencia, Packing y Embalaje",
        "entities": "Ubicaciones (Bin Locations), Tareas de Picking, Hojas de Empaque (Packing Lists), Bahías de Carga y Lectores RF",
        "routes": "/app/wms, /app/circuito-fase1",
        "interconnections_summary": (
            "• [1] Ventas: Recepción de pedidos confirmados para preparación inmediata de surtido.\n"
            "• [3] Inventario: Actualización en tiempo real de ubicaciones y descuento de stock en piso.\n"
            "• [7] Logística: Liberación de pedidos embalados a patio de maniobras para ruta de entrega.\n"
            "• [4] Compras: Recepción guiada de mercancía y colocación eficiente en estanterías (Putaway)."
        ),
        "toc": [
            "1. Definición, Objetivos y Función del Módulo [17] WMS en la Operación de Bodega",
            "2. Arquitectura de Almacén: Mapeo de Zonas, Pasillos, Racks, Estantes y Niveles",
            "3. Estructura de Pantallas, Vistas de Operador y Consola de Supervisión WMS",
            "4. Procedimiento Operativo N° 1: Configuración de Ubicaciones Maestras (Bínes Físicos)",
            "5. Procedimiento Operativo N° 2: Ejecución de Picking Guiado con Lector Óptico de Código de Barras",
            "6. Procedimiento Operativo N° 3: Empaque, Pesaje y Generación de la Etiqueta de Embalaje",
            "7. Procedimiento Operativo N° 4: Protocolo de Putaway (Acomodo Óptimo de Mercancía Recibida)",
            "8. Procedimiento Operativo N° 5: Liberación y Transferencia de Carga a Despacho y Logística [7]",
            "9. Matriz de Integración con [1] Ventas, [3] Inventario, [4] Compras y [7] Logística",
            "10. Seguridad Operativa en Almacén, Ergonomía y Políticas Cero Errores de Surtido"
        ],
        "executive_summary": (
            "El Módulo [17] NyTEX WMS (Warehouse Management System) es el sistema de control operativo en tiempo real para las bodegas "
            "y centros de distribución. Mientras que [3] Inventario lleva el saldo contable y valorizado, el WMS controla la ubicación "
            "física exacta de cada pieza (en qué pasillo, rack y nivel se encuentra).\n\n"
            "Optimiza las rutas de los almacenistas en bodega, automatiza el surtido mediante lectores ópticos de código de barras "
            "y elimina el error humano en los pedidos entregados a los clientes."
        ),
        "purpose_detail": (
            "En un almacén moderno sin WMS, los operarios pierden hasta el 60% de su tiempo buscando productos en estanterías "
            "desordenadas o surtiendo códigos equivocados. El Módulo [17] organiza las órdenes de picking por cercanía de ubicación, "
            "guiando al almacenista por la ruta más corta.\n\n"
            "Cada lectura con pistola de radiofrecuencia valida que el SKU escaneado sea exactamente el solicitado por el cliente. "
            "Al completar el empaque, el paquete queda etiquetado y listo para ser subido a la unidad de transporte en [7] Logística."
        ),
        "without_module_impact": (
            "Carecer de un módulo WMS especializado provoca:\n"
            "1. Envíos equivocados de productos a clientes, generando devoluciones costosas y desprestigio comercial.\n"
            "2. Cuellos de botella graves en el área de empaque durante picos de venta.\n"
            "3. Desconocimiento de la ubicación física de los artículos en bodegas de mediano o gran tamaño.\n"
            "4. Daños y mermas por almacenamiento incorrecto de productos pesados o frágiles."
        ),
        "ecosystem_context": (
            "Dentro del circuito Order-to-Delivery (O2D), el WMS recibe la orden confirmada de Ventas, ejecuta la preparación "
            "física de la mercancía con cero errores y entrega el pedido consolidado a Logística para su distribución."
        ),
        "circuit_diagram": (
            "+-----------------------------------------------------------------------------------------+\n"
            "|                     CIRCUITO OPERATIVO DE ALMACÉN WMS (O2D)                             |\n"
            "+-----------------------------------------------------------------------------------------+\n"
            "|  [1] PEDIDO CONFIRMADO ➔ [17] PICKING GUIADO ➔ [17] PACKING & ETIQUETA ➔ [7] DESPACHO    |\n"
            "|   - Orden de surtido       - Lectura código barras  - Verificación de peso  - Rampa de patio    |\n"
            "|   - Ubicación en rack      - Validación de SKU      - Packing list digital  - Guía de transporte|"
            "+-----------------------------------------------------------------------------------------+"
        ),
        "screen_structure": (
            "La consola de WMS (/app/wms) ofrece dos interfaces: la vista de escritorio para supervisor y la interfaz táctil "
            "simplificada para terminales portátiles / PDAs de los operarios de piso. Despliega Órdenes Pendientes de Surtir, "
            "Líneas Picadas por Hora, Tiempo Promedio de Preparación y Bahías Activas."
        ),
        "kpi_table": {
            "widths": [2.2, 1.8, 2.5],
            "headers": ["Métrica WMS", "Fórmula / Indicador", "Objetivo Operacional"],
            "data": [
                ["Precisión de Picking (Order Accuracy)", "(Pedidos sin Error / Pedidos Totales) * 100", "Meta clase mundial: 99.8% de precisión en surtido"],
                ["Líneas por Hora (LPH)", "Líneas de SKU picadas / Horas hombre trabajadas", "Medición de productividad de los operarios de bodega"],
                ["Tiempo de Ciclo de Pedido (Dock-to-Stock)", "Minutos desde confirmación de venta hasta empaque final", "Reducción de tiempos de entrega al cliente"],
                ["Utilización de Capacidad Cúbica", "(Volumen Ocupado / Volumen Total Almacén) * 100", "Aprovechamiento del espacio vertical en estanterías"]
            ]
        },
        "procedures": [
            {
                "title": "Configuración de Ubicaciones Maestras (Bínes Físicos)",
                "callout": {
                    "title": "NOMENCLATURA ESTÁNDAR DE BODEGA",
                    "text": "Cada ubicación física se codifica con la fórmula P-RR-EE-NN (Pasillo - Rack - Estante - Nivel). Cada bí́n cuenta con código de barras.",
                    "bg": "F0FDF4", "border": "10B981"
                },
                "description": (
                    "Se parametriza el mapa tridimensional del almacén para dirigir con precisión a los operarios."
                ),
                "steps": [
                    "Ingresar a /app/wms en la sección [Mapa y Ubicaciones de Almacén].",
                    "Crear las zonas operativas: Almacenamiento General, Picking Rápido, Zona Fría, Bahía de Recepción y Despacho.",
                    "Generar las coordenadas de ubicaciones: Pasillo, Rack, Estante y Nivel.",
                    "Asignar la capacidad máxima de peso y volumen por bí́n.",
                    "Imprimir las etiquetas con código de barras para fijarlas físicamente en las vigas de los racks."
                ]
            },
            {
                "title": "Ejecución de Picking Guiado con Lector Óptico",
                "callout": {
                    "title": "VALIDACIÓN OBLIGATORIA POR ESCANEO",
                    "text": "El sistema no permite confirmar una partida si el código de barras escaneado no coincide con el SKU del pedido.",
                    "bg": "EFF6FF", "border": "3B82F6"
                },
                "description": (
                    "El almacenista toma una terminal móvil y prepara los productos de una orden de venta."
                ),
                "steps": [
                    "En la terminal móvil, el operario selecciona la siguiente orden asignada en estado 'Pendiente'.",
                    "El sistema muestra la primera ubicación a visitar (ej: P02-R04-E01-N02).",
                    "El operario se desplaza a la posición y escanea el código de barras de la ubicación para confirmar su presencia.",
                    "Toma el producto y escanea el código de barras del SKU.",
                    "Ingresa la cantidad física tomada y presiona [Confirmar Partida].",
                    "El sistema lo dirige automáticamente a la siguiente ubicación por la ruta más corta hasta completar el pedido."
                ]
            },
            {
                "title": "Empaque (Packing), Etiquetado y Liberación a Despacho",
                "description": (
                    "Fase final de control de calidad antes de que el pedido abandone el almacén:",
                    "• El operario traslada los productos a la mesa de empaque.\n"
                    "• Se verifica el peso total contra la báscula digital conectada.\n"
                    "• Se imprime la etiqueta de embalaje con código de rastreo unificado y se coloca en la rampa de despacho."
                ),
                "steps": [
                    "Colocar los productos en la mesa de empaque y escanear el folio de la orden.",
                    "El sistema efectúa el doble chequeo de artículos.",
                    "Colocar el paquete en la báscula; el peso se captura automáticamente en el ERP.",
                    "Presionar [Generar Etiqueta de Despacho]. Se imprime la etiqueta con el folio TRK-XXXX.",
                    "Mover el paquete a la bahía de salida. El pedido pasa a estado 'Listo para Carga' hacia [7] Logística."
                ]
            }
        ],
        "governance_text": (
            "Está prohibido despachar cualquier bulto sin su etiqueta de empaque oficial escaneada. Los inventarios de bínes "
            "son auditados aleatoriamente por supervisores para detectar inconsistencias antes de que afecten a los clientes."
        ),
        "rbac_table": {
            "widths": [1.8, 1.6, 3.1],
            "headers": ["Rol en Bodega", "Permisos Operativos", "Restricciones de Gobernanza"],
            "data": [
                ["Operario de Picking", "Ejecutar Tareas de Recolección en Terminal", "No puede alterar cantidades solicitadas ni reasignar pedidos."],
                ["Operario de Packing", "Empacar, Pesar y Generar Etiquetas", "Responsable de la calidad del embalaje y protección de mercancía."],
                ["Supervisor de WMS", "Asignar Rutas de Picking, Resolver Discrepancias", "Autoriza excepciones en piso cuando falta un producto en bí́n."],
                ["Jefe de Operaciones", "Reorganizar Zonas de Almacén y Bínes", "Control de la configuración física y capacidades de la planta."]
            ]
        },
        "golden_rules": (
            "1. Escaneo obligatorio en cada paso: Prohibido digitar códigos manualmente en las terminales de radiofrecuencia.\n"
            "2. Rutas optimizadas inalterables: Los operarios deben respetar el orden de recorrido calculado por el algoritmo de WMS.\n"
            "3. Rampa limpia: Ningún paquete puede permanecer más de 2 horas en rampa de despacho sin asignación de vehículo."
        ),
        "integration_table": {
            "widths": [1.4, 1.8, 1.3, 2.0],
            "headers": ["Módulo Origen", "Evento Disparador", "Módulo Destino", "Impacto Operativo y Contable"],
            "data": [
                ["[1] Ventas", "Confirmar Pedido", "[17] WMS", "Genera orden de preparación física y reserva unidades en bí́n."],
                ["[17] WMS", "Finalizar Picking", "[3] Inventario", "Actualiza stock de 'Comprometido' a 'En Tránsito a Empaque'."],
                ["[17] WMS", "Finalizar Packing", "[7] Logística", "Transfiere bulto a rampa de salida y genera guía de despacho."],
                ["[4] Compras", "Recepción en Bahía", "[17] WMS", "Habilita tarea guiada de acomodo (Putaway) en estanterías."]
            ]
        }
    }
]
