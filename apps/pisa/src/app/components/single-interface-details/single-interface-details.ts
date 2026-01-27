import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MaterialModule } from '@pdbc/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PisaUtilService } from '../../services/pisa-util.service';
import { PisaSelectors } from '../../store/pisa.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'pisa-single-interface-details',
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule, NgxSkeletonLoaderModule],
  templateUrl: './single-interface-details.html',
  styleUrl: './single-interface-details.scss',
})
export class SingleInterfaceDetailsComponent {
  public interface = input.required<any | null>();
  public pisaUtilService = inject(PisaUtilService);
  private pisaStore = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  public downloadFiles() {
    this.pisaStore
      .select(PisaSelectors.interfaceResultForInterfaceIdInterfacesTab)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((interfaceResult) => {
        const structure1 = interfaceResult.interface.molecules[0];
        const structure2 = interfaceResult.interface.molecules[1];

        const authAsymIdForStructure1 = interfaceResult.interface.molecules[0].auth_asym_id;
        const authAsymIdForStructure2 = interfaceResult.interface.molecules[1].auth_asym_id;

        const residuesForStructure1 = interfaceResult.interface.molecules[0]?.residues?.residues || [];
        const residuesForStructure2 = interfaceResult.interface.molecules[1]?.residues?.residues || [];

        const structure1Data = residuesForStructure1.map((residue: any) => ({ ...residue, auth_sym_id: authAsymIdForStructure1 }));
        const structure2Data = residuesForStructure2.map((residue: any) => ({ ...residue, auth_sym_id: authAsymIdForStructure2 }));
        const interfaceJSON: any = {
          interface: {
            structure_1: {
              symmetry_operation: structure1.symmetry_operation,
              symmetry_id: structure1.symmetry_id,
              atoms: {
                interface: structure1.int_natoms,
                surface: structure1.extendedData.n_surface_atoms,
                total: structure1.extendedData.total_atoms,
              },
              residues: {
                interface: structure1.int_nres,
                surface: structure1.extendedData.n_surface_residues,
                total: structure1.extendedData.total_residues,
              },
              solvent_accessible_area: {
                interface: structure1.int_area,
                total: structure1.extendedData.asa,
              },
              solvation_energy: {
                isolated_structure: structure1.extendedData.solv_energy,
                gain_at_complexation: -6.3,
                p_value: structure1.pvalue,
              },
            },
            structure_2: {
              symmetry_operation: structure2.symmetry_operation,
              symmetry_id: structure2.symmetry_id,
              atoms: {
                interface: structure2.int_natoms,
                surface: structure2.extendedData.n_surface_atoms,
                total: structure2.extendedData.total_atoms,
              },
              residues: {
                interface: structure2.int_nres,
                surface: structure2.extendedData.n_surface_residues,
                total: structure2.extendedData.total_residues,
              },
              solvent_accessible_area: {
                interface: structure2.int_area,
                total: structure2.extendedData.asa,
              },
              solvation_energy: {
                isolated_structure: structure2.extendedData.solv_energy,
                gain_at_complexation: -4.5,
                p_value: structure2.pvalue,
              },
            },
          },
          interfacing_residues: {
            structure_1: structure1Data,
            structure_2: structure2Data,
          },
          interfacing_bonds: {
            hydrogen_bonds: interfaceResult.interface.h_bonds.bonds || [],
            salt_bridges: interfaceResult.interface.salt_bridges.bonds || [],
            disulphide_bonds: interfaceResult.interface.ss_bonds.bonds || [],
            covalent_links: interfaceResult.interface.cov_bonds.bonds || [],
          },
        };

        // console.log('Interface JSON to download:', interfaceJSON);

        if (interfaceResult) {
          this.pisaUtilService.downloadJSON(interfaceJSON, `interface-${this.interface()?.interface_id}`);
        }
      });
  }
}
