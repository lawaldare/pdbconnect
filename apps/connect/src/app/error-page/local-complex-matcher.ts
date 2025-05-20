import { UrlSegment, UrlSegmentGroup, Route } from '@angular/router';
import { environment } from '../../environments/environment';

export function localComplexMatcher(segments: UrlSegment[], group: UrlSegmentGroup, route: Route) {
  if (!environment.isLocal) {
    return null;
  }

  const complexId = segments[0]?.path;

  if (!complexId) return null;

  return {
    consumed: [segments[0]],
    posParams: {
      complexId: segments[0],
    },
  };
}
