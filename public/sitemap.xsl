<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Sitemap — CoreByte Solutions</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <style>
          body{font-family:'Segoe UI',sans-serif;background:#0A0A0F;color:#E8E8F0;margin:0;padding:2rem}
          h1{color:#FF6B35;font-size:1.8rem;margin-bottom:0.25rem}
          p{color:#8888AA;font-size:0.9rem;margin-bottom:2rem}
          table{width:100%;border-collapse:collapse;background:#14141E;border-radius:12px;overflow:hidden}
          th{background:#1A1A26;color:#00C9A7;text-align:left;padding:0.9rem 1.2rem;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em}
          td{padding:0.85rem 1.2rem;border-bottom:1px solid rgba(255,255,255,0.05);font-size:0.88rem}
          tr:last-child td{border-bottom:none}
          a{color:#FF6B35;text-decoration:none}
          a:hover{text-decoration:underline}
          .pri{color:#00C9A7;font-weight:600}
        </style>
      </head>
      <body>
        <h1>🗺 CoreByte Solutions — Sitemap</h1>
        <p>Total URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> · <a href="https://corebytex.com">← Back to site</a></p>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
              <th>Change Freq</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                <td><xsl:value-of select="sitemap:lastmod"/></td>
                <td><xsl:value-of select="sitemap:changefreq"/></td>
                <td class="pri"><xsl:value-of select="sitemap:priority"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
