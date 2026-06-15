import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-api-selector',
  template: `
    <div class="api-selector">
      <p>api selector component</p>
    </div>
  `,
  styles: [`
    .api-selector {
      padding: 20px;
    }
  `]
})
export class ApiSelectorComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}
