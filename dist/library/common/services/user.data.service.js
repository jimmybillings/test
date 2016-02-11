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
var current_user_model_1 = require('../models/current-user.model');
var User = (function () {
    function User(http, apiConfig, _currentUser) {
        this.http = http;
        this.apiConfig = apiConfig;
        this._currentUser = _currentUser;
        this._apiUrls = {
            create: this.apiConfig.getApiRoot() + 'api/identities/user/register',
            get: this.apiConfig.getApiRoot() + 'api/identities/user/currentUser'
        };
    }
    User.prototype.create = function (user) {
        return this.http.post(this._apiUrls.create, JSON.stringify(user), {
            headers: this.apiConfig.getApiHeaders()
        });
    };
    User.prototype.get = function () {
        return this.http.get(this._apiUrls.get, {
            headers: this.apiConfig.getAuthHeader()
        });
    };
    User = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, api_config_1.ApiConfig, current_user_model_1.CurrentUser])
    ], User);
    return User;
})();
exports.User = User;
