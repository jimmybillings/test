var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var http_1 = require('angular2/http');
var ApiConfig = (function () {
    function ApiConfig() {
        this._portal = null;
    }
    ApiConfig.prototype.getApiRoot = function () {
        return 'http://dev.crux.t3sandbox.xyz.:8080/';
    };
    ApiConfig.prototype.getAuthHeader = function () {
        return new http_1.Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') });
    };
    ApiConfig.prototype.getApiHeaders = function () {
        return new http_1.Headers({ 'Content-Type': 'application/json' });
    };
    ApiConfig.prototype.setPortal = function (portal) {
        this._portal = portal;
    };
    ApiConfig.prototype.getPortal = function () {
        return this._portal;
    };
    ApiConfig = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ApiConfig);
    return ApiConfig;
})();
exports.ApiConfig = ApiConfig;
