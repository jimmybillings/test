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
var current_user_model_1 = require('../../../common/models/current-user.model');
var common_1 = require('angular2/common');
var Profile = (function () {
    function Profile(currentUser) {
        this.currentUser = currentUser;
    }
    Profile = __decorate([
        core_1.Component({
            selector: 'profile',
            template: "\n    <section class=\"login hero\"><div layout=\"row\" layout-xs=\"column\" md-scroll-y=\"\" layout-align=\"start center\" layout-padding=\"\"><div flex=\"\"></div><div flex-xl=\"40\" flex-gt-lg=\"40\" flex-gt-md=\"40\" flex-gt-sm=\"55\" flex-gt-xs=\"100\" flex=\"100\"><md-card class=\"md-whiteframe-z2\"><md-card-header><div class=\"logo-wrapper\"><div class=\"logo\"></div></div></md-card-header><md-card-title><md-card-title-text layout=\"column\" layout-align=\"center center\"><span class=\"md-headline\">Profile</span></md-card-title-text></md-card-title><md-card-content><md-list><md-list-item><p><strong>Name: </strong> {{currentUser.fullName()}}</p></md-list-item><md-divider></md-divider><md-list-item><p><strong>Email: </strong> {{currentUser.email()}}</p></md-list-item><md-divider></md-divider><md-list-item><p><strong>Created On: </strong>{{currentUser.createdOn()}}</p></md-list-item><md-divider></md-divider><md-list-item><p><strong>Last Updated: </strong>{{currentUser.lastUpdated()}}</p></md-list-item><md-divider></md-divider><md-list-item><p><strong>Site Name: </strong>{{currentUser.siteName()}}</p></md-list-item><md-divider></md-divider><md-list-item><p><strong>Id: </strong>{{currentUser.id()}}</p></md-list-item><md-divider></md-divider><div *ngFor=\"#account of currentUser.accountIds()\"> <md-list-item><h3>Account: {{account}}</h3></md-list-item><!-- md-divider--><!-- md-list-item--><!--   p Name: {{account.name}}--><!-- md-list-item--><!--   p Created: {{account.createdOn}}--><!-- md-list-item--><!--   p Last Updated: {{account.lastUpdated}}--><!-- md-list-item--><!--   p Admin: {{account.isAdmin}}--></div></md-list></md-card-content></md-card></div><div flex=\"\"></div></div></section>\n  ",
            directives: [common_1.NgFor]
        }), 
        __metadata('design:paramtypes', [current_user_model_1.CurrentUser])
    ], Profile);
    return Profile;
})();
exports.Profile = Profile;
