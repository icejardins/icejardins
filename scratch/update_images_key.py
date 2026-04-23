import glob
import re
import os

posts_dir = '/Users/fernando/dev/icejardins/content/posts'

for filepath in glob.glob(os.path.join(posts_dir, '*.md')):
    with open(filepath, 'r') as f:
        content = f.read()
        
    new_content = re.sub(r'images = \["(.*?)"\]', r'image = "\1"', content)
    
    with open(filepath, 'w') as f:
        f.write(new_content)
        
print("Updated images to image.")
