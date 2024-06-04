import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RelatedLigandsComponent } from './related-ligands.component';
import { HttpClientModule } from '@angular/common/http';

describe('RelatedLigandsComponent', () => {
  let component: RelatedLigandsComponent;
  let fixture: ComponentFixture<RelatedLigandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedLigandsComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatedLigandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
