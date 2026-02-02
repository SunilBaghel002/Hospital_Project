import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cache the template and render function
let templateHtml;
let renderFunction;

export default async function handler(req, res) {
  try {
    // Load template and render function (cached after first load)
    if (!templateHtml) {
      const templatePath = path.resolve(__dirname, '../dist/client/index.html');
      templateHtml = fs.readFileSync(templatePath, 'utf-8');
    }

    if (!renderFunction) {
      const serverEntry = await import('../dist/server/entry-server.js');
      renderFunction = serverEntry.render;
    }

    // Get the URL path
    const url = req.url || '/';

    // Render the app
    const { html: appHtml } = renderFunction(url);

    // Inject the rendered HTML into the template
    const html = templateHtml.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    // Send the response
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('SSR Error:', error);
    res.status(500).send('Internal Server Error');
  }
}
