import { NewProtvistaTrackData } from './track-data.model';

export class NewProtvistaVisualisation {
  private containerId: string;
  private containerElement: HTMLElement | null;
  private data: NewProtvistaTrackData[];

  constructor(containerId: string, data: NewProtvistaTrackData[]) {
    this.containerId = containerId;
    this.data = data;
    console.log('containerId');
    console.log(containerId);
    console.log('data');
    console.log(data);
    const containerElement = document.getElementById(this.containerId);
    if (containerElement === null) {
      throw 'Invalid container for visualisation';
    }
    this.containerElement = containerElement;
    console.log('this.containerElement');
    console.log(this.containerElement);
    this.start();
  }

  public render() {
    if (this.containerElement === null) return;
    this.containerElement.innerHTML = `
      <h3>Manager with only navigation and track</h3>
      <nightingale-manager>
        <div style="line-height: 0">
          <nightingale-navigation
            id="navigation"
            height="100"
            width="800"
            length="60"
            highlight-color="#EB3BFF22"
            show-highlight
          >
          </nightingale-navigation>
        </div>
        <div style="line-height: 0">
          <nightingale-track
            id="track-simple"
            width="800"
            length="60"
            use-ctrl-to-zoom
          >
          </nightingale-track>
        </div>
      </nightingale-manager> 
    `;
    const featuresData = [
      {
        accession: 'feature1',
        start: 1,
        end: 2,
        color: 'blue',
      },
      {
        accession: 'feature1',
        start: 49,
        end: 50,
        color: 'red',
      },
      {
        accession: 'feature1',
        start: 10,
        end: 20,
        color: '#342ea2',
      },
      {
        accession: 'feature2',
        locations: [{ fragments: [{ start: 30, end: 45 }] }],
        color: '#A42ea2',
      },
      {
        accession: 'feature3',
        locations: [
          {
            fragments: [{ start: 15, end: 15 }],
          },
          { fragments: [{ start: 18, end: 18 }] },
        ],
        color: '#A4Aea2',
      },
      {
        accession: 'feature4',
        locations: [
          {
            fragments: [
              { start: 20, end: 23 },
              { start: 26, end: 32 },
            ],
          },
        ],
      },
    ];
    (document.getElementById('track-simple') as any).data = featuresData;
  }

  public async start() {
    this.render();
  }

  public destroy() {
    console.log('destroy');
  }
}
