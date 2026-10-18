import urllib.request

url = 'https://drive.google.com/drive/folders/1yMjZKi0HHhj7kbozoq8XraJQO9_3if7E?hl=ID'

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        print(f"Redirecting ({code}) to: {newurl}")
        return urllib.request.HTTPRedirectHandler.redirect_request(self, req, fp, code, msg, headers, newurl)

opener = urllib.request.build_opener(NoRedirect)
req = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
})

try:
    resp = opener.open(req)
    print("Final URL:", resp.geturl())
    print("Status:", resp.getcode())
except Exception as e:
    print("Error:", e)
