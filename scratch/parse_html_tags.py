import urllib.request
import ssl
from html.parser import HTMLParser

context = ssl._create_unverified_context()

url = "https://www.icejardins.org.br/sermoes/joel-1-a-chegada-do-dia-do-senhor"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req, context=context).read().decode('utf-8')

class MyParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        if tag in ['a', 'iframe', 'video']:
            print(f"Tag: {tag}, Attrs: {attrs}")

parser = MyParser()
parser.feed(html)
