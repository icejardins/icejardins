import os
import glob
import re

posts_dir = '/Users/fernando/dev/icejardins/content/posts'

for filepath in glob.glob(os.path.join(posts_dir, '*.md')):
    with open(filepath, 'r') as f:
        content = f.read()
        
    parts = content.split('+++', 2)
    if len(parts) >= 3:
        frontmatter = parts[1]
        body = parts[2]
        
        lines = body.split('\n')
        new_lines = []
        
        for i, line in enumerate(lines):
            # We want to fix lines that start with "> " but are not verses
            if line.startswith('> '):
                inner_text = line[2:]
                
                # If it's a verse with bold number, keep it
                if re.match(r'^\*\*\d+\*\*', inner_text):
                    new_lines.append(line)
                    continue
                    
                # If it starts with a quote or dash, keep it
                if inner_text.startswith('“') or inner_text.startswith('"') or inner_text.startswith('—'):
                    new_lines.append(line)
                    continue
                    
                # If the line *above* ended with : (we look at new_lines to see what it was)
                prev_line = new_lines[-1].strip() if new_lines else ""
                
                if prev_line.endswith(':'):
                    new_lines.append(line)
                    continue
                    
                # Otherwise, it was accidentally caught by the in_quote_block logic
                # So we remove the "> "
                new_lines.append(inner_text)
            else:
                new_lines.append(line)
                
        new_content = f"+++{frontmatter}+++{''.join(new_lines[0])}" if len(new_lines) == 1 else f"+++{frontmatter}+++{chr(10).join(new_lines)}"
        with open(filepath, 'w') as f:
            f.write(new_content)
            
print("Fixed accidentally blockquoted pastor text.")
