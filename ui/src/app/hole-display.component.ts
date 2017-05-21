import {Component, OnInit, Input} from '@angular/core';
import {GameService, IGameScore, IScores, IMappedScoresByUser, IMappedTotalsByUser, IMappedScoresByHole, Hole, User, Score} from './services/game/game';
import {Observable, Subscription} from 'RxJS/Rx';
import {FormsModule} from '@angular/forms';
import {ScoreInputComponent} from './score-input.component';

@Component({
  selector: 'hole-display',
  template: require('./hole-display.component.html')
})
export class HoleDisplayComponent implements OnInit {
  @Input() gameId: string;
  @Input() hole: Hole;
  scores: Array<IGameScore>;
  selectedHole: Hole;
  constructor(private gameService: GameService) {
  }
  ngOnInit() {
    this.gameService.holeSelected$.subscribe(h => {
      this.selectedHole = h;
    });
  }
  getScores() {
    var holeScores = this.gameService.scores.byHole.filter(s => s.hole === this.hole);
    return holeScores[0].scores;
  }
  selectHole() {
    if (!this.isHoleSelected()) {
      this.gameService.holeSelected(this.hole);
      this.selectedHole = this.hole;
    }
    // } else {
    //   this.gameService.holeSelected(null);
    //   this.selectedHole = null;
    // }
  }
  isHoleSelected(): boolean {
    return this.selectedHole === this.hole;
  }
  isHoleSelectedStyle(): any {
    return { teal: this.hole === this.selectedHole };
  }
  saveScore(score: number) {
    this.gameService.setScore(this.gameId, this.gameService.getCurrentName(), this.selectedHole, score).subscribe(r => {
      if (r) {
        this.gameService.scores = r;
        this.gameService.holeSelected(null);
      }
    });
  }
}
