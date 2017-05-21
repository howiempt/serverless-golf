import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {GameService} from './services/game/game';

@Component({
  selector: 'score-input',
  template: require('./score-input.component.html')
})
export class ScoreInputComponent implements OnInit {
  @Output() scoreSaved: EventEmitter<number> = new EventEmitter<number>();
  @Input() margin: boolean;
  score: number;

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.gameService.holeSelected$.subscribe(h => {
      this.score = null;
    });
  }

  saveScore() {
    console.log('save score');
    if (this.score) {
      this.scoreSaved.next(this.score);
    }
  }
}
