#!/usr/bin/env python3
"""Fotos del contenido inicial: convierte las aprobadas (creative/approved) a WebP ligero en public/seed/.
El panel las sube a Sanity la primera vez que lo abre un administrador. Uso: python3 scripts/build-seed-images.py"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
seed = json.loads((ROOT / 'sanity' / 'seed' / 'seed.json').read_text(encoding='utf8'))
src, out = ROOT / 'creative' / 'approved', ROOT / 'public' / 'seed'
out.mkdir(parents=True, exist_ok=True)
total = 0
for base, im in seed['images'].items():
    for version, path, limit in (('escritorio', im['desktop'], 2000), ('movil', im['mobile'], 1200)):
        if not path:
            continue
        f = next(src.glob(f'{base}-{version}.*'))
        img = Image.open(f).convert('RGB')
        img.thumbnail((limit, limit), Image.LANCZOS)
        dest = ROOT / 'public' / path.lstrip('/')
        img.save(dest, 'WEBP', quality=80, method=6)
        total += dest.stat().st_size
print(f'{len(seed["images"])} fotos · {total / 1e6:.1f} MB en public/seed')
