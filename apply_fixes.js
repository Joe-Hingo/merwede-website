const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir);

// 1. Fix nav link in all HTML files
files.forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // Replace "Projects" with "Portfolio" in nav links
        if (content.includes('>Projects</a>')) {
            content = content.replace(/>Projects<\/a>/g, '>Portfolio</a>');
            modified = true;
        }

        // 4. Remove SECTION X — in index.html specifically
        if (file === 'index.html') {
            // Looking for things like "SECTION 2 — " or "SECTION 6 - "
            // The user said: "SECTION 2 —judt the part that says section and the number do it for all the sections"
            const regex = /SECTION\s+\d+\s*[-—]\s*/g;
            if (regex.test(content)) {
                content = content.replace(regex, '');
                modified = true;
            }
        }
        
        // 2. Fix industrial landing page
        if (file === 'portfolio-industrial.html') {
            if (content.includes('<div class="pf-masonry">')) {
                content = content.replace(
                    '<div class="pf-masonry">',
                    '<div class="pf-masonry" style="display: flex; gap: 24px;">'
                );
                // add flex: 1 to the items to ensure they stay in a row
                content = content.replace(/<div class="pf-masonry-item">/g, '<div class="pf-masonry-item" style="flex: 1; margin-bottom: 0;">');
                modified = true;
            }
        }
        
        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Updated ${file}`);
        }
    }
});

// 3. Fix styles.css to make overlay always visible
const stylesPath = 'styles.css';
if (fs.existsSync(stylesPath)) {
    let styles = fs.readFileSync(stylesPath, 'utf8');
    if (styles.includes('.pf-masonry-overlay {') && styles.includes('opacity: 0;')) {
        // Find the specific block and replace opacity: 0 with opacity: 1
        styles = styles.replace(/\.pf-masonry-overlay\s*\{[^}]*opacity:\s*0;[^}]*\}/, match => {
            return match.replace(/opacity:\s*0;/, 'opacity: 1;');
        });
        fs.writeFileSync(stylesPath, styles, 'utf8');
        console.log('Updated styles.css (made masonry overlay always visible)');
    } else {
        console.log('Could not find .pf-masonry-overlay with opacity: 0 in styles.css');
    }
}
