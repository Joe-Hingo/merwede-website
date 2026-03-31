const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

content = content.replace(/(<img[^>]*?src="([^"]+)"[^>]*>\s*)(<div class="fc-slide-caption">)(.*?)(<\/div>)/gs, (match, p1, p2, p3, p4, p5) => {
    let filename = p2.split('/').pop().replace(/\.[^/.]+$/, "");
    return p1 + p3 + filename + p5;
});

fs.writeFileSync('index.html', content, 'utf-8');
console.log('Updated captions based on filenames.');
