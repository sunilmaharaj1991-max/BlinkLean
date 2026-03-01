import os
import re

for file in os.listdir('.'):
    if file.endswith('.html'):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        content = re.sub(r'Blin<span[^>]*>Klean</span>', r'Blink<span>lean</span>', content)
        content = re.sub(r'Blin</span><span[^>]*>Klean</span>', r'Blink</span><span style="color:#1B9B3A">lean</span>', content)
        content = re.sub(r'(?i)BlinKl ean', 'Blinklean', content)
        content = content.replace('BlinKlean', 'Blinklean')
        content = content.replace('BlinkLean', 'Blinklean')

        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
