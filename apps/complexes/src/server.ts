// 🧠 GLOBAL SSR SHIELD: Polyfill browser APIs at the absolute entry point
import './polyfills.server'; // 🧠 THE SHIELD: Loads all environment overrides instantly!

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ɵsetAngularAppEngineManifest } from '@angular/ssr';
import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-ignore Angular generates this manifest next to the built server bundle.
import angularAppEngineManifest from './angular-app-engine-manifest.mjs';
import { ssrErrors } from '@pdbc/core';

const allowedHosts = ['wwwdev.ebi.ac.uk', 'www.ebi.ac.uk', 'localhost', '127.0.0.1'];

if (angularAppEngineManifest) {
  const updatedManifest = {
    ...angularAppEngineManifest,
    allowedHosts: allowedHosts,
  };
  ɵsetAngularAppEngineManifest(updatedManifest);
} else {
  ɵsetAngularAppEngineManifest(angularAppEngineManifest);
}

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: allowedHosts,
  trustProxyHeaders: true,
} as any);

app.get('/health', (_req, res) => {
  res.status(200).set('Cache-Control', 'no-store').json({ status: 'OK' });
});

// 🧠 GLOBAL PREFIX INJECTOR: Run this BEFORE static files or SSR blocks
app.use((req, res, next) => {
  const baseHref = '/pdbe/pdbe-kb/complexes';
  req.baseUrl = baseHref;

  if (!req.url.startsWith(baseHref)) {
    const normalizedUrl = `${baseHref}${req.url.startsWith('/') ? '' : '/'}${req.url}`;
    req.url = normalizedUrl;
    req.originalUrl = normalizedUrl;
    console.log(`🔧 Path cleanly translated inside Node: ${req.url}`);
  } else {
    req.originalUrl = req.url;
  }
  next();
});

// Handles requests if Nginx leaves the full subpath intact
app.use(
  '/pdbe/pdbe-kb/complexes',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
    fallthrough: true,
  })
);

// Handles requests if Nginx strips the subpath and asks for '/chunk-XXX.js' directly
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('/**', (req, res, next) => {
  if (req.path.includes('.')) {
    return next();
  }
  angularApp
    .handle(req)
    .then((response) => {
      if (!response) {
        return next();
      }

      if (ssrErrors.length > 0) {
        console.error('SSR failures found:', ssrErrors);

        const safeHeaderValue = ssrErrors
          .map((error) => {
            const method = String(error.method ?? 'UNKNOWN');
            const status = String(error.status ?? 'UNKNOWN');
            const url = String(error.url ?? 'unknown-url');
            const message = String(error.message ?? 'unknown-error');

            return `${method} ${status} ${url} - ${message}`;
          })
          .join(' | ')
          .replace(/[\r\n\t]/g, ' ')
          .replace(/[^\x20-\x7e]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 4000);

        res.setHeader('X-SSR-API-ERRORS', safeHeaderValue);
        ssrErrors.length = 0;
      }

      writeResponseToNodeResponse(response, res);
    })
    .catch((err) => {
      console.error('SSR error:', err);
      res.status(500).send('Internal server error');
    });
});

if (isMainModule(import.meta.url)) {
  const port = Number(process.env['PORT']) || 4000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
