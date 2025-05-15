export function truncateText(element: HTMLElement, fullText: string, maxLines: number) {
  const computedStyle = window.getComputedStyle(element);
  const lineHeight = parseFloat(computedStyle.lineHeight || '16');
  const maxHeight = maxLines * lineHeight;
  const containerWidth = element.getBoundingClientRect().width;

  const temp = document.createElement('span');
  temp.style.position = 'absolute';
  temp.style.visibility = 'hidden';
  temp.style.whiteSpace = 'nowrap';
  temp.style.fontFamily = computedStyle.fontFamily;
  temp.style.fontSize = computedStyle.fontSize;
  temp.style.fontWeight = computedStyle.fontWeight;
  temp.style.letterSpacing = computedStyle.letterSpacing;
  temp.style.width = containerWidth + 'px';
  temp.style.lineHeight = computedStyle.lineHeight;
  temp.style.wordBreak = 'break-word';
  temp.style.wordWrap = 'break-word';
  temp.style.whiteSpace = 'normal';
  temp.style.display = 'inline-block';
  document.body.appendChild(temp);

  let low = 0;
  let high = fullText.length;
  let bestFit = fullText;

  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2);
    const testText = fullText.slice(0, mid) + '…';
    temp.textContent = testText;
    const height = temp.getBoundingClientRect().height;

    if (height <= maxHeight) {
      low = mid;
      bestFit = testText;
    } else {
      high = mid - 1;
    }
  }

  document.body.removeChild(temp);

  const bestFitNoEllipsis = bestFit.substring(0, bestFit.indexOf('…'));

  const isTruncated = bestFitNoEllipsis !== fullText;

  if (!isTruncated) bestFit = fullText;

  return { bestFit, isTruncated };
}
