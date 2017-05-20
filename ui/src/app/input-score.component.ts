import {Component, EventEmitter, Output, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {GameService} from './services/game/game';

@Component({
  selector: 'input-score',
  template: require('./input-score.component.html')
})
export class InputScoreComponent implements OnInit {
  score: number;

  @Output() scoreSaved: EventEmitter<number> = new EventEmitter<number>();
  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.gameService.holeSelected$.subscribe(h => {
      console.log('input-scores sub-h', h);
      this.score = null;
    });
  }
  
  saveScore() {
    console.log('saved');
    this.scoreSaved.next(this.score);
  }
}
