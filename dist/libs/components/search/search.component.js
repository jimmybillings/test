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
var http_1 = require('angular2/http');
require('rxjs/add/operator/map');
var Search = (function () {
    function Search(http) {
        this.http = http;
        this.url = '';
    }
    Search.prototype.clipRendition = function (rendition) {
        var bestRendition;
        bestRendition = (rendition.url) ? rendition.url :
            rendition.filter(function (rend) {
                if (rend.purpose === 'Thumbnail' && rend.size === 'Large') {
                    return rend;
                }
            })[0];
        this._getResults();
        return bestRendition || '';
    };
    Search.prototype._getResults = function () {
        this.results = this.http.get(this.url)
            .map(function (res) {
            return res.json()['clip-list']['clip'];
        });
    };
    Search = __decorate([
        core_1.Component({
            selector: 'search',
            template: "\n    <div layout=\"row\" layout-padding=\"\" layout-wrap=\"\" layout-fill=\"\" style=\"padding-bottom: 32px;\" ng-cloak=\"\"><img width=\"465\" NgIf=\"clipRendition(result.rendition).url != &quot;&quot;\" *ngFor=\"#result of results\" src=\"{{clipRendition(result.rendition).url}}\"/></div>\n  ",
            directives: [common_1.NgStyle, common_1.CORE_DIRECTIVES],
            viewProviders: [http_1.HTTP_PROVIDERS]
        }), 
        __metadata('design:paramtypes', [http_1.Http])
    ], Search);
    return Search;
})();
exports.Search = Search;
