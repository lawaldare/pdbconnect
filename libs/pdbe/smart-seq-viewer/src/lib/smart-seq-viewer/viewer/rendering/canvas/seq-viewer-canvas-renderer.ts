import { AlternativeNumbering } from '../../data-processing/seq-viewer-models';
import { drawResidue } from './seq-viewer-residue-renderer';

export function createHiPPICanvas(width: number, height: number) {
  const ratio = window.devicePixelRatio;
  const canvas = document.createElement('canvas');

  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  const context = canvas.getContext('2d');
  if (context) context.scale(ratio, ratio);

  return canvas;
}

export interface DrawResidueConfig {
  nonObservedResidues?: number[];

  backgroundColorMap?: Map<number, string>;
  underlineColorMap?: Map<number, string>;
  circleColorMap?: Map<number, string>;
  distStarColorMap?: Map<number, string>;
  hexagonColorMap?: Map<number, string>;

  currentHoveredResidue: number | null;
  currentClickedResidue: number | null;

  clickedBorderColour: string;
  clickedBorderWidth: number;

  maxNumberingBoxHeight: number;
  maxBoxWidth: number;
  maxBoxHeight: number;

  defaultBgColour: string;

  fontSize: number;
  fontFamily: string;

  numberingFontSize: number;
  numberingVerticalSpacing: number;

  characterBgPadding: number;

  circleAnnotationRadius: number;
  circleAnnotationMarginTop: number;
  circleAnnotationMarginBottom: number;

  residueNumberingFreq: number;
  currentResidueNumberingFreq: number | null;

  useAuthNumbers: boolean;
  alternativeNumberings?: AlternativeNumbering[];

  sequenceLength: number;
}
