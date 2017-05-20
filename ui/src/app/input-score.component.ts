import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'input-score',
  template: require('./input-score.component.html')
})
export class InputScoreComponent {
  @Input() score: number;
  @Output() scoreSaved: EventEmitter<number> = new EventEmitter<number>();
  constructor() {
  }
  saveScore() {
    console.log('saved');
    this.scoreSaved.next(this.score);
  }
}
