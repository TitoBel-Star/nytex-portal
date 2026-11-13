# -*- coding: utf-8 -*-
import os
import sys
import shutil

sys.stdout.reconfigure(encoding='utf-8')

from generator_core import build_docx_for_module, build_html_for_module
from modules_data_fase2 import FASE2_MODULES

mod = FASE2_MODULES[0]  # Modulo 2 CRM
assert mod["num"] == "2", "First module in FASE2_MODULES must be Modulo 2"

BASE_MANUALES = r"C:\Users\emili\OneDrive\Desktop\Developer\Implementacion de Partners\Manuales de usuarios NyTEX"
DIR_EXPRESS = os.path.join(BASE_MANUALES, "Fase 2 Express", "Modulo 2 NyTEX CRM")
DIR_CONSOLIDATED = os.path.join(BASE_MANUALES, "Manuales de Usuario NyTEX - Fases 1 a 4", "Fase 2 - Express (Operación y Cadena Completa)", "Modulo 2 NyTEX CRM")
DIR_ROOT = BASE_MANUALES

for d in [DIR_EXPRESS, DIR_CONSOLIDATED, DIR_ROOT]:
    os.makedirs(d, exist_ok=True)

clean_name = "CRM_(Embudo_de_Ventas_&_Oportunidades)"
clean_name_human = "CRM (Embudo de Ventas & Oportunidades)"

docx_paths = [
    os.path.join(DIR_EXPRESS, f"Módulo 2 NyTEX {clean_name_human} - Manual de usuario.docx"),
    os.path.join(DIR_EXPRESS, f"NyTEX_Modulo_2_{clean_name}.docx"),
    os.path.join(DIR_EXPRESS, f"NyTEX_Modulo_2_Manual_{clean_name}.docx"),
    os.path.join(DIR_CONSOLIDATED, f"Módulo 2 NyTEX {clean_name_human} - Manual de usuario.docx"),
    os.path.join(DIR_CONSOLIDATED, f"NyTEX_Modulo_2_{clean_name}.docx"),
    os.path.join(DIR_CONSOLIDATED, f"NyTEX_Modulo_2_Manual_{clean_name}.docx"),
    os.path.join(DIR_ROOT, f"Módulo 2 NyTEX {clean_name_human} - Manual de usuario.docx")
]

print("Generando archivos DOCX para Módulo [2] NyTEX CRM...")
build_docx_for_module(mod, docx_paths)
print("✅ Archivos DOCX generados con éxito.")

html_file_express = os.path.join(DIR_EXPRESS, f"NyTEX_Modulo_2_{clean_name}_Imprimible.html")
html_file_consolidated = os.path.join(DIR_CONSOLIDATED, f"NyTEX_Modulo_2_{clean_name}_Imprimible.html")
html_file_root = os.path.join(DIR_ROOT, f"NyTEX_Modulo_2_{clean_name}_Imprimible.html")

print("Generando archivos HTML imprimibles...")
build_html_for_module(mod, [html_file_express, html_file_consolidated, html_file_root])
print("✅ Archivos HTML generados con éxito.")
