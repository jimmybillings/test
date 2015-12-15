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
var angular2_1 = require('angular2/angular2');
var Register = (function () {
    function Register() {
        this.register = 'Register';
    }
    Register = __decorate([
        angular2_1.Component({
            selector: 'register'
        }),
        angular2_1.View({
            template: "\n    <div class=\"row\">\n      <h3>{{register}}</h3>\n      <form class=\"login\" method=\"post\">\n      <div class=\"input-field col s6\">\n        <input type=\"text\" name=\"name\" value=\"\" placeholder=\"First Name\">\n      </div>\n      <div class=\"input-field col s6\">\n        <input type=\"text\" name=\"name\" value=\"\" placeholder=\"Last Name\">\n      </div>\n      <div class=\"input-field col s6\">\n        <input type=\"text\" name=\"name\" value=\"\" placeholder=\"Street\">\n      </div>\n      <div class=\"input-field col s6\">\n        <input type=\"text\" name=\"name\" value=\"\" placeholder=\"State\">\n      </div>\n      <div class=\"input-field col s6\">\n        <input type=\"text\" name=\"name\" value=\"\" placeholder=\"City\">\n      </div>\n      <div class=\"input-field col s6\">\n        <input type=\"text\" name=\"name\" value=\"\" placeholder=\"Zip code\">\n      </div>\n      <div class=\"input-field col s6\">\n        <input type=\"password\" name=\"name\" value=\"\" placeholder=\"Password\">\n      </div>\n      <div class=\"input-field col s12\">\n        <a class=\"waves-effect waves-light btn\">Register</a>\n      </div>\n    </form>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], Register);
    return Register;
})();
exports.Register = Register;
//# sourceMappingURL=register.js.map