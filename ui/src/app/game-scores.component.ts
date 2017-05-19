import {Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import {GameService, IGameScore, IScores, IMappedScoresByUser, IMappedScoresByHole, Hole, User, Score} from './services/game/game';
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
    console.log(this.holes);
    this.gameService.holeSelected$.subscribe(h => {
      console.log('game-scores sub-h', h);
      this.selectedHole = h;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.gameId.previousValue !== changes.gameId.currentValue) {
      this.refreshScores(null);
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
  getUsersFromGame(): Array<User> {
    return (this.gameService.scores && this.gameService.scores.byUser && this.gameService.scores.byUser.length > 0) ? this.gameService.scores.byUser.map(u => u.user) : new Array<User>();
  }
  pollForScores() {
    // this.timerSubscription = Observable.timer(1000, 1000).subscribe(() => this.refreshScores(null));
  }
  selectHole(hole: Hole) {
    console.log('game-scores select', hole);
    this.selectedHole = hole;
    this.gameService.holeSelected(hole);
  }
  isHoleSelected(hole: IMappedScoresByHole): boolean {
    //console.log('is-hole-selected', hole.hole, this.selectedHole);
    return hole.hole === this.selectedHole;
  }
  isHoleNumberSelected(hole: number): boolean {
    //console.log('is-hole-selected', hole.hole, this.selectedHole);
    return hole === this.selectedHole;
  }
  isHoleSelectedStyle(hole: IMappedScoresByHole): any {
    //console.log('is-hole-selected', hole.hole, this.selectedHole);
    return { teal: hole.hole === this.selectedHole };
  }
  get3Holes(setOf3: Hole): Array<IMappedScoresByHole> {
    return [
      { gameId: this.gameId, hole: setOf3, scores: this.getHoleScores(setOf3).filter(s => s.score > 0)},
      { gameId: this.gameId, hole: (setOf3 + 1) as Hole, scores: this.getHoleScores((setOf3 + 1) as Hole).filter(s => s.score > 0)},
      { gameId: this.gameId, hole: (setOf3 + 2) as Hole, scores: this.getHoleScores((setOf3 + 2) as Hole).filter(s => s.score > 0)}
    ];
  }
  saveScore() {
    this.saveRefreshing = true;
    console.log(this.gameService.getCurrentName());
    this.gameService.setScore(this.gameId, this.gameService.getCurrentName(), this.selectedHole, this.selectedScore).subscribe(r => {
      if (r) {
        this.gameService.scores = r;
        this.saveRefreshing = false;
      }
    });
  }
  refreshScores(cb: Function | null): Subscription {
    this.refreshing = true;
    return this.gameService.getScores(this.gameId).subscribe(r => {
      if (r) {
        this.gameService.scores = r;
        console.log(this.gameService.scores);
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
