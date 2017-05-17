import {Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import {GameService, IScores, IMappedScoresByUser, IMappedScoresByHole, Hole, User, Score} from './services/game/game';
import {Observable, Subscription} from 'RxJS/Rx';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'game-scores',
  template: require('./game-scores.component.html')
})
export class GameScoresComponent implements OnInit, OnChanges, OnDestroy {

  @Input() gameId: string;
  holes: Hole[];
  scores: IScores;
  timerSubscription: Subscription;
  initialSubscription: Subscription;
  
  selectedUser: User;
  selectedHole: Hole;
  selectedScore: Score;

  constructor(private gameService: GameService) {

  }

  ngOnInit() {
    console.log(this.gameId);
    this.holes = new Array<Hole>();
    for (let i = 1; i <= 18; i++) {
      this.holes.push(i as Hole);
    }
    console.log(this.holes);    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gameId.previousValue !== changes.gameId.currentValue) {
      this.refreshScores(null);
    }
  }

  ngOnDestroy() {
    if (this.timerSubscription) this.timerSubscription.unsubscribe();
    if (this.initialSubscription) this.initialSubscription.unsubscribe();
  }


  loadInitialScores() {
    this.initialSubscription = this.refreshScores(() => this.pollForScores());
  }
  getUsersFromGame(): Array<User> {
    return (this.gameService.scores && this.gameService.scores.byUser && this.gameService.scores.byUser.length > 0) ? this.gameService.scores.byUser.map(u => u.user) : new Array<User>();
  }
  pollForScores() {
    // this.timerSubscription = Observable.timer(1000, 1000).subscribe(() => this.refreshScores(null));
  }
  saveScore() {
    this.gameService.setScore(this.gameId, this.selectedUser, this.selectedHole, this.selectedScore).subscribe(r => {
      if (r) {
        this.gameService.scores = r;
      }
    });
  }

  

  refreshScores(cb: Function | null): Subscription {
    return this.gameService.getScores(this.gameId).subscribe(r => {
      if (r) {
        this.gameService.scores = r;
        console.log(this.gameService.scores);
        if (cb) {
          cb();
        }
      }
    });
  }

}
