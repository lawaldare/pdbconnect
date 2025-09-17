export type SmartSequenceAnnotationScales = 'ordinal' | 'quantile';
export type SmartSequenceAnnotationRenderingTypes = 'Background' | 'Underline' | 'CircleAbove' | 'TextColour';

export interface AlternativeNumbering {
  numberingType: 'Auth' | 'UniProt'; // e.g Auth, UniProt
  identifier: 'auth' | 'uniprot';
  alternativeSequence: Array<Array<string | number>>;
  extraIdentifiers?: string[][];
}

export interface TooltipFormatting {
  preferred: 'auth' | 'uniprot' | 'none';
  secondary?: 'auth' | 'uniprot' | 'none';
  extraLine?: 'auth' | 'uniprot' | 'none';
}

export interface SmartSequenceAnnotation {
  name: string; // Human-readable label for the annotation
  identifier: string; // Unique ID defined by the user
  scaleType: SmartSequenceAnnotationScales; // D3 scale type
  scaleDomain: 'auto' | string[]; // Categories or values; 'auto' will infer from data
  scaleRange: string[]; // Array of colors to map values to
  rendering: SmartSequenceAnnotationRenderingTypes; // For now only 'Background' supported
  data: {
    residueIndex: number; // 1-indexed
    value: string; // Category label or value used for color mapping
    extraData?: any;
  }[];
}

export interface SmartSequenceAnnotationForEvent {
  name: string; // Human-readable label for the annotation
  identifier: string; // Unique ID defined by the user
  scaleType: SmartSequenceAnnotationScales; // D3 scale type
  scaleDomain: 'auto' | string[]; // Categories or values; 'auto' will infer from data
  scaleRange: string[]; // Array of colors to map values to
  rendering: SmartSequenceAnnotationRenderingTypes; // For now only 'Background' supported
  datum: {
    residueIndex: number; // 1-indexed
    value: string; // Category label or value used for color mapping
    extraData?: any;
  };
}

export interface SmartSequenceVisOptions {
  grouping?: boolean;
  groupingLineBreak?: boolean;
  responsive?: boolean;
  externalEvents?: boolean;
  hoverTooltips?: boolean;
  tooltipFormatting?: TooltipFormatting;
  scrollContainerMaxHeight?: number;
  isNucleic?: boolean;
  useAuthNumbers?: boolean;
  helpLogoSrc?: string;
}
