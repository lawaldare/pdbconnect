/* eslint-disable @angular-eslint/no-input-rename */
import { Directive, Input, ElementRef, Renderer2, inject, SimpleChanges, OnChanges } from '@angular/core';

@Directive({
  selector: '[sequence-domain]',
  standalone: true,
})
export class SequenceDomainDirective implements OnChanges {
  @Input() entityId!: number;
  @Input() interproMappings!: any;
  @Input() pfamMappings!: any;

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  ngOnChanges(changes: SimpleChanges) {
    const entityId = changes['entityId']?.currentValue;
    const interproMappings = changes['interproMappings']?.currentValue;
    const pfamMappings = changes['pfamMappings']?.currentValue;

    // console.log(interproMappings, pfamMappings);

    const interproMappingsMatched = this.getObjectsByEntityId(interproMappings, entityId);

    const pfamMappingsMatched = this.getObjectsByEntityId(pfamMappings, entityId);

    const interproNames = interproMappingsMatched.map((m) => m.name);

    const pfamDescriptions = pfamMappingsMatched.map((m) => m.description);

    const matched = [...interproNames, ...pfamDescriptions];

    // console.log(matched);

    const div = this.renderer.createElement('div');
    this.renderer.addClass(div, 'scrollable-content');
    this.renderer.appendChild(this.el.nativeElement, div);

    const ul = this.renderer.createElement('ul');
    this.renderer.appendChild(div, ul);

    matched.forEach((s) => {
      const li = this.renderer.createElement('li');
      const a = this.renderer.createElement('a');
      a.textContent = s;
      a.href = '';
      this.renderer.appendChild(li, a);
      this.renderer.appendChild(ul, li);
    });
  }

  private getObjectsByEntityId(data: any, entityId: number): any[] {
    const results: any[] = [];
    const seen = new Set();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const mappings = data[key].mappings;

        for (const mapping of mappings) {
          if (mapping.entity_id === entityId) {
            const serializedMapping = JSON.stringify(data[key]);

            if (!seen.has(serializedMapping)) {
              seen.add(serializedMapping);
              results.push(data[key]);
            }
          }
        }
      }
    }

    return results;
  }
}
