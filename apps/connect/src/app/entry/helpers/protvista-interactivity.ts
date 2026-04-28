import { QueryParamForHelpers } from './molstar-helpers';

export function protToMolBuildHighlightQuery(detail: any, symOpInstanceId?: string): QueryParamForHelpers | null {
  if (!detail.start || !detail.end) return null;

  const query: any = {
    start_residue_number: parseInt(detail.start, 10),
    end_residue_number: parseInt(detail.end, 10),
  };

  if (detail.feature?.entityId) query.entity_id = String(detail.feature.entityId);
  if (detail.feature?.bestChainId) query.auth_asym_id = detail.feature.bestChainId;
  if (detail.feature?.chainId) query.auth_asym_id = detail.feature.chainId;
  if (symOpInstanceId) query.instance_id = symOpInstanceId;
  return query;
}

export function protToMolShouldShowInteraction(detail: any): boolean {
  const isChain = detail.feature?.accession?.split(' ')[0] === 'Chain';
  const isLigand = detail.feature?.tooltipContent === 'Ligand binding site';
  const isSingleResidue = detail.start === detail.end;
  return isChain || isLigand || isSingleResidue;
}

export function protToMolExtractColor(detail: any): { r: number; g: number; b: number } {
  const color = detail.feature?.locations?.[0]?.fragments?.[detail.trackIndex]?.color ?? detail.feature?.color ?? detail.color;

  if (!color) return { r: 65, g: 96, b: 91 }; // default

  if (typeof color === 'string' && color.startsWith('rgb')) {
    const rgbArr = color
      .substring(4, color.length - 1)
      .split(',')
      .map((c) => parseInt(c.trim(), 10));
    return { r: rgbArr[0], g: rgbArr[1], b: rgbArr[2] };
  }
  return color;
}
