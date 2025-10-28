import { BehaviorSubject } from 'rxjs';
import { ProtvistaGenericBinding } from '../abstract/generic-obj.bind';
import { NewProtvistaColourEvent } from '../../track-data.model';

export class ColourIn3DButtonBinding extends ProtvistaGenericBinding {
  override bind(container: HTMLElement, eventStream: BehaviorSubject<NewProtvistaColourEvent | null>) {
    const in3DBtns = container.querySelectorAll<HTMLButtonElement>('.in-3d-btn');
    if (!in3DBtns.length) return;
    for (const in3DBtn of Array.from(in3DBtns)) {
      const eventId = in3DBtn.getAttribute('data-event-id');
      if (!eventId) continue;

      // Skip if already bound
      const alreadyBound = this.elementListeners.some((entry) => entry.element === in3DBtn);
      if (alreadyBound) continue;

      const onClickEvStream = () => {
        const prevActive = container.querySelector('.in-3d-btn.active');
        if (prevActive) prevActive.classList.remove('active');
        in3DBtn.classList.add('active');
        eventStream.next({ trackId: eventId });
      };
      in3DBtn.addEventListener('click', onClickEvStream);

      // Track for cleanup
      this.elementListeners.push({ element: in3DBtn, handlers: { type: 'click', listener: onClickEvStream } });
    }
  }
}
