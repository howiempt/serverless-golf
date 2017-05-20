import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GameService} from './services/game/game';

@Component({
  selector: 'golf-main',
  template: require('./main.html')
})
export class MainComponent implements OnInit {
  public gameId: string;
  private sub: any;

  constructor(private gameService: GameService,
    private route: ActivatedRoute) {

  }
  ngOnInit() {
    this.sub = this.route.fragment.subscribe(fragment => {
       this.gameId = fragment;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  currentName() {
    return this.gameService.getCurrentName();
  }
}
