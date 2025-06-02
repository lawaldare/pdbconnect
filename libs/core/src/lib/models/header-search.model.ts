export interface Example {
  label: string;
  url: string;
}

export interface ValueLabel {
  label: string;
  value: string;
}

export interface HeaderSearchConfig {
  backgroundColor?: string;
  type?: string;
  examples?: string[] | ValueLabel[];
  isHomepage?: boolean;
  placeholderText?: string;
}

export interface UISearchConfig {
  backgroundColor?: string;
  type?: string;
  examples?: string[];
  placeholderText?: string;
}

export interface APISearchConfig {
  additionalParams: string;
  fields: string;
  group: string;
  groupLimit: string;
  redirectOnClick: boolean;
  resultBoxAlign: string;
  searchUrl: string;
  sort: string;
  view: string;
  env: string;
}
