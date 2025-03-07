import { jest } from '@jest/globals';
import { InteractiveTablesComponent } from '../interactive-tables.component';

interface MockGridApi {
  getRenderedNodes: jest.Mock;
}

interface MockIRowNode {
  rowIndex: number;
  setSelected: jest.Mock;
}

class MockComponentCommunicationService {
  getTabState = jest.fn();
  setTabState = jest.fn();
}

class MockMainDataProcessingFacade {}

class MockStore {
  select = jest.fn();
}

describe('InteractiveTablesComponent.triggerTableSelection() triggerTableSelection method', () => {
  let component: InteractiveTablesComponent;
  let mockSignals: MockComponentCommunicationService;
  let mockDataProcessing: MockMainDataProcessingFacade;
  let mockStore: MockStore;
  let mockGridApi: MockGridApi;

  beforeEach(() => {
    mockSignals = new MockComponentCommunicationService() as any;
    mockDataProcessing = new MockMainDataProcessingFacade() as any;
    mockStore = new MockStore() as any;
    mockGridApi = {
      getRenderedNodes: jest.fn(),
    } as any;

    component = new InteractiveTablesComponent(mockSignals as any, mockDataProcessing as any, mockStore as any);

    component.gridApi = mockGridApi as any;
  });

  describe('Happy paths', () => {
    it('should select the first row if selectionState is "Main" and nodes are rendered', () => {
      // Arrange
      const mockRowNode: MockIRowNode = {
        rowIndex: 0,
        setSelected: jest.fn(),
      } as any;
      mockGridApi.getRenderedNodes.mockReturnValue([mockRowNode]);
      mockSignals.getTabState.mockReturnValue('Main');

      // Act
      component.triggerTableSelection();

      // Assert
      expect(mockSignals.setTabState).toHaveBeenCalledWith(component.tabName(), 0);
      expect(mockRowNode.setSelected).toHaveBeenCalledWith(true);
    });

    it('should select the node corresponding to the selectionState', () => {
      // Arrange
      const mockRowNode1: MockIRowNode = {
        rowIndex: 0,
        setSelected: jest.fn(),
      } as any;
      const mockRowNode2: MockIRowNode = {
        rowIndex: 1,
        setSelected: jest.fn(),
      } as any;
      mockGridApi.getRenderedNodes.mockReturnValue([mockRowNode1, mockRowNode2]);
      mockSignals.getTabState.mockReturnValue(1);

      // Act
      component.triggerTableSelection();

      // Assert
      expect(mockRowNode1.setSelected).toHaveBeenCalledWith(false);
      expect(mockRowNode2.setSelected).toHaveBeenCalledWith(true);
    });
  });

  describe('Edge cases', () => {
    it('should not throw an error if gridApi is undefined', () => {
      // Arrange
      component.gridApi = undefined as any;

      // Act & Assert
      expect(() => component.triggerTableSelection()).not.toThrow();
    });

    it('should not select any node if no nodes are rendered', () => {
      // Arrange
      mockGridApi.getRenderedNodes.mockReturnValue([]);
      mockSignals.getTabState.mockReturnValue(1);

      // Act
      component.triggerTableSelection();

      // Assert
      expect(mockSignals.setTabState).not.toHaveBeenCalled();
    });

    it('should handle non-numeric selectionState gracefully', () => {
      // Arrange
      const mockRowNode: MockIRowNode = {
        rowIndex: 0,
        setSelected: jest.fn(),
      } as any;
      mockGridApi.getRenderedNodes.mockReturnValue([mockRowNode]);
      mockSignals.getTabState.mockReturnValue('InvalidState');

      // Act
      component.triggerTableSelection();

      // Assert
      expect(mockRowNode.setSelected).toHaveBeenCalledWith(false);
    });
  });
});
