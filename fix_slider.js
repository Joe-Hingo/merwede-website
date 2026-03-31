const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/ onclick="event\.stopPropagation\(\);"/g, '');
html = html.replace(/ onclick="flipCard\(this\.closest\('\.flip-card'\)\); event\.stopPropagation\(\);"/g, '');
html = html.replace(/ onclick="scrollFcGallery\(this, -1\); event\.stopPropagation\(\);"/g, '');
html = html.replace(/ onclick="scrollFcGallery\(this, 1\); event\.stopPropagation\(\);"/g, '');
fs.writeFileSync('index.html', html);

let js = fs.readFileSync('script.js', 'utf8');
const replacement = `document.querySelectorAll('.flip-card-back').forEach(back => {
  back.addEventListener('click', function(e) { e.stopPropagation(); });
});
document.querySelectorAll('.flip-card-close').forEach(btn => {
  btn.addEventListener('click', function(e) { 
    e.preventDefault();
    e.stopPropagation(); 
    flipCard(btn.closest('.flip-card')); 
  });
});
document.querySelectorAll('.fc-prev').forEach(btn => {
  btn.addEventListener('click', function(e) { 
    e.preventDefault();
    e.stopPropagation(); 
    scrollFcGallery(btn, -1); 
  });
});
document.querySelectorAll('.fc-next').forEach(btn => {
  btn.addEventListener('click', function(e) { 
    e.preventDefault();
    e.stopPropagation(); 
    scrollFcGallery(btn, 1); 
  });
});`;
js = js.replace(/\/\/ Override inline handlers manually[\s\S]*\}\);/gm, replacement);
fs.writeFileSync('script.js', js);

let css = fs.readFileSync('styles.css', 'utf8');
css = css.replace(/z-index: 10;/g, 'z-index: 100;');
if (!css.includes('.fc-arrow i')) {
  css += '\n\n.fc-arrow i, .flip-card-close i { pointer-events: none; }\n';
}
fs.writeFileSync('styles.css', css);

document.addEventListener("DOMContentLoaded", (event) => {
  document.querySelectorAll('.flip-card-close').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      flipCard(btn.closest('.flip-card'));
    });
  });
});