export interface HeaderLogoMenuConfig {
  backgroundColor?: string;
  logoType?: string;
  headerTitle?: string;
  isHomePage?: boolean;
  urls?: {
    name: string;
    path: string;
    openInNewTab: boolean;
  }[];
}

export interface MobileHeaderLogoMenuConfig {
  backgroundColor: string;
  urls: {
    name: string;
    path: string;
    openInNewTab: boolean;
  }[];
}
