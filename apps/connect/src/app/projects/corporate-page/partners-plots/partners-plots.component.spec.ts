import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { elementAt, of } from 'rxjs';

import { PartnersPlotsComponent } from './partners-plots.component';
declare var Highcharts: any;

describe('PartnersPlotsComponent', () => {
  let component: PartnersPlotsComponent;
  let fixture: ComponentFixture<PartnersPlotsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PartnersPlotsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PartnersPlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call generatePlots and set attributes correctly', waitForAsync(() => {
    const description_response = {
      'Biophysical parameters': [
        {
          name: 'mock1',
          type: 'Biophysical parameters',
          annotation_type: 'Topology annotations',
        },
        {
          name: 'mock2',
          type: 'Biophysical parameters',
          annotation_type: 'Topology annotations',
        },
        {
          name: 'mock3',
          type: 'Biophysical parameters',
          annotation_type: 'Topology annotations',
        },
      ],
    };
    const response = [
      // protein counts mock
      { name: 'mock1', y: 1000 },
      { name: 'mock2', y: 2000 },
      { name: 'mock3', y: 3000 },
    ];
    const parsed_response = [
      // protein counts mock
      {
        name: 'mock1',
        y: 1000,
        type: 'Biophysical parameters',
        annotation_type: 'Topology annotations',
        color: '#8495a9',
      },
      {
        name: 'mock2',
        y: 2000,
        type: 'Biophysical parameters',
        annotation_type: 'Topology annotations',
        color: '#8495a9',
      },
      {
        name: 'mock3',
        y: 3000,
        type: 'Biophysical parameters',
        annotation_type: 'Topology annotations',
        color: '#8495a9',
      },
    ];
    //   const response = [ // protein counts mock
    //       {"name": "mock1", "y": 1000},
    //       {"name": "mock2", "y": 2000},
    //       {"name": "mock3", "y": 3000},
    //     ];

    // const response2 = [ // category counts mock
    //     {"name": "category1", "y": 1000},
    //     {"name": "category2", "y": 2000},
    //     {"name": "category3", "y": 3000},
    //   ];

    const response3 = [
      // last updates mock
      ['mock1', 2020, 1, 1],
      ['mock2', 2021, 2, 2],
      ['mock3', 2022, 3, 3],
    ];
    const parsed_updates = [
      ['mock1', Date.UTC(2020, 0, 1)],
      ['mock2', Date.UTC(2021, 1, 2)],
      ['mock3', Date.UTC(2022, 2, 3)],
    ];
    // spyOn(component, 'getProteinCount').and.returnValue(of(response));
    // spyOn(component, 'getProteinCountCategory').and.returnValue(of(response2));
    spyOn(component, 'getPartnersJSON').and.returnValue(
      of(description_response)
    );
    spyOn(component, 'getProteinCountCategory').and.returnValue(of(response));
    spyOn(component, 'getLastUpdates').and.returnValue(of(response3));

    component.getDataAndPlot();

    // tick(5); (2)
    fixture.detectChanges();

    const plot_1 =
      fixture.debugElement.nativeElement.querySelector('#chart-1-plot'); // example a, h1, p
    // console.log(`plot1: ${plot_1}`);
    const plot_2 =
      fixture.debugElement.nativeElement.querySelector('#chart-2-plot'); // example a, h1, p
    const plot_3 =
      fixture.debugElement.nativeElement.querySelector('#chart-3-plot'); // example a, h1, p
    console.log(component.resource_protein_count);
    expect(
      JSON.stringify(component.resource_protein_count) ==
        JSON.stringify(parsed_response) &&
        // JSON.stringify(component.category_protein_count) == JSON.stringify(response['categories']) &&
        // JSON.stringify(component.category_protein_count) == JSON.stringify(response2) &&
        JSON.stringify(component.last_update_data) ==
          JSON.stringify(parsed_updates) &&
        plot_1.children.length > 1 &&
        plot_2.children.length > 1 &&
        plot_3.children.length > 1
    ).toBeTruthy();

    // flush();
  }));

  it('should show chart-1-plot', () => {
    console.log('i exist');
    component.updateChartVisibility('chart-1');
    const element =
      fixture.debugElement.nativeElement.querySelector('#chart-1-plot'); // example a, h1, p
    console.log('##############');
    console.log(`element; ${element}`);
    const element2 =
      fixture.debugElement.nativeElement.querySelector('#chart-2-plot'); // example a, h1, p
    const element3 =
      fixture.debugElement.nativeElement.querySelector('#chart-3-plot'); // example a, h1, p

    expect(
      element.classList.contains('display-none') == false &&
        element2.classList.contains('display-none') == true &&
        element3.classList.contains('display-none') == true
    ).toBeTruthy();
  });

  it('should show chart-2-plot', () => {
    component.updateChartVisibility('chart-2');

    const element =
      fixture.debugElement.nativeElement.querySelector('#chart-1-plot'); // example a, h1, p
    const element2 =
      fixture.debugElement.nativeElement.querySelector('#chart-2-plot'); // example a, h1, p
    const element3 =
      fixture.debugElement.nativeElement.querySelector('#chart-3-plot'); // example a, h1, p

    expect(
      element2.classList.contains('display-none') == false &&
        element.classList.contains('display-none') == true &&
        element3.classList.contains('display-none') == true
    ).toBeTruthy();
  });

  it('should show chart-3-plot', () => {
    component.updateChartVisibility('chart-3');

    const element =
      fixture.debugElement.nativeElement.querySelector('#chart-1-plot'); // example a, h1, p
    const element2 =
      fixture.debugElement.nativeElement.querySelector('#chart-2-plot'); // example a, h1, p
    const element3 =
      fixture.debugElement.nativeElement.querySelector('#chart-3-plot'); // example a, h1, p

    expect(
      element3.classList.contains('display-none') == false &&
        element.classList.contains('display-none') == true &&
        element2.classList.contains('display-none') == true
    ).toBeTruthy();
  });
});
