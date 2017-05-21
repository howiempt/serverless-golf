import {Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import {GameService, IGameScore, IScores, IMappedScoresByUser, IMappedTotalsByUser, IMappedScoresByHole, Hole, User, Score} from './services/game/game';
import {Observable, Subscription} from 'RxJS/Rx';
import {FormsModule} from '@angular/forms';
import {HoleDisplayComponent} from './hole-display.component';

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
  refreshing: boolean = false;
  saveRefreshing: boolean = false;
  constructor(private gameService: GameService) {
  }
  ngOnInit() {
    console.log(this.gameId);
    this.holes = new Array<Hole>();
    for (let i = 1; i <= 18; i++) {
      this.holes.push(i as Hole);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.gameId.previousValue !== changes.gameId.currentValue) {
      console.log('new game id');
      this.refreshScores(null);
      this.selectedHole = null;
    }
  }
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.initialSubscription) {
      this.initialSubscription.unsubscribe();
    }
  }
  loadInitialScores() {
    this.initialSubscription = this.refreshScores(() => this.pollForScores());
  }
  pollForScores() {
    // this.timerSubscription = Observable.timer(1000, 1000).subscribe(() => this.refreshScores(null));
  }
  leaderBoard(): string {
    return this.gameService.scores.totals
      .sort(function(a: IMappedTotalsByUser, b:IMappedTotalsByUser) { return a.score - b.score; })
      .map(l => `${l.user} (${l.score})`)
      .join(', ');
  }
  getHoles(): Array<IMappedScoresByHole> {
    let holes = new Array<IMappedScoresByHole>();
    for (let i = 1; i <= 18; i++) {
      holes.push({ gameId: this.gameId, hole: i as Hole, scores: this.getHoleScores(i as Hole).filter(s => s.score > 0)});
    }
    return holes;
  }
  refreshScores(cb: Function | null): Subscription {
    this.refreshing = true;
    return this.gameService.getScores(this.gameId).subscribe(r => {
      if (r) {
        this.gameService.scores = r;
        this.refreshing = false;
        if (cb) {
          cb();
        }
      }
    });
  }
  private getHoleScores(hole: Hole): Array<IGameScore> {
    return this.gameService.scores.byHole.filter(h => h.hole === hole).map(h => h.scores)[0];
  }
}
