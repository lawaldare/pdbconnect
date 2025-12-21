export const PDBE_HEADER_LOGO_SRC = 'assets/images/PDBe-letterhead-white-RGB_2013.webp';
export const PDBE_KB_HEADER_LOGO_SRC = '/assets/images/PDBE-KB_logo_2019_white_text.png';

const hostname = window.location.hostname;
const href = window.location.href;
export const PISA_LOGO_PATH =
  hostname === 'localhost'
    ? 'assets/images/PDBe-letterhead-white-RGB_2013.webp'
    : href.includes('dev')
      ? 'https://wwwdev.ebi.ac.uk/pdbe/pisa/assets/images/PDBe-letterhead-white-RGB_2013.webp'
      : 'https://www.ebi.ac.uk/pdbe/pisa/assets/images/PDBe-letterhead-white-RGB_2013.webp';
