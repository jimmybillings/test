import { HomeController } from './home.controller';
import { homeRouter } from './home.router';
import { HomeService } from './home.service';

angular.module('portalUi.HomeModule', ['ngTouch', 'ngSanitize', 'ngAria', 'ui.router', 'ngMaterial'])
	.config(homeRouter)
	.service('HomeService', HomeService)
	.controller('HomeController', HomeController)
