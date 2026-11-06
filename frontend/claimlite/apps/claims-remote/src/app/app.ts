import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-claims-root',
  imports: [RouterModule],
  template: `
    <router-outlet></router-outlet>
  `
})
export class App {}
