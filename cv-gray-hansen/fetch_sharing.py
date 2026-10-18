import urllib.request
import re
import json

url = 'https://drive.google.com/drive/folders/1yMjZKi0HHhj7kbozoq8XraJQO9_3if7E?usp=sharing'
req = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9,id;q=0.8'
})

with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

print('Fetched HTML length:', len(html))
with open('sharing_page.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Check title
m_title = re.search(r'<title>(.*?)</title>', html)
print('Page Title:', m_title.group(1) if m_title else 'None')

# Find AF_initDataCallback
callbacks = re.findall(r'AF_initDataCallback\s*\(\s*\{.*?\}\s*\)\s*;', html, re.DOTALL)
print(f"Callbacks count: {len(callbacks)}")

for i, cb in enumerate(callbacks):
    key_match = re.search(r"key:\s*['\"]([^'\"]+)['\"]", cb)
    key = key_match.group(1) if key_match else f"unknown_{i}"
    safe_key = key.replace(':', '_').replace('/', '_')
    print(f"Callback {i}: key={key}, len={len(cb)}")
    with open(f"sharing_cb_{i}_{safe_key}.txt", "w", encoding="utf-8") as out:
        out.write(cb)
