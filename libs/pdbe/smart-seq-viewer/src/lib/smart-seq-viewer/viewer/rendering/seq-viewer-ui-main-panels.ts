/**
 * Creates the main flex container that wraps both the sequence visualisation
 * canvas area and the optional right-side information panel.
 *
 * The wrapper provides:
 * - horizontal flex layout
 * - fixed maximum vertical viewport height
 * - hidden outer overflow to allow internal independent scrolling
 * - a shared background behind both panels
 *
 * @param scrollContainerMaxHeight - Maximum height of the visualisation area in pixels.
 * @returns Configured flexbox wrapper element.
 */
export function createFlexBoxWrapper(scrollContainerMaxHeight: number): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'flexbox-wrapper';
  wrapper.style.display = 'flex';
  wrapper.style.height = `${scrollContainerMaxHeight}px`;
  wrapper.style.width = '100%';
  wrapper.style.maxWidth = '100%';
  wrapper.style.background = '#f3f3f3';
  // wrapper.style.overflowY = 'scroll';
  wrapper.style.overflowY = 'hidden';
  return wrapper;
}

/**
 * Creates the scrollable container used to host the sequence canvas.
 *
 * This wrapper:
 * - occupies the remaining horizontal space beside the sidebar
 * - enables vertical scrolling for long sequences
 * - hides horizontal overflow to prevent unintended scrolling
 * - constrains the visualisation to a maximum height
 *
 * The sidebar width is reserved using CSS calc().
 *
 * @param scrollContainerMaxHeight - Maximum height of the canvas viewport in pixels.
 * @returns Configured scrollable canvas wrapper element.
 */
export function createScrollableCanvasWrapper(scrollContainerMaxHeight: number): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'canvas-wrapper';
  wrapper.style.width = 'calc(100% - 250px)';
  wrapper.style.maxWidth = 'calc(100% - 250px)';
  wrapper.style.overflowY = 'auto';
  wrapper.style.overflowX = 'hidden';
  wrapper.style.maxHeight = `${scrollContainerMaxHeight}px`;
  return wrapper;
}

/**
 * Creates the warning/information banner displayed above the sequence canvas.
 *
 * This element is primarily used to communicate important numbering or
 * mapping information to users, such as offsets between author residue
 * numbering and sequential residue numbering.
 *
 * The styling intentionally mimics lightweight notification banners with
 * a highlighted left border for visibility.
 *
 * @returns Configured warning message container element.
 */
export function createWarningDiv(): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'warning-div';
  wrapper.style.borderLeftColor = '#E58C17';
  wrapper.style.borderLeftWidth = '4px';
  wrapper.style.borderLeftStyle = 'solid';
  wrapper.style.paddingLeft = '6px';
  wrapper.style.fontSize = '14px';
  wrapper.style.lineHeight = '22.4px';
  wrapper.style.marginBottom = '4px';
  wrapper.style.marginTop = '4px';
  wrapper.style.color = '#373A36';
  return wrapper;
}

/**
 * Creates the right-side sidebar panel used to display residue-specific
 * information and annotation details.
 *
 * The panel supports:
 * - independent vertical scrolling
 * - fixed width layout
 * - dynamic HTML content insertion
 * - persistent visibility beside the sequence canvas
 *
 * Initial content is intentionally left empty so the parent component
 * can inject a default empty state or residue details later.
 *
 * @param sidebarPanelWidth - Width of the sidebar panel in pixels.
 * @returns Configured sidebar panel element.
 */
export function createSidebarPanel(sidebarPanelWidth: number) {
  const panel = document.createElement('div');
  panel.className = 'sidebar-panel';
  panel.style.width = `${sidebarPanelWidth}px`;
  panel.style.height = '100%';
  panel.style.background = '#fafafa';
  panel.style.border = '1px solid #ccc';
  panel.style.overflowY = 'auto';
  panel.style.overflowX = 'hidden';
  panel.style.padding = '10px';
  // panel.innerHTML = this.getSidebarPanelEmptyState();
  panel.style.display = 'block';

  return panel;
}

/**
 * Creates and attaches the floating tooltip element used for residue hover interactions.
 *
 * The tooltip:
 * - is absolutely positioned relative to the provided container
 * - ignores mouse events to prevent hover interference
 * - is hidden by default until explicitly shown
 * - supports dynamically injected HTML content
 *
 * The container is automatically configured as a relative positioning context
 * to ensure tooltip coordinates remain local to the visualisation region.
 *
 * @param container - Parent container used as the tooltip positioning context.
 * @returns Configured tooltip HTML element.
 */
export function createTooltipElement(container: HTMLElement) {
  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.background = '#fff';
  tooltip.style.color = '#1a1c1a';
  tooltip.style.borderRadius = '0px';
  tooltip.style.padding = '10px';
  tooltip.style.fontSize = '14px';
  tooltip.style.fontFamily = "'IBM Plex Sans', Arial, Helvetica, sans-serif";
  tooltip.style.boxShadow = '0 5px 5px -3px rgb(0 0 0 / 20%), 0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%)';
  tooltip.style.zIndex = '9999';
  tooltip.style.display = 'none';

  container.style.position = 'relative'; // make container the positioning context
  container.appendChild(tooltip);
  return tooltip;
}
