import { Http } from 'angular2/http';
export declare class Search {
    url: string;
    http: Http;
    results: Object;
    constructor(http: Http);
    clipRendition(rendition: any): any;
    private _getResults();
}
