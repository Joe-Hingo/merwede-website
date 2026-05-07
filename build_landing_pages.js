const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const portfolioHtml = fs.readFileSync('portfolio.html', 'utf8');

// We will build an array of categories
const categories = [
  { id: 'residential', name: 'Residential', frontImg: '', desc: '', images: [] },
  { id: 'industrial', name: 'Industrial', frontImg: '', desc: '', images: [] },
  { id: 'commercial', name: 'Commercial', frontImg: '', desc: '', images: [] },
  { id: 'internal', name: 'Internal Design & Specifications', frontImg: '', desc: '', images: [] }
];

// Extract data
categories.forEach(cat => {
    const nameMatch = new RegExp(`<span class="pf-name">${cat.name.replace('&', '&amp;')}</span>`);
    // Wait, the HTML might not have escaped &
    const htmlName = cat.name === 'Internal Design & Specifications' ? 'Internal Design &amp; Specifications' : cat.name;
    const blockStart = indexHtml.indexOf(`<span class="pf-name">${htmlName}</span>`);
    if (blockStart === -1) {
        // Try without amp
        const blockStart2 = indexHtml.indexOf(`<span class="pf-name">${cat.name}</span>`);
        if(blockStart2 === -1) console.log("Could not find", cat.name);
    }
    
    // Let's just find each .pf-item flip-card
});

// A better way is to split by "pf-item flip-card"
const items = indexHtml.split('class="pf-item flip-card"');
for(let i=1; i<items.length; i++) {
    const block = items[i];
    
    const nameMatch = block.match(/<span class="pf-name">([^<]+)<\/span>/);
    if(!nameMatch) continue;
    let name = nameMatch[1].trim();
    
    let id = name.toLowerCase().split(' ')[0]; // residential, industrial, commercial, internal
    
    const descMatch = block.match(/<p class="pf-desc">([^<]+)<\/p>/);
    const desc = descMatch ? descMatch[1].trim() : '';
    
    const bgMatch = block.match(/style="background-image:url\('([^']+)'\)"/);
    const bg = bgMatch ? bgMatch[1] : '';
    
    // Find images
    const imgRegex = /<img src="([^"]+)"\s+alt="([^"]+)"\s+class="fc-stage-img">/g;
    let match;
    const images = [];
    while ((match = imgRegex.exec(block)) !== null) {
        images.push({ src: match[1], alt: match[2] });
    }
    
    const cat = categories.find(c => c.id === id);
    if(cat) {
        cat.name = name;
        cat.desc = desc;
        cat.frontImg = bg;
        cat.images = images;
    }
}

// Generate new simplified HTML for the mosaic
let newMosaicHtml = '\n';
categories.forEach(cat => {
    newMosaicHtml += `
          <!-- Card: ${cat.name} -->
          <a href="portfolio-${cat.id}.html" class="pf-item card-link" style="display: block; text-decoration: none; position: relative; width: 100%; height: 450px; border-radius: 20px; overflow: hidden;">
              <div class="flip-card-front" style="background-image:url('${cat.frontImg}'); position: absolute; inset: 0; width: 100%; height: 100%; background-size: cover; background-position: center; transition: transform 0.4s ease;">
                <div class="pf-label-banner" style="position: absolute; bottom: 0; left: 0; right: 0; padding: 18px 24px; background: rgba(0, 10, 33, 0.9); z-index: 2;">
                  <span class="pf-name" style="color: #fff; font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700; display: block; margin-bottom: 6px;">${cat.name}</span>
                  <p class="pf-desc" style="color: rgba(247, 241, 236, 0.7); font-size: 0.95rem; margin: 0; line-height: 1.5;">${cat.desc}</p>
                </div>
                <div class="pf-hover-content" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 3; opacity: 0; transition: opacity 0.35s ease;">
                  <span class="pf-explore-btn" style="color: #fff; font-family: var(--font-heading); font-size: 1.1rem; font-weight: 600; padding: 12px 24px; border: 2px solid #fff; border-radius: 50px; display: flex; align-items: center; gap: 10px;">View Projects <i class="fas fa-arrow-right"></i></span>
                </div>
              </div>
          </a>
`;
});

// Update index.html
let indexResult = indexHtml;
const startMosaic = indexHtml.indexOf('<div class="portfolio-mosaic">');
const endMosaic = indexHtml.indexOf('</div>\r\n      </div>\r\n  </section>');
const endMosaic2 = indexHtml.indexOf('</div>\n      </div>\n  </section>');
let end = endMosaic !== -1 ? endMosaic : endMosaic2;
if (startMosaic !== -1 && end !== -1) {
    indexResult = indexHtml.substring(0, startMosaic + 30) + newMosaicHtml + indexHtml.substring(end);
    fs.writeFileSync('index.html', indexResult, 'utf8');
}

// Update portfolio.html
let portResult = portfolioHtml;
const pStartMosaic = portfolioHtml.indexOf('<div class="portfolio-mosaic">');
const pEndMosaic = portfolioHtml.indexOf('</div><!-- /portfolio-mosaic-container -->');
if (pStartMosaic !== -1 && pEndMosaic !== -1) {
    portResult = portfolioHtml.substring(0, pStartMosaic + 30) + newMosaicHtml + '        ' + portfolioHtml.substring(pEndMosaic);
    fs.writeFileSync('portfolio.html', portResult, 'utf8');
}

// Generate the 4 new HTML pages based on portfolioHtml
// Find the structure of portfolioHtml
const heroStart = portfolioHtml.indexOf('<!-- ===================== PAGE HERO ===================== -->');
const heroEnd = portfolioHtml.indexOf('</section>', heroStart) + 10;

const masonryStart = portfolioHtml.indexOf('<!-- ===================== PROJECT LIST ===================== -->');
const masonryEnd = portfolioHtml.indexOf('</section>', masonryStart) + 10;

// The base template is everything EXCEPT the hero and project list sections
const templateTop = portfolioHtml.substring(0, heroStart);
const templateBottom = portfolioHtml.substring(masonryEnd);

categories.forEach(cat => {
    const heroHtml = `
    <!-- ===================== PAGE HERO ===================== -->
    <section class="page-hero" style="background-image: url('${cat.frontImg}')">
        <div class="page-hero-content">
            <p class="page-hero-eyebrow">Portfolio Category</p>
            <h1 class="page-hero-title">${cat.name}</h1>
            <p class="page-hero-sub">${cat.desc}</p>
        </div>
    </section>
`;

    let imagesHtml = '';
    cat.images.forEach(img => {
        imagesHtml += `
                <div class="pf-masonry-item">
                    <img src="${img.src}" alt="${img.alt}">
                    <div class="pf-masonry-overlay"><span class="pf-masonry-title">${img.alt}</span></div>
                </div>`;
    });

    const masonryHtml = `
    <!-- ===================== PROJECT LIST ===================== -->
    <section class="pf-list-section">
        <div class="container">
            <div class="pf-masonry">
${imagesHtml}
            </div>
        </div>
    </section>
`;

    const finalHtml = templateTop + heroHtml + masonryHtml + templateBottom;
    fs.writeFileSync(`portfolio-${cat.id}.html`, finalHtml, 'utf8');
});

console.log("All pages generated successfully.");
