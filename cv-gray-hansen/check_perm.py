import urllib.request, re

url = 'https://docs.google.com/spreadsheets/d/13SW-NHy2Dth92t7OJyRmc0IlZEV2Zm5Fk7qhERT0dmw/edit'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
        print('canEdit:', re.findall(r'"canEdit"\s*:\s*(true|false)', html))
        print('isViewOnly:', re.findall(r'"isViewOnly"\s*:\s*(true|false)', html))
        print('title:', re.findall(r'<title>(.*?)</title>', html))
except Exception as e:
    print('Error:', e)
