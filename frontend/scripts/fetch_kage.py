# AutoHub - ThreeUI Kage Landing Page Installer
import os
import urllib.request
import hashlib
import json

BASE_URL = 'https://threeui.com'
BUNDLE_URL = f'{BASE_URL}/source-code/kage-landing-page.json'

headers = {'User-Agent': 'Mozilla/5.0'}

print('1. Fetching bundle JSON...')
req = urllib.request.Request(BUNDLE_URL, headers=headers)
with urllib.request.urlopen(req) as resp:
    bundle = json.loads(resp.read().decode('utf-8'))

files_by_path = {f['path']: f for f in bundle.get('files', [])}
assets = bundle.get('assets', [])

# 1. Download and write registered source files with code
for path, f in files_by_path.items():
    if 'code' in f and f['code'] is not None:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8') as out:
            out.write(f['code'])
        print(f"Wrote source file: {path} ({len(f['code'])} chars)")

# 2. Download files with sourceUrl
for path, f in files_by_path.items():
    if f.get('sourceUrl'):
        url = BASE_URL + f['sourceUrl']
        os.makedirs(os.path.dirname(path), exist_ok=True)
        r = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(r) as resp:
            content = resp.read()
        with open(path, 'wb') as out:
            out.write(content)
        sha = hashlib.sha256(content).hexdigest()
        print(f"Downloaded {path}: {len(content)} bytes (sha256: {sha})")

# 3. Download binary assets
for a in assets:
    path = a['path']
    url_path = path
    if url_path.startswith('public/'):
        url_path = url_path[len('public'):]
    elif not url_path.startswith('/'):
        url_path = '/' + url_path
    url = BASE_URL + url_path
    os.makedirs(os.path.dirname(path), exist_ok=True)
    r = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(r) as resp:
        content = resp.read()
    with open(path, 'wb') as out:
        out.write(content)
    sha = hashlib.sha256(content).hexdigest()
    expected_sha = a.get('sha256')
    match = (sha == expected_sha)
    print(f"Asset {path}: {len(content)} bytes -> sha256 match: {match} ({sha[:8]}...)")

print('Download complete!')
