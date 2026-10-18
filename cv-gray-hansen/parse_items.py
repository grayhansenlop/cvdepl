import json
import re

with open('drive_page.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's search for file patterns: [id, title, ...]
items = re.findall(r'\["([a-zA-Z0-9_-]{20,})",\s*"([^"]+\.(?:jpg|jpeg|png|webp|pdf|ai|psd|mp4))"', text, re.IGNORECASE)
print(f'Direct file extension matches: {len(items)}')
for it in items:
    print('File:', it)

# Also check for folders
folders = re.findall(r'\["([a-zA-Z0-9_-]{20,})",\s*"([^"]+)",\s*"application/vnd\.google-apps\.folder"', text)
print(f'Folder matches: {len(folders)}')
for fd in folders:
    print('Folder:', fd)

# Also let's inspect inspect_ds3.py results
try:
    with open("callback_5_ds", "r", encoding="utf-8") as f:
        cb5 = f.read()
    print("callback_5_ds length:", len(cb5))
    m = re.findall(r'\["([a-zA-Z0-9_-]{25,})",\s*"([^"]+)"', cb5)
    print("Found in callback_5_ds:", len(m))
    for x in m[:20]:
        print("  ->", x)
except Exception as e:
    print("Error reading callback_5_ds:", e)
