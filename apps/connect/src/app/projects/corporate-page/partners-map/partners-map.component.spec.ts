import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

import { PartnersMapComponent } from './partners-map.component';

describe('PartnersMapComponent', () => {
  let component: PartnersMapComponent;
  let fixture: ComponentFixture<PartnersMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PartnersMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PartnersMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createMap and set attributes correctly', async () => {
    const response = {
      category1: [
        {
          name: 'mock1',
          city: 'Cambridge',
          coords: [50, 60],
          country: 'United Kingdom',
          type: 'Proteins/domains',
          url: 'http://scop.mrc-lmb.cam.ac.uk/scop/',
        },
      ],
      category2: [
        {
          name: 'mock2',
          city: 'Hinxton',
          coords: [50, 60],
          country: ' United Kingdom',
          type: 'Protein binding sites',
          url: 'https://pfam.xfam.org/',
        },
      ],
    };
    const response_parsed = [
      {
        name: 'mock1',
        city: 'Cambridge',
        coords: [50, 60],
        country: 'United Kingdom',
        type: 'Proteins/domains',
        url: 'http://scop.mrc-lmb.cam.ac.uk/scop/',
      },
      {
        name: 'mock2',
        city: 'Hinxton',
        coords: [50, 60],
        country: ' United Kingdom',
        type: 'Protein binding sites',
        url: 'https://pfam.xfam.org/',
      },
    ];
    // const response2 = {
    //   "ref_country_codes" : [
    //     {
    //       "country" : "United Kingdom",
    //       "alpha2" : "GB",
    //       "alpha3" : "GBR",
    //       "numeric" : 826,
    //       "latitude" : 54,
    //       "longitude" : -2
    //     },
    // ]}

    spyOn(component, 'getJSON').and.returnValue(of(response));
    // spyOn(component, 'getCountryJSON').and.returnValue(of(response2));

    component.getAndPlotData();

    // tick(5); (2)
    fixture.detectChanges();

    const plot_map = fixture.debugElement.nativeElement.querySelector('#map'); // example a, h1, p

    expect(
      JSON.stringify(component.partners_data) ==
        JSON.stringify(response_parsed) &&
        component.partner_count == 2 &&
        plot_map.children.length > 1
    ).toBeTruthy();

    // flush();

    //https://stackoverflow.com/questions/55000562/angular-karma-test-hover
    //   await fixture.whenStable();
    //   let elt: HTMLElement = fixture.nativeElement;
    //   let hoverDivs: NodeListOf<HTMLDivElement> = elt.querySelectorAll('.marker-cluster');
    //   console.log(`HOVER: ${hoverDivs}`)
    //   hoverDivs.forEach(helper => {
    //     console.log(`HOVER 2: ${helper}`)
    //     helper.dispatchEvent(new MouseEvent('mouseover'))
    //     let popwindow = elt.querySelector('.leaflet-popup-content')
    //     console.log(`HOVER 3: ${popwindow}`)
    //     expect(popwindow).toBeTruthy()
    //     if (popwindow) {
    //       expect(popwindow.textContent.length).toBeGreaterThan(0)
    //     }
    //     helper.dispatchEvent(new MouseEvent('mouseleave'))
    //   })
  });
});
