export function renderTooltipsDiv(containerElementChild: HTMLElement) {
  const scrollableContainer = containerElementChild.querySelector('#pv-scrollable');
  if (!scrollableContainer) return;
  const containerTrackRow = document.createElement('div');
  containerTrackRow.id = 'pv-tooltips-container';
  scrollableContainer.appendChild(containerTrackRow);
}
