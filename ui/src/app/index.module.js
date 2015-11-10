import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { HomeController } from '../app/components/home/home.controller';
import { userRouter } from '../app/components/user/user.router';
import { searchRouter } from '../app/components/search/search.router';
import { UserController } from '../app/components/user/user.controller';
import { SearchController } from '../app/components/search/search.controller';
import { authRouter } from '../app/components/auth/auth.router';
import { AuthController } from '../app/components/auth/auth.controller';
import { AuthTokenInterceptor } from '../app/components/auth/auth.interceptor';
import { HomeService } from '../app/components/home/home.service';
import { SearchService } from '../app/components/search/search.service';
import { AuthService } from '../app/components/auth/auth.service';
import { SessionService } from '../app/components/auth/session.service';
import { UserService } from '../app/components/user/user.service';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';

angular.module('portalUi', ['ngTouch', 'ngSanitize', 'ngAria', 'ui.router', 'ngMaterial'])
  .config(config)
  .config(userRouter)
  .config(routerConfig)
  .config(searchRouter)
  .config(authRouter)
  .run(runBlock)
  .factory('AuthTokenInterceptor', AuthTokenInterceptor)
  .service('HomeService', HomeService)
  .controller('HomeController', HomeController)
  .controller('SearchController', SearchController)
  .controller('UserController', UserController)
  .controller('AuthController', AuthController)
  .service('SessionService', SessionService)
  .service('AuthService', AuthService)
  .service('SearchService', SearchService)
  .service('UserService', UserService)
  .directive('acmeNavbar', NavbarDirective)
