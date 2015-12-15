"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/// <reference path="../typings/tsd.d.ts" />
require('zone.js');
require('reflect-metadata');
require('es6-shim');
var angular2_1 = require('angular2/angular2');
var router_1 = require('angular2/router');
var router_2 = require('angular2/router');
var sampleService_1 = require('./services/sampleService');
var login_1 = require('./components/user-management/login');
var register_1 = require('./components/user-management/register');
var MyAppComponent = (function () {
    function MyAppComponent(router, location, myService) {
        this.router = router;
        this.location = location;
        this.serviceStatus = myService.getMessage();
        this.appStatus = 'Application is working.';
    }
    MyAppComponent = __decorate([
        router_2.RouteConfig([
            { path: '/', component: login_1.Login },
            { path: '/register', component: register_1.Register }
        ]),
        angular2_1.Component({
            selector: 'app',
            bindings: [sampleService_1.MyService]
        }),
        angular2_1.View({
            template: "\n    <div class=\"container\">\n      <div class=\"row\">\n        <div class=\"col s6\">\n          <h1>Wazee Digital</h1>\n        </div>\n        <div class=\"col s6\">\n          <ul>\n            <li>{{ appStatus }}</li>\n            <li>{{ serviceStatus }}</li>\n          </ul>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col s12\">\n          <main>\n            <router-outlet></router-outlet>\n          </main>\n        </div>\n      </div>\n    </div>\n\n  ",
            directives: [login_1.Login, router_2.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [router_2.Router, router_2.Location, sampleService_1.MyService])
    ], MyAppComponent);
    return MyAppComponent;
})();
angular2_1.bootstrap(MyAppComponent, [router_1.ROUTER_PROVIDERS, angular2_1.provide(router_1.LocationStrategy, { useClass: router_1.HashLocationStrategy })]);
//# sourceMappingURL=app.js.map