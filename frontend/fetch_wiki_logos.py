import urllib.request
import urllib.parse
import json
import os

universities = [
    ("Bharati Vidyapeeth", "official_logo_1.png"),
    ("DES Pune University", "official_logo_2.png"),
    ("Dr. D. Y. Patil Vidyapeeth, Pune", "official_logo_3.png"),
    ("JSPM University", "official_logo_4.png"),
    ("MIT Art, Design and Technology University", "official_logo_5.png"),
    ("MIT World Peace University", "official_logo_6.png"),
    ("MNR University", "official_logo_7.png"),
    ("Parul University", "official_logo_8.png"),
    ("Pimpri Chinchwad University", "official_logo_9.png"),
    ("Sanjay Ghodawat University", "official_logo_10.png"),
    ("Somaiya Vidyavihar", "official_logo_11.png"),
    ("SRM Institute of Science and Technology", "official_logo_12.png"),
    ("Symbiosis Skills and Professional University", "official_logo_13.png"),
    ("SR University", "official_logo_14.png"),
    ("Vishwakarma University", "official_logo_15.png")
]

out_dir = r"C:\Users\Vicky\Desktop\EM_AME_Portal-main\frontend\public\landing-assets\images\updates\private-universities\official_logos"
os.makedirs(out_dir, exist_ok=True)

def fetch_wiki_logo(query):
    # Search Wikipedia for the query
    search_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&utf8=&format=json"
    req = urllib.request.Request(search_url, headers={'User-Agent': 'Mozilla/5.0'})
    res = urllib.request.urlopen(req)
    data = json.loads(res.read())
    if not data['query']['search']:
        return None
    title = data['query']['search'][0]['title']
    
    # Get page info including images
    page_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&pithumbsize=500&format=json"
    req = urllib.request.Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})
    res = urllib.request.urlopen(req)
    page_data = json.loads(res.read())
    pages = page_data['query']['pages']
    page = list(pages.values())[0]
    if 'thumbnail' in page:
        return page['thumbnail']['source']
    return None

for uni_name, filename in universities:
    try:
        logo_url = fetch_wiki_logo(uni_name)
        if logo_url:
            req = urllib.request.Request(logo_url, headers={'User-Agent': 'Mozilla/5.0'})
            img_data = urllib.request.urlopen(req).read()
            with open(os.path.join(out_dir, filename), "wb") as f:
                f.write(img_data)
            print(f"Success: {uni_name}")
        else:
            print(f"Failed to find logo for: {uni_name}")
    except Exception as e:
        print(f"Error for {uni_name}: {e}")
