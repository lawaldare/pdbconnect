import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, AfterViewChecked } from '@angular/core';
declare const d3: any;
declare const gtag: any;

@Component({
  selector: 'pdbc-key-features-list',
  templateUrl: './key-features-list.component.html',
  styleUrls: ['./key-features-list.component.scss'],
  imports: [CommonModule],
})
export class KeyFeaturesListComponent implements OnInit {
  slides = [
    {
      title: 'Experimental and Predicted Protein Structures',
      src: 'assets/img/experimental_and_predicted2.png',
      details:
        "<div>Compare the superposed structures of protein chains and AlphaFold predictions by clicking on the “3D-view of superposed structures” button on PDBe-KB pages. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P15291/structures'>View example</a></div>",
      div_content:
        'Compare the superposed structures of protein chains and AlphaFold predictions by clicking on the “3D-view of superposed structures” button on PDBe-KB pages. ',
      anchor_content: 'View example',
      event_label: 'features_exp_pred',
      example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P15291/structures',
    },
    {
      title: 'Superposition of Protein Chains and Ligands',
      src: 'assets/img/superimposition2.png',
      details:
        "<div>Overlay all the observed bound molecules on representative conformations of a protein segment across the complete PDB archive. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P24666/structures'>View example</a> <div style='font-size: 12px'>(Click button <i>\"3D view of superposed structures\"</i>)</div></div>",
      div_content: 'Overlay all the observed bound molecules on representative conformations of a protein segment across the complete PDB archive. ',
      anchor_content: 'View example',
      event_label: 'features_superposition',
      example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P24666/structures',
    },
    {
      title: 'Functional and Biophysical Annotations',
      // src: "assets/img/biophysical_annotations.png",
      src: 'assets/img/wordcloud2.png',
      details:
        "<div>PDBe-KB partners provide a wide array of functional and biophysical annotations for proteins and small molecules. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/Q07009/annotations'>PDB ProtVista.</a></div>",
      div_content: 'PDBe-KB partners provide a wide array of functional and biophysical annotations for proteins and small molecules. ',
      anchor_content: 'PDB ProtVista.',
      event_label: 'features_functional_biophys',
      example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/Q07009/annotations',
    },
    {
      title: 'Macromolecular Interaction Interfaces',
      src: 'assets/img/interfaces_example2.png',
      details:
        "<div>Macromolecular interaction interface information calculated using PDBe PISA, and displayed as per residue annotations. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P54764/interactions'>View example</a></div>",
      div_content: 'Macromolecular interaction interface information calculated using PDBe PISA, and displayed as per residue annotations. ',
      anchor_content: 'View example',
      event_label: 'features_macromolecular',
      example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P54764/interactions',
    },
    {
      title: 'Similar Proteins',
      src: 'assets/img/similar2.png',
      details:
        "<div>The similar proteins section of the aggregated views of proteins displays proteins that have >90% sequence identity to a protein of interest. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P07477/similarity'>View example</a></div>",
      div_content: 'The similar proteins section of the aggregated views of proteins displays proteins that have >90% sequence identity to a protein of interest. ',
      anchor_content: 'View example',
      event_label: 'features_similar',
      example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P07477/similarity',
    },
    {
      title: 'Ligand Annotations',
      src: 'assets/img/ligands_annotations_highres2.png',
      details:
        "<div>A gallery of all the small molecules across the PDB archive which interact with a protein of interest. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P00439/ligands'>View example</a></div>",
      div_content: 'A gallery of all the small molecules across the PDB archive which interact with a protein of interest. ',
      anchor_content: 'View example',
      event_label: 'features_ligands',
      example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P00439/ligands',
    },
    {
      title: 'Known Variants',
      src: 'assets/img/variants_highres.png',
      details:
        "<div>Variant annotations from PDBe-Kb partner resources  in a 2D sequence feature viewer, <a target='_blank' class='link-legend-style-kf' href='https://github.com/PDBeurope/protvista-pdb'>PDB ProtVista</a>.</div>",
      div_content: 'Variant annotations from PDBe-Kb partner resources  in a 2D sequence feature viewer, ',
      anchor_content: 'PDB ProtVista',
      event_label: 'features_variants',
      example_href: 'https://github.com/PDBeurope/protvista-pdb',
    },
    {
      title: 'Secondary Structure Variance',
      src: 'assets/img/sec_structures.png',
      details:
        "<div>Investigate the variation in secondary structure elements across PDB chains for a protein of interest in the 2D sequence feature viewer, <a target='_blank' class='link-legend-style-kf' href='https://github.com/PDBeurope/protvista-pdb'>PDB ProtVista</a>.</div>",
      div_content: 'Investigate the variation in secondary structure elements across PDB chains for a protein of interest in the 2D sequence feature viewer, ',
      anchor_content: 'PDB ProtVista.',
      event_label: 'features_secondary',
      example_href: 'https://github.com/PDBeurope/protvista-pdb',
    },
    {
      title: '3D-structure models and associated metadata',
      // src: "assets/img/3dbeacons2.png",
      src: 'assets/img/v2-images/3d_beacons_overview.png',
      details:
        "<div>3D-Beacons aims to provide experimental and computational 3D-structure models and meta-information from all the contributing data resources in a standardised data format, on a unified platform. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/3dbeacons/search/P38398'>View example</a></div>",
      div_content:
        '3D-Beacons aims to provide experimental and computational 3D-structure models and meta-information from all the contributing data resources in a standardised data format, on a unified platform. ',
      anchor_content: 'View example',
      event_label: 'features_complexes',
      example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/3dbeacons/search/P38398',
    },
    {
      title: 'PDB and AlphaFold Structures Superposition',
      src: 'assets/img/af_superimpose2.png',
      details:
        "<div>Compare experimental models from the PDB with AlphaFold models at PDBe-KB Aggregated Views of Protein. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P00439/structures'>View example</a> <div style='font-size: 12px'>(Click button <i>\"3D view of superposed structures > Load AlphaFold structure\"</i>)</div></div>",
      div_content: 'Compare experimental models from the PDB with AlphaFold models at PDBe-KB Aggregated Views of Protein. ',
      anchor_content: 'View example',
      event_label: 'features_afsuperposition',
      example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P00439/structures',
    },
  ];
  chunks: any[] = [];

  chunk_size = 3;
  chunk_index = 0;
  max_chunk_n = 0;
  current_chunk: any[] = [];
  current_chunk_idx: any[] = [];

  ngOnInit(): void {
    // window.addEventListener('resize', this.wrapper);
    if (window.innerWidth < 900) {
      this.chunk_size = 2;
    }
    if (window.innerWidth < 540) {
      this.chunk_size = 1;
    }
    this.buildCarousel();
  }

  @HostListener('window:resize', ['$event'])
  calcChunks(event: any) {
    this.chunk_size = 3;
    if (window.innerWidth < 900) {
      this.chunk_size = 2;
    }
    if (window.innerWidth < 540) {
      this.chunk_size = 1;
    }
    this.buildCarousel();
  }

  // ngOnDestroy() {
  // window.removeEventListener('resize', this.calcChunks);
  // }

  buildChunks(to_chunk_array: any) {
    this.chunks = [];
    for (let i = 0; i < to_chunk_array.length; i += this.chunk_size) {
      const chunk: any = to_chunk_array.slice(i, i + this.chunk_size);
      this.chunks.push(chunk);
    }
  }

  calculateFill(j: number) {
    if (j === this.chunk_index) {
      return '#085F5C';
    }
    return 'transparent';
  }

  calculateCircleX(j: number) {
    return 1.2 * (j + 1) + 'em';
  }

  getCurrentChunk() {
    this.current_chunk = [];
    for (const idx of this.current_chunk_idx) {
      this.current_chunk.push(this.slides[idx]);
    }
  }

  buildCarousel() {
    this.buildChunks(this.slides);
    this.current_chunk_idx = Array.from(Array(this.chunk_size).keys());
    this.max_chunk_n = Math.ceil(this.slides.length / this.chunk_size);
    this.getCurrentChunk();
  }

  updateCarousel(idx: number) {
    this.chunk_index = this.chunk_index + idx;

    if (this.chunk_index < 0) {
      this.chunk_index = this.chunks.length - 1;
    }
    if (this.chunk_index > this.chunks.length - 1) {
      this.chunk_index = 0;
    }

    const slides_to_get = idx * this.chunk_size;
    this.current_chunk_idx = this.current_chunk_idx.map((each_id) => {
      each_id += slides_to_get;
      if (each_id < 0) {
        each_id += this.slides.length;
      } else if (each_id > this.slides.length - 1) {
        each_id -= this.slides.length;
      }
      return each_id;
    });
    this.getCurrentChunk();
  }
}
