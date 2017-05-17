import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {GameService} from './services/game/game';
import {Observable} from 'RxJS/Rx';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'create-game',
  template: require('./create-game.component.html')
})
export class CreateGameComponent implements OnInit {

  @Input() gameId: string;
  name: string;

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
    console.log(this.gameId);
    this.router.navigate([''], { fragment: this.gameId });
  }

  clearCurrentGame() {
    console.log('clear game');
    this.gameService.setCurrentGame('');
    this.router.navigate(['']);
  }

  createNewGame() {
    let name = this.gameService.getCurrentName()
    if (name) {
      this.gameService.createNewGame(name).subscribe(r => {
        this.setCurrentGame(r);        
      });
    }
    else {
      this.error();
    }  
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

  currentGame(): string {
    return this.gameService.getCurrentGame();
  }

  submitName() {
    console.log('submit name', this.name);
    this.gameService.setCurrentName(this.name);
  }

  error() {
    console.log('error');
  }

  reset() {
    this.gameService.reset();
  }
  //this.router.navigate([''], { fragment: gameId });


  isThereACurrentName(): boolean {
    return (!!this.gameService.getCurrentName());
  }

  isThereACurrentGame(): boolean {
    return (!!this.gameService.getCurrentGame());
  }
}
