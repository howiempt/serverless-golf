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
export interface IQueuedCommand {
  score: IGameScore;
  eventId: number;
}

export interface IScores {
  gameId: GameId;
  originalScores: IGameScores;
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
  nameSelected$: Observable<User>;
  loading$: Observable<boolean>;
  queuedScores: Array<IQueuedCommand>;
  private nameSelectedSource = new Subject<User>();
  private currentNameKey: string = 'currentName';
  private currentGameKey: string = 'currentGame';
  private holeSelectedSource = new Subject<Hole>();
  private loadingSource = new Subject<boolean>();
  private lastEventId: number = 0;
  private lastEventIds: { [id: string] : number; } = {};
  constructor(private http: Http) {
    this.holeSelected$ = this.holeSelectedSource.asObservable();
    this.loading$ = this.loadingSource.asObservable();
    this.nameSelected$ = this.nameSelectedSource.asObservable();
    this.queuedScores = new Array<IQueuedCommand>();
  }
  holeSelected(hole: Hole) {
    this.holeSelectedSource.next(hole);
  }
  createNewGame(initialUser: string): Observable<string> {
    var options = { responseType: 1 };
    this.loadingSource.next(true);
    var sub = this.http
      .post(`https://c0tnwjp66j.execute-api.ap-southeast-2.amazonaws.com/dev/game/${encodeURI(initialUser)}`, {}, options)
      .map(r => r.json().gameId);
    sub.subscribe(r => this.loadingSource.next(false));
    return sub;
  }

  setCurrentName(name: string) {
    localStorage.setItem(this.currentNameKey, name);
    this.nameSelectedSource.next(name);
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
  setOfflineScore(user: User, hole: Hole, score: number): IGameScores {
    var matched = this.scores.originalScores.score.filter(s => s.user === user && s.hole === hole);
    if (matched && matched.length > 0) {
      matched[0].score = score;
    } else {
      this.scores.originalScores.score.push({
        gameId: this.getCurrentGame(),
        user,
        hole,
        score
      });
    }
    return this.scores.originalScores;
  }
  doesGameExist(gameId: string): Observable<boolean> {
    this.loadingSource.next(true);
    var sub = this.http
      .get(`https://c0tnwjp66j.execute-api.ap-southeast-2.amazonaws.com/dev/game/score/${gameId}`)
      .map(r => {
        var returned = JSON.parse(r.json().body);
        return (returned.hasOwnProperty('score') && returned.score && returned.score.length === 1);
      });
    sub.subscribe(r => this.loadingSource.next(false));
    return sub;
  }

  setScore(gameId: GameId, user: User, hole: Hole, score: Score) {
    this.scores = this.mapScoresResponse(gameId, this.setOfflineScore(user, hole, score));
    this.queuedScores.push({ score: { gameId, user, hole, score }, eventId: Date.now() });
    this.processSetScore();
  }

  processSetScore() {
    debugger;
    var scoreSubs = new Array<Observable<IScores>>();
    var scores = this.queuedScores.slice(0);
    console.log('to process', scores);
    this.queuedScores = new Array<IQueuedCommand>();
    var score = scores.shift();
    console.log('to process', score);
    while (score != null) {
      this.loadingSource.next(true);
      var data = score;
      score = scores.shift();
      var sub = this.http
        .put(`https://c0tnwjp66j.execute-api.ap-southeast-2.amazonaws.com/dev/game/score/${data.score.gameId}/${data.score.user}/${data.score.hole}/${data.score.score}?ts=${data.eventId}`, {})
        .map(r => {
          console.log('pre-map set',r);
          return this.mapScoresResponse(data.score.gameId, JSON.parse(r.json().body), data.score.user);
        })
        .catch(this.getErrorHandler(data, scores))
        .subscribe(r => {
          console.log('sub');
          this.scores = r;
          console.log('sub this.scores', this.scores);
          console.log('sub scores', scores);
          if (scores.length == 0) {
            console.log('sub stop load');
            this.loadingSource.next(false);
          }
      });      
    }
  }
  getErrorHandler(data: IQueuedCommand, scores: IQueuedCommand[]) {
    var q: IQueuedCommand = {
      score: {
        gameId: data.score.gameId,
        user: data.score.user,
        score: data.score.score,
        hole: data.score.hole
      },
      eventId: data.eventId
    };
    return (err: any, caught: any): Observable<any> => {
      console.log(err, caught);
      this.queuedScores.push(q);
      if (scores.length == 0) {
        console.log('sub stop load');
        this.loadingSource.next(false);
      }
      return Observable.throw('');
    };
  }
  

  getUsers(scores: IScores): Array<User> {
    var users = scores.byUser.map(u => u.user);
    if (users.indexOf(this.getCurrentName()) < 0) {
      users = users.concat(this.getCurrentName());
    }
    return users;
  }

  getScores(gameId: string): Observable<IScores> {
    this.loadingSource.next(true);
    var sub = this.http
      .get(`https://c0tnwjp66j.execute-api.ap-southeast-2.amazonaws.com/dev/game/score/${gameId}`)
      .map(r => {
        return this.mapScoresResponse(gameId, JSON.parse(r.json().body));
      }).share();
    sub.subscribe(r => this.loadingSource.next(false));
    return sub;
  }
  private isFresherEventId(eventId: number): boolean {
    return eventId >= this.lastEventId;
  }
  private isFresherEventIdForUser(eventId: number, user: User): boolean {
    var isUserRecorded = this.lastEventIds[user];
    return (isUserRecorded && this.isFresherEventId(this.lastEventIds[user]));
  }
  private getSafeInt(number: string): number {
    var eventId = parseInt(number || '0');
    return Number.isSafeInteger(eventId) ? eventId : 0;
  }

  private mapScoresResponse(gameId: GameId, r: any, user: User = null): IScores {
    console.log('map', r, r.score.EventId);
    var scores = r as IGameScores;
    var eventId = this.getSafeInt(r.score.EventId);
    console.log(r.score.EventId, eventId, this.lastEventIds, this.lastEventId);
    var isFresh = (user) ? this.isFresherEventIdForUser(eventId, user) : this.isFresherEventId(eventId);
    if (isFresh) {
      console.log('fresher score');
      this.lastEventId = eventId;
      if (r.score.Items) scores.score = r.score.Items as IGameScore[];

      scores.score.forEach(s => {
        s.user = decodeURI(s.user);
      });
      // foreach user set a mapped set of scores
      var mappedByUser = this.getMappedByUsers(gameId, scores);
      var mappedByHole = this.getMappedByHoles(gameId, scores);
      var mappedTotals = this.getMappedTotalsByUser(gameId, scores);
      return {
        gameId,
        originalScores: scores,
        byUser: mappedByUser,
        byHole: mappedByHole,
        totals: mappedTotals
      };
    } else {
      console.log('stale score');
      return this.scores;
    }    
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
        scores: scores.score.filter(s => s.hole === hh).filter(s => s.score > 0)
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
        scores: scores.score.filter(s => s.user === uu).filter(s => s.score > 0)
      };
      return mappedScore;
    });
    return mappedScores;
  }
}
