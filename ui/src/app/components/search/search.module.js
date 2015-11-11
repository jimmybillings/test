import { SearchController } from './search.controller';
import { searchRouter } from './search.router';
import { SearchService } from './search.service';

angular.module('portalUi.SearchModule', ['ngTouch', 'ngSanitize', 'ngAria', 'ui.router', 'ngMaterial'])
	.config(searchRouter)
	.service('SearchService', SearchService)
	.controller('SearchController', SearchController)
