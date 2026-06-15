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
  newHeaderLogo?: boolean;
  logoPath?: string;
  logoWidth?: string;
}

export interface MobileHeaderLogoMenuConfig {
  backgroundColor: string;
  urls: {
    name: string;
    path: string;
    openInNewTab: boolean;
  }[];
}
