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

  saveScoreClasses: any = { ui: true, button: true, icon: true, positive: true, loading: false };

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
    return (this.gameService.scores && this.gameService.scores.byUser && this.gameService.scores.byUser.length > 0) ? this.gameService.getUsers(this.gameService.scores) : [this.gameService.getCurrentName()];
  }

  saveScore() {
    this.saveScoreClasses = { ui: true, button: true, icon: true, positive: true, loading: true };
    console.log(this.selectedUser || this.gameService.getCurrentName());
    this.gameService.setScore(this.gameId, this.selectedUser || this.gameService.getCurrentName(), this.selectedHole, this.selectedScore).subscribe(r => {
      if (r) {
        this.gameService.scores = r;
        this.saveScoreClasses = { ui: true, button: true, icon: true, positive: true, loading: false };
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
