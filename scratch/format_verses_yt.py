import os
import glob
import re

posts_dir = '/Users/fernando/dev/icejardins/content/posts'

yt_videos = {
    "joel-1-a-chegada-do-dia-do-senhor": "Wxtbtr6Tzzc",
    "joel-2_1-11_deus-em-guerra-contra-seu-povo": "F9dBFzAgfr0",
    "joel-3-17-21-os-resultados-do-dia-do-senhor": "kcrpf-J1zhs"
}

for filepath in glob.glob(os.path.join(posts_dir, '*.md')):
    slug = os.path.basename(filepath).replace('.md', '')
    
    with open(filepath, 'r') as f:
        content = f.read()
        
    parts = content.split('+++', 2)
    if len(parts) >= 3:
        frontmatter = parts[1]
        body = parts[2].strip()
        
        # Remove any existing youtube shortcodes
        body = re.sub(r'\{\{< youtube .*? >\}\}\n*', '', body)
        
        lines = body.split('\n')
        new_lines = []
        
        in_quote_block = False
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            
            # Check if previous line ended with : and this is a new paragraph
            prev_line = lines[i-1].strip() if i > 0 else ""
            
            if not stripped:
                in_quote_block = False
                new_lines.append(line)
                continue
                
            if prev_line.endswith(':') and not stripped.startswith('#') and not stripped.startswith('>'):
                in_quote_block = True
                
            # If line is already a blockquote, keep it
            if stripped.startswith('>'):
                in_quote_block = False # Reset because it's already handled
                new_lines.append(line)
                continue
                
            if in_quote_block:
                new_lines.append(f"> {stripped}")
                continue
                
            # Catch standalone verses wrapped in quotes with a reference at the end
            if stripped.startswith('“') and re.search(r'\([A-Za-z0-9\s:]+\)\.?$', stripped):
                new_lines.append(f"> {stripped}")
                continue
                
            # Catch standalone verses starting with an em dash
            if stripped.startswith('— '):
                new_lines.append(f"> {stripped}")
                continue
                
            new_lines.append(line)
            
        video_id = yt_videos.get(slug, "COLAR_ID_AQUI")
        youtube_shortcode = f'\n\n{{{{< youtube {video_id} >}}}}\n\n'
        
        new_body = youtube_shortcode + '\n'.join(new_lines)
        
        new_content = f"+++{frontmatter}+++\n{new_body}"
        with open(filepath, 'w') as f:
            f.write(new_content)
            
print("Formatting and YouTube inclusion complete.")
