import { getAnnotationColor, getAnnotationsForResidue } from '../data-processing/seq-viewer-annotation-processing';
import {
  AlternativeNumbering,
  SmartSequenceAnnotation,
  SmartSequenceAnnotationForEvent,
  SmartSequenceAnnotationRenderingTypes,
} from '../data-processing/seq-viewer-models';
import { getAltNumber, getResidueNameFromCode } from '../data-processing/seq-viewer.helpers';
import { SmartSeqViewerEventManager } from '../events/seq-viewer-evt-manager';

export function getSidebarPanelEmptyState(annotations: SmartSequenceAnnotation[], nonObservedResidues?: number[]): string {
  let html = `<p style="margin: 0; font-weight: bold; font-size: 14px;">Click a residue for details</p>`;

  const renderingIcons: Record<SmartSequenceAnnotationRenderingTypes, (color: string) => string> = {
    Background: (color: string) => `<div style="display:inline-block;width:16px;height:16px;background:${color};margin-right:6px;border:1px solid #aaa;"></div>`,
    Underline: (color: string) => `<div style="display:inline-block;width:16px;height:2px;background:${color};margin:0 6px 0 0;vertical-align:middle;"></div>`,
    CircleAbove: (color: string) =>
      `<div style="display:inline-block;width:12px;height:12px;background:${color};border-radius:50%;margin-right:6px;border:1px solid #aaa;"></div>`,
    DistStarAbove: (color: string) => `<div style="display:inline-block;width:16px;height:16px;background:${color};margin-right:6px;border:1px solid #aaa;"></div>`,
    HexagonAbove: (color: string) => `<div style="display:inline-block;width:16px;height:16px;background:${color};margin-right:6px;border:1px solid #aaa;"></div>`,
    TextColour: () => '', // not rendered here
  };

  html += `<div style="margin-top: 8px;">`;
  let hasWrittenContainer = false;
  let hasWrittenAbsent = false;
  for (const annotation of annotations) {
    if (annotation.rendering === 'TextColour') continue;
    // html += `<div style="font-weight: bold; line-height: 22.4px; font-size: 13px; margin: 0; margin-bottom: 4px;">${annotation.name}</div>`;

    const domain = annotation.scaleDomain === 'auto' ? [...new Set(annotation.data.map((d) => d.value))] : annotation.scaleDomain;

    if (!hasWrittenContainer) {
      html += `<div style="display: flex; flex-direction: row; flex-wrap: wrap; row-gap: 2px; column-gap: 12px; margin: 4px;">`;
      hasWrittenContainer = true;
    }
    for (let i = 0; i < domain.length; i++) {
      const label = domain[i];
      const color = annotation.scaleRange[i] || '#000';
      const icon = renderingIcons[annotation.rendering](color);

      html += `<div style="width: fit-content;">${icon}<span style="font-size: 13px;">${label}</span></div>`;
    }
  }
  if (!hasWrittenAbsent && nonObservedResidues && nonObservedResidues.length > 0) {
    const absentIcon = `
        <div style="
          display:inline-block;
          width:16px;
          height:16px;
          margin-right: 2px;
          border:1px solid #aaa;
          background-color: #f2f2f2;
          background-image: repeating-linear-gradient(
            135deg,          /* smooth diagonal */
            #b3b3b3 0,       /* stripe color */
            #b3b3b3 3px,     /* stripe thickness */
            transparent 3px, 
            transparent 6px  /* spacing between stripes */
          );
        ">
        </div>
      `;
    const absentLabel = 'Absent coordinates';
    html += `<div style="width: fit-content;">${absentIcon}<span style="font-size: 13px;">${absentLabel}</span></div>`;
    hasWrittenAbsent = true;
  }
  html += `</div>`;
  html += `</div>`;

  return html;
}

export function buildSidebarContent(
  residueIndex: number,
  sequence: string,
  isNucleic: boolean,
  sidebarPanel: HTMLDivElement | null = null,
  eventManager: SmartSeqViewerEventManager,
  useAuthNumbers: boolean,
  allAnnotations: SmartSequenceAnnotation[],
  helpLogoSrcString: string | undefined,
  nonObservedResidues: number[] | undefined,
  backgroundColorMap: Map<number, string> | undefined,
  underlineColorMap: Map<number, string> | undefined,
  circleColorMap: Map<number, string> | undefined,
  distStarColorMap: Map<number, string> | undefined,
  hexagonColorMap: Map<number, string> | undefined,
  annotationRenderers: Map<string, (ann: SmartSequenceAnnotationForEvent, residueIndex: number) => string>,
  alternativeNumberings?: AlternativeNumbering[],
  indexWithMultipleResiduesData?: {
    [key: string]: {
      three_letter_code: string;
      one_letter_code: string;
      parent_chem_comp_ids: string[];
    };
  }
): string {
  const residue = sequence[residueIndex - 1];
  let residueName = isNucleic === false ? getResidueNameFromCode(residue) : residue;

  // Check if residue is '*' due to multiple residues in the same position, and if so, try to get a more informative name for it using the indexWithMultipleResiduesData
  // which provides the actual three letter code and one letter code of the residue(s) in that position, as well as the parent chem comp ids
  let hasMultipleResiduesInSamePosition = false;
  const multipleResiduesInfoString = '';
  if (residueName === '*') {
    const oneLetter = indexWithMultipleResiduesData?.[residueIndex]?.one_letter_code;
    const threeLetter = indexWithMultipleResiduesData?.[residueIndex]?.three_letter_code;
    if (threeLetter) {
      residueName = `<a style='font-size: inherit; font-weight: inherit;' href='https://www.ebi.ac.uk/pdbe-srv/pdbechem/chemicalCompound/show/${threeLetter}' target='_blank'>${threeLetter}</a>`;
      hasMultipleResiduesInSamePosition = true;
      multipleResiduesInfoString;
    } else {
      residueName = residue;
    }
  }

  // Inline close handler
  const handleSidebarClose = () => {
    if (sidebarPanel) {
      // this.sidebarPanel.style.display = 'none';
      eventManager.unselectResidueState();
    }
  };

  // Attach to window so the button onclick can reference it
  (window as any).smartSeqSidebarClose = handleSidebarClose;

  const residueNumberLabel = useAuthNumbers ? getAltNumber(residueIndex, 'auth', alternativeNumberings) : residueIndex.toString();
  let residueLabel = residueNumberLabel;
  if (residueNumberLabel !== residueIndex.toString()) {
    residueLabel = `${residueNumberLabel} (Auth)`;
  }

  // Open residue info div
  let html = `<div style="margin-bottom: 6px;">`;

  // Add residue label and close icon
  html += '<div style="display: flex; justify-content: space-between; align-items: center;">';
  html += '<div style="display: flex; gap: 4px;">';
  html += `<h5 style="margin: 0;">${residueName} ${residueLabel}</h5>`;
  if (residueLabel.includes('(Auth)')) {
    const helpLogoSrc = helpLogoSrcString || '';
    const tooltipText = `Auth refers to the residue numbering as provided by the original authors of the PDB entry (${residueName} ${residueNumberLabel}). This numbering may differ from canonical or sequential numbering (${residueName} ${residueIndex}) due to biological context, insertions, or historical reasons.`;

    html += `
        <div style="position: relative; display: inline-block;">
          <img src="${helpLogoSrc}" 
              class="icon help-icon" 
              alt="help icon" 
              data-tooltip="${tooltipText}" />
        </div>
      `;
  }
  html += '</div>';
  html += '<button onclick="smartSeqSidebarClose()" style="background: transparent; border: none; font-size: 20px; cursor: pointer;">×</button>';
  html += '</div>';

  // If Auth residue, add Seq residue numbering
  if (residueLabel.includes('(Auth)')) {
    html += `<h5 style="margin: 0;font-size: 16px;font-weight: normal;">${residueName} ${residueIndex}</h5>`;
  }

  // Close residue info div
  html += '</div>';

  // If there are multiple residues in the same position, add info about that
  if (hasMultipleResiduesInSamePosition) {
    const helpLogoSrc = helpLogoSrcString || '';
    const oneLetter = indexWithMultipleResiduesData?.[residueIndex]?.one_letter_code;
    const tooltipText = `This position corresponds to a non-standard residue present in the structure. This can be observed in some post-translational modifications.`;

    const multipleResiduesHelpEl = `
        <div style="position: relative; display: inline-block; top: -2px; left: -3px;">
          <img src="${helpLogoSrc}" 
              class="icon help-icon" 
              alt="help icon" 
              data-tooltip="${tooltipText}" />
        </div>
      `;

    html += `<div style="margin: 0; font-size: 14px; margin-bottom: 4px;">
      This non-standard residue contains residues: "${oneLetter}". ${multipleResiduesHelpEl}
    </div>`;
  }

  // If Residue is non observed, add observation to this
  const isNonObserved = nonObservedResidues?.includes(residueIndex) ?? false;
  if (isNonObserved) {
    const helpLogoSrc = helpLogoSrcString || '';
    const tooltipText = `Non-observed coordinates are parts of the molecule that were present in the experimental sample but could not be modeled usually due to lack of clear structural data evidence. This can happen because of instrinsic structural flexibility, disorder, or due to experimental limitations during structure determination.`;

    const nonObservedHelpEl = `
        <div style="position: relative; display: inline-block; top: -2px; left: -3px;">
          <img src="${helpLogoSrc}" 
              class="icon help-icon" 
              alt="help icon" 
              data-tooltip="${tooltipText}" />
        </div>
      `;

    html += `<div style="margin: 0; font-size: 14px; margin-bottom: 4px;">
        This residue's coordinates are partially or completely absent. ${nonObservedHelpEl}
      </div>`;
  }

  // // UniProt
  // const uniprotNumbering = this.alternativeNumberings?.find((n) => n.identifier === 'uniprot');
  // const uniprotResIds = uniprotNumbering?.alternativeSequence?.[residueIndex - 1];
  // const uniprotIds = uniprotNumbering?.extraIdentifiers?.[residueIndex - 1];
  // if (uniprotResIds && uniprotIds) {
  //   html += `<p><strong>UniProt:</strong></p><ul>`;
  //   for (let i = 0; i < uniprotIds.length; i++) {
  //     html += `<li><a href="https://www.uniprot.org/uniprotkb/${uniprotIds[i]}" target="_blank">${uniprotIds[i]}</a> - Residue: ${uniprotResIds[i]}</li>`;
  //   }
  //   if (uniprotIds.length === 0) {
  //     html += `<li>No mappings</li>`;
  //   }
  //   html += `</ul>`;
  // }

  // Annotations
  const annotations = getAnnotationsForResidue(residueIndex, allAnnotations);
  let hasAddedTitle = false;
  let hasPdbeValTitle = false;
  let hasPdbeDomTitle = false;
  const colourMaps = {
    backgroundColorMap: backgroundColorMap,
    underlineColorMap: underlineColorMap,
    circleColorMap: circleColorMap,
    distStarColorMap: distStarColorMap,
    hexagonColorMap: hexagonColorMap,
  };
  if (annotations.length > 0) {
    for (const ann of annotations) {
      if (ann.identifier.includes('pdbe-validation')) {
        html += processPdbeValidationAnnotForSidebar(ann, residueIndex, hasPdbeValTitle, colourMaps);
        hasPdbeValTitle = true;
      } else if (ann.identifier.includes('pdbe-domains')) {
        html += processPdbeDomainAnnotForSidebar(ann, hasPdbeDomTitle);
        hasPdbeDomTitle = true;
      } else if (ann.identifier.includes('pdbe-llm-annotation')) {
        html += processPdbeLLMAnnotForSidebar(ann);
      } else {
        const customRenderer = annotationRenderers.get(ann.identifier);
        if (customRenderer) {
          html += customRenderer(ann, residueIndex);
        } else {
          html += processGenericAnnotationForSidebar(ann, residueIndex, hasAddedTitle, colourMaps);
        }
        hasAddedTitle = true;
      }
    }
  }
  return html;
}

export function processPdbeValidationAnnotForSidebar(
  ann: SmartSequenceAnnotationForEvent,
  residueIndex: number,
  hasAddedTitle: boolean,
  colourMaps: {
    backgroundColorMap?: Map<number, string>;
    underlineColorMap?: Map<number, string>;
    circleColorMap?: Map<number, string>;
    distStarColorMap?: Map<number, string>;
    hexagonColorMap?: Map<number, string>;
  }
) {
  let html = '';
  const extraData = ann.datum.extraData || undefined;
  if (!extraData) return '';
  const outlierCount = extraData.outlierTypes.length;
  if (!hasAddedTitle) {
    const color = getAnnotationColor(residueIndex, ann.rendering, colourMaps);
    const colorRect = `<span style="display:inline-block;width:12px;height:12px;background:${color};margin-left:2px; margin-right:2px; border: 1.5px solid black;"></span>`;
    const colourText = `${outlierCount} - ${colorRect}`;
    html += `<p style="margin: 0; font-weight: 500; font-size: 16px;">Validation outliers (${colourText}):</p>`;
  }
  // const issuesNumber = extraData.outlierTypes.length === 0 ? 'No' : extraData.outlierTypes.length;
  // const typesWord = extraData.outlierTypes.length === 1 ? 'type' : 'types';
  // html += `<p style="margin: 0; font-size: 14px;">${issuesNumber} validation outlier ${typesWord} found for this residue</p>`;
  if (outlierCount === 0) {
    html += `<p style="margin: 0; font-size: 14px;">No validation outliers found for this residue</p>`;
  } else if (outlierCount > 0) {
    html += `<ul style="margin-bottom:4px;">`;
    for (const outlierType of extraData.outlierTypes) {
      html += `<li style="margin: 0; font-size: 14px;">${outlierType}</li>`;
    }
    html += `</ul>`;
  }
  return html;
}

export function processPdbeDomainAnnotForSidebar(ann: SmartSequenceAnnotationForEvent, hasAddedTitle: boolean) {
  let html = '';
  const extraData = ann.datum.extraData || undefined;
  if (!extraData) return '';
  if (!hasAddedTitle) {
    html += `<p style="margin: 0; font-size: 14px;">
        This is the <b>${extraData.ordinalLabel} residue</b> in <b>segment ${extraData.segmentIndex} (residues: ${extraData.segment})</b> of this <b>${extraData.source}</b> domain (<b>Domain name: ${extraData.domainName}</b>)
      </p>`;
  }
  return html;
}

export function processPdbeLLMAnnotForSidebar(ann: SmartSequenceAnnotationForEvent) {
  const extraData = ann.datum.extraData || undefined;
  if (!extraData) return '';
  const annotationS = ann.datum.extraData.length > 1 ? 'annotations' : 'annotation';
  const html = `<p style="margin: 0; font-weight: 500; font-size: 16px;">
      ${ann.datum.extraData.length} text-mined ${annotationS}
    </p>`;
  return html;
}

export function processGenericAnnotationForSidebar(
  ann: SmartSequenceAnnotationForEvent,
  residueIndex: number,
  hasAddedTitle: boolean,
  colourMaps: {
    backgroundColorMap?: Map<number, string>;
    underlineColorMap?: Map<number, string>;
    circleColorMap?: Map<number, string>;
    distStarColorMap?: Map<number, string>;
    hexagonColorMap?: Map<number, string>;
  }
) {
  // fallback: default HTML
  let html = '';
  if (!hasAddedTitle) html += `<hr/><h5>Annotations</h5>`;

  html += `<ul style="margin-bottom:10px;">`;
  html += `<li><strong>Name</strong>: ${ann.name}</li>`;
  html += `<li><strong>Value</strong>: ${ann.datum.value}</li>`;
  const color = getAnnotationColor(residueIndex, ann.rendering, colourMaps);
  html += `<li><strong>Colour</strong>: <div style="display:inline-block;width:12px;height:12px;background:${color};margin-right:6px;"></div></li>`;
  html += `</ul>`;

  return html;
}
