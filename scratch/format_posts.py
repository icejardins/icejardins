import os
import glob
import re
import urllib.request
import ssl

context = ssl._create_unverified_context()

posts_dir = '/Users/fernando/dev/icejardins/content/posts'
images_dir = '/Users/fernando/dev/icejardins/static/images/posts'
os.makedirs(images_dir, exist_ok=True)

for filepath in glob.glob(os.path.join(posts_dir, '*.md')):
    slug = os.path.basename(filepath).replace('.md', '')
    url = f"https://www.icejardins.org.br/sermoes/{slug}"
    
    # 1. Fetch the og:image
    image_url = None
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req, context=context).read().decode('utf-8')
        
        # simple regex for og:image
        match = re.search(r'<meta property="og:image" content="([^"]+)"', html)
        if match:
            image_url = match.group(1)
            
        if not image_url:
            # fallback to main joel url
            url2 = f"https://www.icejardins.org.br/{slug}"
            req2 = urllib.request.Request(url2, headers={'User-Agent': 'Mozilla/5.0'})
            html2 = urllib.request.urlopen(req2, context=context).read().decode('utf-8')
            match2 = re.search(r'<meta property="og:image" content="([^"]+)"', html2)
            if match2:
                image_url = match2.group(1)
    except Exception as e:
        print(f"Error fetching image for {slug}: {e}")
        
    local_image_path = None
    if image_url:
        try:
            # handle // prefix or relative
            if image_url.startswith('//'):
                image_url = 'https:' + image_url
            elif image_url.startswith('/'):
                image_url = 'https://www.icejardins.org.br' + image_url
            
            ext = 'jpg'
            if 'png' in image_url.lower(): ext = 'png'
            elif 'webp' in image_url.lower(): ext = 'webp'
            
            local_image_path = f"/images/posts/{slug}.{ext}"
            full_local_path = os.path.join(images_dir, f"{slug}.{ext}")
            
            urllib.request.urlretrieve(image_url, full_local_path)
            print(f"Downloaded image for {slug}")
        except Exception as e:
            print(f"Error downloading image for {slug}: {e}")
            local_image_path = None

    # 2. Format the markdown
    with open(filepath, 'r') as f:
        content = f.read()
        
    parts = content.split('+++', 2)
    if len(parts) >= 3:
        frontmatter = parts[1]
        body = parts[2]
        
        if local_image_path and 'images =' not in frontmatter:
            frontmatter += f'images = ["{local_image_path}"]\n'
            
        # format body
        new_body = []
        for line in body.split('\n'):
            line = line.strip()
            if not line:
                new_body.append('')
                continue
                
            # Headers like: "2. O Problema:" or "3. A Resposta:"
            if re.match(r'^\d+\.\s+[A-Z]', line):
                line = f"## {line}"
            # Headers like: "a. Chore e Lamente"
            elif re.match(r'^[a-z]\.\s+[A-Z]', line) or re.match(r"^[a-z]'\.\s+[A-Z]", line):
                line = f"### {line}"
            # Bible verses like: "1 A palavra do SENHOR" or "15“Ah! Que dia!"
            elif re.match(r'^(\d+)(“|")?([A-Z])', line):
                line = re.sub(r'^(\d+)(“|")?', r'> **\1** \2', line)
            
            new_body.append(line)
            
        new_content = f"+++{frontmatter}+++\n" + '\n'.join(new_body)
        with open(filepath, 'w') as f:
            f.write(new_content)
            
print("Done formatting and fetching images.")
