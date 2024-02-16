import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdbeSearchAutocompleteComponent } from './pdbe-search-autocomplete.component';

describe('PdbeSearchAutocompleteComponent', () => {
  let component: PdbeSearchAutocompleteComponent;
  let fixture: ComponentFixture<PdbeSearchAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdbeSearchAutocompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdbeSearchAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
