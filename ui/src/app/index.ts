import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {routing, RootComponent} from './routes';
import {MainComponent} from './main';
import {NavBarComponent} from './nav-bar.component';
import {CreateGameComponent} from './create-game.component';
import {GameScoresComponent} from './game-scores.component';

import {GameService} from './services/game/game';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    HttpModule,
    FormsModule,
  ],
  providers: [
    GameService
  ],
  declarations: [
    RootComponent,
    NavBarComponent,
    MainComponent,
    CreateGameComponent,
    GameScoresComponent,
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
