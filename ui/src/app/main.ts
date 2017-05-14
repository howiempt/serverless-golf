import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'golf-main',
  template: require('./main.html')
})
export class MainComponent implements OnInit {
  public gameId: string;
  private sub: any;

  constructor(private route: ActivatedRoute) {

  }
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.gameId = params.gameId;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
