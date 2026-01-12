import { AfterViewInit, Component } from '@angular/core';
declare var $;

@Component({
  selector: 'app-services-page',
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.css'],
  standalone: false,
})
export class ServicesPageComponent implements AfterViewInit {
  scroll(elId: string) {
    const el = document.getElementById(elId);
    if (el != null) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngAfterViewInit() {
    $(document).foundation();
    $(document).foundationExtendEBI();
  }
}
