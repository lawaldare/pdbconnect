import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import * as L from 'leaflet';
// import 'leaflet.markercluster';

import L from 'leaflet/dist/leaflet.js'; // Explicit ESM import
import 'leaflet.markercluster/dist/leaflet.markercluster-src.js'; // ESM-compatible version

declare var gtag;

@Component({
  selector: 'app-partners-map',
  templateUrl: './partners-map.component.html',
  styleUrls: ['./partners-map.component.css'],
  standalone: false,
})
export class PartnersMapComponent implements OnInit {
  @Output() map$: EventEmitter<L.Map> = new EventEmitter();
  @Output() zoom$: EventEmitter<number> = new EventEmitter();

  private _jsonURL = 'assets/data/partners_descriptions.json';

  /**
   * Constant used to control partners colors on map
   * also used to draw the bottom-left legend
   */
  markers_colors = {
    'Biophysical parameters': '#8495a9',
    'Small-molecule sites': '#00596c',
    'Protein binding sites': '#00897b',
    'Proteins/domains': '#13c66d',
    'Evolutionary conserved sites': '#84e18f',
    'Mutations/variations': '#d9f3ce',
  };

  public map: L.Map;
  public zoom: number;

  public partner_count = 0;
  public country_count = 0;

  public partners_data: any;
  public country_data = null;

  public marker_group_dict: any[] = [];

  /**
   * Function to retrieve JSON data describing each partner resource
   * @returns JSON data as Observable from descriptions json
   */
  public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

  /**
   * Function to retrieve and count partner resource data and to call map generation
   */
  getAndPlotData() {
    this.getJSON().subscribe((jsondata) => {
      this.partners_data = Object.values(jsondata).reduce(
        (arr: any[], v: any) => {
          arr.push(...v);
          return arr;
        },
        []
      );
      this.partner_count = this.partners_data.length;
      this.createMap();
    });
  }

  constructor(private http: HttpClient) {
    this.getAndPlotData();
  }

  ngOnInit(): void {}

  /**
   * Function to bind leaflet events when map is ready
   * @param map
   */
  onMapReady(map: L.Map) {
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
  clusterMouseOver(c, marker_name) {
    // Get and check map existance
    var map = this.map;
    if (!map) {
      map = L.map('map', { scrollWheelZoom: false });
      this.map = map;
    }

    // Get content from all child markers of a cluster and checks if they are all from the same city
    var childMarkers = c.layer.getAllChildMarkers();
    var sameCity = true;
    var lastCity = null;
    var childData = childMarkers.map((e_cmarker) => {
      let pop_data = e_cmarker._popup._content;
      let city = pop_data.split('<b>')[1].split(',')[0];
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
    var popData = styled_location + childData.join(', ');

    // Pop-up is triggered
    L.popup().setLatLng(c.layer.getLatLng()).setContent(popData).openOn(map);
  }

  /**
   * Function that listen to window changes and switches zoom on mouse scroll
   * (fixes scroll issues on small screen sizes)
   */
  @HostListener('window:resize', ['$event'])
  mapResize() {
    if (this.map) {
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
  createMap() {
    // Partners data is parsed and clustered by country name
    let unique_countries = this.partners_data
      .map((ec: any) => ec.country)
      .filter((coun, i, arr) => arr.indexOf(coun) === i);
    this.country_count = unique_countries.length;
    this.marker_group_dict = unique_countries.reduce((obj, coun) => {
      obj[coun] = L.markerClusterGroup({ singleMarkerMode: true });
      return obj;
    }, {});

    // Constants for map initialization (zoom and center coordinates)
    var initialZoomLevel = 2, // default zoom level
      initialLat = 30,
      initialLon = -10.5;

    // Map initialization
    var map = this.map;
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
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16,
      }
    ).addTo(this.map);

    // Iterates over the data of each partner
    for (let i_p = 0; i_p < this.partners_data.length; i_p++) {
      let city = this.partners_data[i_p]['city'];

      // creates a marker for each partner (aggregated in marker clusters by Country name)
      let marker = L.marker([
        this.partners_data[i_p]['coords'][0],
        this.partners_data[i_p]['coords'][1],
      ]);

      let cname = this.partners_data[i_p]['country'];
      let current_color = this.markers_colors[this.partners_data[i_p]['type']];

      // style of marker content is defined based on category of partnert
      let txt_color = 'white';
      if (
        this.partners_data[i_p]['type'] === 'Small-molecule sites' ||
        this.partners_data[i_p]['type'] === 'Protein binding sites' ||
        this.partners_data[i_p]['type'] === 'Mutations/variations'
      ) {
        txt_color = 'black';
      }

      // marker content includes a title of "City, Country Name" followed by a colored anchor link to each partner's page
      let partners_tag = `<a target="_blank" style='border-radius: 5px; color: ${txt_color}; padding: 2px; line-height:2 ; background: ${current_color}' href="${this.partners_data[i_p]['url']}">${this.partners_data[i_p]['name']}</a>`;
      marker.bindPopup('<b>' + city + ', ' + cname + '</b><br>' + partners_tag);
      marker.on('mouseover', function (ev) {
        ev.target.openPopup();
      });
      this.marker_group_dict[cname].addLayer(marker);
    }

    // Bind function to open pop-ups when each cluster is hovered (clusterMouseOver)
    // and to close pop-ups when each cluster is clicked after hovering
    for (const [marker_name, marker_group] of Object.entries(
      this.marker_group_dict
    )) {
      (marker_group as L.MarkerClusterGroup)
        .on('clustermouseover', (c) => this.clusterMouseOver(c, marker_name))
        .on('clusterclick', function (c) {
          map.closePopup();
        });
      // add clusters to map
      this.map.addLayer(marker_group as L.Layer);
    }

    // Generation of coloured legend displayed on bottom left corner of map
    const markers_colors = this.markers_colors;
    var legend = new L.Control({ position: 'bottomleft' }); // Legend object instantiated

    legend.onAdd = function (map) {
      // when legend is added to map, generate HTML content of legend

      var div = L.DomUtil.create('div', 'info legend'); // create a legend div
      var labels: string[] = [];
      // create a array of html tags for each legend category
      // each html tag is a <i> with category color as background followed by category name as text content
      for (const [name, color] of Object.entries(markers_colors)) {
        labels.push('<i style="background:' + color + '"></i> ' + name);
      }
      // define content of legend div: title followed by <br> spaced html tags for legend categories
      div.innerHTML =
        '<div id="anno-leg-title-container"><span id="anno-leg-title">Annotations type:</span></div>' +
        labels.join('<br>');
      return div;
    };

    legend.addTo(map);
  }
}
