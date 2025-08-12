/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from '@angular/core';
import { MacromoleculesRowData } from '../../data-classes/data-models-and-definitions/row-and-table.model';
import { EntryApiService } from '../../services/entry-api.service';
import { LLMAnnotation } from '../../data-models/llm-model';
import { SmartSequenceAnnotation } from '@pdbe-lib/smart-seq-viewer';
import { SequenceDetail } from '../../data-classes/data-models-and-definitions/other-models';

@Injectable({
  providedIn: 'root',
})
export class LLMAnnotationsFacade {
  public readonly entryApiService = inject(EntryApiService);

  public getMacromoleculeSequenceDetails(entryId: string, datum: MacromoleculesRowData, dropdownSelected: string) {
    const entity = datum.additionalData.molecule;
    const seq = entity.sequence;
    const sequenceDetails: SequenceDetail[] = [];
    if (seq) {
      sequenceDetails.push({
        title: `>FASTA pdb|${entryId}|${entity.molecule_name[0]}; ${dropdownSelected}`,
        fullSequence: seq,
        segments: [{ sequence: seq }],
      });
    }
    return sequenceDetails;
  }

  public groupByPdbChain(data: any) {
    return data.reduce((acc: any, item: any) => {
      const chain = item.pdbChain;
      if (!acc[chain]) {
        acc[chain] = [];
      }
      acc[chain].push(item);
      return acc;
    }, {});
  }

  public removeDuplicatesByKey(array: any[], key: string): any[] {
    const seen = new Set();
    return array.filter((item) => {
      const keyValue = item[key];
      if (seen.has(keyValue)) {
        return false;
      }
      seen.add(keyValue);
      return true;
    });
  }

  public getCircleAnnotationsForSeqViewer(groupedLLMAnnotations: LLMAnnotation[]): SmartSequenceAnnotation {
    // Sort by pdbResidue ascending
    const llmAnnotationDataForSeqViewer = groupedLLMAnnotations
      .slice() // avoid mutating original
      .sort((a, b) => a.pdbResidue - b.pdbResidue)
      .filter((annotation, index, self) => index === self.findIndex((a) => a.pdbResidue === annotation.pdbResidue))
      // .map((resid) => resid.authorResidueNumber);
      .map((annotation) => {
        const annotationsForResidue = groupedLLMAnnotations.filter((eachAnnotation) => eachAnnotation.pdbResidue === annotation.pdbResidue);
        const annotationsForResidueNoDup = this.removeDuplicatesByKey(annotationsForResidue, 'sentence');
        return {
          residueIndex: annotation.pdbResidue,
          value: 'has annotation',
          extraData: annotationsForResidueNoDup,
        };
      });

    return {
      name: 'Text Annotation (AI)',
      identifier: 'pdbe-llm-annotation',
      scaleType: 'ordinal',
      scaleDomain: ['has annotation'],
      scaleRange: ['#4E81C3'],
      rendering: 'CircleAbove',
      data: llmAnnotationDataForSeqViewer,
    };
  }
}
