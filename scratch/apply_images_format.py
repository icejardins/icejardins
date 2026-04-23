import os
import urllib.request
import ssl
import re

context = ssl._create_unverified_context()
images_dir = '/Users/fernando/dev/icejardins/static/images/posts'
os.makedirs(images_dir, exist_ok=True)

posts = [
    ("joel-1-a-chegada-do-dia-do-senhor", "https://cdn1.nucleus-cdn.church/church_832c34948c9a46239f29dd9c7324bcb6/file_f7fad80bfbbe46bf9acc4f786a6e86af/2024-12-03T18:20:03.486Z/a_seriedade_do_pecado_e_a_necessidade_de_redenc_a_o.jpg"),
    ("joel-2_1-11_deus-em-guerra-contra-seu-povo", "https://cdn1.nucleus-cdn.church/church_832c34948c9a46239f29dd9c7324bcb6/file_bcdfeb858c284109aa90da3b55dc7f79/2024-12-03T18:22:14.727Z/A_refere_ncia_a_esse_dia_e__proclamada_primeiro_em_termos_da_invasa_o_de_gafanhotos__um_desastre_natural__que_ocorreu_no_tempo_do_profeta__e__depois__em_termos_de_uma_terri_vel_invasa_o_inimiga_por_um_exe_rcito_irresisti_vel_e_destruidor.-2.jpg"),
    ("joel-2_12-17_rasguem-o-coracao-e-nao-as-roupas", "https://cdn1.nucleus-cdn.church/church_832c34948c9a46239f29dd9c7324bcb6/file_0bfa9a8dbdff42949e170cd988d8918b/2024-12-03T18:23:22.859Z/Nosso_arrependimento_e__possi_vel_porque_Jesus_ja__se_doou_por_no_s_na_cruz._Ele_teve_suas_vestes_rasgadas__elas_foram_sorteadas._Ao_inve_s_disso__Ele_teve_sua_carne_rasgada_por_no_s._Rasgada_por_chicotes__por_pregos_cravados_e_por_uma_lan_.jpg"),
    ("joel-2-18-32-a-compaix-o-de-deus", "https://cdn1.nucleus-cdn.church/church_832c34948c9a46239f29dd9c7324bcb6/file_7d2ccd728cab4db185ea7c35beb3e1e3/2024-12-18T19:02:52.420Z/compaixao_joel.webp"),
    ("joel-3-1-17-o-dia-do-senhor-julgamento-e-restaura-o", "https://cdn1.nucleus-cdn.church/church_832c34948c9a46239f29dd9c7324bcb6/file_efb0a43aeafd4b2ca2b894dc445da5e3/2024-12-18T19:29:33.285Z/joel-3.1_17.webp"),
    ("joel-3-17-21-os-resultados-do-dia-do-senhor", "https://cdn1.nucleus-cdn.church/church_832c34948c9a46239f29dd9c7324bcb6/file_23172c47b0cb40d9aba74cb22acd160f/2024-12-18T20:30:28.130Z/salvacao.webp")
]

for slug, url in posts:
    ext = url.split('.')[-1]
    local_filename = f"{slug}.{ext}"
    local_path = os.path.join(images_dir, local_filename)
    
    # Download image
    try:
        urllib.request.urlretrieve(url, local_path)
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        continue
        
    md_file = f"/Users/fernando/dev/icejardins/content/posts/{slug}.md"
    if not os.path.exists(md_file):
        continue
        
    with open(md_file, 'r') as f:
        content = f.read()
        
    parts = content.split('+++', 2)
    if len(parts) >= 3:
        frontmatter = parts[1]
        body = parts[2]
        
        # Add image to frontmatter if not present or replace existing
        if 'images =' in frontmatter:
            frontmatter = re.sub(r'images = .*', f'images = ["/images/posts/{local_filename}"]', frontmatter)
        else:
            frontmatter += f'images = ["/images/posts/{local_filename}"]\n'
            
        # Format body markdown
        new_body = []
        for line in body.split('\n'):
            line = line.strip()
            if not line:
                new_body.append('')
                continue
                
            # Headers like: "2. O Problema:"
            if re.match(r'^\d+\.\s+[A-Z]', line):
                line = f"## {line}"
            # Headers like: "a. Chore e Lamente"
            elif re.match(r'^[a-z]\.\s+[A-Z]', line) or re.match(r"^[a-z]'\.\s+[A-Z]", line):
                line = f"### {line}"
            # Bible verses: "1 A palavra do SENHOR" -> "> **1** A palavra do SENHOR"
            elif re.match(r'^(\d+)(“|")?([A-Z])', line):
                line = re.sub(r'^(\d+)(“|")?', r'> **\1** \2', line)
                
            new_body.append(line)
            
        new_content = f"+++{frontmatter}+++\n" + '\n'.join(new_body)
        with open(md_file, 'w') as f:
            f.write(new_content)

print("Images downloaded and Markdown formatted.")
