import urllib.request
import ssl
import re

context = ssl._create_unverified_context()
req = urllib.request.Request("https://www.icejardins.org.br/livro-de-joel", headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req, context=context).read().decode('utf-8')

images = re.findall(r'https://[^"\'\s]+(?:\.jpg|\.png|\.webp|\.jpeg)', html)
images = list(dict.fromkeys(images))
for img in images:
    print(img)
