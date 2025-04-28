import { LigandsTabComponent } from '../ligands-tab.component';

// Mock classes and interfaces
class MockElementRef {
  nativeElement: any = {};
}

class MockRenderer2 {
  createElement = jest.fn();
  setAttribute = jest.fn();
  appendChild = jest.fn();
}

class MockComponentCommunicationService {
  molstarFirstRenderFinished = jest.fn();
  getTabData = jest.fn();
  tabState = jest.fn();
}

class MockMolstarOverviewForTopPage {
  checkLigandsReady = jest.fn();
  checkAndCreateComponents = jest.fn();
  renderTabsLigands = jest.fn();
}

class MockMainDataProcessingFacade {
  tabDataLoaded = jest.fn();
}

class MockStore {
  select = jest.fn();
}

// Mock the getLigandsDropdownOptions function
jest.mock('../../../helpers/processed-data-to-controls', () => {
  const actual = jest.requireActual('../../../helpers/processed-data-to-controls');
  return {
    ...actual,
    getLigandsDropdownOptions: jest.fn(),
  };
});

describe('LigandsTabComponent.onDropdownSelect() onDropdownSelect method', () => {
  let component: LigandsTabComponent;
  let mockRenderer: MockRenderer2;
  let mockElementRef: MockElementRef;
  let mockCompCommService: MockComponentCommunicationService;
  let mockMolstarOverview: MockMolstarOverviewForTopPage;
  let mockDataProcessing: MockMainDataProcessingFacade;
  let mockStore: MockStore;

  beforeEach(() => {
    mockRenderer = new MockRenderer2() as any;
    mockElementRef = new MockElementRef() as any;
    mockCompCommService = new MockComponentCommunicationService() as any;
    mockMolstarOverview = new MockMolstarOverviewForTopPage() as any;
    mockDataProcessing = new MockMainDataProcessingFacade() as any;
    mockStore = new MockStore() as any;

    component = new LigandsTabComponent(
      mockRenderer as any,
      mockElementRef as any,
      mockCompCommService as any,
      mockMolstarOverview as any,
      mockDataProcessing as any,
      mockStore as any
    );
  });

  describe('Happy paths', () => {
    it('should update dropdownSelected and call renderInMolstar and initOrRefreshLigandEnvViewer', async () => {
      const mockEvent = 'option1';
      const renderInMolstarSpy = jest.spyOn(component as any, 'renderInMolstar').mockResolvedValue(undefined);
      const initOrRefreshLigandEnvViewerSpy = jest.spyOn(component as any, 'initOrRefreshLigandEnvViewer').mockResolvedValue(undefined);

      await component.onDropdownSelect(mockEvent);

      expect(component.dropdownSelected).toBe(mockEvent);
      expect(renderInMolstarSpy).toHaveBeenCalled();
      expect(initOrRefreshLigandEnvViewerSpy).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty event gracefully', async () => {
      const mockEvent = '';
      const renderInMolstarSpy = jest.spyOn(component as any, 'renderInMolstar').mockResolvedValue(undefined);
      const initOrRefreshLigandEnvViewerSpy = jest.spyOn(component as any, 'initOrRefreshLigandEnvViewer').mockResolvedValue(undefined);

      await component.onDropdownSelect(mockEvent);

      expect(component.dropdownSelected).toBe(mockEvent);
      expect(renderInMolstarSpy).toHaveBeenCalled();
      expect(initOrRefreshLigandEnvViewerSpy).toHaveBeenCalled();
    });

    it('should handle undefined event gracefully', async () => {
      const mockEvent = undefined as any;
      const renderInMolstarSpy = jest.spyOn(component as any, 'renderInMolstar').mockResolvedValue(undefined);
      const initOrRefreshLigandEnvViewerSpy = jest.spyOn(component as any, 'initOrRefreshLigandEnvViewer').mockResolvedValue(undefined);

      await component.onDropdownSelect(mockEvent);

      expect(component.dropdownSelected).toBe(mockEvent);
      expect(renderInMolstarSpy).toHaveBeenCalled();
      expect(initOrRefreshLigandEnvViewerSpy).toHaveBeenCalled();
    });
  });
});
