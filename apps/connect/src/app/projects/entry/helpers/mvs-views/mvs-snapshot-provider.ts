import type { MVSData } from 'molstar/lib/extensions/mvs/mvs-data';
import type * as Builder from 'molstar/lib/extensions/mvs/tree/mvs/mvs-builder';
import type { MVSNodeParams } from 'molstar/lib/extensions/mvs/tree/mvs/mvs-tree';
import type { ColorT, ComponentExpressionT } from 'molstar/lib/extensions/mvs/tree/mvs/param-types';
import { DEFAULT_ENTITY_COLOR, WATER_COLOR } from './colors';
import {
  applyElementColors,
  applyEntityColors,
  applyStandardComponents,
  applyStandardRepresentations,
  atomicRepresentations,
  customTooltipText,
  groupBy,
  max,
  StandardRepresentationType,
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

export interface MVSSnapshotProviderConfig {
  /** URL template for PDB structural data, '{pdb}' will be replaced by actual PDB ID. */
  PdbStructureUrlTemplate: string;
  /** Format for PDB structural data. */
  PdbStructureFormat: 'bcif' | 'mmcif' | 'pdb';
}

export class MVSSnapshotProvider {
  constructor(
    /** MVSData library object (from molstar/lib/extensions/mvs/mvs-data) */
    public readonly MVSDataLib: typeof MVSData,
    public readonly config: MVSSnapshotProviderConfig
  ) {}

  async getSnapshot(spec: SnapshotSpec, options?: { transitionDurationMs?: number }): Promise<MVSData> {
    const ctx = await this.loadSnapshotSpec(spec);
    const description = ctx.description;
    description.push('---');
    description.push(`- **View kind:** ${spec.kind}`);
    description.push(`- **View params:** ${JSON.stringify(spec.params, undefined, 1)}`);
    const snapshot = ctx.root.getSnapshot({
      title: spec.name,
      description: description.join('\n\n'),
      linger_duration_ms: 10_000,
      transition_duration_ms: options?.transitionDurationMs,
    });
    return this.MVSDataLib.createMultistate([snapshot], { title: spec.name, description: description.join('\n\n') });
  }

  private async loadSnapshotSpec(spec: SnapshotSpec) {
    switch (spec.kind) {
      case 'pdbconnect_complex':
        return await this.loadPdbconnectComplex(spec.params);
      case 'pdbconnect_macromolecule':
        return await this.loadPdbconnectMacromolecule(spec.params);
      case 'pdbconnect_all_ligands':
        return await this.loadPdbconnectAllLigands(spec.params);
      case 'pdbconnect_ligand':
        return await this.loadPdbconnectLigand(spec.params);
      case 'pdbconnect_domains':
        return await this.loadPdbconnectDomains(spec.params);
      case 'pdbconnect_modifications':
        return await this.loadPdbconnectModifications(spec.params);
      case 'pdbconnect_quality':
        return await this.loadPdbconnectQuality(spec.params);
      case 'pdbconnect_environment':
        return await this.loadPdbconnectEnvironment(spec.params);
      case 'pdbconnect_text_annotation':
        return await this.loadPdbconnectTextAnnotation(spec.params);
      default:
        throw new Error(`Invalid snapshot kind "${(spec as SnapshotSpec).kind}"`);
    }
  }

  private _loadRoot(): { root: Builder.Root } {
    return {
      root: this.MVSDataLib.createBuilder(),
    };
  }

  private _loadModel(params: { entry: string }) {
    const base = this._loadRoot();
    const model = base.root.download({ url: this.config.PdbStructureUrlTemplate.replace('{pdb}', params.entry) }).parse({ format: this.config.PdbStructureFormat });
    return {
      ...base,
      model,
    };
  }

  /** Create base for all PDBconnect views */
  private async _loadPdbconnectBase(params: { entry: string; assemblyId: string | undefined; modelIndex?: number; volumeStreaming: boolean }) {
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
    // TODO Molstar: ball_and_stick size theme physical?
    // TODO compute PCA to orient camera?

    return {
      ...ctx,
      structure,
      components,
      representations,
    };
  }

  /** Create MVS view for PDBconnect Summary tab > Preferred complex (default view), Complexes tab */
  private async loadPdbconnectComplex(params: SnapshotSpecParams['pdbconnect_complex']) {
    const ctx = await this._loadPdbconnectBase(params);
    if (params.entityColors) {
      for (const repr of Object.values(ctx.representations)) {
        applyEntityColors(repr, params.entityColors as Record<string, ColorT>, WATER_COLOR);
      }
    }
    for (const repr of atomicRepresentations(ctx.representations)) {
      applyElementColors(repr);
    }

    const description: string[] = [];

    description.push(`## Complex ${params.assemblyId}`);
    description.push(`This is complex (assembly) ${params.assemblyId}.`);
    return {
      ...ctx,
      description,
    };
  }

  /** Create MVS view for PDBconnect Summary tab > Macromolecules (macromolecule selected), Macromolecules tab */
  private async loadPdbconnectMacromolecule(params: SnapshotSpecParams['pdbconnect_macromolecule']) {
    const ctx = await this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId, volumeStreaming: params.volumeStreaming });

    const entitySelector: ComponentExpressionT = {
      label_entity_id: params.entityId,
      label_asym_id: params.labelAsymId,
      auth_asym_id: params.authAsymId,
      instance_id: params.instanceId,
    };

    for (const repr of Object.values(ctx.representations)) {
      repr.color({ selector: entitySelector, color: (params.color as ColorT | undefined) ?? DEFAULT_ENTITY_COLOR });
    }
    for (const repr of atomicRepresentations(ctx.representations)) {
      applyElementColors(repr, entitySelector);
    }
    if (params.focus) {
      ctx.structure.component({ selector: entitySelector }).focus(FOCUS_PARAMS.POLYMER);
    }

    // const entityType = decideEntityType(entities[params.entityId]);
    // const entityComponents = applyStandardComponentsForChain(base.structure, params.labelAsymId, params.instanceId, entityType, { modifiedResidues });
    // for (const comp of Object.values(entityComponents)) {
    //     comp.focus(FOCUS_PARAMS.POLYMER);
    // }
    // const entityRepresentations = applyStandardRepresentations(entityComponents, { opacityFactor: 1, sizeFactor: 1.05, custom: CustomDataForEmissivePulse, refPrefix: 'highlighted' });
    // for (const repr of Object.values(entityRepresentations)) {
    //     repr.color({ color: entityColors[params.entityId] });
    // }
    // for (const repr of atomicRepresentations(entityRepresentations)) {
    //     applyElementColors(repr);
    // }
    // base.root.animation({})
    //     .interpolate(makeEmissivePulse('highlighted_polymerCartoon'))
    //     .interpolate(makeEmissivePulse('highlighted_nonstandardSticks'));

    const description: string[] = [];
    description.push(`## Macromolecule ${params.entityId}`);
    const assemblyText = params.assemblyId === undefined ? 'the deposited model' : `complex (assembly) ${params.assemblyId}`;
    description.push(`This is macromolecule ${params.entityId} in ${assemblyText}.`);
    return {
      ...ctx,
      description,
    };
  }

  /** Create MVS view for PDBconnect Summary tab > Ligands (nothing selected) */
  private async loadPdbconnectAllLigands(params: SnapshotSpecParams['pdbconnect_all_ligands']) {
    const ctx = await this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId, volumeStreaming: params.volumeStreaming });

    for (const entityId of params.ligandEntityIds) {
      const entityColor = (params.entityColors?.[entityId] as ColorT | undefined) ?? DEFAULT_ENTITY_COLOR;
      ctx.structure
        .component({ selector: { label_entity_id: entityId } })
        .representation({ type: 'spacefill' })
        .color({ color: entityColor });
    }

    const description: string[] = [];
    description.push(`## All ligands`);
    const assemblyText = params.assemblyId === undefined ? 'the deposited model' : `complex (assembly) ${params.assemblyId}`;
    description.push(`Overview of all ligands in ${assemblyText}.`);
    return {
      ...ctx,
      description,
    };
  }

  /** Create MVS view for PDBconnect Summary tab > Ligands (ligand selected) */
  private async loadPdbconnectLigand(params: SnapshotSpecParams['pdbconnect_ligand']) {
    const ctx = await this.loadPdbconnectComplex({
      entry: params.entry,
      assemblyId: params.assemblyId,
      volumeStreaming: params.volumeStreaming,
      entityColors: params.entityColors,
    });

    if (params.focus) {
      ctx.structure.component({ selector: { label_asym_id: params.labelAsymId, instance_id: params.instanceId } }).focus(FOCUS_PARAMS.RESIDUE);
    }

    const description: string[] = [];
    description.push(`## Ligand entity ${params.entityId}`);
    const assemblyText = params.assemblyId === undefined ? 'the deposited model' : `complex (assembly) ${params.assemblyId}`;
    description.push(`This is ligand entity ${params.entityId} in chain ${params.labelAsymId} (label_asym_id) in ${assemblyText}.`);
    return {
      ...ctx,
      description,
    };
  }

  /** Create MVS view for PDBconnect Summary tab > Domains (domain selected), Domains tab */
  private async loadPdbconnectDomains(params: SnapshotSpecParams['pdbconnect_domains']) {
    const ctx = await this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId, volumeStreaming: params.volumeStreaming });

    const allDomainsSelector: ComponentExpressionT[] = [];
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
      allDomainsSelector.push(...selector);
    }
    if (ctx.representations.nonstandardSticks) {
      applyElementColors(ctx.representations.nonstandardSticks, allDomainsSelector);
    }

    const description: string[] = [];
    description.push(`## Domains`);
    return {
      ...ctx,
      description,
    };
  }

  /** Create MVS view for PDBconnect Summary tab > Modifications (whether modification selected or not) */
  private async loadPdbconnectModifications(params: SnapshotSpecParams['pdbconnect_modifications']) {
    const ctx = await this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId, volumeStreaming: params.volumeStreaming });

    for (const mod of params.modifications) {
      ctx.structure
        .component({ selector: { label_comp_id: mod.labelCompId } })
        .tooltip({ text: customTooltipText(`<b>Modified residue ${mod.labelCompId}:</b><br>${mod.name}`) });
    }

    if (params.selected) {
      for (const [reprName, repr] of Object.entries(ctx.representations)) {
        if (params.entityColors) {
          applyEntityColors(repr, params.entityColors as Record<string, ColorT>, WATER_COLOR);
        }
        if ((reprName as StandardRepresentationType) === 'nonstandardSticks') {
          for (const mod of params.modifications) {
            repr.color({ selector: { label_comp_id: mod.labelCompId }, color: mod.color as ColorT });
          }
        }
      }
      for (const repr of atomicRepresentations(ctx.representations)) {
        applyElementColors(repr);
      }
      if (params.focus) {
        ctx.structure.component({ selector: params.selected }).focus(FOCUS_PARAMS.RESIDUE);
      }
    }

    if (!params.selected && ctx.components.nonstandard) {
      const modresSpacefill = ctx.components.nonstandard.representation({ type: 'spacefill' });
      for (const mod of params.modifications) {
        modresSpacefill.color({ selector: { label_comp_id: mod.labelCompId }, color: mod.color as ColorT });
      }
    }

    const description: string[] = [`## Modified residues`];
    return {
      ...ctx,
      description,
    };
  }

  /** Create MVS view for PDBconnect Model Quality tab */
  private async loadPdbconnectQuality(params: SnapshotSpecParams['pdbconnect_quality']) {
    // TODO: @adam Fix tooltips for Specific issue
    // TODO: @adam Nice-format and sort issue names in tooltips
    const ctx = await this._loadPdbconnectBase({
      entry: params.entry,
      assemblyId: params.assemblyId,
      modelIndex: params.modelId - 1,
      volumeStreaming: params.volumeStreaming,
    });
    const assemblyText = params.assemblyId === undefined ? 'the deposited model' : `complex (assembly) ${params.assemblyId}`;

    const description: string[] = [];
    description.push(`## Validation`);

    if (params.validationData !== undefined) {
      // Validation available
      const annotationCif = [
        'data_validation',
        'loop_',
        '_validation.label_asym_id',
        '_validation.label_seq_id',
        '_validation.class', // will contain either number of present issues, or 'y' where a specific issue is present
        '_validation.tooltip',
        '. . . -',
      ];
      for (const molecule of params.validationData) {
        for (const chain of molecule.chains) {
          const model = chain.models.find((m) => m.model_id === params.modelId);
          if (!model) continue;
          for (const residue of model.residues) {
            const class_ =
              params.validationType.kind === 'issue_count'
                ? residue.outlier_types.length
                : residue.outlier_types.includes(params.validationType.issue)
                  ? 'y'
                  : undefined;
            if (class_ !== undefined) {
              annotationCif.push(`${chain.struct_asym_id} ${residue.residue_number} ${class_} '${residue.outlier_types.join(', ')}'`);
            }
          }
        }
      }
      const annotationUri = 'data:text/plain, ' + annotationCif.join(' ');

      for (const repr of Object.values(ctx.representations)) {
        repr.color({ color: params.validationColors[0] as ColorT }); // base color for residues without issues (not listed in the report)
      }
      ctx.representations.polymerCartoon?.colorFromUri({
        uri: annotationUri,
        format: 'cif',
        schema: 'all_atomic',
        category_name: 'validation',
        field_name: 'class',
        palette: {
          kind: 'categorical',
          colors: Object.fromEntries(params.validationColors.map((color, i) => [i, color as ColorT])),
          missing_color: params.validationColors[params.validationColors.length - 1] as ColorT, // for values higher than number of colors and for value 'y' (specific issue present)
        },
      });
      ctx.structure.tooltipFromUri({
        uri: annotationUri,
        format: 'cif',
        schema: 'all_atomic',
        category_name: 'validation',
        text_format: customTooltipText('<b>Validation issues:</b> {tooltip}'),
      });
      if (params.validationType.kind === 'issue_count') {
        description.push(
          `**PDBe Structure Quality Report:** Residues are coloured by the number of geometry validation issue types. White - no issues, yellow - one issue type, orange - two issue types, red - three or more issue types.`
        );
      } else {
        description.push(
          `**PDBe Structure Quality Report:** Residues are coloured by presence of "${params.validationType.issue}" validation issues. White - no issue, red - has issues.`
        );
      }
      description.push(`Displaying ${assemblyText}.`);
    } else {
      // Validation not available
      for (const repr of Object.values(ctx.representations)) {
        repr.color({ color: '#808080' });
      }
      ctx.structure.component().tooltip({ text: customTooltipText('<b>Validation issues:</b> Data not available') });
      description.push(`PDBe Structure Quality Report not available for this entry.`);
      description.push(`Displaying ${assemblyText}.`);
    }
    return {
      ...ctx,
      description,
    };
  }

  /** Create MVS view for PDBconnect Ligands and Environments tab */
  private async loadPdbconnectEnvironment(params: SnapshotSpecParams['pdbconnect_environment']) {
    const ctx = await this.loadPdbconnectComplex({
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
        applyEntityColors(partnerResiduesRepr, params.entityColors as Record<string, ColorT>, WATER_COLOR);
      }
      applyElementColors(partnerResiduesRepr);
    }
    // TODO: @adam we don't have data for non-preferred-assembly ligands (e.g. 1og5 chain B) - decide what to do (current PDBconnect falls back to builtin, but that's confusing IMHO)

    const description: string[] = [];
    description.push(`## Residue environment for auth ${params.authAsymId} ${params.authSeqId}${params.authInsCode} `);
    const assemblyText = params.assemblyId === undefined ? 'the deposited model' : `complex(assembly) ${params.assemblyId} `;
    description.push(`This is residue auth ${params.authSeqId}${params.authInsCode} in chain auth ${params.authAsymId} in ${assemblyText}.`);
    return {
      ...ctx,
      description,
    };
  }

  /** Create MVS view for PDBconnect Text Annotations tab (residue selected) */
  private async loadPdbconnectTextAnnotation(params: SnapshotSpecParams['pdbconnect_text_annotation']) {
    const ctx = await this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId, volumeStreaming: params.volumeStreaming });

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

    const description: string[] = [];
    const assemblyText = params.assemblyId === undefined ? 'the deposited model' : `complex (assembly) ${params.assemblyId}`;

    description.push(`## Text annotations in chain ${params.labelAsymId}`);
    description.push(`Showing chain ${params.labelAsymId} (label_asym_id) in ${assemblyText}.`);
    return {
      ...ctx,
      description,
    };
  }
}
