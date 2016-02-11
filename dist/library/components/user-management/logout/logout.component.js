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
var router_1 = require('angular2/router');
var authentication_data_service_1 = require('../../../common/services/authentication.data.service');
var current_user_model_1 = require('../../../common/models/current-user.model');
var Logout = (function () {
    function Logout(_authentication, _currentUser) {
        this._authentication = _authentication;
        this._currentUser = _currentUser;
    }
    Logout.prototype.onSubmit = function () {
        localStorage.clear();
        this._currentUser.set();
        this._authentication.destroy().subscribe();
    };
    Logout = __decorate([
        core_1.Component({
            selector: 'logout',
            template: "\n    <md-button md-button=\"\" (click)=\"onSubmit()\" [routerLink]=\"['Home']\" class=\"md-caption md-primary md-hue-2\">Logout</md-button>\n  ",
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [authentication_data_service_1.Authentication]
        }), 
        __metadata('design:paramtypes', [authentication_data_service_1.Authentication, current_user_model_1.CurrentUser])
    ], Logout);
    return Logout;
})();
exports.Logout = Logout;
