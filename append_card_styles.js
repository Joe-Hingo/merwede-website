const fs = require('fs');

const css = `
/* ── EXAGGERATED MINIMALISM CARDS ──────────────── */
.master-card {
    background: #FFFFFF;
    border-radius: 12px;
    padding: 20px;
    box-shadow: var(--shadow-card);
    transition: all 300ms ease;
    cursor: pointer;
    break-inside: avoid;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
}

.master-card:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-4px);
}

.master-card-img {
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
}

.master-card-img img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.master-card:hover .master-card-img img {
    transform: scale(1.05);
}

.master-card-content {
    padding: 0 8px 8px 8px;
}

.master-card-title {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--night);
    margin: 0;
    letter-spacing: -0.02em;
}
`;

fs.appendFileSync('styles.css', '\n' + css + '\n', 'utf8');
console.log('Appended master-card styles to styles.css');
