import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { labelGroups } from '../../entry-constant';
import { ResidueWiseOutliersMolecule } from '../../data-models/residuewise-outliers.model';
import { FlatOutlierResidue, OutliersByModelId } from './models/other-models';

export function processFilesData(data: any) {
  const rename: { [key: string]: string } = {
    'Updated mmCIF file': 'mmCIF file (Updated)',
  };
  const order = [
    'mmCIF file (Updated)',
    'Archive mmCIF file',
    'PDBML',
    'PDBML (ATOM lines)',
    'PDBML (no atoms)',
    'FASTA (Entry)',
    'Full report (PDF)',
    'PDB file',
    'PDB file (gz)',
    'Compatible PDB file bundle (tar.gz)',
    'PDB header',
  ];

  let downloads: any[] = [];
  let views: any[] = [];

  Object.keys(data).forEach((key) => {
    if (data[key].downloads) {
      downloads = downloads.concat(data[key].downloads);
    }
    if (data[key].views) {
      views = views.concat(data[key].views);
    }
  });

  for (const fileData of downloads) {
    if (rename[fileData.label]) {
      fileData.label = rename[fileData.label];
    }
  }

  for (const fileData of views) {
    if (rename[fileData.label]) {
      fileData.label = rename[fileData.label];
    }
  }

  downloads.sort((a, b) => {
    const indexA = order.indexOf(a.label);
    const indexB = order.indexOf(b.label);

    if (indexA === -1 && indexB === -1) {
      return 0;
    } else if (indexA === -1) {
      return 1;
    } else if (indexB === -1) {
      return -1;
    } else {
      return indexA - indexB;
    }
  });

  views.sort((a, b) => {
    const indexA = order.indexOf(a.label);
    const indexB = order.indexOf(b.label);

    if (indexA === -1 && indexB === -1) {
      return 0;
    } else if (indexA === -1) {
      return 1;
    } else if (indexB === -1) {
      return -1;
    } else {
      return indexA - indexB;
    }
  });

  const downloadsUpdated = downloads.map((d) => {
    return {
      name: d.label,
      url: d.url,
      downloadable: true,
    };
  });

  const mappedDownloadsUpdated = groupFilesByLabels(labelGroups, downloadsUpdated);

  const viewsUpdated = views.map((d) => {
    return {
      name: d.label,
      url: d.url,
      downloadable: false,
    };
  });

  const mappedViewsUpdated = groupFilesByLabels(labelGroups, viewsUpdated);

  return { downloads: mappedDownloadsUpdated, views: mappedViewsUpdated };
}

export function groupFilesByLabels(labelGroups: Record<string, (string | RegExp)[]>, files: DownloadOption[]) {
  const result: { group: string; items: DownloadOption[] }[] = [];

  for (const [group, patterns] of Object.entries(labelGroups)) {
    const groupItems = files.filter((file) => patterns.some((pattern) => (pattern instanceof RegExp ? pattern.test(file.name) : file.name === pattern)));

    if (groupItems.length > 0) {
      result.push({ group, items: groupItems });
    }
  }

  return result;
}

export function processResidueOutliersData(outliers: ResidueWiseOutliersMolecule[]) {
  const resultByModelId: OutliersByModelId = {};

  for (const molecule of outliers) {
    for (const chain of molecule.chains) {
      for (const model of chain.models) {
        const modelId = model.model_id;

        if (!resultByModelId[modelId]) {
          resultByModelId[modelId] = {
            uniqueOutlierTypes: new Set<string>(),
            molstarSelectionsByOutlierType: {},
            residuesWith1Outlier: [],
            residuesWith2Outliers: [],
            residuesWith3OrMoreOutliers: [],
          };
        }

        // Flatten residues
        const flattenedResidues: FlatOutlierResidue[] = model.residues.map((residue) => ({
          ...residue,
          entity_id: molecule.entity_id,
          chain_id: chain.chain_id,
          struct_asym_id: chain.struct_asym_id,
        }));

        // Update unique outlier types
        flattenedResidues.forEach((residue) => {
          residue.outlier_types.forEach((type) => resultByModelId[modelId].uniqueOutlierTypes.add(type));
        });

        // Build Mol* selections directly here
        const toMolstarSelections = (residues: FlatOutlierResidue[]) =>
          residues.map((eachRes) => ({
            entity_id: eachRes.entity_id + '',
            auth_asym_id: eachRes.chain_id,
            auth_residue_number: eachRes.author_residue_number,
            auth_ins_code_id: eachRes.author_insertion_code || undefined,
          }));

        // Per outlier type
        resultByModelId[modelId].uniqueOutlierTypes.forEach((type) => {
          const residuesForType = flattenedResidues.filter((res) => res.outlier_types.includes(type));
          if (!resultByModelId[modelId].molstarSelectionsByOutlierType[type]) {
            resultByModelId[modelId].molstarSelectionsByOutlierType[type] = [];
          }
          resultByModelId[modelId].molstarSelectionsByOutlierType[type].push(...toMolstarSelections(residuesForType));
        });

        // Group by outlier counts
        const residuesWith1Outlier = flattenedResidues.filter((r) => r.outlier_types.length === 1);
        const residuesWith2Outliers = flattenedResidues.filter((r) => r.outlier_types.length === 2);
        const residuesWith3OrMoreOutliers = flattenedResidues.filter((r) => r.outlier_types.length >= 3);

        resultByModelId[modelId].residuesWith1Outlier.push(...toMolstarSelections(residuesWith1Outlier));
        resultByModelId[modelId].residuesWith2Outliers.push(...toMolstarSelections(residuesWith2Outliers));
        resultByModelId[modelId].residuesWith3OrMoreOutliers.push(...toMolstarSelections(residuesWith3OrMoreOutliers));
      }
    }
  }
  return resultByModelId;
}
