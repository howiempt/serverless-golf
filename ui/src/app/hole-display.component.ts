import {Component, OnInit, Input} from '@angular/core';
import {GameService, IGameScore, IScores, IMappedScoresByUser, IMappedTotalsByUser, IMappedScoresByHole, Hole, User, Score} from './services/game/game';
import {Observable, Subscription} from 'RxJS/Rx';
import {FormsModule} from '@angular/forms';
import {InputScoreComponent} from './input-score.component';

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
    var holeScores = this.gameService.scores.byHole.filter(s => s.hole == this.hole);
    this.scores = holeScores[0].scores;
  }
  selectHole() {
    this.gameService.holeSelected(this.hole);
    this.selectedHole = this.hole;
  }  
  isHoleSelected(): boolean {
    return this.selectedHole == this.hole;
  }
  isHoleSelectedStyle(): any {
    return { teal: this.hole === this.selectedHole };
  }
  saveScore(score: number) {
    this.gameService.setScore(this.gameId, this.gameService.getCurrentName(), this.selectedHole, score).subscribe(r => {
      if (r) {
        this.gameService.scores = r;
        var holeScores = this.gameService.scores.byHole.filter(s => s.hole == this.hole);
        this.scores = holeScores[0].scores;
        this.gameService.holeSelected(null);
      }
    });
  }
}
