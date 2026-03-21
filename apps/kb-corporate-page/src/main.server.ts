import 'zone.js/node'; // 👈 CRITICAL: This must be first
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

// 🌐 Polyfills for Server-side API calls
// If your Node version is < 18, fetch isn't global.
// Even in 18+, some libs still need XMLHttpRequest.
(global as any).XMLHttpRequest = require('xhr2');

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;
