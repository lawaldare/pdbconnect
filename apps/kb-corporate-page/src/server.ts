import { APP_BASE_HREF } from '@angular/common';
import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  '/pdbe/pdbe-kb/',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

app.use((req, res, next) => {
  console.log('originalUrl:', req.originalUrl);
  console.log('url:', req.url);
  console.log('baseUrl:', req.baseUrl);

  if (!req.originalUrl.startsWith('/pdbe/pdbe-kb/')) {
    return next();
  }

  const originalReqUrl = req.url;

  // Restore the full mounted URL so Angular SSR sees the real path
  req.url = req.originalUrl;

  angularApp
    .handle(req, {
      providers: [{ provide: APP_BASE_HREF, useValue: '/pdbe/pdbe-kb/' }],
    })
    .then((response) => {
      req.url = originalReqUrl;
      return response ? writeResponseToNodeResponse(response, res) : next();
    })
    .catch((err) => {
      req.url = originalReqUrl;
      next(err);
    });
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) throw error;
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
