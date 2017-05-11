import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'RxJS/Rx';

@Injectable()
export class GameService {
  constructor(private http: Http) {

  }

  getGame(initialUser: string): Observable<string> {
    var options = { responseType: 1 };
    return this.http
      .post(`https://c0tnwjp66j.execute-api.ap-southeast-2.amazonaws.com/dev/game/${initialUser}`, {}, options)
      .map(r => r.json().gameId);
  }
}
