interface TopolViewerEventData {
  chainId: string;
  entityId: string;
  entryId: string;
  residueNumber: number;
  type: string;
}

export type PDBTopolViewerEvent = Event & { eventData: TopolViewerEventData };
