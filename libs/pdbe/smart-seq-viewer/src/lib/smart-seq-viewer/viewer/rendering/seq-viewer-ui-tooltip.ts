import { AlternativeNumbering, TooltipFormatting } from '../data-processing/seq-viewer-models';
import { getResidueNameFromCode } from '../data-processing/seq-viewer.helpers';

export function buildTooltipContent(
  sequence: string,
  isNucleic: boolean,
  residueIndex: number,
  tooltipFormatting: TooltipFormatting,
  alternativeNumberings?: AlternativeNumbering[]
): string | null {
  const residue = sequence[residueIndex - 1];
  if (!residue) return null;
  const residueName = isNucleic === false ? getResidueNameFromCode(residue) : residue;

  const authNumbering = alternativeNumberings?.find((n) => n.identifier === 'auth');
  const uniprotNumbering = alternativeNumberings?.find((n) => n.identifier === 'uniprot');

  const authId = authNumbering?.alternativeSequence?.[residueIndex - 1]?.[0];
  const uniprotResIds = uniprotNumbering?.alternativeSequence?.[residueIndex - 1];
  const uniprotIds = uniprotNumbering?.extraIdentifiers?.[residueIndex - 1];

  let displayResnum = `${residueName} ${residueIndex}`;
  let secondaryString = '';
  let extraLineString = '';
  let hasWarning = false;

  // --- Preferred display ---
  if (tooltipFormatting.preferred === 'auth' && authId) {
    displayResnum = `${residueName} ${authId} (Auth)`;
  } else if (tooltipFormatting.preferred === 'uniprot' && uniprotResIds && uniprotIds && uniprotResIds.length > 0 && uniprotIds.length > 0) {
    displayResnum = `${residueName} ${uniprotResIds[0]} (${uniprotIds[0]})`;
    if (uniprotIds.length > 1) hasWarning = true;
  }

  // --- Secondary line ---
  if (tooltipFormatting.secondary === 'none') {
    secondaryString = `Index: ${residueIndex}`;
  } else if (tooltipFormatting.secondary === 'auth' && authId) {
    secondaryString = ` Auth: ${authId}`;
  } else if (tooltipFormatting.secondary === 'uniprot' && uniprotResIds && uniprotIds && uniprotResIds.length > 0 && uniprotIds.length > 0) {
    secondaryString = ` ${uniprotIds[0]}: ${uniprotResIds[0]}`;
    if (uniprotIds.length > 1) hasWarning = true;
  }

  // --- Extra line ---
  if (tooltipFormatting.extraLine === 'none') {
    extraLineString = `Index: ${residueIndex}`;
  } else if (tooltipFormatting.extraLine === 'auth' && authId) {
    extraLineString = `Auth: ${authId}`;
  } else if (tooltipFormatting.extraLine === 'uniprot' && uniprotResIds && uniprotIds && uniprotResIds.length > 0 && uniprotIds.length > 0) {
    extraLineString = `${uniprotIds[0]}: ${uniprotResIds[0]}`;
    if (uniprotIds.length > 1) hasWarning = true;
  }

  // --- Optional warning line ---
  const warningLine = hasWarning ? `<div style="color: #d32f2f; font-size: 14px;">⚠ Multiple UniProt mappings</div>` : '';

  return `
      <div style="font-weight: 500;">${displayResnum}</div>
      <div style="font-size: 14px;">${secondaryString}</div>
      <div style="font-size: 14px;">${extraLineString}</div>
      ${warningLine}
      <em style="font-size: 12px;">Click to view info</em>
    `;
}

export function showTooltip(content: string, x: number, y: number, tooltipEl: HTMLDivElement | null) {
  tooltipEl!.innerHTML = content;
  tooltipEl!.style.display = 'block';

  const GAP = 10;

  requestAnimationFrame(() => {
    const tooltipWidth = tooltipEl!.offsetWidth;
    const tooltipHeight = tooltipEl!.offsetHeight;
    const container = tooltipEl!.parentElement!;
    const containerRect = container.getBoundingClientRect();

    let left = x + GAP;
    let top = y + GAP;

    const willOverflowRight = left + tooltipWidth > containerRect.width;
    const willOverflowBottom = top + tooltipHeight > containerRect.height;

    if (willOverflowRight) {
      left = x - tooltipWidth - GAP;
      if (left < 0) left = containerRect.width - tooltipWidth - GAP; // fallback clamp
    }

    if (willOverflowBottom) {
      top = y - tooltipHeight - GAP;
      if (top < 0) top = containerRect.height - tooltipHeight - GAP; // fallback clamp
    }

    tooltipEl!.style.left = `${left}px`;
    tooltipEl!.style.top = `${top}px`;
  });
}
