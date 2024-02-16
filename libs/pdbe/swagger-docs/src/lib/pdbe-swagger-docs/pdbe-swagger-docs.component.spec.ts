import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdbeSwaggerDocsComponent } from './pdbe-swagger-docs.component';

describe('PdbeSwaggerDocsComponent', () => {
  let component: PdbeSwaggerDocsComponent;
  let fixture: ComponentFixture<PdbeSwaggerDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdbeSwaggerDocsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdbeSwaggerDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
