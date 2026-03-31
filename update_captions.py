import re, os

filepath = "index.html"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

def repl(match):
    img_tag = match.group(1)
    src_val = match.group(2)
    filename = src_val.split('/')[-1].rsplit('.', 1)[0]
    caption_start = match.group(3)
    caption_end = match.group(4)
    return f"{img_tag}{caption_start}{filename}{caption_end}"

pattern = re.compile(r'(<img[^>]*?src="([^"]+)"[^>]*>\s*)(<div class="fc-slide-caption">)(.*?)(</div>)', re.DOTALL)
new_content = pattern.sub(repl, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)
print("Updated captions based on filenames.")
