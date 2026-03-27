import * as Leaflet from 'leaflet';
export const L = Leaflet;

let loading: Promise<void> | null = null;

export function loadMarkerCluster(): Promise<void> {
  if ((Leaflet as any).markerClusterGroup) return Promise.resolve();
  if (loading) return loading;

  loading = (async () => {
    (window as any).L = Leaflet; // harmless + helps some builds
    await import('leaflet.markercluster'); // ✅ the working entrypoint
  })();

  return loading;
}
