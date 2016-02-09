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
var router_1 = require('angular2/router');
var logout_component_1 = require('../../user-management/logout/logout.component');
var all_1 = require('ng2-material/all');
var config_1 = require('../../../common/config/config');
var Header = (function () {
    function Header(ui) {
        this.ui = ui.ui();
        this.showFixed = false;
    }
    Header.prototype.ngOnInit = function () {
        var _this = this;
        window.addEventListener('scroll', function () { return _this.showFixedHeader(window.pageYOffset); });
    };
    Header.prototype.showFixedHeader = function (offset) {
        this.showFixed = (offset > 68) ? true : false;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Header.prototype, "currentUser", void 0);
    Header = __decorate([
        core_1.Component({
            selector: 'app-header',
            template: "\n    <md-toolbar [ngClass]=\"{'fixed': showFixed}\" class=\"glb\"><span flex=\"\"></span><nav class=\"md-toolbar-tools\"><md-button arial-label=\"Settings\" class=\"md-icon-button\"></md-button><button md-button=\"\" title=\"More\" [routerLink]=\"['Home']\" class=\"md-icon-button\"><i md-icon=\"md-icon\" class=\"material-icons\">menu</i></button><a flex=\"\" [routerLink]=\"['Home']\" title=\"Home\" class=\"home-link\"><div class=\"logo-wrapper\"><div class=\"logo\"><img src=\"{{ui.header.logo}}\"/></div></div></a><button md-button=\"\" *ngIf=\"currentUser.loggedIn()\" [routerLink]=\"['UserManagement', 'Profile']\" [ngClass]=\"{'md-primary': !showFixed}\" class=\"is-dd\"> \n    {{currentUser.fullName()}}</button><md-button *ngIf=\"!currentUser.loggedIn()\" md-button=\"\" [routerLink]=\"['UserManagement', 'Login']\">Login</md-button><md-button [ngClass]=\"{'md-accent': !showFixed}\" *ngIf=\"!currentUser.loggedIn()\" md-button=\"\" [routerLink]=\"['UserManagement', 'Register']\" class=\"is-outlined\">Sign Up</md-button><logout *ngIf=\"currentUser.loggedIn()\"></logout><button md-button=\"\" *ngIf=\"currentUser.loggedIn()\" title=\"Search\" [routerLink]=\"['Search']\" class=\"md-icon-button\"><i md-icon=\"\" class=\"material-icons\">search</i></button><button md-button=\"\" title=\"More\" [routerLink]=\"['Home']\" class=\"md-icon-button\"><i md-icon=\"\" class=\"material-icons\">more_vert</i></button></nav></md-toolbar>\n  ",
            directives: [router_1.ROUTER_DIRECTIVES, logout_component_1.Logout, common_1.NgClass, all_1.MATERIAL_DIRECTIVES, common_1.NgIf],
            inputs: ['currentUser']
        }), 
        __metadata('design:paramtypes', [config_1.Config])
    ], Header);
    return Header;
})();
exports.Header = Header;
