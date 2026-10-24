#!/usr/bin/env python3
"""Genera creative/mockup/sitio-con-fotos.html: la maqueta del sitio con las fotos APROBADAS en sus huecos.
Un solo archivo, sin dependencias de red salvo las fuentes de Google. Las fotos van incrustadas (WebP) y se eligen por
ancho de pantalla (móvil <= 767 px, héroe <= 900 px). Lo que aún no tiene foto aprobada sigue siendo un hueco marcado.
Uso: python3 scripts/build-mockup-photos.py
"""
import base64, io, json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
A = ROOT / 'creative' / 'approved'
SRC = ROOT / 'creative' / 'mockup' / 'index.html'
OUT = ROOT / 'creative' / 'mockup' / 'sitio-con-fotos.html'
PROV = {e['id']: e for e in json.load(open(ROOT / 'creative' / 'provenance.json'))['assets']}

# código del hueco -> (archivo escritorio, archivo móvil, id de procedencia para el texto alternativo, proporción)
BASES = {'P05': 'p05-alba-tv', 'P06': 'p06-alba-bano', 'P26': 'p26-alba-bano-detalle', 'P27': 'p27-alba-tv-vista-cama',
         'P07': 'p07-marea', 'P08': 'p08-marea-mirador', 'P09': 'p09-marea-camas', 'P28': 'p28-marea-bano', 'P29': 'p29-marea-tv',
         'P10': 'p10-terraza', 'P11': 'p11-terraza-exterior', 'P12': 'p12-terraza-camas', 'P30': 'p30-terraza-bano', 'P31': 'p31-terraza-tv',
         'P13': 'p13-faro-salon', 'P34': 'p34-faro-tv', 'P14': 'p14-faro-dormitorio-doble', 'P15': 'p15-faro-dormitorio-individuales',
         'P32': 'p32-faro-bano', 'P35': 'p35-faro-cocina-recibidor'}
FIXED = {  # piezas con nombre propio
    'P01': ('p01-hero-escritorio.jpg', 'p01-hero-movil.png', 'p01-hero-escritorio', (2048, 1280), (941, 1672)),
    'P03': ('p03-patio-escritorio.webp', 'p03-patio-movil.webp', 'p03-patio-escritorio', (1600, 1067), (1856, 1237)),
    'P04': ('p04-alba-escritorio.jpg', 'p04-alba-movil.png', 'p04-alba-escritorio', (800, 1000), (720, 900)),
    'P36': ('p36-recepcion-fin-escritorio.png', 'p36-recepcion-fin-movil.png', 'p36-recepcion-fin-escritorio', (1672, 941), (941, 1672)),
    'P19': ('p19-spa-tratamientos-escritorio.png', 'p19-spa-tratamientos-escritorio.png', 'p19-spa-tratamientos-escritorio', (1122, 1402), (720, 900)),  # movil = escritorio reducida (4:5)
    'P21': ('p21-escapada-escritorio.png', 'p21-escapada-movil.png', 'p21-escapada-escritorio', (1536, 1024), (896, 1120)),
    'P25': ('p25-perro-terraza-escritorio.png', 'p25-perro-terraza-movil.png', 'p25-perro-terraza-escritorio', (1200, 800), (720, 480)),
    'V01': ('p16-restaurante-escritorio.png', 'p16-restaurante-movil.png', 'p16-restaurante-escritorio', (1672, 941), (900, 1125)),  # P16, poster de V01
}

# borradores recibidos y aun sin aprobar: se ven en la maqueta para decidir (codigo del hueco -> archivos en el repo)
DRAFTS = {
}

def enc(path, size, q=76):
    im = Image.open(path).convert('RGB').resize(size, Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'WEBP', quality=q, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()

fotos = {}
for code, (fd, fm, pid, sd, sm) in FIXED.items():
    alt = PROV[pid]['alt_draft']
    fotos[code] = {'d': enc(A / fd, sd, 72 if code == 'P01' else 76), 'm': enc(A / fm, sm, 74 if code == 'P01' else 76), 'alt': alt}
for code, (fd, fm, pid, sd, sm) in DRAFTS.items():
    fotos[code] = {'d': enc(ROOT / fd, sd, 78), 'm': enc(ROOT / fm, sm, 78), 'alt': PROV[pid]['alt_draft']}
for code, base in BASES.items():
    pid = base + '-escritorio'
    portrait = PROV[pid]['aspect'] == '4:5'
    sd, sm = ((800, 1000), (720, 900)) if portrait else ((960, 640), (720, 480))
    fotos[code] = {'d': enc(A / (pid + '.png'), sd), 'm': enc(A / (base + '-movil.png'), sm), 'alt': PROV[pid]['alt_draft']}

CSS = """
/* ===== Fotos aprobadas (generado por scripts/build-mockup-photos.py) ===== */
.slot[data-foto]{background-size:cover;background-position:50% 50%;background-repeat:no-repeat}
.slot[data-foto] .slot-label{display:none}
.slot[data-foto]::before{display:none}
.leaf-img[data-foto]{background-position:50% 50%}
"""
JS = """
(function(){
  var F=window.__FOTOS, small=matchMedia('(max-width:767px)'), hero=matchMedia('(max-width:900px)'), queued=false;
  function lang(){return document.documentElement.lang==='en'?'en':'es'}
  function apply(){
    queued=false;
    document.querySelectorAll('.slot').forEach(function(el){
      var b=el.querySelector('.slot-label b'), code=b?b.textContent.trim():el.getAttribute('data-foto');
      var f=F[code]; if(!f) return;
      if(el.getAttribute('data-foto')!==code) el.setAttribute('data-foto',code);
      var src=((code==='P01'||code==='P36')?hero.matches:small.matches)?f.m:f.d;
      if(el.dataset.src!==src){el.style.backgroundImage='url('+src+')';el.dataset.src=src}
      if(el.getAttribute('role')!=='img') el.setAttribute('role','img');
      var alt=f.alt[lang()]; if(el.getAttribute('aria-label')!==alt) el.setAttribute('aria-label',alt);
    });
  }
  function queue(){if(!queued){queued=true;requestAnimationFrame(apply)}}
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-label']});
  small.addEventListener('change',queue); hero.addEventListener('change',queue);
  apply();
})();
"""
html = SRC.read_text(encoding='utf8')
assert '</body>' in html and '</head>' in html
html = html.replace('</head>', '<style>' + CSS + '</style></head>', 1)
html = html.replace('</body>', '<script>window.__FOTOS=' + json.dumps(fotos, ensure_ascii=False) + ';</script><script>' + JS + '</script></body>', 1)
OUT.write_text(html, encoding='utf8')
print(f'{OUT.relative_to(ROOT)}: {OUT.stat().st_size/1048576:.1f} MB, {len(fotos)} huecos con foto')
