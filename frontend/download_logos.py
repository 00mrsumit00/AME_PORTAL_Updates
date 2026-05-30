import urllib.request
import os

domains = [
    "bvuniversity.edu.in",
    "despuneuniversity.edu.in",
    "dypiu.ac.in",
    "jspmuni.ac.in",
    "mituniversity.ac.in",
    "mitwpu.edu.in",
    "mnru.edu.in",
    "paruluniversity.ac.in",
    "pcu.edu.in",
    "sgu.ac.in",
    "somaiya.edu",
    "srmist.edu.in",
    "sspu.ac.in",
    "sru.edu.in",
    "vupune.ac.in"
]

out_dir = r"C:\Users\Vicky\Desktop\EM_AME_Portal-main\frontend\public\landing-assets\images\updates\private-universities\official_logos"
os.makedirs(out_dir, exist_ok=True)

for i, domain in enumerate(domains):
    url = f"https://www.google.com/s2/favicons?domain={domain}&sz=256"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        response = urllib.request.urlopen(req)
        data = response.read()
        
        file_path = os.path.join(out_dir, f"official_logo_{i+1}.png")
        with open(file_path, "wb") as f:
            f.write(data)
        print(f"Downloaded {domain} to official_logo_{i+1}.png")
    except Exception as e:
        print(f"Failed to download {domain}: {e}")
