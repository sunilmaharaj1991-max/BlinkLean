import os
import re

for file in os.listdir('.'):
    if file.endswith('.html'):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the title tag with just '<title>Blinklean</title>'
        content = re.sub(r'<title>.*?</title>', '<title>Blinklean</title>', content, flags=re.IGNORECASE|re.DOTALL)
        
        # Check if favicon link already exists
        if 'rel="icon"' not in content:
            # Add it right after the title tag
            content = re.sub(
                r'(<title>Blinklean</title>)', 
                r'\1\n    <link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg">', 
                content, 
                count=1, 
                flags=re.IGNORECASE
            )

        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
