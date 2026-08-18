const fs = require('fs');
const path = require('path');

const dir = 'd:\\Antigravity Proj\\Liz MCA';
const pages = [
  'business-funding',
  'mca-loans',
  'funding-options',
  'how-it-works',
  'faq',
  'contact',
  'privacy-policy',
  'terms'
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== 'dist' && file !== '.git') {
      processDirectory(filePath);
    } else if (filePath.endsWith('.html') || filePath.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;
      
      pages.forEach(page => {
        // Replace href="/page.html" or href="page.html"
        const regex = new RegExp(`href="(/)?${page}\\.html"`, 'g');
        content = content.replace(regex, `href="$1${page}"`);
        
        // Also handle action="/contact.html" etc.
        const actionRegex = new RegExp(`action="(/)?${page}\\.html"`, 'g');
        content = content.replace(actionRegex, `action="$1${page}"`);
      });
      
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated links in ${filePath}`);
      }
    }
  }
}

processDirectory(dir);
