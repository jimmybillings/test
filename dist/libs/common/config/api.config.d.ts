import { Headers } from 'angular2/http';
export declare class ApiConfig {
    private _portal;
    constructor();
    getApiRoot(): string;
    getAuthHeader(): Headers;
    getApiHeaders(): Headers;
    setPortal(portal: string): void;
    getPortal(): string;
}
