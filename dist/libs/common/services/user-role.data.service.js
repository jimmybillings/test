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
var api_config_1 = require('../config/api.config');
var UserRole = (function () {
    function UserRole(http, apiConfig) {
        this.http = http;
        this.apiConfig = apiConfig;
        this._apiUrls = {
            create: this.apiConfig.getApiRoot() + 'api/identities/userRole',
            show: this.apiConfig.getApiRoot() + 'api/identities/userRole/',
            search: this.apiConfig.getApiRoot() + 'api/identities/userRole/search?text=',
            update: this.apiConfig.getApiRoot() + 'api/identities/userRole/',
            destroy: this.apiConfig.getApiRoot() + 'api/identities/userRole/'
        };
    }
    UserRole.prototype.create = function (userRole) {
        return this.http.post(this._apiUrls.create, JSON.stringify(userRole), {
            headers: this.apiConfig.getAuthHeader()
        });
    };
    UserRole.prototype.show = function (id) {
        return this.http.get(this._apiUrls.show + id, {
            headers: this.apiConfig.getAuthHeader()
        });
    };
    UserRole.prototype.search = function (criteria) {
        return this.http.get(this._apiUrls.search + criteria, {
            headers: this.apiConfig.getAuthHeader()
        });
    };
    UserRole.prototype.update = function (userRole) {
        return this.http.put(this._apiUrls.update + userRole.id, JSON.stringify(userRole), {
            headers: this.apiConfig.getAuthHeader()
        });
    };
    UserRole.prototype.destroy = function (id) {
        return this.http.delete(this._apiUrls.show + id, {
            headers: this.apiConfig.getAuthHeader()
        });
    };
    UserRole = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, api_config_1.ApiConfig])
    ], UserRole);
    return UserRole;
})();
exports.UserRole = UserRole;
