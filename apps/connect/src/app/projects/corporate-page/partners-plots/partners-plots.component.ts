import { Component, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ScriptLoaderService } from '@pdbc/core';

declare const Highcharts: any;

@Component({
  selector: 'pdbc-partners-plots',
  templateUrl: './partners-plots.component.html',
  styleUrls: ['./partners-plots.component.scss'],
})
export class PartnersPlotsComponent {
  private _partnersURL = 'assets/corporate-page/data/partners_descriptions.json';

  resource_protein_count: any = null;
  category_protein_count: any = null;
  last_update_data: any = null;
  all_loaded = false;

  markers_colors: any = {
    'Biophysical parameters': '#8495a9',
    'Small-molecule sites': '#00596c',
    'Protein binding sites': '#00897b',
    'Proteins/domains': '#13c66d',
    'Evolutionary conserved sites': '#84e18f',
    'Mutations/variations': '#d9f3ce',
  };

  public readonly plotData = computed(() => environment.plot_data ?? 'https://www.ebi.ac.uk/pdbe/static/kb_statistics/plot_data.json');
  public readonly partnersLastUpdate = computed(
    () => environment.partners_last_update ?? 'https://www.ebi.ac.uk/pdbe/static/kb_statistics/partners_last_update.json'
  );

  constructor(
    private http: HttpClient,
    private scriptLoader: ScriptLoaderService
  ) {
    this.getDataAndPlot();
  }

  getDataAndPlot() {
    forkJoin([
      // this.getProteinCount(),
      this.getPartnersJSON(),
      this.getProteinCountCategory(),
      this.getLastUpdates(),
    ])
      // .subscribe(([resource_protein_count, category_protein_count, last_update_data]) => {
      // Future: https://stackoverflow.com/a/52610468
      .subscribe(([resource_descriptions, protein_count, last_update_data]) => {
        // this.resource_protein_count = resource_protein_count;
        this.resource_protein_count = protein_count;

        const parsed_resource_descriptions: any = Object.values(resource_descriptions).reduce((arr: any, each_rd: any) => {
          arr.push(...each_rd);
          return arr;
        }, []);

        this.resource_protein_count = this.resource_protein_count.map((each_resource: any) => {
          let found_resource_description = parsed_resource_descriptions.filter((each_rd: any) => each_rd['name'] === each_resource['name']);
          if (found_resource_description.length > 0) {
            found_resource_description = found_resource_description[0];
            each_resource['type'] = found_resource_description['type'];
            each_resource['annotation_type'] = found_resource_description['annotation_type'];
            each_resource['color'] = this.markers_colors[each_resource['type']];
          }
          return each_resource;
        });

        this.category_protein_count = this.resource_protein_count.reduce(
          (obj: { [x: string]: { [x: string]: any }; hasOwnProperty: (arg0: any) => any }, each_resource_count: { [x: string]: any }) => {
            if (each_resource_count['annotation_type'].length > 1) {
              if (!Object.prototype.hasOwnProperty.call(obj, each_resource_count['annotation_type'])) {
                obj[each_resource_count['annotation_type']] = {
                  name: each_resource_count['annotation_type'],
                  y: 0,
                  type: each_resource_count['type'],
                };
                obj[each_resource_count['annotation_type']]['y'] += each_resource_count['y'];
              }
            }
            return obj;
          },
          {}
        );

        this.category_protein_count = Object.values(this.category_protein_count).reduce((obj: any, each_datum: any) => {
          if (!Object.prototype.hasOwnProperty.call(obj, each_datum['type'])) {
            obj[each_datum['type']] = {
              name: each_datum['type'],
              color: this.markers_colors[each_datum['type']],
              data: [],
            };
          }
          obj[each_datum['type']]['data'].push(each_datum);
          return obj;
        }, {});

        this.last_update_data = this.parseUpdateData(last_update_data);

        if (this.resource_protein_count !== null && this.category_protein_count !== null && this.last_update_data !== null) {
          this.all_loaded = true;
          this.generatePlots();
        }
        // this.all_loaded = true;
        // this.generatePlots();
      });
  }

  public getPartnersJSON(): Observable<any> {
    return this.http.get(this._partnersURL);
  }
  public getProteinCountCategory(): Observable<any> {
    return this.http.get(this.plotData());
  }
  public getLastUpdates(): Observable<any> {
    return this.http.get(this.partnersLastUpdate());
  }

  parseUpdateData(data: any) {
    return data
      .map((datum: any) => {
        return [datum[0], Date.UTC(datum[1], datum[2] - 1, datum[3])];
      })
      .sort((a: any, b: any) => {
        return a[1] - b[1];
      });
  }

  // updateChartVisibility(chart_id: string) {
  //   if (chart_id) {
  //     document.getElementById(`chart-1`)
  //       .classList.remove('chart-holder-div-current');
  //     document.getElementById(`chart-1-plot`).classList.add('display-none');
  //     document
  //       .getElementById(`chart-2`)
  //       .classList.remove('chart-holder-div-current');
  //     document.getElementById(`chart-2-plot`).classList.add('display-none');
  //     document
  //       .getElementById(`chart-3`)
  //       .classList.remove('chart-holder-div-current');
  //     document.getElementById(`chart-3-plot`).classList.add('display-none');
  //     document
  //       .getElementById(`${chart_id}`)
  //       .classList.add('chart-holder-div-current');
  //     document
  //       .getElementById(`${chart_id}-plot`)
  //       .classList.remove('display-none');
  //   }
  // }

  public updateChartVisibility(chartId: string) {
    if (!chartId) return;

    document.getElementById('chart-1')?.classList.remove('chart-holder-div-current');
    document.getElementById('chart-1-plot')?.classList.add('display-none');

    document.getElementById('chart-2')?.classList.remove('chart-holder-div-current');
    document.getElementById('chart-2-plot')?.classList.add('display-none');

    document.getElementById('chart-3')?.classList.remove('chart-holder-div-current');
    document.getElementById('chart-3-plot')?.classList.add('display-none');

    document.getElementById(chartId)?.classList.add('chart-holder-div-current');
    document.getElementById(`${chartId}-plot`)?.classList.remove('display-none');
  }

  generatePlots() {
    //TODO:
    // add protein and resource type plots
    const today = new Date();
    const today_day = today.getDate();
    const today_month = today.getMonth();
    const today_year = today.getFullYear();
    const sorted_category_names = this.last_update_data.map((each_cat: any) => each_cat[0]);

    let all_series_chart_1 = this.resource_protein_count.reduce((obj: any, each_datum: { [x: string]: any; type: string | number }) => {
      if (!Object.prototype.hasOwnProperty.call(obj, each_datum['type'])) {
        obj[each_datum['type']] = {
          name: each_datum['type'],
          color: each_datum['color'],
          data: [],
        };
      }
      obj[each_datum.type]['data'].push(each_datum);
      return obj;
    }, {});
    all_series_chart_1 = Object.values(all_series_chart_1);
    Highcharts.chart('chart-1-plot', {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Number of proteins by resource',
      },
      xAxis: {
        type: 'category',
        title: {
          text: 'Resources',
        },
      },
      plotOptions: {
        series: {
          pointWidth: 15,
        },
      },
      yAxis: {
        title: {
          text: 'Number of proteins',
        },
      },
      // legend: {
      //   enabled: false
      // },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -0,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true,
        itemStyle: {
          fontSize: '12px',
        },
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 768,
            },
            chartOptions: {
              legend: {
                x: 0,
                y: 50,
              },
            },
          },
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                itemStyle: {
                  fontSize: '10px',
                },
              },
              xAxis: {
                labels: {
                  style: {
                    fontSize: '8px',
                  },
                },
              },
              plotOptions: {
                series: {
                  pointWidth: 8,
                },
              },
            },
          },
          {
            condition: {
              maxWidth: 400,
            },
            chartOptions: {
              legend: {
                itemStyle: {
                  fontSize: '8px',
                },
              },
            },
          },
          {
            condition: {
              maxWidth: 350,
            },
            chartOptions: {
              legend: {
                x: -5,
                y: 35,
                itemStyle: {
                  fontSize: '8px',
                },
              },
              title: {
                style: {
                  fontSize: '13px',
                },
              },
            },
          },
        ],
      },
      series: all_series_chart_1,

      // series: [
      //   {
      //     name: "",
      //     // colorByPoint: true,
      //     data: this.resource_protein_count
      //   }
      // ]
    });
    const all_series_chart_2 = Object.values(this.category_protein_count);
    Highcharts.chart('chart-2-plot', {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Number of proteins by annotation type',
      },
      xAxis: {
        type: 'category',
        title: {
          text: 'Annotation type',
        },
      },
      plotOptions: {
        series: {
          pointWidth: 15,
        },
      },
      yAxis: {
        title: {
          text: 'Number of proteins',
        },
      },
      // legend: {
      //   enabled: false
      // },
      // series: [
      //   {
      //     name: "",
      //     colorByPoint: true,
      //     data: this.category_protein_count
      //   }
      // ]
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true,
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 768,
            },
            chartOptions: {
              legend: {
                x: 0,
                y: 50,
              },
            },
          },
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                itemStyle: {
                  fontSize: '6px',
                },
              },
              xAxis: {
                labels: {
                  style: {
                    fontSize: '8px',
                  },
                },
              },
              plotOptions: {
                series: {
                  pointWidth: 8,
                },
              },
            },
          },
          {
            condition: {
              maxWidth: 350,
            },
            chartOptions: {
              legend: {
                x: -5,
                y: 35,
              },
              title: {
                style: {
                  fontSize: '13px',
                },
              },
            },
          },
        ],
      },
      series: all_series_chart_2,
    });
    Highcharts.chart('chart-3-plot', {
      chart: {
        type: 'scatter',
      },
      title: {
        text: 'Last update for each resource',
      },
      yAxis: {
        type: 'datetime',
        // dateTimeLabelFormats: { // don't display the year
        //     month: '%e. %b',
        //     year: '%b'
        // },
        title: {
          text: 'Date',
        },
        min: Date.UTC(2019, 8, 5),
        max: Date.UTC(today_year, today_month, today_day),
      },
      xAxis: {
        title: {
          text: 'Resources',
        },
        categories: sorted_category_names,
      },
      legend: {
        enabled: false,
      },
      // tooltip: {
      //   formatter: function() {
      //       return  '<b>Update date:</b><br/>' +
      //           Highcharts.dateFormat('%e/%b/%Y', new Date(this.y));
      //   }
      // },
      // tooltip: {
      //     headerFormat: '<b>Update date:</b><br>',
      //     pointFormat: Highcharts.dateFormat('%e - %b - %Y', '{point.y}')
      // },
      tooltip: {
        headerFormat: '<b>Last update date:</b><br/>',
        pointFormat: '{point.y:%e %b %Y}',
      },
      plotOptions: {
        series: {
          marker: {
            enabled: true,
            radius: 2.5,
          },
        },
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              xAxis: {
                labels: {
                  style: {
                    fontSize: '8px',
                  },
                },
              },
              title: {
                style: {
                  fontSize: '13px',
                },
              },
            },
          },
        ],
      },

      colors: ['#6CF', '#39F', '#06C', '#036', '#000'],

      // Define the data points. All series have a year of 1970/71 in order
      // to be compared on the same x axis. Note that in JavaScript, months start
      // at 0 for January, 1 for February etc.
      series: [
        {
          data: this.last_update_data,
        },
      ],
    });
  }
}
