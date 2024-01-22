import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { PdbeChipsStyleDatum } from '@pdbe-lib/chips';

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

  it('should show advanced button by default', () => {
    expect(component.hasAdvancedSearch).toBeTruthy();
  });

  it('should placeholder property value should be the input placeholder', () => {
    component.placeholder = 'Test placeholder';
    fixture.detectChanges();
    const inputEle = fixture.nativeElement.querySelector('#searchitem');
    expect(inputEle.placeholder).toEqual('Test placeholder');
  });

  it('should display PDBe chips according to examples property', () => {
    component.searchChipsStyle = new PdbeChipsStyleDatum();
    component.searchButtonChipsType === 'PDBe';
    component.examples = [
      { label: 'AAA', url: 'https://www.ebi.ac.uk/1' },
      { label: 'BBB', url: 'https://www.ebi.ac.uk/2' },
      { label: 'CCC', url: 'https://www.ebi.ac.uk/3' },
    ];
    fixture.detectChanges();

    const anchorEles = fixture.nativeElement.querySelectorAll('pdbc-pdbe-chips > a');
    expect(anchorEles.length).toEqual(3);

    expect(anchorEles[0]).toBeTruthy();
    expect(anchorEles[0].innerHTML).toContain('AAA');
    expect(anchorEles[0].href).toEqual('https://www.ebi.ac.uk/1');

    expect(anchorEles[1]).toBeTruthy();
    expect(anchorEles[1].innerHTML).toContain('BBB');
    expect(anchorEles[1].href).toEqual('https://www.ebi.ac.uk/2');

    expect(anchorEles[2]).toBeTruthy();
    expect(anchorEles[2].innerHTML).toContain('CCC');
    expect(anchorEles[2].href).toEqual('https://www.ebi.ac.uk/3');
  });

  // it('should toggle showClearIcon property depending on input text', fakeAsync(() => {
  //   component.searchTermStream.next('AAAAA');
  //   tick(300);
  //   expect(component.showClearIcon).toBeTruthy();

  //   component.searchTermStream.next('');
  //   tick(300);
  //   expect(component.showClearIcon).toBeFalsy();
  // }));

  // it('should display clear icon according to showClearIcon property', () => {
  //   component.showClearIcon = true;
  //   fixture.detectChanges();
  //   const ele1 = fixture.nativeElement.querySelector('.search-clear-icon');
  //   expect(ele1).toBeTruthy();

  //   component.showClearIcon = false;
  //   fixture.detectChanges();
  //   const ele2 = fixture.nativeElement.querySelector('.search-clear-icon');
  //   expect(ele2).toBeFalsy();
  // });

  // it('should display Beta', () => {
  //   component.beta = true;
  //   fixture.detectChanges();
  //   const betaEle = fixture.nativeElement.querySelector('#beta');
  //   expect(betaEle).toBeTruthy();
  // });
});
