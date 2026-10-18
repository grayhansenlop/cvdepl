import re

with open("edge_dom.html", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

print("File length:", len(text))

# Search for title
m_title = re.search(r'<title>(.*?)</title>', text)
print("Title:", m_title.group(1) if m_title else "None")

# Search for any filenames, folder names, text in DOM
# Look for aria-label or role="row" or file extensions
ext_matches = set(re.findall(r'[\w\s\-\.\(\)]+\.(?:jpg|jpeg|png|webp|pdf|ai|psd|mp4)', text, re.IGNORECASE))
print("Extensions found:", len(ext_matches))
for x in list(ext_matches)[:30]:
    print("  Ext:", x)

# Look for data-id or jsname or aria-labels
aria_labels = set(re.findall(r'aria-label="([^"]+)"', text))
print("Aria labels:", len(aria_labels))
for a in list(aria_labels)[:30]:
    if any(k in a.lower() for k in ['folder', 'image', 'file', 'foto', 'arsitektur', 'desain', 'flyer', 'gray', 'hansen']):
        print("  Aria:", a)

# Let's search for keywords in text
for kw in ['arsitektur', 'foto', 'desain', 'flyer', 'landscape', 'portrait', 'grafis']:
    matches = [m.strip() for m in re.findall(r'[^<>\n\r]{0,40}' + kw + r'[^<>\n\r]{0,40}', text, re.IGNORECASE)]
    if matches:
        print(f"Keyword '{kw}':", matches[:5])
