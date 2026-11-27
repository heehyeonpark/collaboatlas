"""Rebuild the single-file exhibition from index.html and its local sources."""
from pathlib import Path
import base64
import json
import mimetypes
import re

ROOT = Path(__file__).resolve().parent
page = (ROOT / 'index.html').read_text(encoding='utf-8')
files = [p for folder in ('assets', 'downloads') for p in (ROOT / folder).rglob('*') if p.is_file()]
files.append(ROOT / 'map07-evidence.json')
assets = {}
for path in sorted(files):
    mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    data = base64.b64encode(path.read_bytes()).decode('ascii')
    assets[path.relative_to(ROOT).as_posix()] = f'data:{mime};base64,{data}'
page = re.sub(r'<script src="(js/[^"]+)"></script>',
              lambda m: '<script>' + (ROOT / m[1]).read_text(encoding='utf-8') + '</script>', page)
page = page.replace('<link rel="stylesheet" href="css/atlas.css">',
                    '<style>' + (ROOT / 'css/atlas.css').read_text(encoding='utf-8') + '</style>')
loader = (ROOT / 'portable-assets.js').read_text(encoding='utf-8')
page = page.replace('<!-- standalone-assets -->',
                    '<script>const assetData=' + json.dumps(assets) + ';' + loader + '</script>')
(ROOT / 'CollaboAtlas-Exhibition.html').write_text(page, encoding='utf-8')
