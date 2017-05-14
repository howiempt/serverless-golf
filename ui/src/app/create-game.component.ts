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
  public newGameId: string;
  public askingForName: boolean;
  public name: string;
  @Input() navigatedGameId: string;

  constructor(private gameService: GameService,
    private router: Router) {

  }

  ngOnInit() {
    this.newGameId = this.navigatedGameId || '';
    this.askingForName = false;

    if (this.navigatedGameId) {
      this.gameService.doesGameExist(this.navigatedGameId).subscribe(r => {
        if (r) {
          this.setGameId(this.newGameId);
        }
      });
    } else {
      var currentGame = JSON.parse(localStorage.getItem('currentGame'));
      this.newGameId = (currentGame && currentGame.gameId) ? currentGame.gameId : ''; // your game id
    }
    var currentName = JSON.parse(localStorage.getItem('currentName'));
    this.name = (currentName && currentName.name) ? currentName.name : ''; // your name
  }

  startGameButtonClicked(evt: Event) {
    if (!this.askingForName && this.name === '') {
      this.askForName();
    } else {
      this.createGame(this.name);
    }
  }

  finishGame() {
    this.newGameId = '';
    this.setGameId(this.newGameId);
  }

  clearName() {
    this.setName('');
    this.askForName();
  }

  askForName() {
    this.askingForName = true;
  }
  setName(name: string) {
    this.name = name;
    localStorage.setItem('currentName', JSON.stringify({ name: name }));
  }
  setGameId(gameId: string) {
    this.newGameId = gameId;
    localStorage.setItem('currentGame', JSON.stringify({ gameId: gameId, name: this.name }));
    this.router.navigate([''], { fragment: gameId });
  }
  createGame(name: string) {
    this.askingForName = false;
    this.setName(this.name);
    this.gameService.getGame(name).subscribe(r => {
      this.newGameId = r;
      console.log(r);
      this.setGameId(this.newGameId);
    });
  }
  clearStorage() {
    localStorage.setItem('currentName', JSON.stringify({  }));
    localStorage.setItem('currentGame', JSON.stringify({  }));
  }

}
