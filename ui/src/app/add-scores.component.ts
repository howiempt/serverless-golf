import {Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import {GameService, IScores, IMappedScoresByUser, IMappedScoresByHole, Hole, User, Score} from './services/game/game';
import {Observable, Subscription} from 'RxJS/Rx';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'add-scores',
  template: require('./add-scores.component.html')
})
export class AddScoresComponent implements OnInit, OnChanges, OnDestroy {

  @Input() gameId: string;
  holes: Hole[];
  scores: IScores;
  
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
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gameId.previousValue !== changes.gameId.currentValue) {
      this.refreshScores(null);
    }
  }

  ngOnDestroy() {

  }


  getUsersFromGame(): Array<User> {
    return (this.gameService.scores && this.gameService.scores.byUser && this.gameService.scores.byUser.length > 0) ? this.gameService.scores.byUser.map(u => u.user) : new Array<User>();
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
