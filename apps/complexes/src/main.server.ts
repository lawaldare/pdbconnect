import 'zone.js/node'; // 👈 CRITICAL: This must be first
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

// (global as any).XMLHttpRequest = require('xhr2');

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;
