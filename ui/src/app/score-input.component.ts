import {Component, EventEmitter, Output, Input, OnInit, OnDestroy} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Subscription} from 'RxJS/Rx';
import {GameService, Hole} from './services/game/game';

@Component({
  selector: 'score-input',
  template: require('./score-input.component.html')
})
export class ScoreInputComponent implements OnInit, OnDestroy {
  @Output() scoreSaved: EventEmitter<number> = new EventEmitter<number>();
  @Input() margin: boolean;
  @Input() hole: Hole;
  score: number;
  holeSelectedSub: Subscription;
  nameSelectedSub: Subscription;
  constructor(private gameService: GameService) {
  }
  ngOnDestroy() {
    this.holeSelectedSub.unsubscribe();
    this.nameSelectedSub.unsubscribe();
  }
  ngOnInit() {
    this.loadUserScore();
    this.holeSelectedSub = this.gameService.holeSelected$.subscribe(h => {
      this.loadUserScore();
    });
    this.nameSelectedSub = this.gameService.nameSelected$.subscribe(n => {
      this.loadUserScore();
    })
  }
  loadUserScore() {
    this.score = null;
    var userScores = this.gameService.scores.byUser.filter(g => g.user === this.gameService.getCurrentName())[0];
    if (userScores) {
      var holeUserScore = userScores.scores.filter(g => g.hole === this.hole)[0];
      if (holeUserScore) {
        this.score = holeUserScore.score;
      }
    }
  }
  addToScore(delta: number) {
    if (delta > 0) {
      if (!this.score) {
        this.score = 1;
      } else {
        this.score++;
      }
    } else {
      if (!this.score) {
        this.score = 1;
      } else {
        if (this.score > 1) {
          this.score--;
        }
      }
    }
    this.saveScore();
  }
  saveScore() {
    if (this.score) {
      this.scoreSaved.next(this.score);
    }
  }
}
