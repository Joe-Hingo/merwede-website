const fs = require('fs');
let css = fs.readFileSync('styles.css', 'utf8');

const targetStr = `        /* ── PORTFOLIO LIST SECTION ─────────────── */
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 10, 33, 0.08);
            position: relative;
        }`;

const replaceStr = `        /* ── PORTFOLIO LIST SECTION ─────────────── */
        .pf-list-section {
            background: var(--snow);
            padding: 90px 0 110px;
        }

        .pf-masonry {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 24px;
        }

        .pf-masonry-item {
            break-inside: avoid;
            margin-bottom: 24px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 10, 33, 0.08);
            position: relative;
        }`;

css = css.replace(targetStr, replaceStr);

fs.writeFileSync('styles.css', css, 'utf8');
console.log('Fixed styles.css');
