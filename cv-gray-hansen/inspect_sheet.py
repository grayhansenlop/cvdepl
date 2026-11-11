import urllib.request, json

url = 'https://docs.google.com/spreadsheets/d/13SW-NHy2Dth92t7OJyRmc0IlZEV2Zm5Fk7qhERT0dmw/gviz/tq?tqx=out:json'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        raw = resp.read().decode('utf-8')
        # gviz response starts with /*O_o*/\ngoogle.visualization.Query.setResponse(...);
        prefix = 'google.visualization.Query.setResponse('
        start = raw.find(prefix) + len(prefix)
        end = raw.rfind(');')
        data = json.loads(raw[start:end])
        cols = [c['label'] if c and 'label' in c else '' for c in data['table']['cols']]
        print('Columns count:', len(cols))
        print('Columns:', cols)
        print('Rows count:', len(data['table']['rows']))
        for i, row in enumerate(data['table']['rows']):
            row_vals = [c['v'] if c and 'v' in c else '' for c in row['c']]
            print(f'Row {i+1}:', row_vals)
except Exception as e:
    print('Error:', e)
