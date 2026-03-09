type ComplexIdHistoryStatus = 'active' | 'obsolete' | 'superseded';

export interface ComplexIdHistory {
  query_id: string;
  status: ComplexIdHistoryStatus;
  canonical: {
    id: string;
    status: ComplexIdHistoryStatus;
    effective_date: string | null;
  };
  effective_status: string;
}
