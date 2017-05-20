import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {NgSemanticModule} from 'ng-semantic';

import {routing, RootComponent} from './routes';
import {MainComponent} from './main';
import {NavBarComponent} from './nav-bar.component';
import {InputScoreComponent} from './input-score.component';
import {GameScoresComponent} from './game-scores.component';

import {GameService} from './services/game/game';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    HttpModule,
    FormsModule,
    NgSemanticModule,
  ],
  providers: [
    GameService
  ],
  declarations: [
    RootComponent,
    NavBarComponent,
    MainComponent,
    InputScoreComponent,
    GameScoresComponent,
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
