import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable, Subscription} from 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';

export type GameId = string;
export type Hole = 1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18;
export type Score = number;
export type User = string;

export interface IGameScores {
  score: Array<IGameScore>;
}
export interface IGameScore {
  gameId: GameId;
  user: User;
  hole: Hole;
  score: Score;
}

export interface IScores {
  gameId: GameId;
  byHole: Array<IMappedScoresByHole>;
  byUser: Array<IMappedScoresByUser>;
  totals: Array<IMappedTotalsByUser>;
}
export interface IMappedScoresByUser {
  gameId: GameId;
  user: User;
  scores: Array<IGameScore>;
}
export interface IMappedTotalsByUser {
  gameId: GameId;
  user: User;
  score: number;
}
export interface IMappedScoresByHole {
  gameId: GameId;
  hole: Hole;
  scores: Array<IGameScore>;
}

@Injectable()
export class GameService {
  scores: IScores;
  holeSelected$: Observable<Hole>;
  private currentNameKey: string = 'currentName';
  private currentGameKey: string = 'currentGame';
  private holeSelectedSource = new Subject<Hole>();

  constructor(private http: Http) {
    this.holeSelected$ = this.holeSelectedSource.asObservable();
  }
  holeSelected(hole: Hole) {
    console.log('$-set', hole);
    this.holeSelectedSource.next(hole);
  }
  createNewGame(initialUser: string): Observable<string> {
    var options = { responseType: 1 };
    return this.http
      .post(`https://c0tnwjp66j.execute-api.ap-southeast-2.amazonaws.com/dev/game/${encodeURI(initialUser)}`, {}, options)
      .map(r => r.json().gameId);
  }

  setCurrentName(name: string) {
    localStorage.setItem(this.currentNameKey, name);
  }

  getCurrentName(): string {
    return localStorage.getItem(this.currentNameKey);
  }

  setCurrentGame(gameId: string) {
    localStorage.setItem(this.currentGameKey, gameId);
  }

  getCurrentGame(): string {
    return localStorage.getItem(this.currentGameKey);
  }

  getCurrentGameUsers(): Array<User> {
    return (this.scores && this.scores.byUser && this.scores.byUser.length > 0) ? this.scores.byUser.map(u => u.user) : new Array<User>();
  }

  reset() {
    localStorage.setItem(this.currentNameKey, '');
    localStorage.setItem(this.currentGameKey, '');
  }

  doesGameExist(gameId: string): Observable<boolean> {
    return this.http
      .get(`https://c0tnwjp66j.execute-api.ap-southeast-2.amazonaws.com/dev/game/score/${gameId}`)
      .map(r => {
        var returned = JSON.parse(r.json().body);
        return (returned.hasOwnProperty('score') && returned.score && returned.score.length === 1);
      });
  }

  setScore(gameId: GameId, user: User, hole: Hole, score: Score): Observable<IScores> {
    return this.http
      .put(`https://c0tnwjp66j.execute-api.ap-southeast-2.amazonaws.com/dev/game/score/${gameId}/${user}/${hole}/${score}`, {})
      .map(r => {
        return this.mapScoresResponse(gameId, JSON.parse(r.json().body));
      });
  }

  getUsers(scores: IScores): Array<User> {
    var users = scores.byUser.map(u => u.user);
    if (users.indexOf(this.getCurrentName()) < 0) {
      users = users.concat(this.getCurrentName());
    }
    return users;
  }

  getScores(gameId: string): Observable<IScores> {
    return this.http
      .get(`https://c0tnwjp66j.execute-api.ap-southeast-2.amazonaws.com/dev/game/score/${gameId}`)
      .map(r => {
        return this.mapScoresResponse(gameId, JSON.parse(r.json().body));
      });
  }
  private mapScoresResponse(gameId: GameId, r: any): IScores {
    var scores = r as IGameScores;
    // foreach user set a mapped set of scores
    var mappedByUser = this.getMappedByUsers(gameId, scores);
    var mappedByHole = this.getMappedByHoles(gameId, scores);
    var mappedTotals = this.getMappedTotalsByUser(gameId, scores);
    return {
      gameId,
      byUser: mappedByUser,
      byHole: mappedByHole,
      totals: mappedTotals
    };
  }
  private getMappedTotalsByUser(gameId: GameId, scores: IGameScores): Array<IMappedTotalsByUser> {
    var users = scores.score.map(function(score: IGameScore) { return score.user; });
    users = users.filter(function(v: User, i: number) { return users.indexOf(v) === i; });
    // foreach user set a mapped set of scores
    var mappedScores = users.map(uu => {
      var mappedScore = {
        gameId: gameId,
        user: decodeURI(uu),
        score: scores.score.reduce(function(acc: number, val: IGameScore) { return acc + ((val.user === uu) ? val.score : 0); }, 0)
      };
      return mappedScore;
    });
    return mappedScores;
  }
  private getMappedByHoles(gameId: GameId, scores: IGameScores): Array<IMappedScoresByHole> {
    var holes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] as Array<Hole>;

    // foreach hole set a mapped set of scores
    var mappedScores = holes.map(hh => {
      var mappedScore = {
        gameId: gameId,
        hole: hh,
        scores: scores.score.filter(s => s.hole === hh)
      };
      return mappedScore;
    });
    return mappedScores;
  }

  private getMappedByUsers(gameId: GameId, scores: IGameScores): Array<IMappedScoresByUser> {
    var users = scores.score.map(function(score: IGameScore) { return score.user; });
    users = users.filter(function(v: User, i: number) { return users.indexOf(v) === i; });
    // foreach user set a mapped set of scores
    var mappedScores = users.map(uu => {
      var mappedScore = {
        gameId: gameId,
        user: decodeURI(uu),
        scores: scores.score.filter(s => s.user === uu)
      };
      return mappedScore;
    });
    return mappedScores;
  }
}
