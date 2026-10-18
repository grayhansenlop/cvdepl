import re
import json

with open('drive_page.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Google Drive folder pages often store data in _data_ or JS arrays or window['_DRIVE_ivd']
print("Looking for items...")

# Let's search for patterns with filenames (.jpg, .png, .jpeg, etc.) or subfolder names
img_matches = set(re.findall(r'[\w\s\-\.\(\)]+\.(?:jpg|jpeg|png|webp|JPG|JPEG|PNG)', content))
print("Image matches found:", len(img_matches))
for m in list(img_matches)[:30]:
    print(" -", m)

# Look for drive file/folder IDs
# In Google Drive HTML, there is typically a big array containing items like:
# [["id", "name", ...]]
# Let's search for folder names or subfolders!
subfolders = re.findall(r'\"([^\"]+?)\",\"application/vnd\.google-apps\.folder\"', content)
print("Subfolders found:", subfolders)

# Let's search for anything related to "arsitektur", "foto", "desain", "flyer", "arsip"
keywords = ['arsitektur', 'foto', 'desain', 'flyer', 'landscape', 'portrait', 'grafis']
for kw in keywords:
    matches = re.findall(r'[^\"\n\r]*?' + kw + r'[^\"\n\r]*', content, re.IGNORECASE)
    print(f"Keyword '{kw}' matches (unique {len(set(matches))}):", list(set(matches))[:5])
