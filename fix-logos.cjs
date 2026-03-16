const fs = require('fs');

const files = [
    'index.html',
    'kontakt.html',
    'leistungen.html',
    'danke.html',
    'datenschutz.html',
    'impressum.html'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    const regex = /<img\s+src="Ryqen_logo\.png"([^>]*class="nav-logo-img"[^>]*)>/g;
    
    content = content.replace(regex, (match, p1) => {
        return `<picture style="display:flex;align-items:center;">
                        <source media="(max-width: 768px)" srcset="Ryqen_logo.webp">
                        <img src="Ryqen_logo.png"${p1}>
                    </picture>`;
    });

    fs.writeFileSync(file, content);
});

console.log('Replaced successfully.');
