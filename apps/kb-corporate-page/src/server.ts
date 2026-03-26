import { APP_BASE_HREF } from '@angular/common';
import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Serve static files from the browser folder with base path
app.use(
  '/pdbe/pdbe-kb',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Handle all requests under the base path
app.get('/pdbe/pdbe-kb/*', (req, res, next) => {
  console.log('Handling SSR request:', {
    originalUrl: req.originalUrl,
    url: req.url,
    baseUrl: req.baseUrl,
  });

  angularApp
    .handle(req, {
      providers: [{ provide: APP_BASE_HREF, useValue: '/pdbe/pdbe-kb/' }],
    })
    .then((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    })
    .catch(next);
});

// Optional: Handle root redirect
app.get('/', (req, res) => {
  res.redirect('/pdbe/pdbe-kb/');
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) throw error;
    console.log(`Node Express server listening on http://localhost:${port}`);
    console.log(`Serving Angular app with base href: /pdbe/pdbe-kb/`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
