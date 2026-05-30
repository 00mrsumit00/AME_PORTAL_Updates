import pandas as pd
from pathlib import Path

ENGG_COLLEGE_DETAILS_FILE = Path('data/ENGG College Details.xlsx')

def safe_str(x):
    s = str(x).strip()
    return '' if s in ('nan', 'None', 'NaN') else s

def get_col(df, *candidates):
    for c in candidates:
        if c in df.columns:
            return df[c]
    return pd.Series([''] * len(df), index=df.index)

xl = pd.ExcelFile(ENGG_COLLEGE_DETAILS_FILE)
for sheet in xl.sheet_names:
    raw = xl.parse(sheet, header=None)
    if len(raw) < 2:
        continue
    headers = [str(h).strip().upper() for h in raw.iloc[0]]
    df = raw.iloc[1:].copy()
    df.columns = headers

    final_df = pd.DataFrame()
    final_df['code'] = get_col(df, 'INST CODE', 'CODE')
    final_df['name'] = get_col(df, 'COLLEGES IN MAHARASHTRA')
    final_df['establishment'] = get_col(df, 'ESTABLISHMENT IN', 'ESTABLISMENT IN')
    final_df['fees'] = get_col(df, 'FEES')
    final_df['intake_capacity'] = get_col(df, 'INTAKE CAPACITY', 'INTAKE')
    final_df['hostel'] = get_col(df, 'HOSTEL AVAILABELITY', 'HOSTEL AVAILABILITY')
    final_df['contact_no'] = get_col(df, 'COLLEGE CONTACT NUMBER', 'CONTACT NUMBER')
    final_df['status'] = get_col(df, 'STATUS')
    final_df = final_df.fillna('')
    final_df = final_df[final_df['name'].astype(str).str.strip() != '']
    first_name = final_df['name'].iloc[0] if len(final_df) > 0 else 'EMPTY'
    print(f"Sheet [{sheet}]: {len(final_df)} rows. Sample: {first_name}")
