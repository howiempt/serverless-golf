import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {GameService} from './services/game/game';
import {Observable} from 'RxJS/Rx';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'nav-bar',
  template: require('./nav-bar.component.html')
})
export class NavBarComponent implements OnInit {
  constructor(private gameService: GameService,
    private router: Router) {

  }
  
  ngOnInit() {

  }
}