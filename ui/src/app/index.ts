import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {routing, RootComponent} from './routes';
import {MainComponent} from './main';
import {HeaderComponent} from './header';
import {TitleComponent} from './title';
import {FooterComponent} from './footer';

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
    MainComponent,
    HeaderComponent,
    TitleComponent,
    FooterComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
