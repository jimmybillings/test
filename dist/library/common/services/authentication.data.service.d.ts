import { Http } from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import { Observable } from 'rxjs/Observable';
export declare class Authentication {
    http: Http;
    private apiConfig;
    private _apiUrls;
    constructor(http: Http, apiConfig: ApiConfig);
    create(user: Object): Observable<any>;
    destroy(): Observable<any>;
}
