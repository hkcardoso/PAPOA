from pathlib import Path
from bs4 import BeautifulSoup,Comment,Doctype
from urllib.parse import urlsplit,unquote
import re,json
root=Path(__file__).resolve().parents[1];errors=[];pages=list(root.rglob('*.html'))
for p in pages:
 s=BeautifulSoup(p.read_text(),'html.parser')
 ids=[e['id'] for e in s.select('[id]')]
 if len(ids)!=len(set(ids)):errors.append(f'{p}: duplicate ids')
 for el in s.find_all(True):
  for attr in ['href','src','poster']:
   val=el.get(attr,'');u=urlsplit(val)
   if not val or u.scheme or u.netloc:continue
   dest=(p.parent/unquote(u.path)).resolve() if u.path else p
   if dest.is_dir():dest=dest/'index.html'
   if not dest.exists():errors.append(f'{p.relative_to(root)}: missing {val}')
   elif u.fragment and dest.suffix=='.html' and not BeautifulSoup(dest.read_text(),'html.parser').find(id=unquote(u.fragment)):
    errors.append(f'{p.relative_to(root)}: missing anchor {val}')
 for _,value in re.findall(r'url\(([\"\'])(.*?)\1\)',str(s)):
  if value.startswith(('http','data:')):continue
  if not (p.parent/unquote(value.split('?')[0])).resolve().exists():errors.append(f'{p.relative_to(root)}: CSS missing {value}')
 assert s.select_one('.languageSwitch'),p
 assert len(s.select('footer .footerSocial a'))==3,p
 assert s.select_one('h1'),p
 if p.relative_to(root).parts[0]=='pt':assert s.html['lang']=='pt-PT'
 if s.select_one('form'):
  f=s.form;assert f['method']=='POST' and f['action']=='https://formsubmit.co/hello@papoa.pt'
  assert f.select_one('input[name="references"][type="url"]')
  assert not f.select_one('input[name="phone"]').has_attr('required')
  assert not any('mailto:' in x.get_text() for x in s.select('script'))
print('\n'.join(errors));assert not errors
print(f'PASS: {len(pages)} pages, local assets and anchors, language navigation, form configuration and footers.')
