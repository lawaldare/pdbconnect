// Unit tests for: ngOnChanges

import { jest } from '@jest/globals';
import { Store } from '@ngrx/store';
import { MainDataProcessingFacade } from '../../../pages/main/data-processing.facade';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { ASSEMBLIES_COL_DEFS, DOMAINS_COL_DEFS, LIGANDS_COL_DEFS, MACROMOLECULES_COL_DEFS } from '../data-models-and-definitions/column-definition-objects';
import { InteractiveTablesComponent } from '../interactive-tables.component';

// Mock interfaces
interface MockEntryStoreState {
  entryId: string;
  assemblies: any[];
  domains: any[];
  ligands: any[];
  macromolecules: any[];
}

describe('InteractiveTablesComponent.ngOnChanges() ngOnChanges method', () => {
  let component: InteractiveTablesComponent;
  let mockSignals: ComponentCommunicationService;
  let mockDataProcessing: MainDataProcessingFacade;
  let mockStore: Store<MockEntryStoreState>;

  beforeEach(() => {
    mockSignals = {
      getTabData: jest.fn(),
      molstarResidueInfo: jest.fn(),
      getTabState: jest.fn(),
      setTabState: jest.fn(),
    } as any;

    mockDataProcessing = {
      tabDataLoaded: jest.fn(),
    } as any;

    mockStore = {
      select: jest.fn().mockReturnValue({
        subscribe: jest.fn(),
      }),
    } as any;

    component = new InteractiveTablesComponent(mockSignals as any, mockDataProcessing as any, mockStore as any);
  });

  describe('Happy paths', () => {
    it('should set tableData and columnDefinitions for Assemblies', async () => {
      // Arrange
      jest.mocked(mockSignals.getTabData).mockReturnValue({ displayFilters: true, tableFilters: jest.fn().mockReturnValue([{ types: ['type1'] }]) });
      component.tabName = jest.fn().mockReturnValue('Assemblies') as any;

      // Act
      await component.ngOnChanges();

      // Assert
      expect(component.tableData).toBeDefined();
      expect(component.columnDefinitions).toEqual(ASSEMBLIES_COL_DEFS);
      expect(component.currentTableFilter).toEqual(['type1']);
    });

    it('should set tableData and columnDefinitions for Domains', async () => {
      // Arrange
      jest.mocked(mockSignals.getTabData).mockReturnValue({ displayFilters: false });
      component.tabName = jest.fn().mockReturnValue('Domains') as any;

      // Act
      await component.ngOnChanges();

      // Assert
      expect(component.tableData).toBeDefined();
      expect(component.columnDefinitions).toEqual(DOMAINS_COL_DEFS);
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined tableData gracefully', async () => {
      // Arrange
      jest.mocked(mockSignals.getTabData).mockReturnValue(undefined);
      component.tabName = jest.fn().mockReturnValue('Ligands') as any;

      // Act
      await component.ngOnChanges();

      // Assert
      expect(component.tableData).toBeUndefined();
      expect(component.columnDefinitions).toEqual(LIGANDS_COL_DEFS);
    });

    it('should handle empty tableFilters gracefully', async () => {
      // Arrange
      jest.mocked(mockSignals.getTabData).mockReturnValue({ displayFilters: true, tableFilters: jest.fn().mockReturnValue([]) });
      component.tabName = jest.fn().mockReturnValue('Macromolecules') as any;

      // Act
      await component.ngOnChanges();

      // Assert
      expect(component.tableData).toBeDefined();
      expect(component.columnDefinitions).toEqual(MACROMOLECULES_COL_DEFS);
      expect(component.currentTableFilter).toEqual([]);
    });
  });
});

// End of unit tests for: ngOnChanges
