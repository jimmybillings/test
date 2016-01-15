import { Injectable } from 'angular2/core';
import {HTTP_PROVIDERS, Http, Response, Headers} from 'angular2/http';

@Injectable()
export class User {
        public http: Http;
        
        constructor(http: Http) {}
        
        new(user: Object) {
            return this.http.post('http://poc1.crux.t3sandbox.xyz./users-api/user/register', 
                JSON.stringify(user), {
                    headers: new Headers({'Content-Type': 'application/json'})
                }
            )
        }
}
