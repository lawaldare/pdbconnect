import { BehaviorSubject } from 'rxjs';

export async function initializeModelIdTracking(
  currentModelId: BehaviorSubject<string>,
  molstarContainerElement: HTMLElement,
  timeoutMs = 120000
): Promise<MutationObserver | undefined> {
  const spanSelector = '.msp-plugin .msp-viewport-top-left-controls .msp-traj-controls > span';
  const topLeftSelector = '.msp-plugin .msp-viewport-top-left-controls';

  // Wait for the span to appear in the DOM
  const waitForSpan = async (): Promise<HTMLSpanElement | null> => {
    const maxTries = Math.floor(timeoutMs / 100);
    for (let i = 0; i < maxTries; i++) {
      const span = molstarContainerElement.querySelector<HTMLSpanElement>(spanSelector);
      if (span) return span;
      await new Promise((res) => setTimeout(res, 100));
    }
    return null;
  };

  const span = await waitForSpan();
  if (!span) return;

  const updateCurrentModelId = () => {
    const text = span.textContent?.trim();
    const match = text?.match(/Model (\d+) \/ \d+/);
    if (match && match[1]) {
      currentModelId.next(match[1]);
    }
  };

  updateCurrentModelId(); // Initial set

  const observer = new MutationObserver(() => {
    updateCurrentModelId();
  });

  // Observe span content changes
  observer.observe(span, {
    characterData: true,
    childList: true,
    subtree: true,
  });

  return observer;
}
