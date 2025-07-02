import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmartSeqViewerComponent } from './smart-seq-viewer.component';

describe('SmartSeqViewerComponent', () => {
  let component: SmartSeqViewerComponent;
  let fixture: ComponentFixture<SmartSeqViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartSeqViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmartSeqViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
