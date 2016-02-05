import { Headers } from 'angular2/http';
export declare class ApiConfig {
    getApiRoot(): string;
    getAuthHeader(): Headers;
    getApiHeaders(): Headers;
    getPortal(): string;
}
