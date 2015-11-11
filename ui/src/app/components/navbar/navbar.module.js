import { NavbarDirective } from './navbar.directive';

angular.module('portalUi.NavBarModule', ['ngTouch', 'ngSanitize', 'ngAria', 'ui.router', 'ngMaterial'])
	.directive('acmeNavbar', NavbarDirective)
	
