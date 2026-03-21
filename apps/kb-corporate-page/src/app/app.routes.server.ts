import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'services', renderMode: RenderMode.Prerender },
  { path: 'join', renderMode: RenderMode.Prerender },
  { path: 'graph', renderMode: RenderMode.Prerender },
  { path: 'partners', renderMode: RenderMode.Prerender },
  { path: 'schema', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Server }, // Fallback for error page
];
