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
    this.holes = new Array<Hole>();
    for (let i = 1; i <= 18; i++) {
      this.holes.push(i as Hole);
    }
    console.log(this.holes);
    this.loadInitialScores();
  }
  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
    this.initialSubscription.unsubscribe();
  }
  loadInitialScores() {
    this.initialSubscription = this.refreshScores(() => this.pollForScores());
  }
  users(): Array<User> {
    return (this.scores && this.scores.byUser && this.scores.byUser.length > 0) ? this.scores.byUser.map(u => u.user) : new Array<User>();
  }
  pollForScores() {
    // this.timerSubscription = Observable.timer(1000, 1000).subscribe(() => this.refreshScores(null));
  }
  saveScore() {
    this.gameService.setScore(this.gameId, this.selectedUser, this.selectedHole, this.selectedScore).subscribe(r => {
      if (r) {
        this.scores = r;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gameId.previousValue !== changes.gameId.currentValue) {
      this.refreshScores(null);
    }
  }

  refreshScores(cb: Function | null): Subscription {
    return this.gameService.getScores(this.gameId).subscribe(r => {
      if (r) {
        this.scores = r;
        console.log(this.scores);
        if (cb) {
          cb();
        }
      }
    });
  }

}
