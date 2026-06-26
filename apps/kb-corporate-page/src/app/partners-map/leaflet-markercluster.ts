// import * as Leaflet from 'leaflet';
// export const L = Leaflet;

// let loading: Promise<void> | null = null;

// export function loadMarkerCluster(): Promise<void> {
//   if ((Leaflet as any).markerClusterGroup) return Promise.resolve();
//   if (loading) return loading;

//   loading = (async () => {
//     (window as any).L = Leaflet; // harmless + helps some builds
//     await import('leaflet.markercluster'); // ✅ the working entrypoint
//   })();

//   return loading;
// }

/* eslint-disable @typescript-eslint/no-explicit-any */

// ❌ REMOVE the eager top-level import
// import * as Leaflet from 'leaflet';

// We export a variable that will hold Leaflet once loaded
export let L: any;

let loading: Promise<void> | null = null;

export async function loadMarkerCluster(): Promise<void> {
  // 🛡️ Server-side Guard: If there's no window, do nothing
  if (typeof window === 'undefined') return Promise.resolve();

  if (L?.markerClusterGroup) return Promise.resolve();
  if (loading) return loading;

  loading = (async () => {
    // ✅ Dynamically import Leaflet only when this function is called
    const Leaflet = (await import('leaflet')).default;
    L = Leaflet;

    // Help some plugins find the global L instance
    (window as any).L = Leaflet;

    // ✅ The markercluster plugin now has a window and a Leaflet instance to attach to
    await import('leaflet.markercluster');
  })();

  return loading;
}
