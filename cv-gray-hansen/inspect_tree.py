import json

with open("callback_5_ds:3.txt", "r", encoding="utf-8") as f:
    text = f.read()

import re
match = re.search(r"data:\s*(\[.*\])\s*,\s*sideChannel:", text, re.DOTALL)
if not match:
    match = re.search(r"data:\s*(\[.*\])\s*}\s*\);", text, re.DOTALL)

data = json.loads(match.group(1))

def inspect(obj, depth=0):
    if depth > 4:
        return
    prefix = "  " * depth
    if isinstance(obj, list):
        print(f"{prefix}List len={len(obj)}")
        for i, item in enumerate(obj[:5]):
            print(f"{prefix}[{i}]:", type(item).__name__, str(item)[:100])
            if isinstance(item, (list, dict)):
                inspect(item, depth + 1)
    elif isinstance(obj, dict):
        print(f"{prefix}Dict keys={list(obj.keys())}")

inspect(data)
