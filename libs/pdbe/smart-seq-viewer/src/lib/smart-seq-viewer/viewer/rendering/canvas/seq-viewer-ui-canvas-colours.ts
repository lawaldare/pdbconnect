/**
 * Determines whether a hexadecimal RGB colour should be considered visually
 * "light" or "dark" based on relative luminance.
 *
 * The calculation follows the WCAG luminance formula using gamma-corrected
 * RGB values. This is useful for dynamically selecting readable foreground
 * text colours (e.g. black vs white text on coloured backgrounds).
 *
 * Supported input format:
 * - '#RRGGBB'
 * - 'RRGGBB'
 *
 * @param bgColor - Hexadecimal background colour string.
 * @returns True if the colour is considered dark enough to require light text.
 */
export function isColorLight(bgColor: string) {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  const uicolors = [r / 255, g / 255, b / 255];
  const c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return L <= 0.179;
}

/**
 * Generates a lighter RGB variation of a hexadecimal colour by increasing
 * each RGB channel toward white by the provided percentage.
 *
 * This utility is primarily used for creating subtle visual variants such as:
 * - striped overlays
 * - checkerboard patterns
 * - hover highlights
 * - secondary annotation shading
 *
 * Supported input format:
 * - '#RRGGBB'
 *
 * @param hex - Base hexadecimal colour.
 * @param percent - Lightening factor between 0 and 1.
 * @returns Lightened colour as an RGB CSS string.
 */
export function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = (num >> 16) + Math.round(255 * percent);
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * percent);
  let b = (num & 0x0000ff) + Math.round(255 * percent);

  r = r > 255 ? 255 : r;
  g = g > 255 ? 255 : g;
  b = b > 255 ? 255 : b;

  return `rgb(${r},${g},${b})`;
}
