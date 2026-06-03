import type { MVSData } from 'molstar/lib/extensions/mvs/mvs-data';
import type * as Builder from 'molstar/lib/extensions/mvs/tree/mvs/mvs-builder';
import type { MVSNodeParams } from 'molstar/lib/extensions/mvs/tree/mvs/mvs-tree';
import type { ColorT, ComponentExpressionT } from 'molstar/lib/extensions/mvs/tree/mvs/param-types';
import { groupBy, max } from '../misc';
import {
  applyElementColors,
  applyEntityColors,
  applyStandardComponents,
  applyStandardRepresentations,
  assemblyText,
  atomicRepresentations,
  customTooltipText,
  wholeResidues,
} from './helpers';
import type { SnapshotSpec, SnapshotSpecParams } from './mvs-snapshot-types';

/** Focus parameter for object of various sizes (radius = (bounding sphere radius) * factor + extent) */
const FOCUS_PARAMS = {
  /** Focus parameters for larger objects, e.g. polymer chains or domains */
  POLYMER: {},
  /** Focus parameters for smaller objects, e.g. individual residues or ligands */
  RESIDUE: {
    radius_factor: 1,
    radius_extent: 2.5,
  },
} as const satisfies Record<string, MVSNodeParams<'focus'>>;

/** Tube radius for atom interactions */
const INTERACTION_TUBE_RADIUS = 0.075;
/** Tube dash length for atom interactions */
const INTERACTION_TUBE_DASH_LENGTH = 0.1;

/** Color for water entity */
const WATER_COLOR = '#ff0d0d';
/** Color for (non-selected) entities if not specified otherwise */
const DEFAULT_ENTITY_COLOR = '#cccccc';
/** Color for selected entities if not specified otherwise */
const DEFAULT_SELECTED_ENTITY_COLOR = '#808080';

export interface MVSSnapshotProviderConfig {
  /** URL template for PDB structural data, '{pdb}' will be replaced by actual PDB ID. */
  PdbStructureUrlTemplate: string;
  /** Format for PDB structural data. */
  PdbStructureFormat: 'bcif' | 'mmcif' | 'pdb';
}

export const DefaultMVSSnapshotProviderConfig: MVSSnapshotProviderConfig = {
  PdbStructureUrlTemplate: 'https://www.ebi.ac.uk/pdbe/entry-files/{pdb}.bcif',
  PdbStructureFormat: 'bcif',
};

export class MVSSnapshotProvider {
  constructor(
    /** MVSData library object (from molstar/lib/extensions/mvs/mvs-data) */
    public readonly MVSDataLib: typeof MVSData,
    public readonly config: MVSSnapshotProviderConfig
  ) {}

  getSnapshot(spec: SnapshotSpec, options?: { transitionDurationMs?: number }): MVSData {
    const ctx = this.loadSnapshotSpec(spec);
    const description = ctx.description.join('\n\n');
    const snapshot = ctx.root.getSnapshot({
      title: spec.name,
      description: description,
      linger_duration_ms: 10_000,
      transition_duration_ms: options?.transitionDurationMs,
    });
    return this.MVSDataLib.createMultistate([snapshot], { title: spec.name, description: description });
  }

  private loadSnapshotSpec(spec: SnapshotSpec) {
    switch (spec.kind) {
      case 'pdbconnect_complex':
        return this.loadPdbconnectComplex(spec.params);
      case 'pdbconnect_macromolecule':
        return this.loadPdbconnectMacromolecule(spec.params);
      case 'pdbconnect_all_ligands':
        return this.loadPdbconnectAllLigands(spec.params);
      case 'pdbconnect_ligand':
        return this.loadPdbconnectLigand(spec.params);
      case 'pdbconnect_domains':
        return this.loadPdbconnectDomains(spec.params);
      case 'pdbconnect_modifications':
        return this.loadPdbconnectModifications(spec.params);
      case 'pdbconnect_quality':
        return this.loadPdbconnectQuality(spec.params);
      case 'pdbconnect_environment':
        return this.loadPdbconnectEnvironment(spec.params);
      case 'pdbconnect_text_annotation':
        return this.loadPdbconnectTextAnnotation(spec.params);
      default:
        throw new Error(`Invalid snapshot kind "${(spec as SnapshotSpec).kind}"`);
    }
  }

  private _loadRoot(): { root: Builder.Root } {
    const root = this.MVSDataLib.createBuilder();
    return { root };
  }

  private _loadModel(params: { entry: string }) {
    const ctx = this._loadRoot();

    const model = ctx.root.download({ url: this.config.PdbStructureUrlTemplate.replace('{pdb}', params.entry) }).parse({ format: this.config.PdbStructureFormat });

    return { ...ctx, model };
  }

  /** Create base for all PDBconnect views */
  private _loadPdbconnectBase(params: { entry: string; assemblyId: string | undefined; modelIndex?: number; volumeStreaming: boolean }) {
    const ctx = this._loadModel(params);

    const structureCustomProps: Record<string, any> = {};
    if (params.volumeStreaming) {
      structureCustomProps['molstar_volume_streaming'] = {
        view: 'selection-box', // ensures selection-box (Around Focus) for X-ray and EM
        channel_params: {
          'fo-fc(+ve)': { opacity: 0.49 },
          'fo-fc(-ve)': { opacity: 0.49 },
        },
      };
    }

    const structure =
      params.assemblyId !== undefined
        ? ctx.model.assemblyStructure({ assembly_id: params.assemblyId, model_index: params.modelIndex, custom: structureCustomProps })
        : ctx.model.modelStructure({ model_index: params.modelIndex, custom: structureCustomProps });
    const components = applyStandardComponents(structure);
    const representations = applyStandardRepresentations(components, { opacityFactor: 1 });

    return { ...ctx, structure, components, representations };
  }

  /** Create MVS view for PDBconnect Summary tab > Preferred complex (default view), Complexes tab */
  private loadPdbconnectComplex(params: SnapshotSpecParams['pdbconnect_complex']) {
    const ctx = this._loadPdbconnectBase(params);

    // Apply entity colors
    if (params.entityColors) {
      for (const repr of Object.values(ctx.representations)) {
        applyEntityColors(repr, params.entityColors as Record<string, ColorT>, DEFAULT_ENTITY_COLOR);
        ctx.representations.waterSticks?.color({ color: WATER_COLOR });
      }
    }
    // Apply element colors to atomic representations
    for (const repr of atomicRepresentations(ctx.representations)) {
      applyElementColors(repr);
    }

    const description: string[] = [`## Complex ${params.assemblyId}`, `This is ${assemblyText(params.entry, params.assemblyId)}.`];

    return { ...ctx, description };
  }

  /** Create MVS view for PDBconnect Summary tab > Macromolecules (macromolecule selected), Macromolecules tab */
  private loadPdbconnectMacromolecule(params: SnapshotSpecParams['pdbconnect_macromolecule']) {
    const ctx = this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId, volumeStreaming: params.volumeStreaming });

    const entitySelector: ComponentExpressionT = {
      label_entity_id: params.entityId,
      label_asym_id: params.labelAsymId,
      auth_asym_id: params.authAsymId,
      instance_id: params.instanceId,
    };

    // Apply color to the selected entity
    for (const repr of Object.values(ctx.representations)) {
      repr.color({ selector: entitySelector, color: (params.color as ColorT | undefined) ?? DEFAULT_SELECTED_ENTITY_COLOR });
    }
    // Apply element colors to atomic representations within the selected entity
    for (const repr of atomicRepresentations(ctx.representations)) {
      applyElementColors(repr, entitySelector);
    }
    // Focus the selected entity
    if (params.focus) {
      ctx.structure.component({ selector: entitySelector }).focus(FOCUS_PARAMS.POLYMER);
    }

    const description: string[] = [
      `## Macromolecule ${params.entityId}`,
      `This is macromolecule ${params.entityId} in ${assemblyText(params.entry, params.assemblyId)}.`,
    ];

    return { ...ctx, description };
  }

  /** Create MVS view for PDBconnect Summary tab > Ligands (nothing selected) */
  private loadPdbconnectAllLigands(params: SnapshotSpecParams['pdbconnect_all_ligands']) {
    const ctx = this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId, volumeStreaming: params.volumeStreaming });

    // Add and color spacefill representation for ligands
    for (const entityId of params.ligandEntityIds) {
      const entityColor = (params.entityColors?.[entityId] as ColorT | undefined) ?? DEFAULT_SELECTED_ENTITY_COLOR;
      ctx.structure
        .component({ selector: { label_entity_id: entityId } })
        .representation({ type: 'spacefill' })
        .color({ color: entityColor });
    }
    // Add and color spacefill representation for modified residues
    if (params.modifications) {
      const modresSpacefill = ctx.components.nonstandard?.representation({ type: 'spacefill' });
      for (const mod of params.modifications) {
        modresSpacefill?.color({ selector: { label_comp_id: mod.labelCompId }, color: mod.color as ColorT });
      }
    }

    const description: string[] = [`## All ligands`, `This is overview of all ligands in ${assemblyText(params.entry, params.assemblyId)}.`];

    return { ...ctx, description };
  }

  /** Create MVS view for PDBconnect Summary tab > Ligands (ligand selected) */
  private loadPdbconnectLigand(params: SnapshotSpecParams['pdbconnect_ligand']) {
    const ctx = this.loadPdbconnectComplex({
      entry: params.entry,
      assemblyId: params.assemblyId,
      volumeStreaming: params.volumeStreaming,
      entityColors: params.entityColors,
    });

    // Focus the selected ligand
    if (params.focus) {
      ctx.structure.component({ selector: { label_asym_id: params.labelAsymId, instance_id: params.instanceId } }).focus(FOCUS_PARAMS.RESIDUE);
    }

    const description: string[] = [
      `## Ligand entity ${params.entityId}`,
      `This is ligand entity ${params.entityId} in chain ${params.labelAsymId} (label_asym_id) in ${assemblyText(params.entry, params.assemblyId)}.`,
    ];

    return { ...ctx, description };
  }

  /** Create MVS view for PDBconnect Summary tab > Domains (domain selected), Domains tab */
  private loadPdbconnectDomains(params: SnapshotSpecParams['pdbconnect_domains']) {
    const ctx = this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId, volumeStreaming: params.volumeStreaming });

    for (const domain of params.domains) {
      const selector = domain.selector;
      const color = domain.color as ColorT;
      ctx.representations.polymerCartoon?.color({ selector, color });
      ctx.representations.nonstandardSticks?.color({ selector, color });
      const domainComponent = ctx.structure.component({ selector });
      if (domain.name !== undefined) {
        domainComponent.tooltip({ text: customTooltipText(`<b>Domain: ${domain.name}</b>`) });
      }
      if (params.focus && params.domains.length > 0) {
        domainComponent.focus(FOCUS_PARAMS.POLYMER);
      }
    }

    // Apply element colors to modified residues within domains
    if (ctx.representations.nonstandardSticks) {
      const allDomainsSelector: ComponentExpressionT[] = [];
      for (const domain of params.domains) {
        allDomainsSelector.push(...domain.selector);
      }
      applyElementColors(ctx.representations.nonstandardSticks, allDomainsSelector);
    }

    const description: string[] = [`## Domains`, `This is view of ${params.domains.length} selected domains in ${assemblyText(params.entry, params.assemblyId)}.`];

    return { ...ctx, description };
  }

  /** Create MVS view for PDBconnect Summary tab > Modifications (whether modification selected or not) */
  private loadPdbconnectModifications(params: SnapshotSpecParams['pdbconnect_modifications']) {
    const ctx = this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId, volumeStreaming: params.volumeStreaming });

    // Add tooltips
    for (const mod of params.modifications) {
      ctx.structure
        .component({ selector: { label_comp_id: mod.labelCompId } })
        .tooltip({ text: customTooltipText(`<b>Modified residue ${mod.labelCompId}:</b><br>${mod.name}`) });
    }

    if (params.selected) {
      // SPECIFIC MODIFIED RESIDUE SELECTED
      // Apply entity colors
      if (params.entityColors) {
        for (const repr of Object.values(ctx.representations)) {
          applyEntityColors(repr, params.entityColors as Record<string, ColorT>, DEFAULT_ENTITY_COLOR);
          ctx.representations.waterSticks?.color({ color: WATER_COLOR });
        }
      }
      // Apply colors to modified residues
      for (const mod of params.modifications) {
        ctx.representations.nonstandardSticks?.color({ selector: { label_comp_id: mod.labelCompId }, color: mod.color as ColorT });
      }
      // Apply element colors to atomic representations
      for (const repr of atomicRepresentations(ctx.representations)) {
        applyElementColors(repr);
      }
      // Focus selected modified residue
      if (params.focus) {
        ctx.structure.component({ selector: params.selected }).focus(FOCUS_PARAMS.RESIDUE);
      }
    } else {
      // NO SPECIFIC MODIFIED RESIDUE SELECTED
      // Add and color spacefill representation for modified residues
      const modresSpacefill = ctx.components.nonstandard?.representation({ type: 'spacefill' });
      for (const mod of params.modifications) {
        modresSpacefill?.color({ selector: { label_comp_id: mod.labelCompId }, color: mod.color as ColorT });
      }
    }

    const description: string[] = [`## Modified residues`, `This is view of modified residues in ${assemblyText(params.entry, params.assemblyId)}.`];

    return { ...ctx, description };
  }

  /** Create MVS view for PDBconnect Model Quality tab */
  private loadPdbconnectQuality(params: SnapshotSpecParams['pdbconnect_quality']) {
    const ctx = this._loadPdbconnectBase({
      entry: params.entry,
      assemblyId: params.assemblyId,
      modelIndex: params.modelId - 1,
      volumeStreaming: params.volumeStreaming,
    });

    let description: string[];

    if (params.validationData !== undefined) {
      // VALIDATION AVAILABLE
      // Construct annotation CIF
      const annotationCif = [
        'data_validation',
        'loop_',
        '_validation.label_asym_id',
        '_validation.label_seq_id',
        '_validation.issues', // will contain either number of present issues, or 'y' where a specific issue is present
        '_validation.tooltip',
        '. . . -',
      ];
      for (const molecule of params.validationData) {
        for (const chain of molecule.chains) {
          const model = chain.models.find((m) => m.model_id === params.modelId);
          if (!model) continue;
          for (const residue of model.residues) {
            const issues =
              params.validationType.kind === 'issue_count' ? residue.outlier_types.length : residue.outlier_types.includes(params.validationType.issue) ? 'y' : '.';
            const tooltip = residue.outlier_types.map((type) => params.niceIssueNames?.[type] ?? type).join(', ');
            annotationCif.push(`${chain.struct_asym_id} ${residue.residue_number} ${issues} '${tooltip}'`);
          }
        }
      }
      const annotationUri = 'data:text/plain, ' + annotationCif.join(' ');

      // Color residues by annotation CIF
      for (const repr of Object.values(ctx.representations)) {
        repr.color({ color: params.validationColors[0] as ColorT }); // base color for residues without issues (not listed in the report)
      }
      ctx.representations.polymerCartoon?.colorFromUri({
        uri: annotationUri,
        format: 'cif',
        schema: 'all_atomic',
        category_name: 'validation',
        field_name: 'issues',
        palette: {
          kind: 'categorical',
          colors: Object.fromEntries(params.validationColors.map((color, i) => [i, color as ColorT])),
          missing_color: params.validationColors[params.validationColors.length - 1] as ColorT, // for values higher than number of colors and for value 'y' (specific issue present)
        },
      });
      // Add tooltips
      ctx.structure.tooltipFromUri({
        uri: annotationUri,
        format: 'cif',
        schema: 'all_atomic',
        category_name: 'validation',
        text_format: customTooltipText('<b>Validation issues:</b> {tooltip}'),
      });

      description = [
        `## Validation`,
        `This is view of PDBe Structure Quality Report in ${assemblyText(params.entry, params.assemblyId)}.`,
        params.validationType.kind === 'issue_count'
          ? `Residues are coloured by the number of geometry validation issue types. White - no issues, yellow - one issue type, orange - two issue types, red - three or more issue types.`
          : `Residues are coloured by presence of "${params.validationType.issue}" validation issues. White - no issue, red - has issues.`,
      ];
    } else {
      // VALIDATION NOT AVAILABLE
      for (const repr of Object.values(ctx.representations)) {
        repr.color({ color: '#808080' });
      }
      ctx.structure.component().tooltip({ text: customTooltipText('<b>Validation issues:</b> Data not available') });

      description = [
        `## Validation`,
        `This is view of PDBe Structure Quality Report in ${assemblyText(params.entry, params.assemblyId)}.`,
        `PDBe Structure Quality Report not available for this entry`,
      ];
    }

    return { ...ctx, description };
  }

  /** Create MVS view for PDBconnect Ligands and Environments tab */
  private loadPdbconnectEnvironment(params: SnapshotSpecParams['pdbconnect_environment']) {
    const ctx = this.loadPdbconnectComplex({
      entry: params.entry,
      assemblyId: params.assemblyId,
      volumeStreaming: params.volumeStreaming,
      entityColors: params.entityColors,
    });

    ctx.structure
      .component({
        selector: { auth_asym_id: params.authAsymId, auth_seq_id: params.authSeqId, pdbx_PDB_ins_code: params.authInsCode, instance_id: params.instanceId },
        custom: { molstar_show_non_covalent_interactions: params.atomInteractions === 'builtin' },
      })
      .focus(FOCUS_PARAMS.RESIDUE);

    if (params.atomInteractions !== 'builtin' && params.atomInteractions !== 'none') {
      const primitives = ctx.structure.primitives();
      const interactingAtoms: ComponentExpressionT[] = [];
      for (const interaction of params.atomInteractions) {
        primitives.tube({
          start: { expressions: interaction.start },
          end: { expressions: interaction.end },
          radius: INTERACTION_TUBE_RADIUS,
          dash_length: INTERACTION_TUBE_DASH_LENGTH,
          color: interaction.color as ColorT | undefined,
          tooltip: interaction.tooltip,
        });
        interactingAtoms.push(...interaction.start, ...interaction.end);
      }
      const partnerResiduesRepr = ctx.structure.component({ selector: wholeResidues(interactingAtoms) }).representation({ type: 'ball_and_stick', size_factor: 0.5 });
      if (params.entityColors) {
        applyEntityColors(partnerResiduesRepr, params.entityColors as Record<string, ColorT>, DEFAULT_ENTITY_COLOR);
        ctx.representations.waterSticks?.color({ color: WATER_COLOR });
      }
      applyElementColors(partnerResiduesRepr);
    }

    const description: string[] = [
      `## Ligand environment`,
      `This is ligand environment view for residue auth ${params.authSeqId}${params.authInsCode} in chain auth ${params.authAsymId} in ${assemblyText(
        params.entry,
        params.assemblyId
      )}.`,
    ];
    return { ...ctx, description };
  }

  /** Create MVS view for PDBconnect Text Annotations tab (residue selected) */
  private loadPdbconnectTextAnnotation(params: SnapshotSpecParams['pdbconnect_text_annotation']) {
    const ctx = this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId, volumeStreaming: params.volumeStreaming });

    const annotsInChain = params.annotations.filter((a) => a.pdbChain === params.labelAsymId);
    const annotsByLabelSeqId = groupBy(annotsInChain, (a) => a.pdbResidue);
    const chainSelector: ComponentExpressionT = { label_asym_id: params.labelAsymId, instance_id: params.instanceId };

    // Color selected chain
    if (params.chainColor) {
      ctx.representations.polymerCartoon?.color({ selector: chainSelector, color: params.chainColor as ColorT });
      ctx.representations.nonstandardSticks?.color({ selector: chainSelector, color: params.chainColor as ColorT });
    }

    // Add annotation markers (balls)
    if (params.annotationMarkerColor) {
      const annotMarkerAtomsSelector: ComponentExpressionT[] = Object.keys(annotsByLabelSeqId).map((labelSeqId) => ({
        ...chainSelector,
        label_seq_id: Number(labelSeqId),
        label_atom_id: 'CA',
      }));
      ctx.structure
        .component({ selector: annotMarkerAtomsSelector })
        .representation({ type: 'spacefill', size_factor: 0.6 })
        .opacity({ opacity: 0.8 })
        .color({ color: params.annotationMarkerColor as ColorT });
    }

    // Add tooltips
    for (const labelSeqId in annotsByLabelSeqId) {
      const nAnnots = annotsByLabelSeqId[labelSeqId].length;
      const bestScore = max(annotsByLabelSeqId[labelSeqId].map((a) => a.aiScore));
      const flooredBestScore = Math.floor(bestScore * 100) / 100;
      ctx.structure.component({ selector: { ...chainSelector, label_seq_id: Number(labelSeqId) } }).tooltip({
        text: customTooltipText(
          `<b>${nAnnots} annotation${nAnnots === 1 ? '' : 's'}</b>`,
          `${nAnnots === 1 ? '' : 'Best '} AI score: ${flooredBestScore.toFixed(2)}`
        ),
      });
    }

    // Focus selected chain
    if (params.focus) {
      ctx.structure.component({ selector: chainSelector }).focus(FOCUS_PARAMS.RESIDUE);
    }

    const description: string[] = [
      `## Text annotations`,
      `This is overview of text annotations in chain ${params.labelAsymId} (label_asym_id) in ${assemblyText(params.entry, params.assemblyId)}.`,
    ];

    return { ...ctx, description };
  }
}
