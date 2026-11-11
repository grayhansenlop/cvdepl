import http.server, socketserver, threading, urllib.request, time, subprocess, json, websockets, asyncio, tempfile

PORT = 8092

def start_server():
    Handler = http.server.SimpleHTTPRequestHandler
    httpd = socketserver.TCPServer(('', PORT), Handler)
    httpd.serve_forever()

t = threading.Thread(target=start_server, daemon=True)
t.start()
time.sleep(1)

async def check():
    u = tempfile.mkdtemp()
    edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
    p = subprocess.Popen([
        edge,
        '--headless',
        '--remote-debugging-port=9240',
        f'--user-data-dir={u}',
        '--disable-gpu',
        f'http://127.0.0.1:{PORT}/indexdua.html'
    ])
    await asyncio.sleep(2)
    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9240/json').read().decode())
        page = next(t for t in tabs if t.get('type') == 'page' and 'indexdua.html' in t.get('url', ''))
        
        async with websockets.connect(page['webSocketDebuggerUrl']) as ws:
            msg_id = 1
            async def send(method, params=None):
                nonlocal msg_id
                mid = msg_id
                msg_id += 1
                await ws.send(json.dumps({'id': mid, 'method': method, 'params': params or {}}))
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get('id') == mid:
                        return resp.get('result', {})

            await send('Runtime.enable')
            await send('Log.enable')
            
            # Evaluate flip check
            res = await send('Runtime.evaluate', {
                'expression': '''
                (() => {
                    const flippers = document.querySelectorAll('.dock-card-flipper');
                    const flipBtns = document.querySelectorAll('.flip-dock-card-btn');
                    const btn1 = flipBtns[0];
                    let beforeClass = flippers[0] ? flippers[0].className : 'null';
                    let btnClickResult = 'no btn';
                    if (btn1) {
                        btn1.click();
                        btnClickResult = 'clicked';
                    }
                    let afterClass = flippers[0] ? flippers[0].className : 'null';
                    
                    return {
                        totalFlippers: flippers.length,
                        totalFlipBtns: flipBtns.length,
                        btnClickResult: btnClickResult,
                        beforeClass: beforeClass,
                        afterClass: afterClass
                    };
                })()
                ''',
                'returnByValue': True
            })
            print('RESULTS:', json.dumps(res.get('result', {}).get('value'), indent=2))
    finally:
        p.terminate()

asyncio.run(check())
