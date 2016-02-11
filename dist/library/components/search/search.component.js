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
var http_1 = require('angular2/http');
var common_1 = require('angular2/common');
var asset_data_service_1 = require('../../common/services/asset.data.service');
var asset_list_component_1 = require('./asset-list/asset-list.component');
var Search = (function () {
    function Search(_router, routeParams, _assetData) {
        this._router = _router;
        this.routeParams = routeParams;
        this._assetData = _assetData;
        this._params = routeParams.params;
    }
    Search.prototype.ngOnInit = function () {
        this.searchAssets();
    };
    Search.prototype.searchAssets = function () {
        var _this = this;
        this._assetData.getAssets(this._params)
            .subscribe(function (assets) { return _this.assets = assets; }, function (error) { return _this.errorMessage = error; });
    };
    Search = __decorate([
        core_1.Component({
            selector: 'search',
            template: "\n    <section class=\"search-results\"><div layout=\"row\" layout-xs=\"column\" md-scroll-y=\"\" layout-align=\"start center\" layout-padding=\"\"><div flex=\"\"></div><div flex-xl=\"85\" flex-gt-lg=\"95\" flex=\"100\"><div layout=\"row\"><!-- img(width=\"465\", NgIf='clipRendition(result.rendition).url != \"\"', *ngFor='#result of results' src=\"{{clipRendition(result.rendition).url}}\")--><asset-list [assets]=\"assets\"></asset-list><div [hidden]=\"!errorMessage &amp;&amp; (!assets || assets.length &gt; 0)\" class=\"alert warning\"><No>items can be found with that search</No></div></div></div><div flex=\"\"></div></div></section>\n  ",
            directives: [common_1.NgStyle, common_1.CORE_DIRECTIVES, asset_list_component_1.AssetList],
            viewProviders: [http_1.HTTP_PROVIDERS, asset_data_service_1.AssetData]
        }), 
        __metadata('design:paramtypes', [router_1.Router, router_1.RouteParams, asset_data_service_1.AssetData])
    ], Search);
    return Search;
})();
exports.Search = Search;
