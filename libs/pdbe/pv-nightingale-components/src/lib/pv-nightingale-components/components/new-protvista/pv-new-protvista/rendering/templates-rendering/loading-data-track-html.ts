export function getLoadingDataHTML(trackName: string) {
  return `
    <div class="pv-track-label-col">
      <div class="track-title">
        <span class="expand-icon" style="visibility: hidden;">▸</span>
        ${trackName}
      </div>
    </div>
    <div class="pv-track-container no-data">
      <div class="skeleton-loader"></div>
    </div>
  `;
}
