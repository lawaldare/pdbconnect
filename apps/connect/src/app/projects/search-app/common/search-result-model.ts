export const SearchResultModel = [
    {
      manager: 'entriesManager',
      pagination: {
        perPage: '10', currentPage: 1, totalPages: 0, pages: [], totalRecords: 0,
        sort: {
          options: [
            { label: 'Sort by', value: 'Sort by'},
            { label: 'Quality (asc)', value: 'overall_quality asc'},
            { label: 'Quality (desc)', value: 'overall_quality desc'},
            { label: 'Release date (asc)', value: 'release_date asc'},
            { label: 'Release date (desc)', value: 'release_date desc'},
            { label: 'Resolution (asc)', value: 'resolution desc'},
            { label: 'Resolution (desc)', value: 'resolution asc'}
          ],
          value: 'Sort by'
        }
      },
      filterUpdated: true,
      resultCardData: undefined,
      loadingMsg: "Loading search result..",
      addFilterMsg: "Use 'Advanced search' form to search Entries",
      emptyResultMsg: "No Entries Found!",
      currentMessage: "Use 'Advanced search' form to search Entries",
      totalManager: undefined,
      selectAllEntries: {
        1: false
      },
      recentQueryData : undefined
    },
    {
      manager: 'macroMoleculesManager',
      pagination: { perPage: '10', currentPage: 1, totalPages: 0, pages: [], totalRecords: 0, sort:undefined },
      filterUpdated: true,
      resultCardData: undefined,
      loadingMsg: "Loading search result..",
      addFilterMsg: "Use 'Advanced search' form to search Macromolecules",
      emptyResultMsg: "No Macromolecules Found!",
      currentMessage: "Use 'Advanced search' form to search Macromolecules",
      totalManager: 'macroMoleculesTotalManager',
      selectAllEntries: {
        1: false
      },
      recentQueryData : undefined
    },
    {
      manager: 'compoundsManager',
      pagination: { perPage: '10', currentPage: 1, totalPages: 0, pages: [], totalRecords: 0, sort:undefined },
      filterUpdated: true,
      resultCardData: undefined,
      loadingMsg: "Loading search result..",
      addFilterMsg: "Use 'Advanced search' form to search Compounds",
      emptyResultMsg: "No Compounds Found!",
      currentMessage: "Use 'Advanced search' form to search Compounds",
      totalManager: 'compoundsTotalManager',
      selectAllEntries: {
        1: false
      },
      recentQueryData : undefined
    },
    {
      manager: 'proteinFamiliesManager',
      pagination: { perPage:'10', currentPage: 1, totalPages: 0, pages: [], totalRecords: 0, sort:undefined },
      filterUpdated: true,
      resultCardData: undefined,
      loadingMsg: "Loading search result..",
      addFilterMsg: "Use 'Advanced search' form to search Protein families",
      emptyResultMsg: "No Protein families Found!",
      currentMessage: "Use 'Advanced search' form to search Protein families",
      totalManager: 'proteinFamiliesTotalManager',
      selectAllEntries: {
        1: false
      },
      recentQueryData : undefined
    }
]