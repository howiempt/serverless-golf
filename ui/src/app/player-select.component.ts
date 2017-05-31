import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {GameService, User} from './services/game/game';
import {Observable} from 'RxJS/Rx';
import {FormsModule} from '@angular/forms';
import {DOCUMENT} from '@angular/platform-browser';

@Component({
  selector: 'player-select',
  template: require('./player-select.component.html')
})
export class PlayerSelectComponent implements OnInit {
  name: string;
  loadingGame: boolean;
  shareLink: string;
  loadingText: string;
  loading: boolean = false;
  constructor(private gameService: GameService,
    @Inject(DOCUMENT) private document: any,
    private router: Router) {
  }
  ngOnInit() {
    this.gameService.loading$.subscribe(r => this.loading = r);
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
    if (this.name) {
      this.gameService.setCurrentName(this.name);
    }
  }
  setCurrentName(name: string) {
    this.name = name;
    this.submitName();
  }
  isThereACurrentName(): boolean {
    return (!!this.gameService.getCurrentName());
  }
  isThereACurrentGame(): boolean {
    return (!!this.gameService.getCurrentGame());
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
    this.router.navigate([''], { fragment: this.gameService.getCurrentGame() });
  }
  copyShareLink(): string {
    this.shareLink = `Hey! Join my game at ${this.document.location.href}`;
    return this.shareLink;
  }
  inviteText(): string {
    return 'Invite';
  }
  currentGameUsers(): Array<User> {
    return this.gameService.getCurrentGameUsers();
  }
  refreshScores() {
    return this.gameService.getScores(this.gameService.getCurrentGame()).subscribe(r => {
      if (r) {
        this.gameService.scores = r;
      }
    });
  }
}
