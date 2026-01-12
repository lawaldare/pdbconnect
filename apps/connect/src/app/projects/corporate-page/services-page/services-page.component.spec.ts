import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesPageComponent } from './services-page.component';
declare var gtag;

describe('ServicesPageComponent', () => {
  let component: ServicesPageComponent;
  let fixture: ComponentFixture<ServicesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesPageComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ServicesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should scroll to aggregated views', () => {
  //   // as suggested by https://stackoverflow.com/questions/48722982/testing-scrollintoview-while-unit-testing-angular
  //   // since: https://github.com/karma-runner/karma/issues/345
  //   const scroll_to_element = fixture.debugElement.nativeElement.querySelector('#aggregated_views'); // example a, h1, p
  //   spyOn(scroll_to_element, 'scrollIntoView').and.callThrough();
  //   const element = fixture.debugElement.nativeElement.querySelector('#aggregated_views_menu');
  //   element.click();
  //   expect(scroll_to_element.scrollIntoView).toHaveBeenCalled();
  // });

  // it('should scroll to aggregated views of proteins', () => {
  //   // as suggested by https://stackoverflow.com/questions/48722982/testing-scrollintoview-while-unit-testing-angular
  //   // since: https://github.com/karma-runner/karma/issues/345
  //   const scroll_to_element = fixture.debugElement.nativeElement.querySelector('#aggregated_views_proteins'); // example a, h1, p
  //   spyOn(scroll_to_element, 'scrollIntoView').and.callThrough();
  //   const element = fixture.debugElement.nativeElement.querySelector('#aggregated_views_proteins_menu');
  //   element.click();
  //   expect(scroll_to_element.scrollIntoView).toHaveBeenCalled();
  // });

  // it('should scroll to 3d beacns network', () => {
  //   // as suggested by https://stackoverflow.com/questions/48722982/testing-scrollintoview-while-unit-testing-angular
  //   // since: https://github.com/karma-runner/karma/issues/345
  //   const scroll_to_element = fixture.debugElement.nativeElement.querySelector('#beacons'); // example a, h1, p
  //   spyOn(scroll_to_element, 'scrollIntoView').and.callThrough();
  //   const element = fixture.debugElement.nativeElement.querySelector('#beacons_menu');
  //   element.click();
  //   expect(scroll_to_element.scrollIntoView).toHaveBeenCalled();
  // });

  // it('should scroll to graph database', () => {
  //   // as suggested by https://stackoverflow.com/questions/48722982/testing-scrollintoview-while-unit-testing-angular
  //   // since: https://github.com/karma-runner/karma/issues/345
  //   const scroll_to_element = fixture.debugElement.nativeElement.querySelector('#graph_database'); // example a, h1, p
  //   spyOn(scroll_to_element, 'scrollIntoView').and.callThrough();
  //   const element = fixture.debugElement.nativeElement.querySelector('#graph_database_menu');
  //   element.click();
  //   expect(scroll_to_element.scrollIntoView).toHaveBeenCalled();
  // });

  // it('should scroll to api', () => {
  //   // as suggested by https://stackoverflow.com/questions/48722982/testing-scrollintoview-while-unit-testing-angular
  //   // since: https://github.com/karma-runner/karma/issues/345
  //   const scroll_to_element = fixture.debugElement.nativeElement.querySelector('#api'); // example a, h1, p
  //   spyOn(scroll_to_element, 'scrollIntoView').and.callThrough();
  //   const element = fixture.debugElement.nativeElement.querySelector('#api_menu');
  //   element.click();
  //   expect(scroll_to_element.scrollIntoView).toHaveBeenCalled();
  // });

  // it('should scroll to pdbe-kb component library', () => {
  //   // as suggested by https://stackoverflow.com/questions/48722982/testing-scrollintoview-while-unit-testing-angular
  //   // since: https://github.com/karma-runner/karma/issues/345
  //   const scroll_to_element = fixture.debugElement.nativeElement.querySelector('#pdbekb_component'); // example a, h1, p
  //   spyOn(scroll_to_element, 'scrollIntoView').and.callThrough();
  //   const element = fixture.debugElement.nativeElement.querySelector('#pdbekb_component_menu');
  //   element.click();
  //   expect(scroll_to_element.scrollIntoView).toHaveBeenCalled();
  // });

  // it('should scroll to public ftp area', () => {
  //   // as suggested by https://stackoverflow.com/questions/48722982/testing-scrollintoview-while-unit-testing-angular
  //   // since: https://github.com/karma-runner/karma/issues/345
  //   const scroll_to_element = fixture.debugElement.nativeElement.querySelector('#public_ftp'); // example a, h1, p
  //   spyOn(scroll_to_element, 'scrollIntoView').and.callThrough();
  //   const element = fixture.debugElement.nativeElement.querySelector('#public_ftp_menu');
  //   element.click();
  //   expect(scroll_to_element.scrollIntoView).toHaveBeenCalled();
  // });

  // it('should scroll to other services', () => {
  //   // as suggested by https://stackoverflow.com/questions/48722982/testing-scrollintoview-while-unit-testing-angular
  //   // since: https://github.com/karma-runner/karma/issues/345
  //   const scroll_to_element = fixture.debugElement.nativeElement.querySelector('#other_services'); // example a, h1, p
  //   spyOn(scroll_to_element, 'scrollIntoView').and.callThrough();
  //   const element = fixture.debugElement.nativeElement.querySelector('#other_services_menu');
  //   element.click();
  //   expect(scroll_to_element.scrollIntoView).toHaveBeenCalled();
  // });



});
