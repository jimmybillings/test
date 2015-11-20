import { AuthController } from './auth.controller';
import { authRouter } from './auth.router';
import { AuthService } from './auth.service';
import { AuthTokenInterceptor } from './auth.interceptor';
import { SessionService } from './session.service';

angular.module('portalUi.AuthModule', ['ngTouch', 'ngSanitize', 'ngAria', 'ui.router', 'ngMaterial', 'ngMessages'])
	.config(authRouter)
	.controller('AuthController', AuthController)
	.service('AuthService', AuthService)
	.service('SessionService', SessionService)
	.factory('AuthTokenInterceptor', AuthTokenInterceptor)
