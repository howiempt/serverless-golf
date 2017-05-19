import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {GameService, IScores, IMappedScoresByUser, IMappedScoresByHole, Hole, User, Score} from './services/game/game';
import {Observable, Subscription} from 'rxjs/Rx';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'add-scores',
  template: require('./add-scores.component.html')
})
export class AddScoresComponent implements OnInit, OnChanges {
  @Input() gameId: string;
  holes: Hole[];
  scores: IScores;
  selectedUser: User;
  selectedHole: Hole;
  selectedScore: Score;
  refreshing: boolean = false;
  constructor(private gameService: GameService) {
  }
  ngOnInit() {
    console.log(this.gameId);
    this.holes = new Array<Hole>();
    for (let i = 1; i <= 18; i++) {
      this.holes.push(i as Hole);
    }
    this.gameService.holeSelected$.subscribe(h => {
      console.log('add-scores sub-h', h);
      this.selectedHole = h;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.gameId.previousValue !== changes.gameId.currentValue) {
      this.refreshScores(null);
    }
  }
  holeChange(hole: Hole) {
    console.log('add-scores select', hole);
    this.selectedHole = hole;
    this.gameService.holeSelected(hole);
  }
  getUsersFromGame(): Array<User> {
    return (this.gameService.scores && this.gameService.scores.byUser && this.gameService.scores.byUser.length > 0) ? this.gameService.getUsers(this.gameService.scores) : [this.gameService.getCurrentName()];
  }
  saveScore() {
    this.refreshing = true;
    console.log(this.gameService.getCurrentName());
    this.gameService.setScore(this.gameId, this.gameService.getCurrentName(), this.selectedHole, this.selectedScore).subscribe(r => {
      if (r) {
        this.gameService.scores = r;
        this.refreshing = false;
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
