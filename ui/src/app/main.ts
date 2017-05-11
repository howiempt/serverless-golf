import {Component, OnInit} from '@angular/core';
import {GameService} from './services/game/game';
import {Observable} from 'RxJS/Rx';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'golf-main',
  template: require('./main.html')
})
export class MainComponent implements OnInit {
  public newGameId: string;
  public askingForName: boolean;
  public name: string;

  constructor(private gameService: GameService) {

  }
  ngOnInit() {
    this.newGameId = '';
    this.askingForName = false;

    var currentName = JSON.parse(localStorage.getItem('currentName'));
    this.name = (currentName) ? currentName.name : ''; // your name

    var currentGame = JSON.parse(localStorage.getItem('currentGame'));
    this.newGameId = (currentGame) ? currentGame.gameId : ''; // your game id
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

}
