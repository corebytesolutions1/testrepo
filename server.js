const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Serve static files with correct MIME types
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders(res, filePath) {
    if (filePath.endsWith('.xml'))  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    if (filePath.endsWith('.xsl'))  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    if (filePath.endsWith('.txt'))  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    if (filePath.endsWith('.webmanifest')) res.setHeader('Content-Type', 'application/manifest+json');
  }
}));

// SPA fallback — all routes serve index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 CoreByte Solutions running → http://localhost:${PORT}`);
  console.log(`   Sitemap: http://localhost:${PORT}/sitemap.xml`);
  console.log(`   Robots:  http://localhost:${PORT}/robots.txt`);
});

module.exports = app;
