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
var authentication_data_service_1 = require('../../../common/services/authentication.data.service');
var all_1 = require('ng2-material/all');
var router_1 = require('angular2/router');
var api_config_1 = require('../../../common/config/api.config');
var user_data_service_1 = require('../../../common/services/user.data.service');
var router_2 = require('angular2/router');
var current_user_model_1 = require('../../../common/models/current-user.model');
var Login = (function () {
    function Login(_fb, _authentication, _user, router, _ApiConfig, _currentUser) {
        this._fb = _fb;
        this._authentication = _authentication;
        this._user = _user;
        this.router = router;
        this._ApiConfig = _ApiConfig;
        this._currentUser = _currentUser;
    }
    Login.prototype.ngOnInit = function () {
        this.setForm();
    };
    Login.prototype.onSubmit = function (user) {
        var _this = this;
        console.log(user);
        this._authentication.create(user).subscribe(function (res) {
            localStorage.setItem('token', res.json().token.token);
            _this._currentUser.set(res.json().user);
            _this.router.navigate(['/Home']);
        });
    };
    Login.prototype.setForm = function () {
        this.loginForm = this._fb.group({
            'userId': null,
            'password': ['', common_1.Validators.required],
            'siteName': this._ApiConfig.getPortal()
        });
    };
    Login = __decorate([
        core_1.Component({
            selector: 'login',
            template: "\n    <section class=\"login hero\"><div layout=\"row\" layout-xs=\"column\" md-scroll-y=\"\" layout-align=\"start center\" layout-padding=\"\"><div flex=\"\"></div><div flex-xl=\"30\" flex-gt-lg=\"35\" flex-gt-md=\"40\" flex-gt-sm=\"55\" flex-gt-xs=\"100\" flex=\"100\"><md-card class=\"md-whiteframe-z2\"><md-card-header><div class=\"logo-wrapper\"><div class=\"logo\"></div></div></md-card-header><md-card-title><md-card-title-text layout=\"column\" layout-align=\"center center\"><span class=\"md-headline\">Login To Your Account</span></md-card-title-text></md-card-title><md-card-content><form layout=\"column\" [ngFormModel]=\"loginForm\" (ngSubmit)=\"onSubmit(loginForm.value)\" class=\"md-inline-form\"><md-content layout-sm=\"row\" layout-padding=\"\"><md-input-container class=\"md-block flex-gt-sm\"><label>Email</label><input md-autofocus=\"\" md-input=\"\" type=\"email\" [ngFormControl]=\"loginForm.controls['userId']\"/></md-input-container><md-input-container class=\"md-block flex-gt-sm\"><label>Password</label><input md-input=\"\" type=\"password\" [ngFormControl]=\"loginForm.controls['password']\"/></md-input-container></md-content><md-card-actions layout=\"column\" layout-align=\"center center\" layout-wrap=\"\"> <button md-raised-button=\"\" type=\"submit\" class=\"md-raised md-primary conversion\">Login</button></md-card-actions><div layout=\"column\" layout-align=\"center center\" class=\"md-body-2\"> <a layout=\"row\" flex=\"\" md-button=\"\" [routerLink]=\"['Register']\" class=\"md-primary\">Forgot Your Password?</a></div></form></md-card-content></md-card><div md-theme=\"docs-dark\" layout=\"column\" layout-align=\"start center\" layout-wrap=\"\"><span class=\"md-title\">Don't have an account? <a md-button=\"\" [routerLink]=\"['Register']\" class=\"md-accent\">Sign Up</a></span></div></div><div flex=\"\"></div></div></section>\n  ",
            providers: [authentication_data_service_1.Authentication],
            directives: [all_1.MATERIAL_DIRECTIVES, router_1.ROUTER_DIRECTIVES, common_1.FORM_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [common_1.FormBuilder, authentication_data_service_1.Authentication, user_data_service_1.User, router_2.Router, api_config_1.ApiConfig, current_user_model_1.CurrentUser])
    ], Login);
    return Login;
})();
exports.Login = Login;
