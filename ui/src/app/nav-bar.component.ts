import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {GameService, User} from './services/game/game';
import {Observable} from 'RxJS/Rx';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'nav-bar',
  template: require('./nav-bar.component.html')
})
export class NavBarComponent implements OnInit {
  name: string;
  
  constructor(private gameService: GameService,
    private router: Router) {

  }
  
  ngOnInit() {

  }

  
  notNameClick(evt: Event) {
    this.clearCurrentName();
  }

  clearCurrentName() {
    this.gameService.setCurrentName('');
  }
  
  currentName(): string {
    return this.gameService.getCurrentName();
  }

  submitName() {
    console.log('submit name', this.name);
    if (this.name) this.gameService.setCurrentName(this.name);
  }

  isThereACurrentName(): boolean {
    return (!!this.gameService.getCurrentName());
  }

  currentGameUsers(): Array<User> {
    return this.gameService.getCurrentGameUsers();
  }
}