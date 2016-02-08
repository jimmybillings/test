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
var common_1 = require('angular2/common');
var user_data_service_1 = require('../../../common/services/user.data.service');
var all_1 = require('ng2-material/all');
var router_1 = require('angular2/router');
var api_config_1 = require('../../../common/config/api.config');
var Register = (function () {
    function Register(_fb, _user, _ApiConfig) {
        this._fb = _fb;
        this._user = _user;
        this._ApiConfig = _ApiConfig;
        this._setForm();
    }
    Register.prototype.onSubmit = function (user) {
        this._user.create(user)
            .subscribe(function (res) {
            console.log(res);
        });
    };
    Register.prototype._setForm = function () {
        this.registerForm = this._fb.group({
            'firstName': null,
            'lastName': null,
            'emailAddress': null,
            'siteName': this._ApiConfig.getPortal(),
            'password': null
        });
    };
    Register = __decorate([
        core_1.Component({
            selector: 'register',
            template: "\n    <section class=\"login hero\"><div layout=\"row\" layout-xs=\"column\" md-scroll-y=\"\" layout-align=\"start center\" layout-padding=\"\"><div flex=\"\"></div><div flex-gt-lg=\"30\" flex-gt-md=\"40\" flex-gt-sm=\"55\" flex-gt-xs=\"100\" flex=\"100\"><md-card class=\"md-whiteframe-z2\"><md-card-header><div class=\"logo-wrapper\"><div class=\"logo\"></div></div></md-card-header><md-card-title><md-card-title-text layout=\"column\" layout-align=\"center center\"><span class=\"md-headline\">Get Started With Wazee</span></md-card-title-text></md-card-title><md-card-content><form layout=\"column\" [ngFormModel]=\"registerForm\" (ngSubmit)=\"onSubmit(registerForm.value)\" class=\"md-inline-form\"><md-content layout-sm=\"row\" layout-padding=\"\"><md-input-container class=\"md-block\"><label>First Name</label><input autofocus=\"autofocus\" type=\"text\" [ngFormControl]=\"registerForm.controls['firstName']\" class=\"md-input\"/></md-input-container><md-input-container class=\"md-block\"><label>Last Name</label><input type=\"text\" [ngFormControl]=\"registerForm.controls['lastName']\" class=\"md-input\"/></md-input-container><md-input-container class=\"md-block\"><label>Email</label><input type=\"text\" [ngFormControl]=\"registerForm.controls['emailAddress']\" class=\"md-input\"/></md-input-container><md-input-container class=\"md-block\"><label>Password</label><input type=\"password\" [ngFormControl]=\"registerForm.controls['password']\" class=\"md-input\"/></md-input-container></md-content><md-card-actions layout=\"column\" layout-align=\"center center\" layout-wrap=\"\"> <button md-raised-button=\"\" type=\"submit\" class=\"md-raised md-primary conversion\">Sign Up</button></md-card-actions></form></md-card-content></md-card><div md-theme=\"docs-dark\" layout=\"column\" layout-align=\"center center\" layout-wrap=\"\"><span class=\"md-title\">Already have an account? <a md-button=\"\" [routerLink]=\"['Login']\" class=\"md-accent\">Login</a></span></div></div><div flex=\"\"></div></div></section>\n  ",
            providers: [user_data_service_1.User],
            directives: [all_1.MATERIAL_DIRECTIVES, router_1.ROUTER_DIRECTIVES, common_1.FORM_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [common_1.FormBuilder, user_data_service_1.User, api_config_1.ApiConfig])
    ], Register);
    return Register;
})();
exports.Register = Register;
