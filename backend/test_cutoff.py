import os
import pandas as pd
from pathlib import Path
import logging

ROOT_DIR = Path(__file__).parent
CUTOFF_DATA_FILE = ROOT_DIR / "data" / "NEET.xlsx"

print("Starting test...")
if not CUTOFF_DATA_FILE.exists():
    print(f"File not found: {CUTOFF_DATA_FILE}")
    exit(1)

print(f"File found. Size: {os.path.getsize(CUTOFF_DATA_FILE)}")

try:
    print("Opening ExcelFile with openpyxl...")
    xl = pd.ExcelFile(CUTOFF_DATA_FILE, engine='openpyxl')
    print(f"Sheets found: {xl.sheet_names}")
    for sheet in xl.sheet_names:
        print(f"Parsing sheet: {sheet}")
        df = xl.parse(sheet, header=None)
        print(f"Parsed {len(df)} rows.")
except Exception as e:
    print(f"Error: {e}")

print("Test finished.")
