var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var angular2_1 = require('angular2/angular2');
var User = (function () {
    function User() {
        this.text = 'Super Simple Jeff Component';
    }
    User = __decorate([
        angular2_1.Component({
            selector: 'user'
        }),
        angular2_1.View({
            templateUrl: "/app/components/user/user.html"
        })
    ], User);
    return User;
})();
exports.User = User;
