import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';


declare var pendo: any;

@Injectable()
export class HomeVideoService {

  constructor(
    private http: Http) { }

  public getVideo(mediaId: any): Observable<any> {
    console.log(`get video called with ${mediaId}`);
    return this.http.get(`https://content.jwplatform.com/feeds/${mediaId}.json`)
      .map(data => { try { return data.json(); } catch (exception) { return data; } });
  }
}
