import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { PdbeHeaderSearchComponent } from './pdbe-header-search.component';

describe('PdbeHeaderSearchComponent', () => {
  let component: PdbeHeaderSearchComponent;
  let fixture: ComponentFixture<PdbeHeaderSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdbeHeaderSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdbeHeaderSearchComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show clear icon by default', () => {
    expect(component.showClearIcon).toBeFalsy();
  });

  it('should placeholder property value should be the input placeholder', () => {
    component.placeholder = 'Test placeholder';
    fixture.detectChanges();
    const inputEle = fixture.nativeElement.querySelector('#searchitem');
    expect(inputEle.placeholder).toEqual('Test placeholder');
  });

  it('should toggle showClearIcon property depending on input text', fakeAsync(() => {
    component.searchTermStream.next('AAAAA');
    tick(300);
    expect(component.showClearIcon).toBeTruthy();

    component.searchTermStream.next('');
    tick(300);
    expect(component.showClearIcon).toBeFalsy();
  }));

  it('should display clear icon according to showClearIcon property', () => {
    component.showClearIcon = true;
    fixture.detectChanges();
    const ele1 = fixture.nativeElement.querySelector('.search-clear-icon');
    expect(ele1).toBeTruthy();

    component.showClearIcon = false;
    fixture.detectChanges();
    const ele2 = fixture.nativeElement.querySelector('.search-clear-icon');
    expect(ele2).toBeFalsy();
  });

  it('should display Beta', () => {
    component.beta = true;
    fixture.detectChanges();
    const betaEle = fixture.nativeElement.querySelector('#beta');
    expect(betaEle).toBeTruthy();
  });
});
