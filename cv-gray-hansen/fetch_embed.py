import urllib.request

url = 'https://drive.google.com/embeddedfolderview?id=1yMjZKi0HHhj7kbozoq8XraJQO9_3if7E#grid'
req = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
})

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print('Embedded folderview length:', len(html))
        with open('embedded_folderview.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print('Saved embedded_folderview.html')
except Exception as e:
    print('Error:', e)
