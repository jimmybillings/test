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
var sampleService_1 = require('./services/sampleService');
var login_1 = require('./components/user-management/login');
var MyAppComponent = (function () {
    function MyAppComponent(myService) {
        this.serviceStatus = myService.getMessage();
        this.appStatus = 'Application is working.';
    }
    MyAppComponent = __decorate([
        angular2_1.Component({
            selector: 'app',
            bindings: [sampleService_1.MyService]
        }),
        angular2_1.View({
            template: "\n    <ul>\n      <li>{{ appStatus }}</li>\n      <li>{{ serviceStatus }}</li>\n    </ul>\n    <login></login>\n  ",
            directives: [login_1.Login]
        }), 
        __metadata('design:paramtypes', [sampleService_1.MyService])
    ], MyAppComponent);
    return MyAppComponent;
})();
angular2_1.bootstrap(MyAppComponent);
//# sourceMappingURL=app.js.map