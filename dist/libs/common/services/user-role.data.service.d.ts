import { Http } from 'angular2/http';
import { ApiConfig } from '../config/api.config';
import { Observable } from 'rxjs/Observable';
export declare class UserRole {
    http: Http;
    private apiConfig;
    private _apiUrls;
    constructor(http: Http, apiConfig: ApiConfig);
    create(userRole: Object): Observable<any>;
    show(id: number): Observable<any>;
    search(criteria: string): Observable<any>;
    update(userRole: any): Observable<any>;
    destroy(id: number): Observable<any>;
}
