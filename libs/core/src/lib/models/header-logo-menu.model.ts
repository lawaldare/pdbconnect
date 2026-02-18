export interface HeaderLogoMenuConfig {
  backgroundColor?: string;
  logoType?: string;
  headerTitle?: string;
  isComplexPage?: boolean;
  isHomePage?: boolean;
  urls?: {
    name: string;
    path: string;
    openInNewTab: boolean;
  }[];
  logoPath?: string;
}

export interface MobileHeaderLogoMenuConfig {
  backgroundColor: string;
  urls: {
    name: string;
    path: string;
    openInNewTab: boolean;
  }[];
}
