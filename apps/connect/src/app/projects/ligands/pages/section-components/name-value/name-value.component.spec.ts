import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NameValueComponent } from './name-value.component';

describe('NameValueComponent', () => {
  let component: NameValueComponent;
  let fixture: ComponentFixture<NameValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NameValueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NameValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.data = { name: 'Test', value: 'Test' };
    expect(component).toBeTruthy();
  });
});
