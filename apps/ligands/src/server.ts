/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { dirname, join } from 'node:path';

// @ts-ignore Angular generates this manifest next to the built server bundle.
import angularAppEngineManifest from './angular-app-engine-manifest.mjs';
import { ɵsetAngularAppEngineManifest } from '@angular/ssr';
import { fileURLToPath } from 'node:url';

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
const browserDistFolder = join(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: allowedHosts,
  trustProxyHeaders: true,
} as any);

// 🧠 GLOBAL PREFIX INJECTOR: Run this BEFORE static files or SSR blocks
app.use((req, res, next) => {
  const baseHref = '/pdbe-srv/pdbechem/chemicalCompound';

  // 🧠 Always lock the baseUrl namespace for the Angular Manifest engine
  req.baseUrl = baseHref;

  if (!req.url.startsWith(baseHref)) {
    // 1. Reconstruct the clean, absolute path string structure
    const normalizedUrl = `${baseHref}${req.url.startsWith('/') ? '' : '/'}${req.url}`;

    // 2. Assign standard mutable properties. Express native getters will automatically
    // update req.path perfectly without any internal runtime type mutation crashes!
    req.url = normalizedUrl;
    req.originalUrl = normalizedUrl;

    console.log(`🔧 Path cleanly translated inside Node: ${req.url}`);
  }
  next();
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    redirect: false,
  })
);

// // Handles requests if Nginx leaves the full subpath intact
// app.use(
//   '/pdbe-srv/pdbechem/chemicalCompound',
//   express.static(browserDistFolder, {
//     maxAge: '1y',
//     index: false,
//     redirect: false,
//   })
// );

// // Handles requests if Nginx strips the subpath and asks for '/chunk-XXX.js' directly
// app.use(
//   '/',
//   express.static(browserDistFolder, {
//     maxAge: '1y',
//     index: false,
//     redirect: false,
//   })
// );

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('*', (req, res, next) => {
  // Absolute safety net: Skip the SSR engine entirely if the request is trying to load a file
  if (req.path.includes('.')) {
    return next();
  }

  angularApp
    .handle(req)
    .then((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    })
    .catch((err) => {
      console.error('SSR error:', err);
      res.status(500).send('Internal server error');
    });
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
// if (isMainModule(import.meta.url)) {
const port = Number(process.env['PORT']) || 4000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});
// }

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
