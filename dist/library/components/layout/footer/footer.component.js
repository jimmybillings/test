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
var all_1 = require('ng2-material/all');
var Footer = (function () {
    function Footer() {
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Footer.prototype, "currentUser", void 0);
    Footer = __decorate([
        core_1.Component({
            selector: 'app-footer',
            template: "\n    <div layout=\"row\" layout-xs=\"column\" layout-align=\"start center\" layout-padding=\"\" class=\"glb\"><div flex=\"\"></div><div flex-xl=\"50\" flex-gt-lg=\"55\" flex-gt-md=\"60\" flex-gt-sm=\"75\" flex-gt-xs=\"95\" flex=\"100\"><div layout=\"row\" layout-sm=\"column\" layout-align=\"start center\" layout-wrap=\"\"><div flex=\"auto\"><div class=\"logo-wrapper\"><div class=\"logo\"></div></div></div><div flex=\"25\"></div><div flex=\"25\"></div><div flex=\"25\"></div></div></div><div flex=\"\"></div></div>\n  ",
            directives: [router_1.ROUTER_DIRECTIVES, common_1.NgClass, all_1.MATERIAL_DIRECTIVES],
            inputs: ['currentUser']
        }), 
        __metadata('design:paramtypes', [])
    ], Footer);
    return Footer;
})();
exports.Footer = Footer;
