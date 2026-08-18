const fs = require('fs');
const path = require('path');

const dir = 'd:\\Antigravity Proj\\Liz MCA';
const htmlFiles = [
  'business-funding.html',
  'mca-loans.html',
  'funding-options.html',
  'how-it-works.html'
];

const newCta = `    <!-- CTA Section -->
    <section class="section section--dark text-center">
      <div class="container reveal">
        <h2 style="font-size: var(--font-size-3xl); margin-bottom: var(--space-6);">Ready to Secure Capital?</h2>
        <p style="font-size: var(--font-size-lg); max-width: 600px; margin: 0 auto var(--space-8);">Take the first step toward the funding your business needs to grow. It takes less than 2 minutes to check your options.</p>
        <a href="/contact.html" class="btn btn--primary btn--lg" style="background-color: var(--color-white); color: var(--color-primary-dark);">Check Your Options</a>
      </div>
    </section>`;

htmlFiles.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the old cta-section
  const regex = /<section class="cta-section">[\s\S]*?<\/section>/;
  content = content.replace(regex, newCta);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
