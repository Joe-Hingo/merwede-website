const fs = require('fs');

let html = fs.readFileSync('portfolio.html', 'utf8');

// Revert section padding
html = html.replace(/padding:\s*160px\s+0;/g, 'padding: 90px 0;');

// Revert category header alignment
html = html.replace(/margin-bottom:\s*80px;\s*text-align:\s*left;/g, 'margin-bottom: 48px; text-align: center;');

// Revert h2
html = html.replace(/font-size:\s*clamp\(4rem,\s*8vw,\s*8rem\);\s*color:\s*var\(--night\);\s*margin-bottom:\s*24px;\s*font-weight:\s*900;\s*letter-spacing:\s*-0\.04em;\s*text-transform:\s*uppercase;\s*line-height:\s*0\.9;/g, 'font-family: var(--font-heading); font-size: 2.5rem; color: var(--night); margin-bottom: 12px; font-weight: 800;');

// Revert paragraph
html = html.replace(/font-size:\s*1\.4rem;\s*color:\s*rgba\(0,\s*10,\s*33,\s*0\.7\);\s*max-width:\s*800px;\s*margin:\s*0;\s*line-height:\s*1\.5;/g, 'font-size: 1.1rem; color: rgba(0, 10, 33, 0.7); max-width: 600px; margin: 0 auto;');

// Revert hero
html = html.replace(/<h1 class="page-hero-title" style="[^"]*">Our Portfolio<\/h1>/, '<h1 class="page-hero-title">Our Portfolio</h1>');

// Now let's transform the cards to look like the MASTER.md cards
// Currently:
// <div class="pf-masonry-item" ...>
//     <img src="..." alt="...">
//     <div class="pf-masonry-overlay"><span class="pf-masonry-title">...</span></div>
// </div>

html = html.replace(/<div class="pf-masonry-item"([^>]*)>\s*<img src="([^"]+)" alt="([^"]+)">\s*<div class="pf-masonry-overlay"><span class="pf-masonry-title">([^<]+)<\/span><\/div>\s*<\/div>/g, (match, attrs, src, alt, title) => {
    return `<div class="pf-masonry-item master-card"${attrs}>
                    <div class="master-card-img">
                        <img src="${src}" alt="${alt}">
                    </div>
                    <div class="master-card-content">
                        <h3 class="master-card-title">${title}</h3>
                    </div>
                </div>`;
});

fs.writeFileSync('portfolio.html', html, 'utf8');
console.log('Reverted headings and applied master-card HTML structure.');
