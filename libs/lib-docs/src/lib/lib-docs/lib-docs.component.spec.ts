import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibDocsComponent } from './lib-docs.component';

describe('LibDocsComponent', () => {
  let component: LibDocsComponent;
  let fixture: ComponentFixture<LibDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibDocsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LibDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
