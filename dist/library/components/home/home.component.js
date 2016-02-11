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
var common_1 = require('angular2/common');
var current_user_model_1 = require('../../common/models/current-user.model');
var search_box_component_1 = require('./search-box/search-box.component');
var ui_config_1 = require('../../common/config/ui.config');
var Home = (function () {
    function Home(currentUser, router, uiConfig) {
        this.currentUser = currentUser;
        this.router = router;
        this.uiConfig = uiConfig;
        this.ui = this.uiConfig.ui();
    }
    Home = __decorate([
        core_1.Component({
            selector: 'home',
            template: "\n    <header class=\"hero\"> <div layout=\"row\" layout-xs=\"column\" layout-margin=\"\" md-scroll-y=\"\" layout-align=\"start center\" layout-padding=\"\"><div flex=\"\"></div><div flex-xl=\"35\" flex-gt-lg=\"50\" flex-gt-md=\"55\" flex-gt-sm=\"70\" flex-gt-xs=\"90\" flex=\"100\"><div layout=\"column\" layout-align=\"start center\" layout-wrap=\"\"><div class=\"logo-wrapper\"><div class=\"logo\"></div></div><search-box></search-box><h4 class=\"md-headline\">Incredible footage, killer research and unmatched clearance expertise</h4></div></div><div flex=\"\"></div></div></header><section hide-xs=\"\" class=\"vendor-marquee\"><ul><li><img src=\"resources/img/client_dimoc.png\"/><img src=\"resources/img/client_usta.png\"/><img src=\"resources/img/client_AFV.png\"/><img src=\"resources/img/client_discovery.png\"/><img src=\"resources/img/client_ncaa.png\"/><!-- img(src='resources/img/client_fox.png')--><img src=\"resources/img/client_paramount.png\"/></li><li><img src=\"resources/img/client_natgeo.png\"/><img src=\"resources/img/client_pac12.png\"/><img src=\"resources/img/client_usga.png\"/><img src=\"resources/img/client_sony.png\"/><img src=\"resources/img/client_big10.png\"/><img src=\"resources/img/client_wpt.png\"/></li><li><img src=\"resources/img/client_dimoc.png\"/><img src=\"resources/img/client_usta.png\"/><img src=\"resources/img/client_AFV.png\"/><img src=\"resources/img/client_discovery.png\"/><img src=\"resources/img/client_ncaa.png\"/><!-- img(src='resources/img/client_fox.png')--><img src=\"resources/img/client_paramount.png\"/></li></ul></section><section layout=\"row\" layout-xs=\"column\" layout-align=\"start top\" class=\"mrkt-collections\"><div flex=\"\"></div><div flex-xl=\"70\" flex-gt-lg=\"80\" flex-gt-md=\"90\" flex=\"100\" layout=\"row\" layout-xs=\"column\" layout-wrap=\"\"><div flex-gt-sm=\"33\" flex=\"100\" class=\"mrkt-collections__highlight\"><a [routerLink]=\"['UserManagement', 'Register']\"><div class=\"mrkt-collections__highlight_img\"></div><div class=\"mrkt-collections__highlight_content\"><h5 class=\"md-title\">highlight one highlight one</h5></div></a></div><div flex-gt-sm=\"33\" flex=\"100\" class=\"mrkt-collections__highlight\"><a [routerLink]=\"['UserManagement', 'Register']\"><div class=\"mrkt-collections__highlight_img\"></div><div class=\"mrkt-collections__highlight_content\"><h5 class=\"md-title\">highlight two highlight two</h5></div></a></div><div flex-gt-sm=\"33\" flex=\"100\" class=\"mrkt-collections__highlight\"><a [routerLink]=\"['UserManagement', 'Register']\"><div class=\"mrkt-collections__highlight_img\"></div><div class=\"mrkt-collections__highlight_content\"><h5 class=\"md-title\">highlight three highlight three</h5></div></a></div><div flex-gt-sm=\"33\" flex=\"100\" class=\"mrkt-collections__highlight\"><a [routerLink]=\"['UserManagement', 'Register']\"><div class=\"mrkt-collections__highlight_img\"></div><div class=\"mrkt-collections__highlight_content\"><h5 class=\"md-title\">highlight four highlight four</h5></div></a></div><div flex-gt-sm=\"33\" flex=\"100\" class=\"mrkt-collections__highlight\"><a [routerLink]=\"['UserManagement', 'Register']\"><div class=\"mrkt-collections__highlight_img\"></div><div class=\"mrkt-collections__highlight_content\"><h5 class=\"md-title\">highlight five highlight five</h5></div></a></div><div flex-gt-sm=\"33\" flex=\"100\" class=\"mrkt-collections__highlight\"><a [routerLink]=\"['UserManagement', 'Register']\"><div class=\"mrkt-collections__highlight_img\"></div><div class=\"mrkt-collections__highlight_content\"><h5 class=\"md-title\">highlight six highlight six</h5></div></a></div></div><div flex=\"\"></div></section><section class=\"mrkt-call-to-action\"><div layout=\"row\" layout-xs=\"column\" layout-align=\"start center\" layout-padding=\"\"><div flex=\"\"></div><div flex-xl=\"50\" flex-gt-lg=\"60\" flex-gt-md=\"70\" flex-gt-sm=\"80\" flex=\"100\"><div layout=\"column\" layout-align=\"center center\" layout-wrap=\"\"><h2 class=\"md-display-1\">Experience what more than 67,000 customers know. Access <strong>4 million+ assets</strong> &amp; expert research support.</h2><md-button *ngIf=\"!currentUser.loggedIn()\" md-button=\"\" [routerLink]=\"['UserManagement', 'Register']\" class=\"md-block conversion\">Start Your Project! </md-button><md-button *ngIf=\"currentUser.loggedIn()\" md-button=\"\" [routerLink]=\"['UserManagement', 'Profile']\" class=\"md-block conversion\">Start Your Project! </md-button></div></div><div flex=\"\"></div></div></section>\n  ",
            directives: [router_1.ROUTER_DIRECTIVES, common_1.NgIf, search_box_component_1.SearchBox]
        }), 
        __metadata('design:paramtypes', [current_user_model_1.CurrentUser, router_1.Router, ui_config_1.UiConfig])
    ], Home);
    return Home;
})();
exports.Home = Home;
