import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // 🧠 Absolute path mappings for the server-side manifest engine
  { path: 'pdbe-srv/pdbechem/chemicalCompound/show/:ligandId', renderMode: RenderMode.Server },
  { path: 'pdbe-srv/pdbechem/chemicalCompound/error', renderMode: RenderMode.Server },

  { path: 'error', renderMode: RenderMode.Server },
  { path: 'show/:ligandId', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
