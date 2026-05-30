import os
import urllib.request
import time
from duckduckgo_search import DDGS

universities = [
    ("Bharati Vidyapeeth", "official_logo_1.png"),
    ("DES Pune University", "official_logo_2.png"),
    ("DY Patil International University", "official_logo_3.png"),
    ("JSPM University", "official_logo_4.png"),
    ("MIT-ADT University", "official_logo_5.png"),
    ("MIT World Peace University", "official_logo_6.png"),
    ("MNR University", "official_logo_7.png"),
    ("Parul University", "official_logo_8.png"),
    ("Pimpri Chinchwad University", "official_logo_9.png"),
    ("Sanjay Ghodawat University", "official_logo_10.png"),
    ("Somaiya Vidyavihar", "official_logo_11.png"),
    ("SRM Institute", "official_logo_12.png"),
    ("Symbiosis Skills and Professional University", "official_logo_13.png"),
    ("SR University", "official_logo_14.png"),
    ("Vishwakarma University", "official_logo_15.png")
]

out_dir = r"C:\Users\Vicky\Desktop\EM_AME_Portal-main\frontend\public\landing-assets\images\updates\private-universities\official_logos"
os.makedirs(out_dir, exist_ok=True)

with DDGS() as ddgs:
    for uni_name, filename in universities:
        file_path = os.path.join(out_dir, filename)
        if os.path.exists(file_path) and os.path.getsize(file_path) > 2000:
            print(f"Skipping {uni_name}, already downloaded.")
            continue
            
        print(f"Searching for {uni_name} logo...")
        try:
            # Search for transparent PNG logos
            results = ddgs.images(
                f"{uni_name} official logo",
                max_results=3
            )
            
            downloaded = False
            for res in results:
                image_url = res['image']
                try:
                    req = urllib.request.Request(image_url, headers={'User-Agent': 'Mozilla/5.0'})
                    img_data = urllib.request.urlopen(req, timeout=10).read()
                    
                    if len(img_data) > 2000: # Make sure it's a valid size image
                        with open(file_path, "wb") as f:
                            f.write(img_data)
                        print(f"Downloaded {uni_name} from {image_url}")
                        downloaded = True
                        break
                except Exception as e:
                    print(f"Failed URL {image_url}: {e}")
            
            if not downloaded:
                print(f"Could not download a valid logo for {uni_name}")
                
        except Exception as e:
            print(f"Search failed for {uni_name}: {e}")
            
        time.sleep(1) # Be nice to the API
