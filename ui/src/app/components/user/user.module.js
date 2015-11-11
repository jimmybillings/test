import { UserController } from './user.controller';
import { userRouter } from './user.router';
import { UserService } from './user.service';

angular.module('portalUi.UserModule', ['ngTouch', 'ngSanitize', 'ngAria', 'ui.router', 'ngMaterial'])
	.config(userRouter)
	.service('UserService', UserService)
	.controller('UserController', UserController)