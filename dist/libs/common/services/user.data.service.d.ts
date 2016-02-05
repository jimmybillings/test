import { Http } from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import { CurrentUser } from '../models/current-user.model';
import { Observable } from 'rxjs/Observable';
export declare class User {
    http: Http;
    private apiConfig;
    private _currentUser;
    private _apiUrls;
    constructor(http: Http, apiConfig: ApiConfig, _currentUser: CurrentUser);
    create(user: Object): Observable<any>;
    get(): Observable<any>;
}
