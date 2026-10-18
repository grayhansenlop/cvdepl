import re

with open('drive_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

callbacks = re.findall(r'AF_initDataCallback\s*\(\s*\{.*?\}\s*\)\s*;', html, re.DOTALL)
print(f"Total callbacks found: {len(callbacks)}")

for i, cb in enumerate(callbacks):
    key_match = re.search(r"key:\s*['\"]([^'\"]+)['\"]", cb)
    key = key_match.group(1) if key_match else f"unknown_{i}"
    safe_key = key.replace(':', '_').replace('/', '_')
    print(f"Callback {i}: key={key}, len={len(cb)}")
    with open(f"cb_{i}_{safe_key}.txt", "w", encoding="utf-8") as out:
        out.write(cb)
