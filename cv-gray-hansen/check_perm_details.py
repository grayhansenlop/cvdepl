import urllib.request, re

url = 'https://docs.google.com/spreadsheets/d/13SW-NHy2Dth92t7OJyRmc0IlZEV2Zm5Fk7qhERT0dmw/edit'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')
    for line in html.splitlines():
        if 'permission' in line.lower() or 'anonymous' in line.lower() or 'role' in line.lower() or 'user_locale' in line.lower():
            if len(line) < 300:
                print(line.strip())
