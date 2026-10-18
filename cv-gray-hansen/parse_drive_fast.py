import json
import re

with open('drive_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's search for AF_initDataCallback
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
print(f"Total scripts: {len(scripts)}")

data_callbacks = []
for s in scripts:
    if 'AF_initDataCallback' in s:
        data_callbacks.append(s)

print(f"Data callbacks found: {len(data_callbacks)}")

# Let's inspect data callbacks
for i, dc in enumerate(data_callbacks):
    # try to extract key and data
    key_match = re.search(r"key:\s*'([^']+)'", dc)
    key = key_match.group(1) if key_match else "unknown"
    print(f"Callback {i}: key={key}, len={len(dc)}")
    
    # Save callbacks for inspection
    with open(f"callback_{i}_{key}.txt", "w", encoding="utf-8") as out:
        out.write(dc)
