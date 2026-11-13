# -*- coding: utf-8 -*-
"""
Generador del Manual Oficial en formato Word (.docx):
Módulo [1] NyTEX CRM (Embudo de Ventas)
Circuito Lead-to-Order (L2O) - Fase 2 Express / Enterprise
Consultores NyT S.A. de C.V.
"""

import os
import sys
import shutil

sys.stdout.reconfigure(encoding='utf-8')
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_callout(doc, title, text, bg_hex="F0FDF4", border_hex="10B981"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_background(cell, bg_hex)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:left w:val="single" w:sz="24" w:space="0" w:color="{border_hex}"/><w:top w:val="none"/><w:right w:val="none"/><w:bottom w:val="none"/></w:tcBorders>')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(2)
    run_title = p.add_run(f"{title}\n")
    run_title.bold = True
    run_title.font.name = "Arial"
    run_title.font.size = Pt(10.5)
    run_title.font.color.rgb = RGBColor.from_string(border_hex)
    
    run_text = p.add_run(text)
    run_text.font.name = "Arial"
    run_text.font.size = Pt(9.5)
    run_text.font.color.rgb = RGBColor(40, 40, 40)
    doc.add_paragraph()

def add_code_box(doc, text):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_background(cell, "0F172A")
    set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    run.font.name = "Consolas"
    run.font.size = Pt(8.5)
    run.font.color.rgb = RGBColor(226, 232, 240)
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

def style_table(table, col_widths, headers, data, align_rights=[]):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Header row
    hdr_cells = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr_cells[i].text = h
        set_cell_background(hdr_cells[i], "0A2540")
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=140, right=140)
        p = hdr_cells[i].paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        if i in align_rights:
            p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        for r in p.runs:
            r.font.name = "Arial"
            r.font.size = Pt(9.5)
            r.font.bold = True
            r.font.color.rgb = RGBColor(255, 255, 255)

    # Data rows
    for row_idx, row_data in enumerate(data):
        row = table.add_row()
        fill_color = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(row_data):
            cell = row.cells[col_idx]
            cell.text = str(text)
            set_cell_background(cell, fill_color)
            set_cell_margins(cell, top=90, bottom=90, left=130, right=130)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            if col_idx in align_rights:
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            for r in p.runs:
                r.font.name = "Arial"
                r.font.size = Pt(9)
                r.font.color.rgb = RGBColor(30, 41, 59)

    # Set column widths
    for row in table.rows:
        for idx, width in enumerate(col_widths):
            row.cells[idx].width = Inches(width)

def build_document():
    doc = docx.Document()

    # Configuración de márgenes estándar A4
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        
        # Header / Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("ERP NyTEX 4.0 • Módulo [1] CRM (Embudo de Ventas) • Circuito Lead-to-Order")
        hrun.font.name = "Arial"
        hrun.font.size = Pt(8)
        hrun.font.color.rgb = RGBColor(140, 140, 140)

        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Documento Oficial de Capacitación • Consultores NyT S.A. de C.V. • Confidencial")
        frun.font.name = "Arial"
        frun.font.size = Pt(8)
        frun.font.color.rgb = RGBColor(140, 140, 140)

    # -------------------------------------------------------------
    # PORTADA / COVER PAGE
    # -------------------------------------------------------------
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(30)
    title_p.paragraph_format.space_after = Pt(6)
    r_tag = title_p.add_run("ERP NyTEX • CIRCUITO LEAD-TO-ORDER (L2O)\n")
    r_tag.font.name = "Arial"
    r_tag.font.size = Pt(11)
    r_tag.font.bold = True
    r_tag.font.color.rgb = RGBColor(0, 110, 173) # #006EAD
    
    r_title = title_p.add_run("Módulo [1] — NyTEX CRM (Embudo de Ventas)")
    r_title.font.name = "Arial"
    r_title.font.size = Pt(24)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(10, 37, 64) # #0A2540
    
    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_after = Pt(20)
    r_sub = sub_p.add_run("Manual de Usuario Oficial y Guía Operativa Integral de Capacitación Tarea por Tarea\n"
                          "Incluye Bandeja Omnicanal (WhatsApp/Instagram/Correo/Web), Búsqueda Predictiva de Kardex, Integración con Módulo 2 y Panel Analítico BI de Cotizaciones vs Vendidas y Pérdidas por Códigos")
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(11.5)
    r_sub.font.color.rgb = RGBColor(100, 116, 139)

    add_callout(doc, "FICHA TÉCNICA DE IMPLEMENTACIÓN EMPRESARIAL",
                "• Ecosistema: ERP NyTEX Versión 4.0\n"
                "• Fase de Implementación: Fase 2: Express en adelante (Express, Advanced, Enterprise)\n"
                "• Circuito Operativo: Lead-to-Order (L2O) / Prospección, Maduración, Cotización y Conversión Comercial\n"
                "• Canales Omnicanal Integrados: WhatsApp Business, Instagram Direct, Correo Electrónico y Web Chat\n"
                "• Moneda Base de Cotización: Dólares de los Estados Unidos (USD) / Moneda Local de Negociación\n"
                "• Módulos Interconectados:\n"
                "   – [0] Business Partners: Catálogo oficial de clientes y contactos sincronizados en tiempo real.\n"
                "   – [2] Ventas & Facturación: Facturación en caja de cotizaciones autorizadas sin recaptura manual.\n"
                "   – [7] Logística & Despacho: Definición de Modalidad de Entrega (Mostrador vs Domicilio), dirección de flete y disparo de Orden de Embarque para reparto.\n"
                "   – [4] Inventarios & Stock: Búsqueda predictiva y consulta de existencias de Kardex en vivo.\n"
                "   – [5] Planeación de Demanda: Forecast ponderado de ventas y auditoría de fugas para reposición.\n"
                "   – [8] Cuentas por Cobrar (CxC): Condiciones de crédito pactadas y apertura de línea comercial.\n"
                "   – [12] Contabilidad Central: Trazabilidad de origen desde oportunidad hasta póliza de ingresos.\n"
                "• Fecha de Emisión: Noviembre 2026 • Consultores NyT S.A. de C.V.",
                bg_hex="F0F9FF", border_hex="0284C7")

    doc.add_page_break()

    # -------------------------------------------------------------
    # TABLA DE CONTENIDOS
    # -------------------------------------------------------------
    h_toc = doc.add_heading(level=1)
    r_toc = h_toc.add_run("Índice de Contenido General")
    r_toc.font.name = "Arial"
    r_toc.font.color.rgb = RGBColor(10, 37, 64)

    toc_items = [
        "1. Definición y Función del Módulo [1] dentro del Circuito Lead-to-Order (L2O)",
        "2. Mapa Comparativo de Circuitos y Ecosistema de Módulos NyTEX",
        "3. Estructura de la Pantalla Principal, Selector de Vistas y KPIs en Vivo",
        "4. Procedimiento Operativo N° 1: Captación, Registro y Calificación BANT de Oportunidades",
        "5. Procedimiento Operativo N° 2: Búsqueda Predictiva Incremental y Selección Ágil de SKUs en Kardex",
        "6. Procedimiento Operativo N° 3: Gestión Visual del Embudo (Pipeline Kanban) y Maduración de Etapas",
        "7. Procedimiento Operativo N° 4: Historial de Actividades, Bitácora Comercial y Seguimiento",
        "8. Procedimiento Operativo N° 5: Integración Comercial y Facturación en Caja en NyTEX Ventas [2]",
        "9. Procedimiento Operativo N° 6: Bandeja Omnicanal Integrada (WhatsApp, Instagram, Correo y Web)",
        "10. Procedimiento Operativo N° 7: Tablero Analítico BI de Cotizaciones Generadas vs Vendidas y Pérdidas por Códigos",
        "11. Matriz de Interconexión e Impacto con los Demás Módulos del Ecosistema NyTEX",
        "12. Buenas Prácticas Comerciales, Segregación de Funciones y Gobernanza del Pipeline"
    ]

    for item in toc_items:
        p_item = doc.add_paragraph()
        p_item.paragraph_format.space_before = Pt(3)
        p_item.paragraph_format.space_after = Pt(3)
        r = p_item.add_run(item)
        r.font.name = "Arial"
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = RGBColor(30, 41, 59)

    doc.add_paragraph().paragraph_format.space_after = Pt(15)

    # -------------------------------------------------------------
    # SECCIÓN 1: DEFINICIÓN Y FUNCIÓN
    # -------------------------------------------------------------
    h1 = doc.add_heading(level=1)
    r1 = h1.add_run("1. Definición y Función del Módulo [1] dentro del Circuito Lead-to-Order (L2O)")
    r1.font.name = "Arial"
    r1.font.color.rgb = RGBColor(10, 37, 64)

    add_callout(doc, "DEFINICIÓN EJECUTIVA DEL MÓDULO [1]",
                "Así como el Módulo [2] NyTEX Ventas & Facturación gestiona el ciclo comercial formal dentro del circuito Order-to-Cash (O2C) "
                "(desde el despacho en bodega y timbrado fiscal hasta la cartera y póliza contable), el Módulo [1] NyTEX CRM (Embudo de Ventas) "
                "gestiona el ciclo integral de prospección comercial, calificación técnica, cotización estructurada, omnicanalidad (WhatsApp, Instagram, Correo, Web) "
                "y conversión de prospectos dentro del circuito Lead-to-Order (L2O).\n\n"
                "Su función primordial es captar y estructurar todas las oportunidades comerciales en un pipeline visual dinámico por etapas, "
                "calificando su viabilidad económica mediante metodologías estandarizadas (BANT), consultando en vivo el Kardex de inventarios [4] con búsqueda predictiva, "
                "proyectando ingresos futuros con métricas en tiempo real e interconectando fluidamente las cotizaciones autorizadas por clientes "
                "hacia Ventas [2] para que la cajera o facturador emita los comprobantes fiscales sin recaptura manual y garantizando la estricta segregación de funciones.",
                bg_hex="F0FDF4", border_hex="10B981")

    p_desc = doc.add_paragraph()
    p_desc.add_run("El Módulo [1] representa la puerta de entrada de nuevos ingresos para la organización. Antes de que una transacción comercial se formalice en una factura, "
                   "el prospecto atraviesa un ciclo de maduración donde se recopilan sus especificaciones técnicas, volúmenes de consumo, capacidad crediticia y plazos requeridos. "
                   "La integración nativa de NyTEX CRM con el resto del ERP garantiza que la promesa comercial efectuada al cliente concuerde con el stock físico de almacenes, "
                   "la capacidad fabril y las políticas financieras corporativas.")

    doc.add_heading(level=2).add_run("Alcance Funcional por Fase de Implementación")
    p_fases = doc.add_paragraph()
    p_fases.add_run("En la arquitectura modular y escalable de NyTEX, el proceso comercial se despliega de acuerdo con la madurez operativa de la empresa:\n\n"
                    "• Fase 1: Starter: Se opera principalmente la venta de mostrador, venta transaccional directa o sobre catálogo precargado de clientes en Ventas [2], "
                    "sin requerir aún una fuerza de ventas consultiva con pipeline de negociación largo.\n\n"
                    "• Fase 2: Express: Se activa formalmente el Módulo [1] CRM con su tablero Kanban de 5 etapas, cotizador con Kardex interactivo, calificación BANT "
                    "y conversión automática de cotizaciones hacia Ventas [2].\n\n"
                    "• Fase 3: Advanced: Se incorpora la Bandeja Omnicanal integrada para WhatsApp Business, Instagram Direct y Correo Electrónico, junto con el "
                    "Panel Analítico Multidimensional de Fugas y Rendimiento por Códigos (SKU).\n\n"
                    "• Fase 4: Enterprise: Se habilita la analítica predictiva de cierre asistida por IA, automatización de SLA en reclamos comerciales, auditoría profunda "
                    "y sincronización bidireccional continua con WhatsApp Cloud API y canales de comercio electrónico B2B.")

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECCIÓN 2: MAPA COMPARATIVO DE CIRCUITOS
    # -------------------------------------------------------------
    h2 = doc.add_heading(level=1)
    r2 = h2.add_run("2. Mapa Comparativo de Circuitos y Ecosistema de Módulos NyTEX")
    r2.font.name = "Arial"
    r2.font.color.rgb = RGBColor(10, 37, 64)

    p_map = doc.add_paragraph()
    p_map.add_run("Para comprender la delimitación funcional de NyTEX, la siguiente tabla resume los tres macrocircuitos que gobiernan las transacciones mercantiles y operativas:")

    tbl_circ = doc.add_table(rows=1, cols=4)
    col_w_circ = [1.8, 1.8, 1.8, 1.8]
    headers_circ = ["Dimensión", "Lead-to-Order (L2O)\nMódulo [1] CRM", "Order-to-Cash (O2C)\nMódulos [2, 3, 4, 8]", "Procure-to-Pay (P2P)\nMódulos [6, 7, 9, 11]"]
    data_circ = [
        ["Objetivo Principal", "Captar, madurar y cotizar oportunidades comerciales.", "Surtir, facturar (DTE) y cobrar pedidos autorizados.", "Abastecer materiales, recibir en almacén y pagar proveedores."],
        ["Documento Clave", "Oportunidad Comercial / Cotización Estructurada.", "Pedido de Venta / Factura de Consumidor Final o CCF.", "Orden de Compra / DTE Sujeto Excluido o Factura Proveedor."],
        ["Rol Operativo", "Asesor Comercial, Preventa, Ejecutivo de Cuentas.", "Cajera, Facturador, Despachador de Bodega, Cobrador.", "Encargado de Compras, Bodeguero, Tesorería/Cuentas por Pagar."],
        ["Impacto Contable", "Sin impacto contable (cuentas de orden / estadísticas).", "Póliza automática de Ingresos, IVA Débito y Costo de Venta.", "Póliza automática de Compras, IVA Crédito y Cuentas por Pagar."],
        ["Integración NyTEX", "Transfiere cotización aprobada al Módulo 2.", "Rebaja Kardex en Módulo 4 y alimenta CxC en Módulo 8.", "Ingresa Kardex en Módulo 4 y alimenta CxP en Módulo 9."]
    ]
    style_table(tbl_circ, col_w_circ, headers_circ, data_circ)
    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # SECCIÓN 3: PANTALLA PRINCIPAL Y SELECTOR DE VISTAS
    # -------------------------------------------------------------
    h3 = doc.add_heading(level=1)
    r3 = h3.add_run("3. Estructura de la Pantalla Principal, Selector de Vistas y KPIs en Vivo")
    r3.font.name = "Arial"
    r3.font.color.rgb = RGBColor(10, 37, 64)

    p_struct = doc.add_paragraph()
    p_struct.add_run("El entorno de trabajo del Módulo [1] cuenta con un encabezado superior que incluye el Selector de Tres Vistas Principales, "
                     "permitiendo a los ejecutivos y directores comerciales conmutar con un solo clic:")

    add_code_box(doc,
"""[ 📌 Tablero Kanban ]        [ 📥 Bandeja Omnicanal (4) ]        [ 📊 Indicadores: Cotizaciones vs Vendidas (BI) ]
Tablero Visual de 5 Etapas    Live Hub: WhatsApp, Instagram,       Tasa de Conversión (Win Rate), Pérdidas
de Maduración Comercial      Correo y Web (Filtro Solo Pendientes) por Código y Motivos de Descarte""")

    p_vistas = doc.add_paragraph()
    p_vistas.add_run("1. [ 📌 Tablero Kanban ]: Vista operativa tradicional donde las oportunidades se mueven visualmente en tarjetas a través de 5 columnas.\n"
                    "2. [ 📥 Bandeja Omnicanal ]: Bandeja unificada de mensajería para prospectos entrantes desde WhatsApp Business, Instagram Direct, Correo y Web. "
                    "Incluye filtro predeterminado de 'Solo Pendientes', chat interactivo y módulo de resolución.\n"
                    "3. [ 📊 Indicadores: Cotizaciones vs Vendidas ]: Plataforma analítica de Business Intelligence que audita la efectividad comercial, "
                    "calcula tasas de cierre en cantidad y porcentaje, y analiza pérdidas por producto en la pestaña [ 📦 Por Códigos (SKU) ].")

    doc.add_heading(level=2).add_run("Métricas Globales en Tiempo Real (KPI Cards)")
    p_kpis = doc.add_paragraph()
    p_kpis.add_run("En la parte superior del tablero Kanban se despliegan las 6 tarjetas de mando integral estratégicas:\n\n"
                   "• Valor del Pipeline (Pipeline Value): Σ Valor Estimado * % Probabilidad Cierre (Pronóstico ponderado para los próximos 30-60 días).\n"
                   "• Tasa de Cierre (Win Rate): (Oportunidades Ganadas / Total Cerradas) * 100 (Medición de efectividad, Meta > 35%).\n"
                   "• Velocidad de Venta (Sales Cycle): Días promedio desde primer contacto hasta cierre ganado (Acelera rotación de capital).\n"
                   "• Tiempo de Respuesta a Leads: Minutos transcurridos hasta primera interacción (Atender en < 15 min para triplicar conversión).\n"
                   "• Oportunidades Abiertas: Conteo total de negociaciones en curso activo en el pipeline.\n"
                   "• Ganado este mes: Volumen monetario acumulado de cierres confirmados en el período.\n")

    tbl_kpis = doc.add_table(rows=1, cols=3)
    col_w_kpi = [2.2, 2.2, 2.8]
    headers_kpi = ["KPI Comercial CRM", "Fórmula / Indicador", "Objetivo Estratégico"]
    data_kpi = [
        ["Valor del Pipeline (Pipeline Value)", "Σ Valor Estimado * % Probabilidad Cierre", "Pronóstico ponderado de ventas para los próximos 30-60 días."],
        ["Tasa de Cierre (Win Rate)", "(Oportunidades Ganadas / Total Cerradas) * 100", "Medición de efectividad del equipo de ventas (Meta > 35%)."],
        ["Velocidad de Venta (Sales Cycle)", "Días promedio desde primer contacto hasta cierre ganado", "Reducir el ciclo de venta para acelerar rotación de capital."],
        ["Tiempo de Respuesta a Leads", "Minutos transcurridos hasta primera interacción", "Atender prospectos en < 15 min para triplicar conversión."],
        ["Oportunidades Abiertas", "COUNT(Oportunidades abiertas)", "Monitoreo del flujo de negociaciones en seguimiento."],
        ["Ganado este mes", "SUM(Valor órdenes ganadas mes)", "Cumplimiento de la meta de ventas del período."]
    ]
    style_table(tbl_kpis, col_w_kpi, headers_kpi, data_kpi)
    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECCIÓN 4: PROCEDIMIENTO OPERATIVO N° 1 (BANT)
    # -------------------------------------------------------------
    h4 = doc.add_heading(level=1)
    r4 = h4.add_run("4. Procedimiento Operativo N° 1: Captación, Registro y Calificación BANT de Oportunidades")
    r4.font.name = "Arial"
    r4.font.color.rgb = RGBColor(10, 37, 64)

    p_p1 = doc.add_paragraph()
    p_p1.add_run("Para registrar una nueva oportunidad comercial, el asesor debe hacer clic en el botón azul '+ Nueva Oportunidad' en el panel superior. "
                 "El formulario interactivo exige completar cuatro bloques de información obligatoria:")

    add_callout(doc, "BLOQUES DEL FORMULARIO DE OPORTUNIDAD",
                "1. Datos Generales: Título de la oportunidad, Empresa / Razón Social, Contacto principal, Teléfono, Correo electrónico y Sucursal asignada.\n"
                "2. Asignación Comercial: Vendedor responsable del seguimiento y Etapa inicial en el embudo.\n"
                "3. Calificación BANT (Budget, Authority, Need, Timeline):\n"
                "   – Presupuesto (Budget): Indica si el cliente tiene fondos aprobados o si requiere cotización preliminar.\n"
                "   – Autoridad (Authority): Identifica si el contacto es tomador de decisión, recomendador o analista de compras.\n"
                "   – Necesidad (Need): Define la urgencia crítica del producto y el dolor de negocio que resuelve.\n"
                "   – Tiempo (Timeline): Establece el horizonte estimado de compra (ej: Inmediato, 15 días, 30 días, >60 días).\n"
                "4. Productos y Cotización Inicial: Selección de artículos directamente desde el catálogo de Kardex con cálculo automático de importes.",
                bg_hex="F8FAFC", border_hex="006EAD")

    # -------------------------------------------------------------
    # SECCIÓN 5: PROCEDIMIENTO OPERATIVO N° 2 (KARDEX PREDICTIVO)
    # -------------------------------------------------------------
    h5 = doc.add_heading(level=1)
    r5 = h5.add_run("5. Procedimiento Operativo N° 2: Búsqueda Predictiva Incremental y Selección Ágil de SKUs en Kardex")
    r5.font.name = "Arial"
    r5.font.color.rgb = RGBColor(10, 37, 64)

    p_p2 = doc.add_paragraph()
    p_p2.add_run("Para agilizar la cotización de pedidos con múltiples artículos o inventarios extensos, NyTEX CRM incorpora un selector predictivo inteligente "
                 "directamente conectado con el Módulo [4] Inventarios & Stock:")

    add_callout(doc, "FUNCIONAMIENTO DEL BUSCADOR PREDICTIVO INCREMENTAL",
                "• Búsqueda en Tiempo Real: En el campo 'Seleccionar SKU del Kardex *', el asesor puede escribir cualquier número o letra.\n"
                "• Reducción Progresiva: A medida que se teclean caracteres, la lista desplegable filtra y reduce automáticamente las coincidencias, "
                "buscando simultáneamente en el Código de Producto (SKU), Descripción Comercial y Categoría de Inventario.\n"
                "• Validación de Existencias: Cada ítem muestra su stock actual disponible, previniendo cotizar productos agotados.\n"
                "• Precio Base y Descuentos: Al seleccionar el SKU, el sistema carga el precio de lista vigente y permite asignar descuentos porcentuales "
                "respetando el límite de autorización del vendedor.",
                bg_hex="EFF6FF", border_hex="3B82F6")

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECCIÓN 6: PROCEDIMIENTO OPERATIVO N° 3 (KANBAN)
    # -------------------------------------------------------------
    h6 = doc.add_heading(level=1)
    r6 = h6.add_run("6. Procedimiento Operativo N° 3: Gestión Visual del Embudo (Pipeline Kanban) y Maduración de Etapas")
    r6.font.name = "Arial"
    r6.font.color.rgb = RGBColor(10, 37, 64)

    p_p3 = doc.add_paragraph()
    p_p3.add_run("El embudo visual estructura el ciclo de vida de la negociación en 5 etapas secuenciales, cada una con un porcentaje de probabilidad matemática asignado:")

    tbl_etapas = doc.add_table(rows=1, cols=4)
    col_w_etapas = [1.8, 1.2, 2.2, 2.0]
    headers_etapas = ["Etapa del Embudo", "Probabilidad", "Criterio de Entrada / Requisitos", "Acción Comercial Requerida"]
    data_etapas = [
        ["1. Prospección", "20%", "Lead recibido por redes, web o llamada telefónica.", "Contacto inicial, levantamiento de datos y verificación de interés."],
        ["2. Calificación", "40%", "Cuestionario BANT completado favorablemente.", "Confirmar presupuesto disponible y validar tomador de decisión."],
        ["3. Propuesta / Cotización", "60%", "SKUs seleccionados de Kardex y cotización emitida.", "Envío formal de oferta de precios, ficha técnica y condiciones."],
        ["4. Negociación", "80%", "Objeciones en revisión (precio, plazos o flete).", "Ajuste de términos de pago, aprobación de descuento especial."],
        ["5. Cerrada Ganada", "100%", "Cliente aprueba oferta y confirma compra.", "Generar pedido a Módulo 2 y enviar a facturación en caja."],
        ["6. Cerrada Perdida", "0%", "Cliente rechaza o se vence la vigencia.", "Obligatorio registrar 1 de los 5 motivos de descarte."]
    ]
    style_table(tbl_etapas, col_w_etapas, headers_etapas, data_etapas)
    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # SECCIÓN 7: PROCEDIMIENTO OPERATIVO N° 4 (BITÁCORA Y SEGUIMIENTO)
    # -------------------------------------------------------------
    h7 = doc.add_heading(level=1)
    r7 = h7.add_run("7. Procedimiento Operativo N° 4: Historial de Actividades, Bitácora Comercial y Seguimiento")
    r7.font.name = "Arial"
    r7.font.color.rgb = RGBColor(10, 37, 64)

    p_p4 = doc.add_paragraph()
    p_p4.add_run("Al hacer clic en cualquier tarjeta del tablero Kanban, se abre el expediente completo de la oportunidad, el cual incluye "
                 "la bitácora cronológica de interacciones:\n\n"
                 "• Registro de Llamadas: Fecha, hora, duración y resumen de acuerdos telefónicos.\n"
                 "• Minutas de Reunión: Compromisos pactados en visitas presenciales o videoconferencias.\n"
                 "• Tareas Programadas con Alertas: Recordatorios automáticos para llamadas de seguimiento o reenvío de cotizaciones.\n"
                 "• Historial de Modificaciones: Auditoría forense de cambios de etapa, montos y reasignación de vendedores.")

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECCIÓN 8: PROCEDIMIENTO OPERATIVO N° 5 (INTEGRACIÓN CON MÓDULO 2)
    # -------------------------------------------------------------
    h8 = doc.add_heading(level=1)
    r8 = h8.add_run("8. Procedimiento Operativo N° 5: Integración Comercial y Facturación en Caja en NyTEX Ventas [2]")
    r8.font.name = "Arial"
    r8.font.color.rgb = RGBColor(10, 37, 64)

    p_p5 = doc.add_paragraph()
    p_p5.add_run("El hito culminante del circuito Lead-to-Order ocurre cuando el cliente acepta la cotización y se transfiere la información "
                 "hacia el Módulo [2] Ventas & Facturación:")

    add_callout(doc, "CIRCUITO DE CONVERSIÓN DE COTIZACIÓN A FACTURACIÓN",
                "1. Botón '✓ Comprar Todos los SKUs': Si el cliente aprueba la totalidad de los artículos cotizados, este botón transfiere todos los renglones "
                "al estado de venta ganada y genera el pedido formal en Módulo 2.\n"
                "2. Botón '🚀 Generar Pedido en Módulo 2' (Compra Parcial): Si el cliente solo adquiere algunos ítems, el asesor marca individualmente los SKUs comprados "
                "y el sistema exige justificar la causa de pérdida de los productos no comprados (ej: Falta de stock, Precio alto) antes de transferir el pedido parcial a Ventas.\n"
                "3. Sincronización Inmediata de Cotizaciones Abiertas: Al presionar 'Ir a Facturar en Módulo 2 ➔', el sistema navega directamente a la pantalla de ventas, "
                "donde el contador de cotizaciones abiertas se actualiza automáticamente a '1 Cotización Abierta' lista para cobrar.\n"
                "4. Cobro y Timbrado Fiscal (DTE): La cajera en Módulo 2 recupera la cotización por número o cliente, selecciona la forma de pago (Efectivo, Tarjeta, Cheque o Crédito) "
                "y genera el comprobante fiscal sin necesidad de volver a digitar los productos.",
                bg_hex="F0FDF4", border_hex="10B981")

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECCIÓN 9: BANDEJA OMNICANAL INTEGRADA
    # -------------------------------------------------------------
    h9 = doc.add_heading(level=1)
    r9 = h9.add_run("9. Procedimiento Operativo N° 6: Bandeja Omnicanal Integrada (WhatsApp, Instagram, Correo y Web)")
    r9.font.name = "Arial"
    r9.font.color.rgb = RGBColor(10, 37, 64)

    add_callout(doc, "ARQUITECTURA DE INTEGRACIÓN OMNICANAL CENTRALIZADA",
                "La Bandeja Omnicanal de NyTEX CRM conecta de manera transparente y bidireccional los canales digitales de atención externa "
                "(WhatsApp Business Cloud API, Instagram Graph API, buzones de Correo Electrónico y Web Chat) mediante un Gateway unificado de Webhooks "
                "en la ruta backend '/api/crm/webhook/omnichannel'.\n\n"
                "Cada interacción de un prospecto genera en milisegundos una solicitud formal en el CRM, permitiendo a los ejecutivos responder directamente "
                "desde el sistema sin necesidad de consultar teléfonos personales o cuentas dispersas en redes sociales.",
                bg_hex="FAF5FF", border_hex="9333EA")

    doc.add_heading(level=2).add_run("Clasificación en los Tres Tipos de Solicitudes")
    p_tipos = doc.add_paragraph()
    p_tipos.add_run("Cada mensaje recibido se clasifica automáticamente o por el asesor en uno de los tres perfiles operativos:\n\n"
                    "• 💰 Solicitud de Cotización: Prospectos que solicitan listas de precios, existencias por volumen o cotizaciones formales. "
                    "Se vincula directamente al Kardex y permite crear la oportunidad comercial para conversión a pedido.\n\n"
                    "• ❓ Consulta Comercial: Dudas de preventa sobre características técnicas de telas/insumos, horarios de atención, tiempos de entrega "
                    "o cobertura de despacho.\n\n"
                    "• ⚠️ Reclamo / Incidencia: Inconformidades de clientes por demoras o fallas de producto. Cuenta con alerta de SLA (tiempo máximo de respuesta) "
                    "para priorizar su atención y mitigar riesgos de cancelación.")

    doc.add_heading(level=2).add_run("Filtro Predeterminado: [ ⏳ Solo Pendientes ] (Eficiencia Operativa)")
    p_pend = doc.add_paragraph()
    p_pend.add_run("Para evitar que los ejecutivos pierdan tiempo valioso revisando una por una todas las solicitudes históricas, la bandeja aplica "
                   "como estado predeterminado el filtro 'Solo Pendientes':\n\n"
                   "1. Foco en la Acción: La pantalla únicamente lista los casos que requieren respuesta o gestión pendiente.\n"
                   "2. Contador en Vivo: Muestra el número exacto de casos activos (ej: '4 activas').\n"
                   "3. Pestaña [ ✓ Solo Finalizadas ]: Permite a los supervisores auditar los casos cerrados, ver notas de resolución y validar tiempos de respuesta.\n"
                   "4. Pestaña [ Todas ]: Despliega la totalidad del histórico para búsquedas generales.")

    doc.add_heading(level=2).add_run("Chat Bidireccional en Vivo y Protocolo de Resolución")
    p_chat = doc.add_paragraph()
    p_chat.add_run("Al pulsar 'Ver Chat' en cualquier tarjeta:\n\n"
                   "• Mensajería Bidireccional: Se despliega la conversación cronológica completa. Al escribir y enviar una respuesta, el backend la despacha "
                   "a través de la API oficial hacia el WhatsApp, Instagram o correo del cliente.\n"
                   "• Botón [ ✓ Finalizar ]: Una vez atendida la consulta o acordada la cotización, el ejecutivo presiona 'Finalizar'. "
                   "El sistema abre una ventana modal donde es OBLIGATORIO ingresar la Nota de Resolución (ej: 'Cotización enviada y aceptada por WhatsApp'). "
                   "Al confirmar, la solicitud cambia su estado a 'resuelto' y DESAPARECE INMEDIATAMENTE de la lista de pendientes, registrando el usuario resolutor, "
                   "fecha y hora de auditoría.\n"
                   "• Botón [ Reabrir ]: Si el cliente vuelve a escribir o reactiva el reclamo, el caso puede reabrirse a pendiente.")

    doc.add_heading(level=2).add_run("Simulador de Mensajes Entrantes para Pruebas")
    p_sim = doc.add_paragraph()
    p_sim.add_run("El sistema incluye la herramienta '🧪 Simular Mensaje Entrante' en la esquina superior de la bandeja. "
                  "Permite seleccionar el canal (WhatsApp, Instagram, Correo, Web), tipo de solicitud y redactar un mensaje ficticio "
                  "para simular en tiempo real la llegada de un prospecto y capacitar a la fuerza comercial.")

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECCIÓN 10: TABLERO ANALÍTICO BI Y CÓDIGOS (SKU)
    # -------------------------------------------------------------
    h10 = doc.add_heading(level=1)
    r10 = h10.add_run("10. Procedimiento Operativo N° 7: Tablero Analítico BI de Cotizaciones Generadas vs Vendidas y Pérdidas por Códigos")
    r10.font.name = "Arial"
    r10.font.color.rgb = RGBColor(10, 37, 64)

    p_bi = doc.add_paragraph()
    p_bi.add_run("El módulo de Business Intelligence (BI) de NyTEX CRM ofrece visibilidad total sobre la efectividad comercial, respondiendo a dos preguntas críticas: "
                 "¿Cuánto de lo que cotizamos se convierte en dinero real? y ¿Cuáles son los motivos exactos por los que no vendemos cada producto?")

    add_callout(doc, "MÉTRICAS CLAVE DE EFECTIVIDAD COMERCIAL",
                "• Cotizaciones Generadas: Cantidad total de cotizaciones emitidas a prospectos en el período seleccionado.\n"
                "• Cotizaciones Vendidas: Cantidad de cotizaciones formalmente facturadas en Módulo 2.\n"
                "• Tasa de Cierre (Win Rate %): Porcentaje de efectividad comercial = (Vendidas / Total Concluidas) x 100.\n"
                "• Tasa de Fuga Comercial (%): Porcentaje de cotizaciones rechazadas o no compradas por el cliente.\n"
                "• Montos en Dólares ($ USD): Comparativo de importes totales cotizados vs importes totales vendidos.",
                bg_hex="FFFBEB", border_hex="D97706")

    doc.add_heading(level=2).add_run("Pestaña Destacada al Tope: [ 📦 Por Códigos (SKU) ]")
    p_sku = doc.add_paragraph()
    p_sku.add_run("Ubicada inmediatamente debajo de las tarjetas KPI, permite evaluar la aceptación en el mercado de cada producto individual:\n\n"
                  "• Modos de Métrica con 1 Clic:\n"
                  "   – [ 📊 Completa ]: Despliega simultáneamente cantidades, montos en dólares y porcentajes de efectividad.\n"
                  "   – [ 🔢 Cantidad ]: Unidades cotizadas vs vendidas vs no vendidas.\n"
                  "   – [ ％ Porcentaje ]: Tasa de efectividad (%) por SKU.\n"
                  "   – [ 💲 Montos ]: Total facturado vs total cotizado en $ USD.\n"
                  "• Filtros por Condición: Visualizar todos los SKUs, solo los vendidos con éxito, los descartados con pérdidas o los 100% no vendidos.\n"
                  "• Buscador de Código en Vivo: Permite localizar al instante cualquier artículo por código o descripción.\n"
                  "• Desglose de Causas de No Compra por SKU: Muestra badges con el motivo exacto por el cual se perdió cada código.\n"
                  "• Acordeón de Casos Reales: Al dar clic en 'Ver casos', despliega las cotizaciones específicas donde se descartó el SKU con empresa, "
                  "vendedor, fecha y notas textuales del cliente.")

    doc.add_heading(level=2).add_run("Otras Dimensiones de Clasificación Disponibles")
    p_dims = doc.add_paragraph()
    p_dims.add_run("El tablero permite además evaluar la salud comercial por:\n\n"
                   "• [ 🏢 Total Empresa ]: Consolidado corporativo, sucursal líder, vendedor líder y auditoría de motivos general.\n"
                   "• [ 📍 Por Sucursal ]: Comparativo de tasa de cierre y montos cotizados vs vendidos entre agencias.\n"
                   "• [ 👤 Por Vendedor ]: Ranking de asesores comerciales por volumen vendido y tasa de efectividad (%).\n"
                   "• [ 🏭 Por Proveedor ]: Rendimiento y aceptación en el mercado por marca o fabricante.\n"
                   "• [ 🏷️ Por Categoría ]: Familias de productos con mayor rotación o mayor fuga comercial.\n"
                   "• [ ⚠️ Motivos de Pérdida (1 al 5) ]: Vista dedicada para auditar las 5 causas estratégicas de descarte "
                   "(Precio superior, Falta de stock, Plazo de entrega largo, Crédito rechazado, Especificación técnica).")

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECCIÓN 11: MATRIZ DE INTEGRACIÓN
    # -------------------------------------------------------------
    h11 = doc.add_heading(level=1)
    r11 = h11.add_run("11. Matriz de Interconexión e Impacto con los Demás Módulos del Ecosistema NyTEX")
    r11.font.name = "Arial"
    r11.font.color.rgb = RGBColor(10, 37, 64)

    tbl_integ = doc.add_table(rows=1, cols=4)
    col_w_integ = [2.0, 1.8, 1.8, 1.4]
    headers_integ = ["Módulo Receptor", "Datos Transferidos", "Impacto Operativo en el Sistema", "Circuito"]
    data_integ = [
        ["[0] Business Partners (Catálogo Clientes)", "Razón Social, NIT/RFC, Contactos, Dirección Fiscal", "Crea el expediente maestro del cliente formal si no existía.", "Maestros"],
        ["[2] Ventas & Facturación", "Cotización autorizada, SKUs, precios, descuentos", "Habilita facturación en caja (DTE/Ticket) sin recaptura manual.", "Order-to-Cash"],
        ["[7] Logística & Despacho", "Modalidad de Entrega (A Domicilio / Mostrador), dirección exacta de despacho y ventana horaria", "Dispara automáticamente la Orden de Embarque, asigna camión de reparto, chofer y genera la Hoja de Ruta.", "Order-to-Cash"],
        ["[4] Inventario & Control de Stock", "Consulta de Kardex en vivo y reserva de existencias", "Aparta stock disponible y evita sobreventa física en almacén.", "Supply Chain"],
        ["[5] Planeación de Demanda", "Forecast ponderado y auditoría de fugas por SKU", "Ajusta pronósticos de reposición ROP y compras a proveedores.", "Plan-to-Produce"],
        ["[8] Cuentas por Cobrar (CxC)", "Términos de crédito pactados y límite comercial", "Abre la cuenta corriente y programa cobros futuros.", "Order-to-Cash"],
        ["[12] Contabilidad Central", "Trazabilidad completa de origen (Oportunidad -> Factura)", "Garantiza auditoría de la orden que generó la póliza de ingresos.", "Record-to-Report"]
    ]
    style_table(tbl_integ, col_w_integ, headers_integ, data_integ)
    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # SECCIÓN 12: BUENAS PRÁCTICAS Y GOBERNANZA
    # -------------------------------------------------------------
    h12 = doc.add_heading(level=1)
    r12 = h12.add_run("12. Buenas Prácticas Comerciales, Segregación de Funciones y Gobernanza del Pipeline")
    r12.font.name = "Arial"
    r12.font.color.rgb = RGBColor(10, 37, 64)

    add_callout(doc, "POLÍTICAS DE CONTROL INTERNO Y AUDITORÍA COMERCIAL",
                "1. Segregación de Funciones Estricta (Vendedor vs Cajera): El vendedor prospecta, califica y cotiza en Módulo 1 CRM; la cajera o facturador es la única persona autorizada para procesar el cobro y emitir la factura en Módulo 2 Ventas.\n"
                "2. Justificación Obligatoria de Descarte: Ningún negocio o SKU puede marcarse como 'Perdido' sin seleccionar uno de los motivos estratégicos y documentar la nota explicativa para retroalimentar Compras y Almacén.\n"
                "3. Gestión Prioritaria de Bandeja Omnicanal: Las solicitudes de tipo Reclamo deben ser respondidas dentro del SLA establecido (máximo 60 minutos) y las cotizaciones en menos de 2 horas hábiles.\n"
                "4. Finalización Inmediata de Casos Resueltos: Los ejecutivos deben marcar como 'Finalizada' toda solicitud atendida de inmediato, manteniendo la bandeja de 'Solo Pendientes' en cero.\n"
                "5. Prohibición de Cotizaciones sin Oportunidad: Todas las cotizaciones emitidas a clientes deben nacer vinculadas a una oportunidad en el CRM para preservar la analítica de efectividad.\n"
                "6. Validación de Stock antes de Cotizar: Los asesores deben verificar la disponibilidad real en el Kardex interactivo para no comprometer plazos inviables.\n"
                "7. Caducidad de Prospectos Inactivos: Los prospectos sin seguimiento tras 30 días naturales se desasignan y reingresan a la bolsa común corporativa.",
                bg_hex="FFF1F2", border_hex="E11D48")

    # Guardar documento en todas las carpetas oficiales
    base_dir = os.path.dirname(os.path.abspath(__file__))
    target_dirs = [
        os.path.join(base_dir, "Manuales de usuarios NyTEX", "Fase 2 Express", "Modulo 1 NyTEX CRM (Embudo de Ventas)"),
        os.path.join(base_dir, "Manuales de usuarios NyTEX", "Fase 1 Starter", "Modulo 1 NyTEX CRM (Embudo de Ventas)"),
        os.path.join(base_dir, "Manuales de usuarios NyTEX")
    ]
    
    for tdir in target_dirs:
        os.makedirs(tdir, exist_ok=True)
        file_docx1 = os.path.join(tdir, "NyTEX_Modulo_1_Manual_CRM_Embudo_de_Ventas.docx")
        file_docx2 = os.path.join(tdir, "Módulo 1 NyTEX CRM (Embudo de Ventas) - Manual de usuario.docx")
        file_docx3 = os.path.join(tdir, "NyTEX_Modulo_1_CRM_Embudo_de_Ventas.docx")
        
        doc.save(file_docx1)
        doc.save(file_docx2)
        doc.save(file_docx3)
        print(f"✅ Documentos DOCX actualizados en: {tdir}")

if __name__ == "__main__":
    build_document()
