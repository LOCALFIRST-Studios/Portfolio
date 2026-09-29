import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

// Get the site URL from environment or use a placeholder
const SITE_URL = process.env.VITE_SITE_URL || 'https://your-domain.com';

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

// Generate sitemap.xml
const pages = ['', '/work', '/pricing', '/about', '/contact'];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url><loc>${SITE_URL}${page}</loc></url>`).join('\n')}
</urlset>
`;

// Write files
writeFileSync(join(publicDir, 'robots.txt'), robotsTxt);
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap);

console.log(`✓ Generated SEO files with domain: ${SITE_URL}`);