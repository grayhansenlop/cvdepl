import json
import re

with open("callback_5_ds:3.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Extract data: parameter from AF_initDataCallback
# Pattern is usually: AF_initDataCallback({key: 'ds:3', isError: false, hash: '...', data: [...]});
match = re.search(r"data:\s*(\[.*\])\s*,\s*sideChannel:", text, re.DOTALL)
if not match:
    match = re.search(r"data:\s*(\[.*\])\s*}\s*\);", text, re.DOTALL)

if match:
    data_str = match.group(1)
    print("Found data json, length:", len(data_str))
    try:
        data = json.loads(data_str)
        print("Successfully parsed JSON!")
        
        # Let's inspect data structure recursively to find files/folders
        items = []
        def find_items(obj):
            if isinstance(obj, list):
                # An item usually has [id, title, mimeType, ...]
                # check if this list looks like a file item
                if len(obj) > 3 and isinstance(obj[0], str) and len(obj[0]) > 20 and isinstance(obj[1], str):
                    items.append((obj[0], obj[1]))
                for child in obj:
                    find_items(child)
            elif isinstance(obj, dict):
                for v in obj.values():
                    find_items(v)
        
        find_items(data)
        print(f"Items found: {len(items)}")
        for it in items[:50]:
            print("Item:", it)
    except Exception as e:
        print("JSON parse error:", e)
        # fallback: find string pairs
        # find patterns like ["1abc...", "filename.jpg"]
        matches = re.findall(r'\[\"([a-zA-Z0-9_-]{25,})\",\s*\"([^\"]+)\"', text)
        print("Regex matches count:", len(matches))
        for m in matches[:30]:
            print("Match:", m)
else:
    print("Could not match data pattern, checking fallback regex...")
    matches = re.findall(r'\[\"([a-zA-Z0-9_-]{25,})\",\s*\"([^\"]+)\"', text)
    print("Regex matches count:", len(matches))
    for m in matches[:30]:
        print("Match:", m)
