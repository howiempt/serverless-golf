import {Component} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './main';

@Component({
  selector: 'golf-app',
  template: '<router-outlet></router-outlet>'
})
export class RootComponent {}

export const routes: Routes = [
  { path: ':gameId', component: MainComponent },
  { path: '', component: MainComponent }
];

export const routing = RouterModule.forRoot(routes);
