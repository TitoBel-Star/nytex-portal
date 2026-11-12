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
                          "Incluye Integración con Módulo 2 (Ventas/Facturación), Búsqueda Predictiva de Kardex y Panel Analítico Multidimensional de Fugas y Cierre")
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(12)
    r_sub.font.color.rgb = RGBColor(100, 116, 139)

    add_callout(doc, "FICHA TÉCNICA DE IMPLEMENTACIÓN EMPRESARIAL",
                "• Ecosistema: ERP NyTEX Versión 4.0\n"
                "• Fase de Implementación: Fase 2: Express en adelante (Express, Advanced, Enterprise)\n"
                "• Circuito Operativo: Lead-to-Order (L2O) / Prospección, Maduración, Cotización y Conversión Comercial\n"
                "• Moneda Base de Cotización: Dólares de los Estados Unidos (USD) / Moneda Local de Negociación\n"
                "• Módulos Interconectados:\n"
                "   – [0] Business Partners: Catálogo oficial de clientes y contactos sincronizados en tiempo real.\n"
                "   – [2] Ventas & Facturación: Facturación en caja de cotizaciones autorizadas sin recaptura manual.\n"
                "   – [4] Inventarios & Stock: Validación de existencias del Kardex y reserva preventiva de SKUs.\n"
                "   – [5] Planeación de Demanda: Forecast ponderado de ventas para planes de compras y reposición.\n"
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
        "3. Estructura de la Pantalla Principal, Vistas del Sistema y KPIs en Vivo",
        "4. Procedimiento Operativo Detallado N° 1: Captación, Registro y Calificación BANT de una Oportunidad",
        "5. Procedimiento Operativo Detallado N° 2: Búsqueda Predictiva y Selección Ágil de SKUs del Kardex",
        "6. Procedimiento Operativo Detallado N° 3: Gestión Visual del Embudo (Pipeline Kanban) y Maduración de Etapas",
        "7. Procedimiento Operativo Detallado N° 4: Historial de Actividades, Bitácora Comercial y Seguimiento de Tareas",
        "8. Procedimiento Operativo Detallado N° 5: Integración Comercial y Facturación en Caja en NyTEX Ventas [2]",
        "9. Procedimiento Operativo Detallado N° 6: Tablero Analítico de Cotizaciones Generadas vs Vendidas y Auditoría de Fugas",
        "10. Matriz de Interconexión e Impacto con los Demás Módulos del Ecosistema NyTEX",
        "11. Buenas Prácticas Comerciales, Segregación de Funciones y Gobernanza del Pipeline"
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
                "gestiona el ciclo integral de prospección comercial, calificación técnica, cotización estructurada y conversión de prospectos dentro del circuito Lead-to-Order (L2O).\n\n"
                "Su función primordial es captar y estructurar todas las oportunidades comerciales en un pipeline visual dinámico por etapas, "
                "calificando su viabilidad económica mediante metodologías estandarizadas (BANT), consultando en vivo el Kardex de inventarios [4], "
                "proyectando ingresos futuros con métricas en tiempo real e interconectando fluidamente las cotizaciones autorizadas por clientes "
                "hacia Ventas [2] para que la cajera o facturador emita los comprobantes fiscales sin recaptura manual y garantizando la estricta segregación de funciones.",
                bg_hex="F0FDF4", border_hex="10B981")

    p_desc = doc.add_paragraph()
    p_desc.add_run("El Módulo [1] representa la puerta de entrada de nuevos ingresos para la organización. Antes de que una transacción comercial se formalice en una factura, "
                   "el prospecto atraviesa un ciclo de maduración donde se recopilan sus especificaciones técnicas, volúmenes de consumo, capacidad crediticia y plazos requeridos. "
                   "La integración nativa de NyTEX CRM con el resto del ERP garantiza que la promesa comercial efectuada al cliente concuerde con el stock físico de almacenes, "
                   "la capacidad fabril y las políticas financieras corporativas.")

    # Alcance por Fases
    doc.add_heading(level=2).add_run("Alcance Funcional por Fase de Implementación")
    p_fases = doc.add_paragraph()
    p_fases.add_run("En la arquitectura modular y escalable de NyTEX, el proceso comercial se despliega de acuerdo con la madurez operativa de la empresa:\n\n"
                    "• Fase 1: Starter: Se opera principalmente la venta de mostrador, venta transaccional directa o sobre catálogo precargado de clientes en Ventas [2], "
                    "sin requerir aún una fuerza de ventas consultiva con pipeline de negociación largo.\n\n"
                    "• Fase 2: Express en adelante (Express, Advanced, Enterprise): Se activa plenamente el Módulo [1] NyTEX CRM (Embudo de Ventas). "
                    "Se habilita el tablero Kanban interactivo, el cotizador multilínea con búsqueda predictiva de Kardex, la calificación BANT estructurada, "
                    "el pase directo a Módulo 2 para facturación en caja y el potente Tablero Analítico de Cotizaciones Generadas vs Vendidas con auditoría de las 5 causas de fuga.")

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # SECCIÓN 2: MAPA COMPARATIVO
    # -------------------------------------------------------------
    h2 = doc.add_heading(level=1)
    r2 = h2.add_run("2. Mapa Comparativo de Circuitos y Ecosistema de Módulos NyTEX")
    r2.font.name = "Arial"
    r2.font.color.rgb = RGBColor(10, 37, 64)

    p_map_intro = doc.add_paragraph()
    p_map_intro.add_run("Para comprender la sincronía del ERP NyTEX, la siguiente tabla ubica al Módulo [1] junto a los módulos operativos y financieros que completan la cadena de valor:")

    tbl_comp = doc.add_table(rows=1, cols=3)
    col_w_comp = [2.0, 1.8, 3.2]
    headers_comp = ["Módulo NyTEX", "Circuito Empresarial", "Función Operativa Principal"]
    data_comp = [
        ["[1] CRM (Embudo de Ventas)", "Lead-to-Order (L2O)", "Capta, califica y madura oportunidades comerciales, cotiza artículos del Kardex, audita motivos de no compra y transfiere cotizaciones autorizadas a Ventas para facturación en caja."],
        ["[2] Ventas & Facturación", "Order-to-Cash (O2C)", "Recibe cotizaciones autorizadas del CRM, factura en caja (DTE/Ticket), gestiona despachos de bodega, genera cartera en CxC y emite la póliza contable automática."],
        ["[3] Compras & Abastecimiento", "Procure-to-Pay (P2P)", "Gestiona el aprovisionamiento de insumos y mercadería mediante órdenes de compra, controlando recepción de proveedores, inventario y pasivos en CxP."],
        ["[4] Inventario & Control de Stock", "P2P / O2C / Plan-to-Produce", "Administra la custodia física, catálogo maestro de SKUs, existencias en almacenes, kardex de entradas/salidas y valuación de costo promedio."],
        ["[5] Planeación de Demanda", "Plan-to-Produce (P2P)", "Consolida las ventas históricas y el forecast del CRM para calcular pronósticos de reabastecimiento ROP y planes de producción."],
        ["[8] Cuentas por Cobrar (CxC & Cartera)", "Order-to-Cash (O2C)", "Administra la recuperación de liquidez, control de créditos, estados de cuenta de clientes, aplicación de cobranza y emisión de pólizas de ingreso."],
        ["[9] Cuentas por Pagar & Pasivos (CxP)", "Procure-to-Pay (P2P)", "Administra las obligaciones financieras contraídas con proveedores, programación de pagos, calendario de vencimientos y pólizas de egreso."],
        ["[10] Dirección de Finanzas & Tesorería", "Cash Management & Liquidity", "Custodia la liquidez de cuentas bancarias y cajas chicas, asegurando conciliación bancaria milimétrica y flujo de caja en vivo."],
        ["[12] Contabilidad Central & Pólizas", "Record-to-Report (R2R)", "Núcleo centralizador: consolida todas las transacciones operativas en asientos de partida doble (Diario, Ingreso y Egreso) y Balanza en tiempo real."]
    ]
    style_table(tbl_comp, col_w_comp, headers_comp, data_comp)
    doc.add_paragraph().paragraph_format.space_after = Pt(15)

    # -------------------------------------------------------------
    # SECCIÓN 3: ESTRUCTURA, VISTAS Y KPIS EN VIVO
    # -------------------------------------------------------------
    h3 = doc.add_heading(level=1)
    r3 = h3.add_run("3. Estructura de la Pantalla Principal, Vistas del Sistema y KPIs en Vivo")
    r3.font.name = "Arial"
    r3.font.color.rgb = RGBColor(10, 37, 64)

    p_ui = doc.add_paragraph()
    p_ui.add_run("Al acceder al módulo a través del Workspace del ERP NyTEX (/app/workspace?phase=2&mod=crm), el sistema despliega una barra superior con dos vistas operativas fundamentales:\n\n"
                 "• Vista [ 📊 Tablero Pipeline ]: El embudo visual clásico Kanban con 5 columnas de avance progresivo (Nuevo, Contactado, Calificado, Cotizado, Ganado) y 4 KPIs de pipeline.\n"
                 "• Vista [ 📈 Indicadores: Cotizaciones vs Vendidas ]: El centro de inteligencia comercial y auditoría de fugas, con filtros por fechas, análisis de 5 motivos de venta perdida y desglose por SKU, sucursal, vendedor, proveedor y empresa.\n"
                 "• Botón [ + NUEVA OPORTUNIDAD ]: Botón azul de acción inmediata para registrar un nuevo negocio en el pipeline.")

    doc.add_heading(level=2).add_run("Esquema Estructural de la Pantalla Principal (Tablero Kanban)")

    ascii_screen = (
        "Portal / NyTEX CRM (Embudo de Ventas)       [ 📊 Tablero Pipeline ]  [ 📈 Indicadores ]  [ + NUEVA OPORTUNIDAD ]\n"
        "┌─────────────────────────┬─────────────────────────┬─────────────────────────┬─────────────────────────┐\n"
        "│ 💼 OPORTUNIDADES        │ 💲 VALOR DEL PIPELINE   │ 📈 TASA DE CIERRE       │ 🏆 GANADO ESTE MES      │\n"
        "│    ABIERTAS: 6          │    $68,700 USD          │    24.5%                │    $12,400 USD          │\n"
        "└─────────────────────────┴─────────────────────────┴─────────────────────────┴─────────────────────────┘\n\n"
        "┌──────────────────┬──────────────────┬──────────────────┬──────────────────┬──────────────────┐\n"
        "│ Nuevo (2) $23.5k │ Contactado(1)$3.2│ Calificado(2)$17k│ Cotizado(1) $25k │ Ganado (1) $2.4k │\n"
        "├──────────────────┼──────────────────┼──────────────────┼──────────────────┼──────────────────┤\n"
        "│ [ALTA]       ··· │ [ALTA]       ··· │ [BAJA]       ··· │ [MEDIA]      ··· │ [MEDIA]      ··· │\n"
        "│ Impl. ERP Fase 1 │ Fac. Electrónica │ Consultoría Log. │ Proyecto WMS     │ Soporte Hypercare│\n"
        "│ 🏢 Industrias Ap. │ 🏢 Comercializ.  │ 🏢 Logistics Pro │ 🏢 Alm. Globales │ 🏢 Constr. XYZ   │\n"
        "│ 💲 $15,000        │ 💲 $3,200        │ 💲 $5,000        │ 💲 $25,000       │ 💲 $2,400        │\n"
        "│ 🕒 24 Sep        │ 🕒 21 Sep        │ 🕒 18 Sep        │ 🕒 10 Sep        │ 🕒 05 Sep        │\n"
        "└──────────────────┴──────────────────┴──────────────────┴──────────────────┴──────────────────┘"
    )
    add_code_box(doc, ascii_screen)

    tbl_kpi = doc.add_table(rows=1, cols=3)
    col_w_kpi = [2.2, 1.8, 3.0]
    headers_kpi = ["Indicador (KPI)", "Fórmula de Cálculo", "Interpretación y Decisión Estratégica"]
    data_kpi = [
        ["Oportunidades Abiertas (Azul / Maletín)", "COUNT(Oportunidades en etapas 1 a 4)", "Mide el volumen de negociaciones comerciales activas que demandan atención y gestión continua del equipo comercial."],
        ["Valor del Pipeline (Morado / Símbolo Dólar)", "SUM(Monto Estimado Oportunidades Abiertas)", "Valor económico bruto acumulado de todas las oportunidades abiertas actualmente en curso dentro del embudo."],
        ["Tasa de Cierre (Dorado / Gráfico Tendencia)", "(Oportunidades Ganadas / Total Cerradas) × 100", "Porcentaje de efectividad comercial y conversión del equipo de ventas; benchmark recomendado: > 20% - 25%."],
        ["Ganado Este Mes (Verde / Trofeo)", "SUM(Monto Ganadas en Mes Corriente)", "Importe monetario total de negocios concretados, formalizados y ganados con éxito durante el mes en curso."]
    ]
    style_table(tbl_kpi, col_w_kpi, headers_kpi, data_kpi, align_rights=[1])
    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # SECCIÓN 4: PROCEDIMIENTO 1 - REGISTRO Y CALIFICACIÓN BANT
    # -------------------------------------------------------------
    h4 = doc.add_heading(level=1)
    r4 = h4.add_run("4. Procedimiento Operativo Detallado N° 1: Captación, Registro y Calificación BANT de una Oportunidad")
    r4.font.name = "Arial"
    r4.font.color.rgb = RGBColor(10, 37, 64)

    p_proc1 = doc.add_paragraph()
    p_proc1.add_run("El objetivo de este procedimiento es garantizar que ninguna oportunidad quede desatendida y que solo las negociaciones viables consuman recursos operativos de ingeniería y cotización.")

    add_callout(doc, "VENTANA MODAL INTERACTIVA DE 'NUEVA OPORTUNIDAD'",
                "Al hacer clic en el botón superior '+ NUEVA OPORTUNIDAD', el sistema abre una ventana modal con 2 pestañas estructuradas:\n\n"
                "• Pestaña '1. Datos de la Oportunidad':\n"
                "   – Título de la Oportunidad / Proyecto: Nombre descriptivo de la negociación comercial.\n"
                "   – Selector de Modo de Empresa:\n"
                "       * Pestaña 'Business Partners': Acceso directo al catálogo oficial de socios de negocio de NyTEX. Al seleccionar un socio, autocompleta empresa, contacto principal, correo y teléfono.\n"
                "       * Pestaña 'Escribir Manual': Permite escribir libremente prospectos nuevos que aún no son clientes formales.\n"
                "   – Monto Estimado ($ USD): Valor económico proyectado con formateo monetario automático.\n"
                "   – Etapa Inicial (Nuevo, Contactado, Calificado, Cotizado, Ganado) y Prioridad (Alta, Media, Baja).\n"
                "   – Asesor Comercial Asignado, Fecha de Cierre y Notas de Calificación BANT.\n\n"
                "• Pestaña '2. Cotización Inicial (Opcional)':\n"
                "   – Permite agregar desde el primer instante artículos del Kardex con cantidades y precios para que la oportunidad nazca respaldada por una cotización formal.",
                bg_hex="F0F9FF", border_hex="0284C7")

    # -------------------------------------------------------------
    # SECCIÓN 5: PROCEDIMIENTO 2 - BÚSQUEDA PREDICTIVA KARDEX
    # -------------------------------------------------------------
    h5_sku = doc.add_heading(level=1)
    r5_sku = h5_sku.add_run("5. Procedimiento Operativo Detallado N° 2: Búsqueda Predictiva y Selección Ágil de SKUs del Kardex")
    r5_sku.font.name = "Arial"
    r5_sku.font.color.rgb = RGBColor(10, 37, 64)

    p_sku = doc.add_paragraph()
    p_sku.add_run("Para eliminar la lentitud en la selección de artículos en catálogos extensos, NyTEX CRM cuenta con una pestaña y buscador predictivo interactivo directamente en el cotizador de la oportunidad:")

    steps_sku = [
        ("Paso 2.1: Acceso al Cotizador de la Oportunidad",
         "Abra la oportunidad deseada en el tablero Kanban y diríjase a la sección 'Cotización Formal Asociada' o en la pestaña 'Cotización Inicial' del modal de creación."),
        ("Paso 2.2: Activación del Buscador Predictivo en Tiempo Real",
         "Haga clic en el campo '🔍 Buscar SKU por código o nombre...'. Al comenzar a teclear cualquier letra o número, el sistema filtra y reduce instantáneamente la lista desplegable mostrando únicamente los artículos coincidentes."),
        ("Paso 2.3: Visualización de Atributos Críticos del Artículo",
         "Cada resultado de búsqueda muestra en tiempo real: Código SKU, Nombre del producto, Categoría, Proveedor, Precio de lista en USD y Stock disponible en almacén."),
        ("Paso 2.4: Incorporación a la Cotización",
         "Seleccione el SKU con un clic, digite la cantidad requerida y el precio unitario pactado. Presione '+ Agregar a Cotización'. El sistema calcula de inmediato el subtotal de la línea y el monto total de la cotización."),
        ("Paso 2.5: Sincronización Automática con el Monto de la Oportunidad",
         "El monto estimado de la oportunidad se sincroniza de forma automática con el total de la cotización activa, garantizando coherencia absoluta entre el pipeline y el desglose de productos.")
    ]

    for title, desc in steps_sku:
        p_st = doc.add_paragraph()
        p_st.paragraph_format.space_before = Pt(4)
        p_st.paragraph_format.space_after = Pt(2)
        r_st_t = p_st.add_run(f"{title}\n")
        r_st_t.bold = True
        r_st_t.font.color.rgb = RGBColor(0, 110, 173)
        r_st_d = p_st.add_run(desc)
        r_st_d.font.size = Pt(9.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # SECCIÓN 6: PROCEDIMIENTO 3 - GESTIÓN VISUAL PIPELINE KANBAN
    # -------------------------------------------------------------
    h6_kan = doc.add_heading(level=1)
    r6_kan = h6_kan.add_run("6. Procedimiento Operativo Detallado N° 3: Gestión Visual del Embudo (Pipeline Kanban) y Maduración de Etapas")
    r6_kan.font.name = "Arial"
    r6_kan.font.color.rgb = RGBColor(10, 37, 64)

    tbl_etapas = doc.add_table(rows=1, cols=4)
    col_w_etapas = [1.6, 1.2, 2.5, 1.7]
    headers_etapas = ["Etapa del Pipeline", "Probabilidad", "Criterio de Entrada Obligatorio", "Acción Operativa Requerida"]
    data_etapas = [
        ["1. Nuevo", "10%", "Oportunidad recién captada desde web, campaña, recomendación o prospección.", "Asignar ejecutivo comercial y realizar llamada o reunión inicial de descubrimiento."],
        ["2. Contactado", "25%", "Primer contacto formal establecido; interlocutor y requerimiento confirmados.", "Iniciar investigación técnica, perfilar necesidades y evaluar la matriz BANT."],
        ["3. Calificado", "50%", "Matriz BANT validada con presupuesto real, tomador de decisión y urgencia confirmada.", "Validar disponibilidad de SKUs en Inventarios [4] y coordinar propuesta técnica."],
        ["4. Cotizado", "75%", "Propuesta técnico-económica formal emitida y entregada al cliente para revisión.", "Realizar seguimiento a cotización, resolver objeciones y afinar plazos de entrega."],
        ["5. Ganado", "100%", "Aceptación formal de la propuesta, emisión de orden de compra o confirmación escrita.", "Transferir cotización autorizada a Ventas [2] para facturación en caja."],
        ["Descartada / Perdida", "0%", "Rechazo formal de la oferta por parte del prospecto o cancelación de proyecto.", "Registrar motivo obligatorio de descarte (1 de las 5 causas de fuga) para auditoría."]
    ]
    style_table(tbl_etapas, col_w_etapas, headers_etapas, data_etapas, align_rights=[1])
    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # -------------------------------------------------------------
    # SECCIÓN 7: PROCEDIMIENTO 4 - BITÁCORA Y ACTIVIDADES
    # -------------------------------------------------------------
    h7_act = doc.add_heading(level=1)
    r7_act = h7_act.add_run("7. Procedimiento Operativo Detallado N° 4: Historial de Actividades, Bitácora Comercial y Seguimiento de Tareas")
    r7_act.font.name = "Arial"
    r7_act.font.color.rgb = RGBColor(10, 37, 64)

    p_act = doc.add_paragraph()
    p_act.add_run("La gobernanza comercial de NyTEX prohíbe las oportunidades 'huérfanas' o inactivas. Cada oportunidad en el pipeline debe contar con una bitácora "
                  "actualizada de contactos y una próxima acción comprometida con fecha y hora.")

    add_callout(doc, "REGLA ANTIENFRIAMIENTO DE OPORTUNIDADES",
                "Toda oportunidad activa debe contar con al menos una próxima tarea programada (llamada, visita o entrega de muestras). Si una tarjeta permanece más de 7 días continuos sin interacción registrada, el sistema le asigna un marco visual color ámbar con la leyenda 'Riesgo de Inactividad'.",
                bg_hex="FAF5FF", border_hex="A855F7")

    # -------------------------------------------------------------
    # SECCIÓN 8: PROCEDIMIENTO 5 - INTEGRACIÓN CRM -> VENTAS [2]
    # -------------------------------------------------------------
    h8_o2c = doc.add_heading(level=1)
    r8_o2c = h8_o2c.add_run("8. Procedimiento Operativo Detallado N° 5: Integración Comercial y Facturación en Caja en NyTEX Ventas [2]")
    r8_o2c.font.name = "Arial"
    r8_o2c.font.color.rgb = RGBColor(10, 37, 64)

    p_o2c_desc = doc.add_paragraph()
    p_o2c_desc.add_run("Este procedimiento constituye el puente de comunicación directa entre el Módulo 1 (CRM - Rol Vendedor) y el Módulo 2 (Ventas & Facturación - Rol Cajera/Facturador). "
                       "Resuelve la segregación de funciones fundamental en la empresa: el vendedor prospecta, cotiza y negocia, pero la cajera factura y cobra en caja.")

    add_callout(doc, "FLUJO OPERATIVO: DE COTIZACIÓN AUTORIZADA A FACTURACIÓN EN CAJA",
                "1. En el Módulo 1: CRM, el vendedor gestiona la cotización con el cliente. Cuando el cliente acepta la compra:\n"
                "   • Si compra toda la cotización: El vendedor hace clic en el botón verde [ ✓ Comprar Todos los SKUs ]. Todos los artículos pasan a estado 'Comprado' y se genera automáticamente la orden formal.\n"
                "   • Si compra parcialmente: El vendedor marca únicamente los SKUs que el cliente autorizó y hace clic en [ 🚀 Generar Pedido en Módulo 2 ]. Los artículos no comprados solicitan motivo de descarte.\n\n"
                "2. Transmisión Instantánea al Módulo 2: Ventas & Facturación:\n"
                "   • La cotización autorizada pasa de forma automática e inmediata al Módulo 2.\n"
                "   • El vendedor puede presionar el botón directo [ ➔ Ir a Facturar en Módulo 2 ] para trasladarse a la pantalla de ventas.\n"
                "   • En la pantalla de Módulo 2 Ventas, la pestaña [ Cotizaciones Abiertas ] se actualiza en tiempo real mostrando el contador de pedidos pendientes de cobro/facturación.\n\n"
                "3. Facturación en Caja por la Cajera:\n"
                "   • La cajera abre la pestaña 'Cotizaciones Abiertas' en Módulo 2, selecciona la cotización autorizada por el vendedor y presiona 'Cargar a Caja'.\n"
                "   • El sistema carga cliente, SKUs, precios y condiciones de pago pactadas.\n"
                "   • La cajera procesa el cobro (Efectivo, Tarjeta, Transferencia o Crédito) y emite el DTE / Factura Fiscal sin recaptura de datos.",
                bg_hex="F0FDF4", border_hex="10B981")

    # -------------------------------------------------------------
    # SECCIÓN 9: PROCEDIMIENTO 6 - TABLERO ANALÍTICO Y FUGAS
    # -------------------------------------------------------------
    h9_an = doc.add_heading(level=1)
    r9_an = h9_an.add_run("9. Procedimiento Operativo Detallado N° 6: Tablero Analítico de Cotizaciones Generadas vs Vendidas y Auditoría de Fugas")
    r9_an.font.name = "Arial"
    r9_an.font.color.rgb = RGBColor(10, 37, 64)

    p_an_desc = doc.add_paragraph()
    p_an_desc.add_run("Para responder con rigor directivo a la pregunta: ¿Cuánto cotizamos, cuánto vendimos realmente y por qué razones perdimos lo no vendido?, "
                      "el Módulo 1 incorpora el Tablero Analítico Avanzado, accesible desde la pestaña [ 📈 Indicadores: Cotizaciones vs Vendidas ].")

    doc.add_heading(level=2).add_run("Las 4 Tarjetas de Control Gerencial:")
    tbl_an_kpis = doc.add_table(rows=1, cols=3)
    col_w_an = [2.2, 1.8, 3.0]
    headers_an = ["Tarjeta KPI", "Métrica y Contenido", "Utilidad Gerencial"]
    data_an = [
        ["1. Cotizaciones Generadas (Azul)", "Total cotizaciones emitidas y monto total bruto en $ USD en el rango de fechas.", "Mide la intensidad y volumen del esfuerzo comercial desplegado."],
        ["2. Cotizaciones Vendidas / Cierre (Verde)", "Cotizaciones cerradas en venta, monto vendido y Tasa de Conversión (%) con barra de progreso.", "Efectividad real de cierre del equipo comercial frente a la demanda."],
        ["3. En Negociación / Abiertas (Ámbar)", "Cotizaciones en proceso activo, importe en curso y % de cartera viva.", "Volumen de negocio en riesgo o con potencial de cierre a corto plazo."],
        ["4. Ventas Perdidas / Fuga (Rojo)", "Cotizaciones descartadas, SKUs rechazados y monto total de fuga en $ USD.", "Identificación inmediata de fugas económicas para toma de decisiones."]
    ]
    style_table(tbl_an_kpis, col_w_an, headers_an, data_an)
    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    doc.add_heading(level=2).add_run("Auditoría de los 5 Motivos Estratégicos de Ventas Perdidas (Razones de No Compra):")
    tbl_reasons = doc.add_table(rows=1, cols=3)
    col_w_r = [2.2, 1.8, 3.0]
    headers_r = ["Motivo de Rechazo", "Impacto Típico", "Acción Correctiva en NyTEX"]
    data_r = [
        ["1. Precio Alto / Competencia Más Barata", "Pérdida por precio de lista o agresividad de competidores.", "Revisión de márgenes en Compras [3], solicitud de descuentos a proveedores o análisis de elasticidad."],
        ["2. Falta de Stock / Tiempo de Entrega Tardío", "Pérdida por desabasto o tiempos de reposición lentos.", "Ajuste de punto de reorden (ROP) y stock de seguridad en Planeación de Demanda [5] e Inventarios [4]."],
        ["3. Desistimiento del Cliente / Cancelación de Proyecto", "El cliente pospuso o canceló su inversión interna.", "Seguimiento periódico a 60/90 días para reactivar la oportunidad cuando se retome el proyecto."],
        ["4. Especificación Técnica Incorrecta o Incompatible", "El SKU cotizado no cumplió con requerimiento físico/químico.", "Capacitación técnica al asesor comercial y validación cruzada con fichas técnicas de producto."],
        ["5. Falta de Aprobación de Crédito / Condiciones de Pago", "El cliente requería crédito no autorizado por CxC.", "Evaluación de garantías comerciales, líneas rotativas con pagos parciales o financiamiento mixto."]
    ]
    style_table(tbl_reasons, col_w_r, headers_r, data_r)
    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    doc.add_heading(level=2).add_run("Pestaña Destacada al Tope: [ 📦 Por Códigos (SKU) ]:")
    p_sku_tab = doc.add_paragraph()
    p_sku_tab.add_run("Ubicada inmediatamente debajo de las 4 tarjetas KPI principales para visibilidad instantánea sin requerir scroll, "
                      "la pestaña [ 📦 Por Códigos (SKU) ] permite evaluar el comportamiento individual de cada producto:\n\n"
                      "• Selector de Métrica: Permite alternar la tabla entre:\n"
                      "   – [ 📊 Completa ]: Despliega unidades, montos y porcentajes simultáneamente.\n"
                      "   – [ 🔢 Cantidad ]: Muestra unidades cotizadas vs vendidas vs no vendidas.\n"
                      "   – [ ％ Porcentaje ]: Muestra la tasa de efectividad (%) de cada código.\n"
                      "   – [ 💲 Montos ]: Muestra los importes monetarios en dólares ($ USD).\n"
                      "• Filtros por Condición: Visualizar todos los SKUs, solo con ventas ganadas, con pérdidas registradas o 100% no vendidos.\n"
                      "• Buscador de Código: Permite encontrar rápidamente cualquier SKU por código o descripción.\n"
                      "• Desglose de Causas de No Compra por SKU: Muestra badges con el motivo exacto por el cual se perdió cada código.\n"
                      "• Acordeón de Casos Reales: Al dar clic en 'Ver casos', despliega las cotizaciones específicas donde se descartó el SKU con empresa, vendedor, fecha y notas textuales del cliente.")

    doc.add_heading(level=2).add_run("Otras Dimensiones de Clasificación Disponibles:")
    p_dims = doc.add_paragraph()
    p_dims.add_run("• [ 🏢 Total Empresa ]: Consolidado corporativo, sucursal líder, vendedor líder y auditoría de motivos general.\n"
                   "• [ 📍 Por Sucursal ]: Comparativo de tasa de cierre y montos cotizados vs vendidos entre agencias (Central, Norte, Sur, etc.).\n"
                   "• [ 👤 Por Vendedor ]: Ranking de asesores comerciales por volumen vendido y tasa de efectividad (%).\n"
                   "• [ 🏭 Por Proveedor ]: Rendimiento y aceptación en el mercado por marca o fabricante.\n"
                   "• [ 🏷️ Por Categoría ]: Familias de productos con mayor rotación o mayor fuga comercial.\n"
                   "• [ ⚠️ Motivos de Pérdida (1 al 5) ]: Vista dedicada para auditar las 5 causas estratégicas de descarte.")

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # SECCIÓN 10: MATRIZ DE INTEGRACIÓN
    # -------------------------------------------------------------
    h10 = doc.add_heading(level=1)
    r10 = h10.add_run("10. Matriz de Interconexión e Impacto con los Demás Módulos del Ecosistema NyTEX")
    r10.font.name = "Arial"
    r10.font.color.rgb = RGBColor(10, 37, 64)

    tbl_integ = doc.add_table(rows=1, cols=4)
    col_w_integ = [2.0, 1.8, 1.8, 1.4]
    headers_integ = ["Módulo Receptor", "Datos Transferidos", "Impacto Operativo en el Sistema", "Circuito"]
    data_integ = [
        ["[0] Business Partners (Catálogo Clientes)", "Razón Social, NIT/RFC, Contactos, Dirección Fiscal", "Crea el expediente maestro del cliente formal si no existía.", "Maestros"],
        ["[2] Ventas & Facturación", "Cotización autorizada, SKUs, precios, descuentos", "Habilita facturación en caja (DTE/Ticket) sin recaptura manual.", "Order-to-Cash"],
        ["[4] Inventario & Control de Stock", "Consulta de Kardex en vivo y reserva de existencias", "Aparta stock disponible y evita sobreventa física en almacén.", "Supply Chain"],
        ["[5] Planeación de Demanda", "Forecast ponderado y auditoría de fugas por SKU", "Ajusta pronósticos de reposición ROP y compras a proveedores.", "Plan-to-Produce"],
        ["[8] Cuentas por Cobrar (CxC)", "Términos de crédito pactados y límite comercial", "Abre la cuenta corriente y programa cobros futuros.", "Order-to-Cash"],
        ["[12] Contabilidad Central", "Trazabilidad completa de origen (Oportunidad -> Factura)", "Garantiza auditoría de la orden que generó la póliza de ingresos.", "Record-to-Report"]
    ]
    style_table(tbl_integ, col_w_integ, headers_integ, data_integ)
    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # SECCIÓN 11: BUENAS PRÁCTICAS Y GOBERNANZA
    # -------------------------------------------------------------
    h11 = doc.add_heading(level=1)
    r11 = h11.add_run("11. Buenas Prácticas Comerciales, Segregación de Funciones y Gobernanza del Pipeline")
    r11.font.name = "Arial"
    r11.font.color.rgb = RGBColor(10, 37, 64)

    add_callout(doc, "POLÍTICAS DE CONTROL INTERNO Y AUDITORÍA COMERCIAL",
                "1. Segregación de Funciones Estricta (Vendedor vs Cajera): El vendedor prospecta, califica y cotiza en Módulo 1 CRM; la cajera o facturador es la única persona autorizada para procesar el cobro y emitir la factura en Módulo 2 Ventas.\n"
                "2. Justificación Obligatoria de Descarte: Ningún negocio puede marcarse como 'Perdido' sin seleccionar uno de los 5 motivos estratégicos de no compra y documentar la nota explicativa para retroalimentar Compras y Almacén.\n"
                "3. Prohibición de Cotizaciones sin Oportunidad: Todas las cotizaciones emitidas a clientes deben nacer vinculadas a una oportunidad en el CRM para preservar la analítica de efectividad.\n"
                "4. Validación de Stock antes de Cotizar: Los asesores deben verificar la disponibilidad real en el Kardex interactivo para no comprometer plazos inviables.\n"
                "5. Caducidad de Prospectos Inactivos: Los prospectos sin seguimiento tras 30 días naturales se desasignan y reingresan a la bolsa común corporativa.",
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
