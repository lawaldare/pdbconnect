/* eslint-disable @angular-eslint/prefer-inject */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Output, EventEmitter, HostListener, inject, computed, effect, signal, PLATFORM_ID, Inject } from '@angular/core';
import { L, loadMarkerCluster } from './leaflet-markercluster';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CorporatePagesApiService } from '../services/corporate-pages-api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { markersColors } from '../corporate-page.constant';

declare const gtag: any;

@Component({
  selector: 'pdbc-partners-map',
  templateUrl: './partners-map.component.html',
  styleUrls: ['./partners-map.component.scss'],
  imports: [CommonModule],
})
export class PartnersMapComponent {
  private readonly cpApiService = inject(CorporatePagesApiService);
  public readonly partnersDescriptionData = toSignal(this.cpApiService.getPartnersDescriptionData(), { initialValue: {} });
  private mapInitialized = signal(false);

  public partnersData = computed(() => {
    const data = this.partnersDescriptionData();
    if (data) {
      return Object.values(data).reduce((arr: any[], v: any) => {
        arr.push(...v);
        return arr;
      }, []);
    }
    return [];
  });

  public partnersCount = computed(() => {
    const data = this.partnersData();
    return data ? data.length : 0;
  });

  @Output() map$: EventEmitter<L.Map> = new EventEmitter();
  @Output() zoom$: EventEmitter<number> = new EventEmitter();

  private readonly markerColors: any = markersColors;

  public map!: L.Map;
  public zoom!: number;

  public country_count = 0;
  public country_data = null;
  public marker_group_dict: any[] = [];
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    effect(() => {
      const partners = this.partnersData();
      if (this.isBrowser && !this.mapInitialized() && partners.length) {
        this.mapInitialized.set(true);
        this.createMap();
      }
    });
  }

  /**
   * Function to bind leaflet events when map is ready
   * @param map
   */
  onMapReady(map: any) {
    this.map = map;
    this.map$.emit(map);
    this.zoom = map.getZoom();
    this.zoom$.emit(this.zoom);
  }

  /**
   * Functions generates a pop up when user hovers over a cluster marker
   * @param c cluster marker
   * @param marker_name "name" of cluster marker (Country names in this case)
   */
  clusterMouseOver(c: any, marker_name: any) {
    // Get and check map existance
    let map = this.map;
    if (!map) {
      map = L.map('map', { scrollWheelZoom: false });
      this.map = map;
    }

    // Get content from all child markers of a cluster and checks if they are all from the same city
    const childMarkers = c.layer.getAllChildMarkers();
    let sameCity = true;
    let lastCity: any = null;
    const childData = childMarkers.map((e_cmarker: any) => {
      const pop_data = e_cmarker._popup._content;
      const city = pop_data.split('<b>')[1].split(',')[0];
      if (!lastCity) {
        lastCity = city;
      } else if (lastCity !== city) {
        sameCity = false;
      }
      return pop_data.split('</b><br>')[1];
    });

    // Pop-up title is named by "Country" or "City, Country" accordingly
    let styled_location = '<b>' + marker_name + '</b><br>';
    if (sameCity) {
      styled_location = '<b>' + lastCity + ', ' + marker_name + '</b><br>';
    }

    // Pop-up is composed of title and child data (Coloured boxes containing links)
    const popData = styled_location + childData.join(', ');

    // Pop-up is triggered
    L.popup().setLatLng(c.layer.getLatLng()).setContent(popData).openOn(map);
  }

  /**
   * Function that listen to window changes and switches zoom on mouse scroll
   * (fixes scroll issues on small screen sizes)
   */
  @HostListener('window:resize')
  mapResize() {
    if (this.isBrowser && this.map) {
      if (window.innerWidth < 900) {
        this.map.scrollWheelZoom.disable();
      } else {
        this.map.scrollWheelZoom.enable();
      }
    }
  }

  /**
   * Main function to create map from JSON
   */
  async createMap() {
    if (!this.isBrowser) return; // 🛑 Stop server here
    await loadMarkerCluster();
    const unique_countries = this.partnersData()
      .map((ec: any) => ec.country)
      .filter((coun: any, i: any, arr: any) => arr.indexOf(coun) === i);
    this.country_count = unique_countries.length;
    this.marker_group_dict = unique_countries.reduce((obj: { [x: string]: any }, coun: string | number) => {
      obj[coun] = L.markerClusterGroup({ singleMarkerMode: true });
      return obj;
    }, {});

    // Constants for map initialization (zoom and center coordinates)
    const initialZoomLevel = 2, // default zoom level
      initialLat = 30,
      initialLon = -10.5;

    // Map initialization
    let map = this.map;
    if (!map) {
      map = L.map('map');
      this.map = map;
    }
    this.map.setView([initialLat, initialLon], initialZoomLevel);

    // Disable mouse wheel zooming on small screens to avoid unwanted behaviour on mobile
    if (window.innerWidth < 900) {
      this.map.scrollWheelZoom.disable();
    }

    // Register zoom events on google analytics
    this.map.on('zoomend', () => {
      gtag('event', 'map_zoom', {
        event_category: 'partners_map_click',
        event_label: 'map_zoom',
        value: undefined,
      });
    });

    // Defines the map overall style. This is the same of a live EBI map
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      maxZoom: 16,
    }).addTo(this.map);

    // Iterates over the data of each partner
    for (let i_p = 0; i_p < this.partnersData().length; i_p++) {
      const city = this.partnersData()[i_p]['city'];

      // creates a marker for each partner (aggregated in marker clusters by Country name)
      const marker = L.marker([this.partnersData()[i_p]['coords'][0], this.partnersData()[i_p]['coords'][1]]);

      const cname = this.partnersData()[i_p]['country'];
      const current_color = this.markerColors[this.partnersData()[i_p]['type']];

      // style of marker content is defined based on category of partnert
      let txt_color = 'white';
      if (
        this.partnersData()[i_p]['type'] === 'Small-molecule sites' ||
        this.partnersData()[i_p]['type'] === 'Protein binding sites' ||
        this.partnersData()[i_p]['type'] === 'Mutations/variations'
      ) {
        txt_color = 'black';
      }

      // marker content includes a title of "City, Country Name" followed by a colored anchor link to each partner's page
      const partners_tag = `<a target="_blank" style='border-radius: 5px; color: ${txt_color}; padding: 2px; line-height:2 ; background: ${current_color}' href="${
        this.partnersData()[i_p]['url']
      }">${this.partnersData()[i_p]['name']}</a>`;
      marker.bindPopup('<b>' + city + ', ' + cname + '</b><br>' + partners_tag);
      marker.on('mouseover', function (ev: any) {
        ev.target.openPopup();
      });
      this.marker_group_dict[cname].addLayer(marker);
    }

    // Bind function to open pop-ups when each cluster is hovered (clusterMouseOver)
    // and to close pop-ups when each cluster is clicked after hovering
    for (const [marker_name, marker_group] of Object.entries(this.marker_group_dict)) {
      (marker_group as any)
        .on('clustermouseover', (c: any) => this.clusterMouseOver(c, marker_name))
        .on('clusterclick', function (c: any) {
          map.closePopup();
        });
      // add clusters to map
      this.map.addLayer(marker_group as L.Layer);
    }

    // Generation of coloured legend displayed on bottom left corner of map
    const markers_colors = this.markerColors;
    const legend = new L.Control({ position: 'bottomleft' }); // Legend object instantiated

    legend.onAdd = function (map: any) {
      // when legend is added to map, generate HTML content of legend

      const div = L.DomUtil.create('div', 'info legend'); // create a legend div
      const labels: string[] = [];
      // create a array of html tags for each legend category
      // each html tag is a <i> with category color as background followed by category name as text content
      for (const [name, color] of Object.entries(markers_colors)) {
        labels.push('<i style="background:' + color + '"></i> ' + name);
      }
      // define content of legend div: title followed by <br> spaced html tags for legend categories
      div.innerHTML = '<div id="anno-leg-title-container"><span id="anno-leg-title">Annotations type:</span></div>' + labels.join('<br>');
      return div;
    };

    legend.addTo(map);
  }
}
