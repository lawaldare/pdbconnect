import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'error', renderMode: RenderMode.Server },
  { path: 'show/:ligandId', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
