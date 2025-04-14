import { Store } from '@ngrx/store';
import { UtilService } from '@pdbc/core';
import { ValidationDataProcessingFacade } from '../../../../components/model-quality-tab/validation-data.facade';
import { DetailsDashboardFacade } from '../../../../components/shared/details-dashboard/details-dashboard.facade';
import { ComponentCommunicationService } from '../../../../services/component-comm.service';
import { EntryApiService } from '../../../../services/entry-api.service';
import { MainDataProcessingFacade } from '../../../main/data-processing.facade';
import { MobileFacade } from '../../mobile.facade';
import { MbMacromoleculeComponent } from '../mb-macromolecule.component';

// Mock classes and interfaces
interface MockEntryStoreState {
  entryId: string;
  summaryData: any;
  macroMolecules: any[];
  // Add other properties as needed
}

class MockMatBottomSheetRef {
  dismiss = jest.fn();
}

// Mock dependencies
const mockStore = {
  select: jest.fn(),
} as unknown as jest.Mocked<Store<MockEntryStoreState>>;

const mockValidationDataProcessingFacade = {
  // Mock methods as needed
} as unknown as jest.Mocked<ValidationDataProcessingFacade>;

const mockComponentCommunicationService = {
  getTabData: jest.fn(),
} as unknown as jest.Mocked<ComponentCommunicationService>;

const mockMainDataProcessingFacade = {
  tabDataLoaded: jest.fn(),
} as unknown as jest.Mocked<MainDataProcessingFacade>;

const mockMobileFacade = {
  macromoleculeTitle: 'Mock Title',
} as unknown as jest.Mocked<MobileFacade>;

const mockUtilService = {
  // Mock methods as needed
} as unknown as jest.Mocked<UtilService>;

const mockDetailsDashboardFacade = {
  transformCoverageData: jest.fn(),
} as unknown as jest.Mocked<DetailsDashboardFacade>;

const mockEntryApiService = {
  getSummaryStats: jest.fn(),
} as unknown as jest.Mocked<EntryApiService>;

// Test suite for toggleBottomsheetHeight
describe('MbMacromoleculeComponent.toggleBottomsheetHeight() toggleBottomsheetHeight method', () => {
  let component: MbMacromoleculeComponent;

  beforeEach(() => {
    component = new MbMacromoleculeComponent(new MockMatBottomSheetRef() as any);
    (component as any).globalStore = mockStore;
    (component as any).dataFacade = mockValidationDataProcessingFacade;
    (component as any).signals = mockComponentCommunicationService;
    (component as any).dataProcessing = mockMainDataProcessingFacade;
    (component as any).mbFacade = mockMobileFacade;
    (component as any).util = mockUtilService;
    (component as any).detailsDashboardFacade = mockDetailsDashboardFacade;
    (component as any).entryApiService = mockEntryApiService;
  });

  it('should toggle expanded state and adjust bottom sheet height to 80%', () => {
    // Arrange
    const container = document.createElement('div');
    container.className = 'custom-bottom-sheet';
    document.body.appendChild(container);

    // Act
    component.toggleBottomsheetHeight();

    // Assert
    expect(component.expanded()).toBe(true);
    expect(container.style.height).toBe('80%');

    // Clean up
    document.body.removeChild(container);
  });

  it('should toggle expanded state and adjust bottom sheet height to 40%', () => {
    // Arrange
    const container = document.createElement('div');
    container.className = 'custom-bottom-sheet';
    document.body.appendChild(container);

    // Act
    component.toggleBottomsheetHeight(); // First toggle
    component.toggleBottomsheetHeight(); // Second toggle

    // Assert
    expect(component.expanded()).toBe(false);
    expect(container.style.height).toBe('40%');

    // Clean up
    document.body.removeChild(container);
  });

  it('should not throw error if container is not found', () => {
    // Act & Assert
    expect(() => component.toggleBottomsheetHeight()).not.toThrow();
  });
});
