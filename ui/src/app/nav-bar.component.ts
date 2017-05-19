import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {GameService, User} from './services/game/game';
import {Observable} from 'RxJS/Rx';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'nav-bar',
  template: require('./nav-bar.component.html')
})
export class NavBarComponent {
  name: string;
  loadingGame: boolean;

  constructor(private gameService: GameService,
    private router: Router) {
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
    if (this.name) {
      this.gameService.setCurrentName(this.name);
    }
  }
  setCurrentName(name: string) {
    console.log('set name', name);
    this.name = name;
    this.submitName();
  }
  isThereACurrentName(): boolean {
    return (!!this.gameService.getCurrentName());
  }
  createNewGame() {
    let name = this.gameService.getCurrentName();
    if (name) {
      this.loadingGame = true;
      this.gameService.createNewGame(name).subscribe(r => {
        this.setCurrentGame(r);
        this.loadingGame = false;
      });
    } else {
      this.loadingGame = false;
    }
  }
  setCurrentGame(gameId: string) {
    this.gameService.setCurrentGame(gameId);
    console.log('setCurrentGame', this.gameService.getCurrentGame());
    this.router.navigate([''], { fragment: this.gameService.getCurrentGame() });
  }
  currentGameUsers(): Array<User> {
    return this.gameService.getCurrentGameUsers();
  }
}
