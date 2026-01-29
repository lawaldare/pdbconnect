import type { MVSData } from 'molstar/lib/extensions/mvs/mvs-data';
import type * as Builder from 'molstar/lib/extensions/mvs/tree/mvs/mvs-builder';
import type { ColorT, ComponentExpressionT } from 'molstar/lib/extensions/mvs/tree/mvs/param-types';
import { ATOM_INTERACTION_COLORS, CHAIN_ANNOTATED_COLOR, RESIDUE_ANNOTATED_COLOR, RESIDUE_HIGHLIGHT_COLOR, VALIDATION_COLORS } from './colors';
import type { IDataProvider } from './data-provider';
import {
  applyElementColors,
  applyEntityColors,
  applyStandardComponents,
  applyStandardRepresentations,
  atomicRepresentations,
  entityIsLigand,
  getEntityColors,
  max,
  normalizeInsertionCode,
  StandardRepresentationType,
  unique,
} from './helpers';
import { type SnapshotSpec, type SnapshotSpecParams } from './mvs-snapshot-types';

/** Radius factor for focusing ligands and modified residues (radius = (bounding sphere radius) * factor + extent) */
const FOCUS_RADIUS_FACTOR = 1;
/** Radius extent for focusing ligands and modified residues (radius = (bounding sphere radius) * factor + extent) */
const FOCUS_RADIUS_EXTENT = 2.5;
/** Tube radius for atom interactions */
const INTERACTION_TUBE_RADIUS = 0.075;
/** Tube dash length for atom interactions */
const INTERACTION_TUBE_DASH_LENGTH = 0.1;
/** Nice names for atom interaction types */
const INTERACTION_NICE_NAMES: Record<string, string> = {
  clash: 'Covalent clash',
  covalent: 'Covalent',
  vdw_clash: 'Van der Waals clash',
  vdw: 'Van der Waals',
  hbond: 'Hydrogen bond',
  xbond: 'Halogen bond',
  ionic: 'Ionic',
  metal_complex: 'Metal complex',
  aromatic: 'Aromatic',
  FF: 'Plane-Plane',
  hydrophobic: 'Hydrophobic',
  carbonyl: 'Carbonyl',
  polar: 'Polar',
  CARBONPI: 'Carbon-pi',
  CATIONPI: 'Cation-pi',
  DONORPI: 'Hydrogen bond donor-pi',
  HALOGENPI: 'Halogen-pi',
  METSULPHURPI: 'Methionine sulphur-pi',
  plane_plane: 'Plane-Plane',
  AMIDEAMIDE: 'Amide-Amide',
  AMIDERING: 'Amide-Ring',
  weak_polar: 'Weak polar',
  weak_hbond: 'Weak hydrogen bond',
};

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
    public readonly dataProvider: IDataProvider,
    public readonly config: MVSSnapshotProviderConfig
  ) {}

  async getSnapshot(spec: SnapshotSpec): Promise<MVSData> {
    const ctx = await this.loadSnapshotSpec(spec);
    const description = ctx.description;
    description.push('---');
    description.push(`- **View kind:** ${spec.kind}`);
    description.push(`- **View params:** ${JSON.stringify(spec.params, undefined, 1)}`);
    const snapshot = ctx.root.getSnapshot({ title: spec.name, description: description.join('\n\n'), linger_duration_ms: 10_000, transition_duration_ms: 500 });
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
  private async _loadPdbconnectBase(params: { entry: string; assemblyId: string | undefined }) {
    const ctx = this._loadModel(params);

    const structure = params.assemblyId !== undefined ? ctx.model.assemblyStructure({ assembly_id: params.assemblyId }) : ctx.model.modelStructure();
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
    const entities = await this.dataProvider.entities(params.entry);
    const entityColors = getEntityColors(entities);
    for (const repr of Object.values(ctx.representations)) {
      applyEntityColors(repr, entityColors);
    }
    for (const repr of atomicRepresentations(ctx.representations)) {
      applyElementColors(repr);
    }

    const description: string[] = [];

    description.push(`## Complex ${params.assemblyId}`);
    description.push(`This is complex (assembly) ${params.assemblyId}.`);
    return {
      ...ctx,
      metadata: {
        entities,
        entityColors,
      },
      description,
    };
  }

  /** Create MVS view for PDBconnect Summary tab > Macromolecules (macromolecule selected), Macromolecules tab */
  private async loadPdbconnectMacromolecule(params: SnapshotSpecParams['pdbconnect_macromolecule']) {
    const ctx = await this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId });

    const entities = await this.dataProvider.entities(params.entry);
    const entityColors = getEntityColors(entities);
    const entitySelector: ComponentExpressionT = {
      label_entity_id: params.entityId,
      label_asym_id: params.labelAsymId,
      auth_asym_id: params.authAsymId,
      instance_id: params.instanceId,
    };

    for (const repr of Object.values(ctx.representations)) {
      repr.color({ selector: entitySelector, color: entityColors[params.entityId] });
    }
    for (const repr of atomicRepresentations(ctx.representations)) {
      applyElementColors(repr, entitySelector);
    }
    if (params.focus) {
      ctx.structure.component({ selector: entitySelector }).focus();
    }

    // const entityType = decideEntityType(entities[params.entityId]);
    // const entityComponents = applyStandardComponentsForChain(base.structure, params.labelAsymId, params.instanceId, entityType, { modifiedResidues });
    // for (const comp of Object.values(entityComponents)) {
    //     comp.focus();
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
    const ctx = await this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId });

    const entities = await this.dataProvider.entities(params.entry);
    const entityColors = getEntityColors(entities);
    for (const entityId in entities) {
      const entity = entities[entityId];
      const entityColor = entityColors[entityId];
      if (entityIsLigand(entity)) {
        ctx.structure
          .component({ selector: { label_entity_id: entity.id } })
          .representation({ type: 'spacefill' })
          .color({ color: entityColor });
      }
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
    const ctx = await this.loadPdbconnectComplex({ entry: params.entry, assemblyId: params.assemblyId });
    const { entities } = ctx.metadata;

    if (params.focus) {
      ctx.structure
        .component({ selector: { label_asym_id: params.labelAsymId, instance_id: params.instanceId } })
        .focus({ radius_factor: FOCUS_RADIUS_FACTOR, radius_extent: FOCUS_RADIUS_EXTENT });
    }

    const description: string[] = [];
    description.push(`## Ligand entity ${params.entityId}`);
    const assemblyText = params.assemblyId === undefined ? 'the deposited model' : `complex (assembly) ${params.assemblyId}`;
    description.push(
      `This is ligand entity ${params.entityId} **${entities[params.entityId].compIds[0]}** in chain ${params.labelAsymId} (label_asym_id) in ${assemblyText}.`
    );
    return {
      ...ctx,
      description,
    };
  }

  /** Create MVS view for PDBconnect Summary tab > Domains (domain selected), Domains tab */
  private async loadPdbconnectDomains(params: SnapshotSpecParams['pdbconnect_domains']) {
    const ctx = await this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId });

    const allDomainsSelector: ComponentExpressionT[] = [];
    for (const domain of params.domains) {
      const selector = domain.selector;
      const color = domain.color as ColorT;
      ctx.representations.polymerCartoon?.color({ selector, color });
      ctx.representations.nonstandardSticks?.color({ selector, color });
      const domainComponent = ctx.structure.component({ selector });
      if (domain.name !== undefined) domainComponent.tooltip({ text: `Domain: ${domain.name}` });
      if (params.focus && params.domains.length > 0) domainComponent.focus();
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
    const ctx = await this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId });

    for (const mod of params.modifications) {
      ctx.structure.component({ selector: { label_comp_id: mod.labelCompId } }).tooltip({ text: `<hr><b>Modified residue ${mod.labelCompId}:</b><br>${mod.name}` });
    }

    if (params.selected) {
      const entities = await this.dataProvider.entities(params.entry);
      const entityColors = getEntityColors(entities);
      for (const [reprName, repr] of Object.entries(ctx.representations)) {
        applyEntityColors(repr, entityColors);
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
        ctx.structure.component({ selector: params.selected }).focus({ radius_factor: FOCUS_RADIUS_FACTOR, radius_extent: FOCUS_RADIUS_EXTENT });
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
    const ctx = await this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId });
    const assemblyText = params.assemblyId === undefined ? 'the deposited model' : `complex (assembly) ${params.assemblyId}`;

    const description: string[] = [];
    description.push(`## Validation`);
    const validationReport = await this.dataProvider.pdbeStructureQualityReport(params.entry);
    if (validationReport !== undefined) {
      const annotationCif = [
        'data_validation',
        'loop_',
        '_validation.label_asym_id',
        '_validation.label_seq_id',
        '_validation.class',
        '_validation.tooltip',
        '. . 0 OK',
      ];
      for (const molecule of validationReport.molecules) {
        for (const chain of molecule.chains) {
          for (const residue of chain.models[0].residues) {
            const class_ =
              params.validation_type === 'issue_count'
                ? Math.min(residue.outlier_types.length, 3)
                : residue.outlier_types.includes(params.validation_type)
                  ? 'y'
                  : undefined;
            if (class_) {
              annotationCif.push(`${chain.struct_asym_id} ${residue.residue_number} ${class_} '${residue.outlier_types.join(', ')}'`);
            }
          }
        }
      }
      const annotationUri = 'data:text/plain, ' + annotationCif.join(' ');
      for (const repr of Object.values(ctx.representations)) {
        repr.color({ color: VALIDATION_COLORS[0] }); // base color for residues without issues (not listed in the report)
      }
      ctx.representations.polymerCartoon?.colorFromUri({
        uri: annotationUri,
        format: 'cif',
        schema: 'all_atomic',
        category_name: 'validation',
        field_name: 'class',
        palette: {
          kind: 'categorical',
          colors: { '0': VALIDATION_COLORS[0], '1': VALIDATION_COLORS[1], '2': VALIDATION_COLORS[2], '3': VALIDATION_COLORS[3], y: VALIDATION_COLORS.HAS_ISSUE },
        },
      });
      ctx.structure.component().tooltip({ text: '<hr>Validation:' });
      ctx.structure.tooltipFromUri({ uri: annotationUri, format: 'cif', schema: 'all_atomic', category_name: 'validation', field_name: 'tooltip' });
      if (params.validation_type === 'issue_count') {
        description.push(
          `**PDBe Structure Quality Report:** Residues are coloured by the number of geometry validation issue types. White - no issues, yellow - one issue type, orange - two issue types, red - three or more issue types.`
        );
      } else {
        description.push(
          `**PDBe Structure Quality Report:** Residues are coloured by presence of "${params.validation_type}" validation issues. White - no issue, red - has issues.`
        );
      }
      description.push(`Displaying ${assemblyText}.`);
    } else {
      for (const repr of Object.values(ctx.representations)) {
        repr.color({ color: VALIDATION_COLORS.NOT_APPLICABLE });
      }
      ctx.structure.component().tooltip({ text: '<hr>Validation: Not available' });
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
    const ctx = await this.loadPdbconnectComplex({ entry: params.entry, assemblyId: params.assemblyId });
    const { entityColors } = ctx.metadata;

    ctx.structure
      .component({
        selector: { auth_asym_id: params.authAsymId, auth_seq_id: params.authSeqId, pdbx_PDB_ins_code: params.authInsCode, instance_id: params.instanceId },
        custom: { molstar_show_non_covalent_interactions: params.atomInteractions === 'builtin' },
      })
      .focus({ radius_factor: FOCUS_RADIUS_FACTOR, radius_extent: FOCUS_RADIUS_EXTENT });

    if (params.atomInteractions === 'api') {
      const atomInteractions = await this.dataProvider.atomInteractions(params.entry, params.authAsymId, params.authSeqId);
      const partnerResidues: { auth_asym_id: string; auth_seq_id: number; pdbx_PDB_ins_code?: string; instance_id?: string }[] = [];
      const primitives = ctx.structure.primitives();
      for (const { interactions, ligand } of atomInteractions) {
        for (const int of interactions) {
          const details = int.interaction_details;
          const color = details.length === 1 ? ATOM_INTERACTION_COLORS[details[0]] ?? ATOM_INTERACTION_COLORS['_DEFAULT_'] : ATOM_INTERACTION_COLORS['_MIXED_'];
          // TODO: @adam pass colors from frontend (also for entities, domains etc)
          const formatInteractionType = (type: string) => INTERACTION_NICE_NAMES[type] ?? type;
          const tooltipHeader =
            details.length === 1
              ? `<strong>${formatInteractionType(details[0])} interaction</strong>`
              : `<strong>Mixed interaction</strong><br>${details.map(formatInteractionType).join(', ')}`;
          const tooltipLigand = `<strong>${ligand.chem_comp_id} ${ligand.author_residue_number}${
            ligand.author_insertion_code?.trim() ?? ''
          }</strong> | ${int.ligand_atoms.join(', ')}`;
          const tooltipPartner = `<strong>${int.end.chem_comp_id} ${int.end.author_residue_number}${
            int.end.author_insertion_code?.trim() ?? ''
          }</strong> | ${int.end.atom_names.join(', ')}`;
          const tooltip = `${tooltipHeader}<br>${tooltipLigand} — ${tooltipPartner}`;
          const ligandSelector: ComponentExpressionT[] = int.ligand_atoms.map((atom) => ({
            auth_asym_id: ligand.chain_id,
            auth_seq_id: ligand.author_residue_number,
            pdbx_PDB_ins_code: normalizeInsertionCode(ligand.author_insertion_code),
            auth_atom_id: atom,
            instance_id: params.instanceId,
          }));
          const partnerSelector: ComponentExpressionT[] = int.end.atom_names.map((atom) => ({
            auth_asym_id: int.end.chain_id,
            auth_seq_id: int.end.author_residue_number,
            pdbx_PDB_ins_code: normalizeInsertionCode(int.end.author_insertion_code),
            auth_atom_id: atom,
            instance_id: params.instanceId,
          }));
          primitives.tube({
            start: { expressions: ligandSelector },
            end: { expressions: partnerSelector },
            radius: INTERACTION_TUBE_RADIUS,
            dash_length: INTERACTION_TUBE_DASH_LENGTH,
            color: color,
            tooltip: tooltip,
          });
          partnerResidues.push({
            auth_asym_id: int.end.chain_id,
            auth_seq_id: int.end.author_residue_number,
            pdbx_PDB_ins_code: normalizeInsertionCode(int.end.author_insertion_code),
            instance_id: params.instanceId,
          });
        }
      }
      const partnerResiduesRepr = ctx.structure
        .component({ selector: unique(partnerResidues, (r) => `${r.auth_asym_id}:${r.auth_seq_id}:${r.pdbx_PDB_ins_code ?? ''}:${r.instance_id ?? ''}`) })
        .representation({ type: 'ball_and_stick', size_factor: 0.5 });
      applyEntityColors(partnerResiduesRepr, entityColors);
      applyElementColors(partnerResiduesRepr);
    }
    // TODO: @adam volumes
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
    const ctx = await this._loadPdbconnectBase({ entry: params.entry, assemblyId: params.assemblyId });

    const chainSelector: ComponentExpressionT = { label_asym_id: params.labelAsymId, instance_id: params.instanceId };
    const residueSelector: ComponentExpressionT = { ...chainSelector, label_seq_id: params.labelSeqId };

    const chainHighlightColor = CHAIN_ANNOTATED_COLOR;
    ctx.representations.polymerCartoon?.color({ selector: chainSelector, color: chainHighlightColor });
    ctx.representations.nonstandardSticks?.color({ selector: chainSelector, color: chainHighlightColor });

    const annots = await this.dataProvider.llmAnnotations(params.entry);
    const chainAnnots = annots[params.entityId][params.labelAsymId];
    const annotResiduesSelector: ComponentExpressionT[] = Object.keys(chainAnnots).map((labelSeqId) => ({ ...chainSelector, label_seq_id: Number(labelSeqId) }));
    ctx.representations.polymerCartoon?.color({ selector: annotResiduesSelector, color: RESIDUE_ANNOTATED_COLOR });
    ctx.representations.nonstandardSticks?.color({ selector: annotResiduesSelector, color: RESIDUE_ANNOTATED_COLOR });
    for (const labelSeqId in chainAnnots) {
      const nAnnots = chainAnnots[labelSeqId].length;
      const bestScore = max(chainAnnots[labelSeqId].map((a) => a.aiScore));
      const flooredBestScore = Math.floor(bestScore * 100) / 100;
      ctx.structure
        .component({ selector: { ...chainSelector, label_seq_id: Number(labelSeqId) } })
        .tooltip({ text: `<hr>${nAnnots} annotation${nAnnots === 1 ? '' : 's'}, ${nAnnots === 1 ? '' : 'best '} AI score ${flooredBestScore.toFixed(2)}` });
    }

    if (params.labelSeqId !== undefined) {
      ctx.representations.polymerCartoon?.color({ selector: residueSelector, color: RESIDUE_HIGHLIGHT_COLOR });
      ctx.representations.nonstandardSticks?.color({ selector: residueSelector, color: RESIDUE_HIGHLIGHT_COLOR });
      const residueSticks = ctx.structure
        .component({ selector: residueSelector })
        .representation({ type: 'ball_and_stick', size_factor: 1.05 })
        .color({ color: RESIDUE_HIGHLIGHT_COLOR });
      applyElementColors(residueSticks);
      ctx.structure.component({ selector: residueSelector, custom: { molstar_show_non_covalent_interactions: true } });
    }

    for (const repr of atomicRepresentations(ctx.representations)) {
      applyElementColors(repr);
    }
    ctx.structure.component({ selector: residueSelector }).focus({ radius_factor: FOCUS_RADIUS_FACTOR, radius_extent: FOCUS_RADIUS_EXTENT });
    // TODO: @adam volumes

    const description: string[] = [];
    const assemblyText = params.assemblyId === undefined ? 'the deposited model' : `complex (assembly) ${params.assemblyId}`;
    if (params.labelSeqId !== undefined) {
      description.push(`## Text annotations in chain ${params.labelAsymId} residue ${params.labelSeqId}`);
      description.push(`Showing chain ${params.labelAsymId} (label_asym_id) residue ${params.labelSeqId} (label_seq_id) in ${assemblyText}.`);
    } else {
      description.push(`## Text annotations in chain ${params.labelAsymId}`);
      description.push(`Showing chain ${params.labelAsymId} (label_asym_id) in ${assemblyText}.`);
    }
    return {
      ...ctx,
      description,
    };
  }
}
