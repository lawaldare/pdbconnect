import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

import { PartnersPageComponent } from './partners-page.component';

describe('PartnersPageComponent', () => {
  let component: PartnersPageComponent;
  let fixture: ComponentFixture<PartnersPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PartnersPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PartnersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should scroll to pdbe data', () => {
  //   // as suggested by https://stackoverflow.com/questions/48722982/testing-scrollintoview-while-unit-testing-angular
  //   // since: https://github.com/karma-runner/karma/issues/345
  //   const scroll_to_element = fixture.debugElement.nativeElement.querySelector('#pdbe_data'); // example a, h1, p
  //   spyOn(scroll_to_element, 'scrollIntoView').and.callThrough();
  //   const element = fixture.debugElement.nativeElement.querySelector('#pdbe_data_menu'); // example a, h1, p
  //   element.click();
  //   expect(scroll_to_element.scrollIntoView).toHaveBeenCalled();
  // });

  // it('should scroll to pdbe partners', () => {
  //   // as suggested by https://stackoverflow.com/questions/48722982/testing-scrollintoview-while-unit-testing-angular
  //   // since: https://github.com/karma-runner/karma/issues/345
  //   const scroll_to_element = fixture.debugElement.nativeElement.querySelector('#pdbe_partners'); // example a, h1, p
  //   spyOn(scroll_to_element, 'scrollIntoView').and.callThrough();
  //   const element = fixture.debugElement.nativeElement.querySelector('#partners_data'); // example a, h1, p
  //   element.click();
  //   expect(scroll_to_element.scrollIntoView).toHaveBeenCalled();
  // });

  it('should call getPartnersData and set attributes correctly', waitForAsync(() => {
    const response = {
      'Category 1': [
        {
          name: 'Partner 1',
          authors: 'Partner Author 1',
          short:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do, [more...]',
          long: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
          city: 'Naland',
          country: 'NA',
          type: 'Category/1',
          url: 'http://example.ac.uk/1/',
        },
      ],
      'Category 2': [
        {
          name: 'Partner 2',
          authors: 'Partner Author 2',
          short:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do, [more...]',
          long: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
          city: 'Naland',
          country: 'NA',
          type: 'Category/2',
          url: 'http://example.ac.uk/2/',
        },
      ],
    };
    const response_keys = ['Category 1', 'Category 2'];
    const response_ids = ['category_1', 'category_2'];
    spyOn(component, 'getPartnersJSON').and.returnValue(of(response));

    component.getPartnersData();

    fixture.detectChanges();
    expect(
      component.partners_data == response &&
        JSON.stringify(component.partners_categories) ==
          JSON.stringify(response_keys) &&
        JSON.stringify(component.partners_categories_ids) ==
          JSON.stringify(response_ids)
    ).toBeTruthy();
  }));
});
