"""Regenerate /pt from the English HTML source (requires beautifulsoup4)."""
from pathlib import Path
from bs4 import BeautifulSoup, Comment, Doctype
from urllib.parse import urlsplit, urlunsplit
import json
root=Path(__file__).resolve().parents[1]
translations=json.loads((root/'scripts/pt-translations.json').read_text())
for path in root.rglob('*.html'):
 rel=path.relative_to(root)
 if rel.parts[0] in ('pt','.git'):continue
 s=BeautifulSoup(path.read_text(),'html.parser');s.html['lang']='pt-PT'
 for t in list(s.find_all(string=True)):
  if isinstance(t,(Comment,Doctype)) or t.parent.name in ('script','style'):continue
  key=str(t).strip()
  if key in translations:t.replace_with(str(t).replace(key,translations[key]))
 for el in s.find_all(True):
  for attr in ['alt','aria-label','title','placeholder']:
   if el.has_attr(attr):
    value=el[attr]
    for a,b in [('Open menu','Abrir menu'),('Close menu','Fechar menu'),('Close image','Fechar imagem'),('Next image','Imagem seguinte'),('Previous image','Imagem anterior'),('Language','Idioma'),('visualization','visualização'),('interior view','vista interior')]:value=value.replace(a,b)
    el[attr]=translations.get(value,value)
  for attr in ['src','href','poster']:
   value=el.get(attr,'')
   if value and not value.startswith(('https:','http:','mailto:','data:','#')) and 'assets/' in value:
    el[attr]='../'+value
 for el in s.select('[style]'):
  el['style']=el['style'].replace("url('../assets/","url('../../assets/").replace("url('./assets/","url('../assets/")
 for style in s.select('style'):
  # Every local CSS asset path needs one additional level in the language subtree.
  import re
  style.string=re.sub(r'url\((["\'])(.*?)\1\)',lambda m:'url('+m[1]+('../' if m[2].startswith(('./','../')) and 'assets/' in m[2] else '')+m[2]+m[1]+')',style.get_text())
 depth=len(rel.parts)-1;base='../'*depth or './'
 switch=s.select_one('.languageSwitch')
 pt,en=switch.select('a')
 pt['href']='./';pt['aria-current']='page';en.attrs.pop('aria-current',None)
 en['href']='../'*(depth+1)+rel.as_posix().removesuffix('index.html')
 for meta in s.select('meta[name="description"]'):
  meta['content']='PAPOA — design, desenvolvimento 3D, renovação de barcos, componentes automóveis e interiores à medida. Peniche, Portugal.'
 target=root/'pt'/rel;target.parent.mkdir(parents=True,exist_ok=True);target.write_text(str(s))
