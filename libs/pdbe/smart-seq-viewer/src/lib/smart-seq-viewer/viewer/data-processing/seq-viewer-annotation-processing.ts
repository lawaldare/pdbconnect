import { scaleOrdinal, scaleQuantile } from 'd3-scale';
import { SmartSequenceAnnotation, SmartSequenceAnnotationForEvent, SmartSequenceAnnotationRenderingTypes } from './seq-viewer-models';

export function processBgAnnotations(annotations: SmartSequenceAnnotation[]): Map<number, string> {
  const backgroundColorMap = new Map<number, string>();
  const bgAnnotation = annotations.find((a) => a.rendering === 'Background');

  if (!bgAnnotation) return backgroundColorMap;

  let scale: (value: any) => string;

  if (bgAnnotation.scaleType === 'ordinal') {
    const domain = bgAnnotation.scaleDomain === 'auto' ? [...new Set(bgAnnotation.data.map((d) => d.value))] : bgAnnotation.scaleDomain;

    scale = scaleOrdinal<string, string>().domain(domain).range(bgAnnotation.scaleRange);
  } else if (bgAnnotation.scaleType === 'quantile') {
    const numericValues = bgAnnotation.data.map((d) => parseFloat(d.value)).filter((v) => !isNaN(v));
    if (numericValues.length === 0) return backgroundColorMap;

    const domain = bgAnnotation.scaleDomain === 'auto' ? numericValues : bgAnnotation.scaleDomain.map((v) => parseFloat(v)).filter((v) => !isNaN(v));

    scale = scaleQuantile<string>().domain(domain).range(bgAnnotation.scaleRange);
  } else {
    console.warn(`Unsupported scaleType: ${bgAnnotation.scaleType}`);
    return backgroundColorMap;
  }

  for (const d of bgAnnotation.data) {
    const color = scale(d.value);
    if (color) {
      backgroundColorMap.set(d.residueIndex, color);
    }
  }

  return backgroundColorMap;
}

export function processUnderlineAnnotations(annotations: SmartSequenceAnnotation[]): Map<number, string> {
  const underlineColorMap = new Map<number, string>();
  const underlineAnnotation = annotations.find((a) => a.rendering === 'Underline');

  if (!underlineAnnotation) return underlineColorMap;

  let scale: (value: any) => string;

  if (underlineAnnotation.scaleType === 'ordinal') {
    const domain = underlineAnnotation.scaleDomain === 'auto' ? [...new Set(underlineAnnotation.data.map((d) => d.value))] : underlineAnnotation.scaleDomain;

    scale = scaleOrdinal<string, string>().domain(domain).range(underlineAnnotation.scaleRange);
  } else if (underlineAnnotation.scaleType === 'quantile') {
    const numericValues = underlineAnnotation.data.map((d) => parseFloat(d.value)).filter((v) => !isNaN(v));
    if (numericValues.length === 0) return underlineColorMap;

    const domain = underlineAnnotation.scaleDomain === 'auto' ? numericValues : underlineAnnotation.scaleDomain.map((v) => parseFloat(v)).filter((v) => !isNaN(v));

    scale = scaleQuantile<string>().domain(domain).range(underlineAnnotation.scaleRange);
  } else {
    console.warn(`Unsupported scaleType for Underline: ${underlineAnnotation.scaleType}`);
    return underlineColorMap;
  }

  for (const d of underlineAnnotation.data) {
    const color = scale(d.value);
    if (color) {
      underlineColorMap.set(d.residueIndex, color);
    }
  }

  return underlineColorMap;
}

export function processCircleAboveAnnotations(annotations: SmartSequenceAnnotation[]): { circleColorMap: Map<number, string>; hasCircleAnnotation: boolean } {
  const circleColorMap = new Map<number, string>();
  const circleAnnotation = annotations.find((a) => a.rendering === 'CircleAbove');

  let hasCircleAnnotation = false;
  if (!circleAnnotation) return { circleColorMap, hasCircleAnnotation };

  hasCircleAnnotation = true;

  let scale: (value: any) => string;

  if (circleAnnotation.scaleType === 'ordinal') {
    const domain = circleAnnotation.scaleDomain === 'auto' ? [...new Set(circleAnnotation.data.map((d) => d.value))] : circleAnnotation.scaleDomain;

    scale = scaleOrdinal<string, string>().domain(domain).range(circleAnnotation.scaleRange);
  } else if (circleAnnotation.scaleType === 'quantile') {
    const numericValues = circleAnnotation.data.map((d) => parseFloat(d.value)).filter((v) => !isNaN(v));
    if (numericValues.length === 0) return { circleColorMap, hasCircleAnnotation };

    const domain = circleAnnotation.scaleDomain === 'auto' ? numericValues : circleAnnotation.scaleDomain.map((v) => parseFloat(v)).filter((v) => !isNaN(v));

    scale = scaleQuantile<string>().domain(domain).range(circleAnnotation.scaleRange);
  } else {
    console.warn(`Unsupported scaleType for CircleAbove: ${circleAnnotation.scaleType}`);
    return { circleColorMap, hasCircleAnnotation };
  }

  for (const d of circleAnnotation.data) {
    const color = scale(d.value);
    if (color) {
      circleColorMap.set(d.residueIndex, color);
    }
  }

  return { circleColorMap, hasCircleAnnotation };
}

export function processDistStarAboveAnnotations(annotations: SmartSequenceAnnotation[]): Map<number, string> {
  const distStarColorMap = new Map<number, string>();
  const distStarAnnotation = annotations.find((a) => a.rendering === 'DistStarAbove');

  if (!distStarAnnotation) return distStarColorMap;

  let scale: (value: any) => string;

  if (distStarAnnotation.scaleType === 'ordinal') {
    const domain = distStarAnnotation.scaleDomain === 'auto' ? [...new Set(distStarAnnotation.data.map((d) => d.value))] : distStarAnnotation.scaleDomain;

    scale = scaleOrdinal<string, string>().domain(domain).range(distStarAnnotation.scaleRange);
  } else if (distStarAnnotation.scaleType === 'quantile') {
    const numericValues = distStarAnnotation.data.map((d) => parseFloat(d.value)).filter((v) => !isNaN(v));
    if (numericValues.length === 0) return distStarColorMap;

    const domain = distStarAnnotation.scaleDomain === 'auto' ? numericValues : distStarAnnotation.scaleDomain.map((v) => parseFloat(v)).filter((v) => !isNaN(v));

    scale = scaleQuantile<string>().domain(domain).range(distStarAnnotation.scaleRange);
  } else {
    console.warn(`Unsupported scaleType for DistStarAbove: ${distStarAnnotation.scaleType}`);
    return distStarColorMap;
  }

  for (const d of distStarAnnotation.data) {
    const color = scale(d.value);
    if (color) {
      distStarColorMap.set(d.residueIndex, color);
    }
  }

  return distStarColorMap;
}

export function processHexagonAboveAnnotations(annotations: SmartSequenceAnnotation[]): Map<number, string> {
  const hexagonColorMap = new Map<number, string>();
  const hexagonAnnotation = annotations.find((a) => a.rendering === 'HexagonAbove');

  if (!hexagonAnnotation) return hexagonColorMap;

  let scale: (value: any) => string;

  if (hexagonAnnotation.scaleType === 'ordinal') {
    const domain = hexagonAnnotation.scaleDomain === 'auto' ? [...new Set(hexagonAnnotation.data.map((d) => d.value))] : hexagonAnnotation.scaleDomain;

    scale = scaleOrdinal<string, string>().domain(domain).range(hexagonAnnotation.scaleRange);
  } else if (hexagonAnnotation.scaleType === 'quantile') {
    const numericValues = hexagonAnnotation.data.map((d) => parseFloat(d.value)).filter((v) => !isNaN(v));
    if (numericValues.length === 0) return hexagonColorMap;

    const domain = hexagonAnnotation.scaleDomain === 'auto' ? numericValues : hexagonAnnotation.scaleDomain.map((v) => parseFloat(v)).filter((v) => !isNaN(v));

    scale = scaleQuantile<string>().domain(domain).range(hexagonAnnotation.scaleRange);
  } else {
    console.warn(`Unsupported scaleType for HexagonAbove: ${hexagonAnnotation.scaleType}`);
    return hexagonColorMap;
  }

  for (const d of hexagonAnnotation.data) {
    const color = scale(d.value);
    if (color) {
      hexagonColorMap.set(d.residueIndex, color);
    }
  }

  return hexagonColorMap;
}

export function getAnnotationsForResidue(residueIndex: number, annotations: SmartSequenceAnnotation[]): SmartSequenceAnnotationForEvent[] {
  const matching: SmartSequenceAnnotationForEvent[] = [];

  for (const annotation of annotations) {
    const datum = annotation.data.find((d) => d.residueIndex === residueIndex);
    if (datum) {
      matching.push({
        name: annotation.name,
        identifier: annotation.identifier,
        scaleType: annotation.scaleType,
        scaleDomain: annotation.scaleDomain,
        scaleRange: annotation.scaleRange,
        rendering: annotation.rendering,
        datum,
      });
    }
  }
  return matching;
}

export function getAnnotationColor(
  residueIndex: number,
  rendering: SmartSequenceAnnotationRenderingTypes,
  colourMaps: {
    backgroundColorMap?: Map<number, string>;
    underlineColorMap?: Map<number, string>;
    circleColorMap?: Map<number, string>;
    distStarColorMap?: Map<number, string>;
    hexagonColorMap?: Map<number, string>;
  }
): string | undefined {
  if (rendering === 'Background') return colourMaps.backgroundColorMap?.get(residueIndex);
  if (rendering === 'Underline') return colourMaps.underlineColorMap?.get(residueIndex);
  if (rendering === 'CircleAbove') return colourMaps.circleColorMap?.get(residueIndex);
  if (rendering === 'DistStarAbove') return colourMaps.distStarColorMap?.get(residueIndex);
  if (rendering === 'HexagonAbove') return colourMaps.hexagonColorMap?.get(residueIndex);
  return undefined;
}
