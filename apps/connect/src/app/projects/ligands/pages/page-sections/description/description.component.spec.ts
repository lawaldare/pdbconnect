import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescriptionComponent } from './description.component';

const mockDescription = {
  name: 'fluorinated heme',
  synonyms: 'fluorinated heme',
  formula: 'C34 H33 F3 Fe N4 O4',
  inchi:
    'InChI=1S/C34H35F3N4O4.Fe/c1-6-19-16(3)23-12-24-17(4)21(8-10-31(42)43)28(39-24)14-29-22(9-11-32(44)45)18(5)25(40-29)13-27-20(7-2)33(34(35,36)37)30(41-27)15-26(19)38-23;/h12-15H,6-11H2,1-5H3,(H4,38,39,40,41,42,43,44,45);/q;+2/p-2/b23-12-,24-12-,25-13-,26-15-,27-13-,28-14-,29-14-,30-15-;',
  inchikey: 'CNPAYGPAEWLGQO-MZUFGXIUSA-L',
  smiles: 'CCc1c(c2n3c1C=C4C(=C(C5=[N]4[Fe]36[N]7=C(C=C8N6C(=C5)C(=C8CCC(=O)O)C)C(=C(C7=C2)C)CCC(=O)O)CC)C(F)(F)F)C',
  properties: {
    crippen_mr: 160.699,
    num_atom_stereo_centers: 1,
    crippen_clog_p: 5.849,
    num_rings: 8,
    num_rotatable_bonds: 13,
    num_heteroatoms: 12,
    fraction_csp3: 0.353,
    num_aromatic_rings: 2,
    exactmw: 674.18,
    num_spiro_atoms: 1,
    num_heavy_atoms: 46,
    num_aliphatic_rings: 6,
    num_hbd: 2,
    num_saturated_heterocycles: 0,
    tpsa: 90.48,
    num_bridgehead_atoms: 0,
    num_aromatic_heterocycles: 2,
    labute_asa: 311.618,
    num_hba: 6,
    num_amide_bonds: 0,
    num_saturated_rings: 0,
    lipinski_hba: 8,
    num_unspec_atom_stereo_centers: 0,
    lipinski_hbd: 2,
    num_heterocycles: 8,
    num_aliphatic_heterocycles: 6,
  },
  annotations: [],
  crossLinks: [],
};

describe('DescriptionComponent', () => {
  let component: DescriptionComponent;
  let fixture: ComponentFixture<DescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionComponent);
    component = fixture.componentInstance;
    component.description = mockDescription;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
