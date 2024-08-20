import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-download-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download-navbar.component.html',
  styleUrl: './download-navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadNavbarComponent implements OnInit {
  ngOnInit(): void {
    window.onscroll = function () {
      myFunction();
    };

    var navbar = document.getElementById('navbar');
    var sticky = navbar.offsetTop;

    function myFunction() {
      if (window.scrollY >= sticky) {
        navbar.classList.add('sticky');
      } else {
        navbar.classList.remove('sticky');
      }
    }
  }
}
