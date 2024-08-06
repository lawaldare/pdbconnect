import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NameValueComponent } from './name-value.component';
import { ChangeDetectionStrategy } from '@angular/core';

describe('NameValueComponent', () => {
  let component: NameValueComponent;
  let fixture: ComponentFixture<NameValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NameValueComponent],
    })
      .overrideComponent(NameValueComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NameValueComponent);
    component = fixture.componentInstance;
    component.data = { name: 'Test', value: 'Test' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
