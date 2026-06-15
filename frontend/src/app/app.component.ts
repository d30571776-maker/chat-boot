import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div class="main-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .main-container {
      font-family: 'Playfair Display', serif;
      background: #000000;
      color: #ffffff;
      min-height: 100vh;
      padding: 0;
      margin: 0;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
  }
}
