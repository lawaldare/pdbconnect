export interface Example {
  label: string;
  url: string;
}

export interface HeaderSearchConfig {
  backgroundColor?: string;
  type?: string;
  examples?: Example[];
  isHomepage?: boolean;
  placeholderText?: string;
}
