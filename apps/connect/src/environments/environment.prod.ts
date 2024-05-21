export const environment = {
  production: true,
  debug: false,
  pdbeApiUrl: '${PDBE_API_URL}' || 'https://www.ebi.ac.uk/pdbe/api/',
  pdbeAggregatedApiUrl: '${PDBE_AGGREGATED_API_URL}' || 'https://www.ebi.ac.uk/pdbe/aggregated-api/',
};
