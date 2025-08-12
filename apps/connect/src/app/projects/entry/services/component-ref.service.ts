import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ComponentReferenceService {
  public hasSetComponents = signal(false);
  public domainsTabComponent!: any;
  public macromoleculesTabComponent!: any;
  public llmTabComponent!: any;

  public getComponent(componentType: 'domains' | 'macromolecules' | 'llm') {
    if (componentType === 'domains') {
      return this.domainsTabComponent;
    } else if (componentType === 'macromolecules') {
      return this.macromoleculesTabComponent;
    } else {
      // else if (componentType === 'llm') {
      return this.llmTabComponent;
    }
  }

  public setComponent(componentType: 'domains' | 'macromolecules' | 'llm', component: any) {
    if (!component) return;
    if (componentType === 'domains') {
      this.domainsTabComponent = component;
    } else if (componentType === 'macromolecules') {
      this.macromoleculesTabComponent = component;
    } else if (componentType === 'llm') {
      this.llmTabComponent = component;
    }
    if (this.domainsTabComponent && this.macromoleculesTabComponent && this.llmTabComponent) {
      this.hasSetComponents.set(true);
    }
  }
}
