import urllib.request
import json
import re

url = 'https://drive.google.com/drive/folders/1yMjZKi0HHhj7kbozoq8XraJQO9_3if7E?hl=ID'
req = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
})

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print('Page length:', len(html))
        with open('drive_page.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print('Saved drive_page.html')
except Exception as e:
    print('Error:', e)
