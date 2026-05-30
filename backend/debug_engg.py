import pandas as pd

xl = pd.ExcelFile('data/ENGG College Details.xlsx')

def get_col(df, *candidates):
    for c in candidates:
        if c in df.columns:
            return df[c]
    return pd.Series([''] * len(df), index=df.index)

for sheet in ['IIT', 'IIIT']:
    raw = xl.parse(sheet, header=None)
    headers = [str(h).strip().upper() for h in raw.iloc[0]]
    df_raw = raw.iloc[1:].copy()
    df_raw.columns = headers

    final_df = pd.DataFrame()
    final_df['code'] = get_col(df_raw, 'INST CODE', 'CODE')
    final_df['name'] = get_col(df_raw, 'COLLEGES IN MAHARASHTRA', 'NATIONAL INSTITUTE OF TECHNOLOGY (NIT)', 'GOVERNMENT FUNDED TECHNICAL INSTITUTE', 'COLLEGE NAME', 'NAME')
    final_df['fees'] = get_col(df_raw, 'FEES')
    final_df['hostel'] = get_col(df_raw, 'HOSTEL AVAILABELITY', 'HOSTEL AVAILABILITY')
    final_df = final_df.fillna('')
    final_df = final_df[final_df['name'].astype(str).str.strip() != '']
    final_df = final_df.reset_index(drop=True)

    print(f'Sheet [{sheet}]: {len(final_df)} rows')
    print(f'  Index type: {type(final_df.index)}, values: {list(final_df.index[:5])}')
    
    # Simulate the search
    mask = pd.Series([True] * len(final_df))
    print(f'  Mask index: {list(mask.index[:5])}')
    print(f'  Mask len: {len(mask)}, df len: {len(final_df)}')
    result = final_df[mask]
    print(f'  Result rows: {len(result)}')
    print(f'  Sample: {list(result["name"].head(2))}')
    print()
