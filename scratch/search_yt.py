import urllib.request
import urllib.parse
import re

titles = [
    "Joel 1 A chegada do Dia do Senhor",
    "Joel 2.1-11 Deus em guerra com seu povo",
    "Joel 2.12-17 Rasguem o coração e não as roupas",
    "Joel 2.18-32 A compaixão de Deus",
    "Joel 3.1-17 O Dia do Senhor Julgamento e Restauração",
    "Joel 3:17-21 Os resultados do Dia do Senhor"
]

for title in titles:
    query = urllib.parse.quote(f"Igreja Cristã Evangélica Jardins {title}")
    url = f"https://www.youtube.com/results?search_query={query}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        # Find watch?v=
        matches = re.findall(r'"videoId":"([^"]{11})"', html)
        if matches:
            print(f"{title}: {matches[0]}")
        else:
            print(f"{title}: Not found")
    except Exception as e:
        print(f"Error for {title}: {e}")
