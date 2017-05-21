import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {NgSemanticModule} from 'ng-semantic';
import {ClipboardModule} from 'ngx-clipboard';

import {routing, RootComponent} from './routes';
import {MainComponent} from './main';
import {PlayerSelectComponent} from './player-select.component';
import {ScoreInputComponent} from './score-input.component';
import {GameDisplayComponent} from './game-display.component';
import {HoleDisplayComponent} from './hole-display.component';

import {GameService} from './services/game/game';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    HttpModule,
    FormsModule,
    NgSemanticModule,
    ClipboardModule,
  ],
  providers: [
    GameService
  ],
  declarations: [
    RootComponent,
    PlayerSelectComponent,
    MainComponent,
    ScoreInputComponent,
    GameDisplayComponent,
    HoleDisplayComponent,
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
