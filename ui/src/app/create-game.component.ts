import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {GameService} from './services/game/game';
import {Observable} from 'RxJS/Rx';
import {FormsModule} from '@angular/forms';
import { SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES } from "ng-semantic";

@Component({
  selector: 'create-game',
  template: require('./create-game.component.html')
})
export class CreateGameComponent implements OnInit {

  @Input() gameId: string;
  name: string;
  createGameClasses: any = { ui: true, button: true, icon: true, positive: true, loading: false };
  
  constructor(private gameService: GameService,
    private router: Router) {

  }

  ngOnInit() {
    this.gameId = this.gameId || this.currentGame();
    if (this.gameId) {
      this.gameService.doesGameExist(this.gameId).subscribe(r => {
        if (r) {
          this.setCurrentGame(this.gameId);
        }
      });
    } else {
      this.clearCurrentGame();
    }
  }

  setCurrentGame(gameId: string) {
    this.gameService.setCurrentGame(gameId);
    console.log('setCurrentGame', this.gameService.getCurrentGame());
    this.router.navigate([''], { fragment: this.gameService.getCurrentGame() });
  }

  clearCurrentGame() {
    console.log('clear game');
    this.gameService.setCurrentGame('');
    this.router.navigate(['']);
  }

  createNewGame() {
    let name = this.gameService.getCurrentName()
    if (name) {
      this.createGameClasses = { ui: true, button: true, icon: true, positive: true, loading: true };
      this.gameService.createNewGame(name).subscribe(r => {
        this.createGameClasses = { ui: true, button: true, icon: true, positive: true, loading: false };
        this.setCurrentGame(r);
      });
    }
    else {
      this.error();
    }  
  }

  currentGame(): string {
    return this.gameService.getCurrentGame();
  }  

  isThereACurrentGame(): boolean {
    return (!!this.gameService.getCurrentGame());
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
    this.gameService.setCurrentName(this.name);
  }

  isThereACurrentName(): boolean {
    return (!!this.gameService.getCurrentName());
  }

  error() {
    console.log('error');
  }

  reset() {
    this.gameService.reset();
  }
  //this.router.navigate([''], { fragment: gameId });

}
